# PORTFOLIO_EXTRACT.md

Factual extraction pass, verified against source on 2026-08-08. Every claim below
cites the file (and line where useful) that proves it. Anything I could not prove
from the repo is marked `UNVERIFIED:` or `RATIONALE NOT IN REPO`.

Repo state at time of extraction: branch `main`, HEAD `b65cfcf` (2026-05-29),
245 commits (`git rev-list --count HEAD`), 119 tracked files (`git ls-files | wc -l`).

---

## 1. Identity

### Names

The project has **four** distinct names in active use, and they conflict.

| Name | Where it appears |
|---|---|
| `fgf-sentinel` | Canonical package-manifest name [package.json:2] |
| **FGF Sentinel** | FastAPI app title [api/main.py:46]; module docstring [api/main.py:1]; briefing doc filename [docs/fgf-sentinel-briefing.html]; pitch page `<title>` [web/public/pitch/index.html:5]; submission doc title [docs/internal/SUBMISSION.md:1] |
| **Maridian** | README H1 "Maridian — Agentic Decision Layer for the Factory Floor" [README.md:3]; LICENSE copyright holder "The Maridian Team" [LICENSE:4]; deployed UI route `/maridian/*` [web/public/maridian/]; email sender name default [api/routers/production.py:35]; email footer "Maridian Group — Sentinel Quality System" [api/routers/production.py:524] |
| **Sentinel** | SQLite filename `sentinel.db` [api/db/connection.py]; root logger name `"sentinel"` [api/main.py:32]; tool logger `"sentinel.tools"` [api/agents/runtime.py:25] |

Deploy/infra names, all different again:
- Vercel project `fgf-sentinel-web` [.vercel/project.json]
- A second, nested Vercel project simply named `web` [web/.vercel/project.json] — two distinct `projectId`s exist in the repo
- Railway host `fgf-sentinel-api-production.up.railway.app` [README.md:8, api/smoke_test.py:6]
- GitHub repo `mahyar-jbr/TMLS_hacketon-` (typo in repo name preserved; visible in merge commit `a4da7cf`)
- Local directory `TMLS_hacketon-`

The rename appears to have happened late: the pitch page still says "FGF Sentinel"
[web/public/pitch/index.html:5] while the README it links from says "Maridian".
**Contradiction — the public-facing pitch page and the README disagree on the product name.**

### One sentence

A web service that takes a computer-vision defect event from a bakery production
line, runs it through a chain of Claude-backed agents that query a SQLite factory
database, and returns a recommended disposition (repack / B-grade / scrap /
escalate) with a dollar recovery estimate and a written audit trail
[api/agents/orchestrator.py:121-232, api/routers/production.py:353-425].

### Current status

**Frontend live, backend dead.** Verified 2026-08-08 by HTTP request:

```
GET https://fgf-sentinel-api-production.up.railway.app/health
  -> HTTP 404  {"status":"error","code":404,"message":"Application not found", ...}

GET https://fgf-sentinel-web.vercel.app/                       -> HTTP 307 (redirect)
GET https://fgf-sentinel-web.vercel.app/maridian/login.html    -> HTTP 200
GET https://fgf-sentinel-web.vercel.app/maridian/dist-portal.html -> HTTP 200
```

The Railway app no longer exists (that 404 body is Railway's edge, not FastAPI's).
The deployed UI hardcodes that Railway host as its production API base
[web/public/maridian/line-detail.html:1028-1030], so **every data fetch and the
"Run AI Analysis" button on the live demo currently fail.** The README's
`status-deployed` badge and its `/health` link [README.md:7-8] are both stale.

Last commit: 2026-05-29 (`b65cfcf`). No CI (`.github/` does not exist). Development
window: first commit 2026-05-25 (`4b28ece`), last 2026-05-29 — five days, matching
the README's claim [README.md, CONTRIBUTORS.md:3].

---

## 2. The problem

**Stated in the repo**, at length, in [docs/internal/SUBMISSION.md] (section "The
Problem We Are Solving") and summarized in [README.md]. Not reconstructed by me.

- **Who:** line operators at FGF Brands, a commercial bakery. "These decisions
  happen dozens of times per shift, under time pressure, by line operators who are
  also managing equipment" [docs/internal/SUBMISSION.md].
- **The problem:** CV cameras flag "hundreds of defects per batch"; each flagged
  defect needs a human call — scrap, B-grade, or repack — and the information
  needed (inventory, customer contracts, B-grade demand, capacity) "is scattered
  across systems" [docs/internal/SUBMISSION.md].
- **What they did before:** the same doc describes the prior state as a manual
  triage loop producing "slow decisions, inconsistent quality calls, and missed SLA
  signals that only surface when it's too late to recover"
  [docs/internal/SUBMISSION.md].

`UNVERIFIED:` Whether that description of the manual status quo came from FGF
Brands or was written by the team. The README says FGF "provided the operational
context, customer-spec data structure, and decision matrix" [README.md], but no
FGF-authored document, interview note, or data file is in the repo. The seed data
is synthetic (see §5).

---

## 3. Architecture

### Services

1. **`api/`** — FastAPI (Python 3.11 [api/runtime.txt]), deployed to Railway with
   root directory `/api` [api/Procfile: `uvicorn main:app --host 0.0.0.0 --port $PORT`].
2. **`web/`** — Next.js 14 App Router [web/package.json], deployed to Vercel. Its
   root route is a pure redirect to a static pitch page [web/app/page.tsx:7].
   The actual demo UI is **static HTML** served from `web/public/maridian/`.
3. **`front/`** — the working copy of that same static UI, served locally by
   [front/serve.py]. `web/public/maridian/*` is a manual mirror of `front/*`
   (commit `6864cd2`: "sync: web/public/maridian mirrors front/ for Vercel deploy").
   The two copies differ: `front/` hardcodes `http://localhost:8001`
   [front/line-detail.html:1027], the mirror switches on hostname
   [web/public/maridian/line-detail.html:1028-1030].
4. **`data/`** — seed script + committed SQLite file [data/seed_db.py, data/sentinel.db].
   A **second copy** of the DB is committed at [api/data/sentinel.db] for the
   Railway deploy root (see the war story in §8).

### One request traced end to end

Operator clicks "Run AI Analysis" on the line-detail page:

1. Browser `POST {API}/problems/{problem_id}/analyze/stream`
   [web/public/maridian/line-detail.html — `const API` at :1028].
2. FastAPI route handler [api/routers/production.py:353].
3. Handler loads the problem row, then the batch (exact SKU+line, falling back to
   any non-completed batch on the line), then the single highest-`confidence_score`
   QC row for that batch [api/routers/production.py:362-402].
4. It synthesizes a `DefectEvent`-shaped dict — note `image_url` is set to `""`,
   i.e. no image is involved in this path [api/routers/production.py:404-413].
5. `stream_orchestrator(event)` is called and its `StreamEvent`s are serialized to
   SSE frames `event: <type>\ndata: <json>` [api/routers/production.py:415-425].
6. The orchestrator runs six stages in sequence, each via `stream_agent`
   [api/agents/orchestrator.py:129-232].
7. Each `stream_agent` call loops up to `MAX_ROUNDS = 8` against
   `client.messages.create` with `model = "claude-haiku-4-5-20251001"`
   [api/agents/runtime.py:27-29, :222-257], executing tool calls between rounds
   [api/agents/runtime.py:263-287].
8. Each tool is a plain Python function hitting SQLite through `get_db_conn()`
   [api/db/connection.py], e.g. [api/tools/customer_spec.py], [api/tools/log_decision.py].
9. Events stream back to the browser as they happen: `agent_thinking`,
   `tool_call_start`, `tool_call_result`, then orchestrator-level `decision_made`,
   `batch_updated`, `recovery_proposed`, `draft_ready`, `done`
   [api/agents/runtime.py:255-283, api/agents/orchestrator.py:190-232].

### External dependencies

| Dependency | Where configured / called |
|---|---|
| **Anthropic API** (`anthropic==0.40.0`) | [api/requirements.txt:4]; client [api/agents/runtime.py:36-43]; key from `ANTHROPIC_API_KEY` [api/agents/runtime.py:39] |
| **SQLite** (stdlib) | [api/db/connection.py]; path resolution via `SENTINEL_DB_PATH` env → `api/data/` → repo-root `data/` [api/db/connection.py:34] |
| **Mailtrap** (`mailtrap==2.6.0`) | [api/requirements.txt:6]; `POST /notifications/send-email` [api/routers/production.py:496-554] |
| **Railway** | [api/Procfile], [api/runtime.txt] |
| **Vercel** | [.vercel/project.json], [web/.vercel/project.json] |
| **placehold.co** | Simulator defect images [api/sim/router.py:33-41] |
| **Google Fonts** | [web/public/pitch/index.html:8-10] (Fraunces, Geist, Geist Mono) |
| **Google Maps** | Added `4fcdc47`, **reverted** `eced851` — not in the current tree |

No queue, no cache, no auth provider, no vector store, no ORM. The login screen
performs **no authentication**: it only validates that fields are non-empty
["Any non-empty password works in the preview build", front/login.html:167], and
ROADMAP confirms "The login screen is decorative" [ROADMAP.md].

### Data model — 14 tables

From [api/db/schema.sql] (`grep -c "CREATE TABLE"` → 14):

| Table | Line | Purpose (from schema comments / usage) |
|---|---|---|
| `products` | :9 | SKU catalog — weight targets, pack format, price, line mapping |
| `customers` | :28 | Accounts, type, location, importance |
| `customer_specs` | :40 | Per customer × SKU SLA contract (`max_defect_pct`, `repack_approved`, `b_grade_approved`) |
| `batches` | :53 | Live production ledger (target/produced/defect qty, status) |
| `qc_results` | :68 | Append-only CV defect events |
| `decision_log` | :81 | Append-only agent decisions + accept/override status |
| `users` | :92 | Login/staff directory |
| `dist_actions` | :107 | Distributor-portal action list |
| `involved_customers` | :118 | Distributor-portal affected-customer list |
| `notify_people` | :130 | Per-problem notification roster |
| `actions` | :142 | Per-problem action options (good/semigood/bad) |
| `involved_people` | :153 | Per-problem staff roster |
| `line_status` | :166 | Per-line safe / need_action state |
| `problems` | :174 | The unit the UI is built around |

Indexes: **4**, all in [api/db/schema.sql:189-192] — `idx_qc_batch_ts`,
`idx_qc_severity`, `idx_batch_status`, `idx_decision_batch`. WAL journal mode is
enabled [api/db/connection.py, commit `2e3cf36`].

### AI agents — 6, each verified

All six are real modules with their own system prompt file and tool wiring.
The orchestrator chains them in this fixed order [api/agents/orchestrator.py:129-232]:

| # | Agent | Module | Prompt | Tools it can call |
|---|---|---|---|---|
| 1 | Triage | [api/agents/triage.py:38-39] | [api/agents/prompts/triage.md] | `triage_defect` |
| 2 | Options | [api/agents/options.py:38-49] | [api/agents/prompts/options.md] | `lookup_run_context`, `lookup_customer_spec`, `query_repack_paths`, `check_b_grade_demand` |
| 3 | Scorer | [api/agents/scorer.py:41-46] | [api/agents/prompts/scorer.md] | `lookup_inventory`, `calculate_recovery_value`, `check_b_grade_demand` |
| 4 | Decision | [api/agents/decision.py:44-48] | [api/agents/prompts/decision.md] | `query_recent_defects`, `log_decision` |
| 5 | Batch Tracker | [api/agents/batch_tracker.py:45-46] | [api/agents/prompts/batch_tracker.md] | `track_batch_fulfillment` |
| 6 | Recovery Planner | [api/agents/recovery_planner.py:57-58] | [api/agents/prompts/recovery_planner.md] | `propose_recovery_action` |

**Coordination:** a hand-written sequential generator, not a framework. There is no
LangChain/LangGraph import anywhere [api/requirements.txt has 6 entries: fastapi,
uvicorn, pydantic, anthropic, python-dotenv, mailtrap]. Each stage is drained with
a 45-second timeout [api/agents/orchestrator.py:81, :99-118] and falls back to a
hardcoded stub dict if the agent produces nothing parseable
[api/agents/orchestrator.py:25-36]. Only stage 6 is conditional — it runs when
`batch_ledger["breached"]` is truthy [api/agents/orchestrator.py:215].

**Agent-count contradictions across the repo — three different numbers:**
- README: "six specialized agents" [README.md, "What this is"]
- ROADMAP: "7 agents over 12 tools backed by 14 DB tables" [ROADMAP.md, "Where we are"]
- Code docstring: "Run the 5-agent pipeline for this problem" [api/routers/production.py:355]
- Pitch page (public, deployed): "Five agents decide what happens next" [web/public/pitch/index.html:6]

**The code has 6.** The README's own mermaid diagram is also wrong about the
control flow: it draws `Decision -.->|on SLA breach| BatchTracker` [README.md,
Architecture], but in code Batch Tracker runs **unconditionally** after Decision
and only Recovery Planner is gated on breach [api/agents/orchestrator.py:198-215].

### Tools — 12 defined, 11 reachable by agents

Twelve `"name":` tool specs exist under [api/tools/] (verified by grep). Eleven
appear in some agent's `TOOL_HANDLERS`. The twelfth, `notify`
[api/tools/notify.py:85], **is defined but wired to no agent** — `grep -rn notify
api/agents/` returns only a prose mention in a docstring
[api/agents/recovery_planner.py:11]. Its Python helpers are used directly by two
REST endpoints instead [api/main.py:23, :125-138]. So "12 tools" is true of the
tool *layer*; "the agents use 12 tools" is not.

---

## 4. Technical decisions and their rationale

### Claude Sonnet 4.5 → Claude Haiku 4.5

**Chosen:** `MODEL = "claude-haiku-4-5-20251001"` [api/agents/runtime.py:27].
**Alternative actually tried:** `claude-sonnet-4-5` — it was in the code and was
replaced.
**Rationale, recorded in the commit:** "switch model from claude-sonnet-4-5 to
claude-haiku-4-5-20251001 (higher rate limits, faster per-call latency for a
5-agent sequential chain)" [commit `732edc9`]. Locked into the backlog the same
night [commit `d1c9557`: "unlock §2 model row to claude-haiku-4-5-20251001"].
This is the one major decision whose *why* is genuinely in the repo.

### No agent framework — hand-built orchestrator

**Chosen:** direct Anthropic SDK tool-use loop [api/agents/runtime.py:135-289]
with a sequential generator orchestrator [api/agents/orchestrator.py].
**Claimed rationale:** README asserts "**No LangGraph, no LangChain** — direct
Anthropic SDK tool-use with a hand-built orchestrator" [README.md, "Why it's
interesting"] but gives no reason.
`RATIONALE NOT IN REPO — ask Mahyar.` No commit, ADR, or comment explains why a
framework was rejected; the first runtime commit `6939394` ("E4-T1: add generic
Claude tool-use harness") shows no framework was ever tried.

### SQLite as the database

**Chosen:** SQLite, file committed to git [data/sentinel.db, api/data/sentinel.db].
`RATIONALE NOT IN REPO — ask Mahyar.` No alternative (Postgres, Supabase, Railway
volume) appears in any commit, comment, or backlog row I found.

### SSE over WebSockets for streaming

**Chosen:** `StreamingResponse(..., media_type="text/event-stream")`
[api/main.py:120, api/routers/production.py:425].
`RATIONALE NOT IN REPO — ask Mahyar.` The SSE event contract was defined on day
one [commit `860cc15`: "E4-T1: fix SSE event shapes to match contracts.md"]; no
WebSocket alternative appears anywhere.

### Two frontends (Next.js app + vanilla HTML portal)

**What exists:** a Next.js 14 app with 4 routes [web/app/*/page.tsx] *and* a
6-page static HTML portal [web/public/maridian/*.html]. The Next.js root route
just redirects away to a static pitch page [web/app/page.tsx:7]. The static portal
arrived on Thu [commit `524ff22`: "feat: add initial frontend HTML files for FGF
Sentinel UI"], three days after the Next.js app was scaffolded [commit `3f86843`].
`RATIONALE NOT IN REPO — ask Mahyar.` No commit explains why the Next.js UI was
superseded rather than extended. The comment at [web/app/page.tsx:3-5] states the
outcome ("the pitch presentation ... is the portfolio-visible artifact") but not
the reason for the switch.

### Fallback stubs instead of failing the stream

**Chosen:** on unparseable agent output, yield a `degraded` error event and
continue with a hardcoded stub [api/agents/orchestrator.py:25-36, :133-141].
**Rationale, in a code comment:** "keeps the stream alive for the demo rather than
stopping on a JSON parse error" [api/agents/orchestrator.py:23-24]. Explicitly a
demo-robustness choice, not a production one.

### Per-stage timeout wrapper

**Chosen:** `_collect_safe` wrapping each stage in `asyncio.wait_for(45s)`
[api/agents/orchestrator.py:99-118].
**Rationale, in the commit:** "a rate-limit retry sleep (15/30/60s) in any agent
would block the entire orchestrator indefinitely" [commit `8b80654`]. See §8.

### Contract-first shared types

**Chosen:** a Pydantic module [api/contracts.py] mirrored by hand into TypeScript
[shared/contracts.ts], plus prose [shared/contracts.md].
`RATIONALE NOT IN REPO — ask Mahyar.` The cost of the choice is visible though:
at least six commits exist purely to re-align vocabulary across the two copies
(`3f892e6`, `702f846`, `4695ddb` (a revert of `702f846`), `201dc5a`, `12dcdaf`,
`c173c0d`, `6f86613`).

### Guardrail: never auto-send customer email

**Chosen:** `ready_to_send: Literal[False] = False  # invariant — never auto-sent`
[api/contracts.py:93].
**Rationale, in README:** "a political guardrail that lets real operations teams
trust the system" [README.md]. This is enforced at the type level, and a test
asserts it [docs/internal/TESTING.md — "`CustomerFulfillmentDraft.ready_to_send`
is always `False` (guardrail) ✅"].

---

## 5. Implementation facts

### API endpoints — 21 total

`grep -rn -E "@(app|router)\.(get|post|put|patch|delete)" api/` → 21 matches.

**[api/main.py]** (5)
| Method | Path | Line |
|---|---|---|
| GET | `/health` | :69 |
| POST | `/agent/echo` | :78 |
| POST | `/agent/process-defect/stream` | :108 |
| GET | `/notifications` | :125 |
| PATCH | `/notifications/{notification_id}/read` | :134 |

**[api/sim/router.py]** (1)
| POST | `/sim/next-defect` | :48 |

**[api/routers/production.py]** (12)
| Method | Path | Line |
|---|---|---|
| GET | `/lines` | :41 |
| GET | `/lines/{line_id}/problems` | :53 |
| GET | `/problems/{problem_id}` | :83 |
| GET | `/problems/{problem_id}/actions` | :155 |
| GET | `/problems/{problem_id}/involved-people` | :174 |
| GET | `/problems/{problem_id}/notify` | :193 |
| GET | `/problems/{problem_id}/impact` | :212 |
| GET | `/problems/{problem_id}/qc` | :281 |
| POST | `/problems/{problem_id}/analyze/stream` | :353 |
| GET | `/problems/{problem_id}/decision` | :430 |
| PATCH | `/decisions/{decision_id}/status` | :465 |
| POST | `/notifications/send-email` | :496 |

**[api/routers/distributor.py]** (3)
| GET | `/lines/dist-status` | :24 |
| GET | `/problems/{problem_id}/involved-customers` | :53 |
| GET | `/problems/{problem_id}/dist-actions` | :73 |

### Code size

`find api -name "*.py" (excluding .venv/__pycache__) | xargs wc -l` → **4,081 lines**
across 33 Python files. Largest: [api/routers/production.py] 596,
[api/agents/runtime.py] 289, [api/db/queries.py] 272, [api/agents/orchestrator.py] 232.

### Database contents (measured, `data/sentinel.db`)

products 200 · customers 6 · customer_specs 16 · batches 7 · qc_results 579 ·
decision_log 3 · users 50 · problems 20 · actions 74 · involved_people 100 ·
notify_people 100 · dist_actions 70 · involved_customers 43 · line_status 7.

The **second copy** at `api/data/sentinel.db` is identical except
`decision_log` = **14** rows (11 more) — real agent runs wrote to the deployed
copy and it was committed back. Note: README says "~1000+ QC rows" [README.md,
"What's in the box"]; the actual count is **579**. **Contradiction — the README
overstates by ~1.7×.**

### Tests — 2 scripts, neither a test framework

- [api/smoke_test.py] (209 lines) — an HTTP smoke test run manually against a live
  server: `python3 api/smoke_test.py https://fgf-sentinel-api-production.up.railway.app`
  [README.md; api/smoke_test.py:3-6]. Fires a breach and a non-breach payload at
  `/agent/process-defect/stream` and asserts each SSE event type appears.
- [api/test_runtime.py] (58 lines) — a manual script (`python test_runtime.py`
  [api/test_runtime.py:3]) that prints agent runtime output. It contains no
  assertions; the functions are named `test_*` but nothing checks them.

There is **no pytest, no test runner, no CI** — `pytest` is absent from
[api/requirements.txt] and `.github/` does not exist. `package.json` has no test
script [package.json:6-11]. Manual test results are written up in
[docs/internal/TESTING.md] and [docs/internal/TESTING_detailed.md].

### Screens / routes

- Static portal, 6 pages, deployed: `login.html`, `roles.html`, `line-portal.html`,
  `line-detail.html`, `dist-portal.html`, `dist-detail.html`
  [web/public/maridian/] — duplicated in [front/].
- Next.js app, 4 routes: `/` (redirect only), `/dashboard`, `/demo`, `/specs`
  [web/app/*/page.tsx].
- Pitch page: [web/public/pitch/index.html].
- 5 React components: `DecisionCard`, `Nav`, `OverrideModal`, `ReasoningStream`,
  `SimulatorPanel` [web/components/].

### Performance numbers

- **"~30 seconds" end-to-end** [README.md ×3]: `NO MEASUREMENT IN REPO` as a
  committed benchmark. The closest artifact is a commit *subject line*:
  "F-T2 ✅ + LATENCY REALITY (30-40s/run)" [commit `87848c8`, 2026-05-28]. That is
  a claim from a status commit, not a recorded measurement, and it says **30–40s**,
  not ~30s.
- **"~13 tool calls per decision"** [README.md, Stack]: `NO MEASUREMENT IN REPO`.
  The number comes from an *expectation* in a docstring — "tool_call_start /
  tool_call_result (x13 across all agents)" [api/smoke_test.py:23]. It is what the
  smoke test expects, not a measured average.
- **"smoke 26/26"** [commit `4579c95`]: a commit-message claim; no committed
  output log.
- Cache hit rate, query time, bundle size, Lighthouse: `NO MEASUREMENT IN REPO`.

### Timeouts and limits (real, in code)

`MAX_ROUNDS = 8`, `MAX_TOKENS = 4096`, `AGENT_TIMEOUT = 30.0s`,
`_RETRY_DELAYS = [15, 30, 60]` [api/agents/runtime.py:28-31];
`_COLLECT_TIMEOUT = 45.0s` per stage [api/agents/orchestrator.py:81];
tool handlers retry once with a 0.3s pause [api/agents/runtime.py:92-103].

---

## 6. Results and evidence

**What shipped:** two deployed services. The Vercel frontend is still up (200 on
`/maridian/login.html`, verified above). The Railway API is gone (404, verified
above), so the shipped system is **currently non-functional end to end**.

**Real users:** no evidence in the repo. There is **no analytics integration**
anywhere — no Vercel Analytics, GA, PostHog, or Sentry import in
[web/app/layout.tsx] or any HTML page. The only usage evidence is 11 extra
`decision_log` rows in the deployed DB copy vs the local one (see §5), i.e. a
handful of agent runs against the deployed service — consistent with the team's own
testing, not external users. Login is not real auth [front/login.html:167], so
there are no accounts.

**Event / placement:** README says "judged at TMLS 2026, and received strong
reception from the sponsor judge panel" [README.md, Status], and CONTRIBUTORS
lists "**Fri:** live demo at TMLS 2026, judges' panel, FGF Brands sponsor
reception" [CONTRIBUTORS.md]. `UNVERIFIED:` no award, placement, score, or judge
feedback artifact exists in the repo — no screenshot, no email, no results file.
"Strong reception" is unsupported by any committed evidence.

**Sponsor relationship:** README states the project was built "in partnership with
FGF Brands" who "provided the operational context, customer-spec data structure,
and decision matrix" [README.md]. `UNVERIFIED:` no FGF-supplied artifact is in the
repo. All seed data is synthetic — the seed script author's own commits describe it
as "4 demo scenarios" [commit `ed352b5`], and `users` rows carry `@maridian.com`
addresses with password `pass123` (see §10).

**Measured outcomes:** none. Every dollar figure the system reports is computed
from seeded prices [api/routers/production.py:246, api/tools/recovery_value.py]
against synthetic batches. There is no before/after, no baseline, no operator
study.

---

## 7. Contribution

`git shortlog -sne HEAD` (245 commits, 9 identities / 6 people):

```
102  bahar-oveis <oveisgharan.b@gmail.com>
 41  Mahyar Jaberi <jaberi.mahyar@gmail.com>
 33  Mahyar Jaberi <107087318+mahyar-jbr@users.noreply.github.com>
 24  Elham <elhamrazi99@gmail.com>
 21  Matin Mehrabani <matin.mehrabani1397@gmail.com>
 13  sabayazdani <saba.yzdn26@gmail.com>
  9  r <r@r>
  1  Elham Razi <47900695+elhamrazi@users.noreply.github.com>
  1  Matin Mehrabani <46069027+matinmehrabani@users.noreply.github.com>
```

Mahyar = 74 commits across two identities (30% of all commits), the largest
individual share; Bahar has the most single-identity commits at 102, but many are
one-line documentation commits (roughly 40 consecutive `E2-T2:` doc commits on
2026-05-27, e.g. `9c5bbc8` through `bba7271`).

**Lines changed** (`git log --no-merges --numstat`, text paths only —
`api web front shared docs data *.md`; renames disabled):

| Author | Added | Deleted |
|---|---|---|
| Mahyar (both identities) | **+16,267** | −3,575 |
| Bahar | +4,898 | −238 |
| Elham | +4,219 | −305 |
| Matin | +3,824 | −432 |
| Saba | +1,187 | −16 |
| `r@r` | +26 | 0 |

**Where Mahyar's lines actually are** — this is the honest part:

| Area | Lines added |
|---|---|
| `web/public/` (the Vercel mirror of the portal + pitch page) | 8,069 |
| `front/` (the portal source) | 4,270 |
| `docs/fgf-sentinel-briefing.html` | 1,416 |
| `docs/internal/` (BACKLOG, TEAM, status) | 1,110 |
| other docs + README/ROADMAP/CONTRIBUTORS | ~693 |
| `api/routers/` | 114 |
| `api/contracts.py` | 91 |
| `api/main.py` | 59 |
| `api/db/` | 46 |
| `web/app/` + web config | ~197 |

So **~76% of Mahyar's added lines are frontend HTML, and roughly half of that is a
duplicated mirror copy of `front/` — the same code counted twice.** His backend
Python footprint is about **310 added lines**: [api/routers/distributor.py] (97
lines, sole author), parts of [api/routers/production.py], [api/contracts.py],
[api/main.py], and the DB-path hotfix in [api/db/connection.py].

**Mahyar wrote none of the agents, none of the tools, and none of the schema.**
- `api/agents/*` — Elham, 35 file-commits; orchestrator.py and runtime.py are
  100% Elham's except one `r@r` and one Bahar commit.
- `api/tools/*` — Saba, 14 file-commits (all 12 tool modules, commits `afd48d6`
  through `909f396`).
- `api/db/schema.sql` — Bahar, 13 commits, sole author.

**Where the title fits:** "Infrastructure Lead · Coordinator" [CONTRIBUTORS.md] is
consistent with the evidence — Mahyar owns deploy config, the API contract
[api/contracts.py], the two Railway hotfixes, all 24 `Merge pull request` commits,
every `status:` commit, and the backlog/coordination docs. "Lead" here means
integration, deploy, and process, **not** authorship of the agent system. Say that
plainly in an interview.

**Two CONTRIBUTORS.md claims git does not support:**
1. Saba is credited with "production API endpoints" [CONTRIBUTORS.md]. Git shows
   `api/routers/production.py` committed by Elham (3) and Mahyar (1); Saba has
   **zero** commits under `api/routers/`. Her 13 commits are all `api/tools/`.
2. Bahar is credited with "distributor portal" [CONTRIBUTORS.md]. Git shows
   `front/dist-portal.html` by Matin and Mahyar, and `api/routers/distributor.py`
   by Mahyar alone. Bahar has no commits to either.

`UNVERIFIED:` The 9 commits by `r <r@r>` are a misconfigured git identity. They are
almost certainly Mahyar's — they are `status:`/`team:` commits in his exact format
("status: E5-T2 ✅ (PR #14 cleanup) — 33/47"), and he committed
"chore: re-trigger Vercel deploy with valid git author (was r@r)" [commit `bc1b5be`]
immediately after. But nothing in the repo states it. If they are his, his commit
count is 83, not 74.

**Process claims:** CONTRIBUTORS says "25+ pull requests, all peer-reviewed"
[CONTRIBUTORS.md]. The repo contains **24** `Merge pull request` commits
(`git log --merges | grep -c`), with PR numbers running #1–#25. "47 tasks" checks
out — [docs/internal/BACKLOG.md] contains exactly 47 unique `E<n>-T<n>` IDs, plus
19 `F-T<n>` IDs in [docs/internal/BACKLOG_FRIDAY.md]. `UNVERIFIED:` whether the PRs
were actually reviewed — no review metadata is in the repo (GitHub-side only).

---

## 8. War stories

### 1. Railway crash — prod down Wednesday afternoon (the best one)

**Commit `c5616f5`** (Mahyar, 2026-05-27 17:28) — the commit message is unusually
complete and is itself the primary evidence:

> "Railway deploys with Root Directory=/api, so connection.py's
> `../../data/sentinel.db` pointed ABOVE the container root → sqlite3
> OperationalError 'unable to open database file' → lifespan re-raised → app
> crashed on startup → 502 on every route (prod down Wed afternoon)."

**Diagnosis:** "Verified via Railway deploy log (**not build log**): crash traceback
was `init_db → get_db → sqlite3.connect(DB_PATH)`, nothing else." The build log was
green — the failure was only visible in the runtime log.

**Fix, three parts:** (a) DB path resolution in priority order —
`SENTINEL_DB_PATH` env (which "was already advertised in .env.example but never
read"), then `api/data/`, then repo-root `data/` [api/db/connection.py:34];
(b) commit a second, seeded copy of the DB at `api/data/sentinel.db` so prod reads
real data; (c) make `init_db()` and the lifespan handler non-fatal so a DB error
can't take `/health` down [api/main.py:35-43]. That third change is still in the
code and its comment still explains why: "Keep startup non-fatal so a DB issue
can't take the whole API down mid-demo" [api/main.py:37-38].

Merged as PR #12 [commit `48ffd49`].

### 2. The stream that trailed off — orchestrator hang

**Commit `8b80654`** (Elham, 2026-05-28), two bugs found *by the smoke test*:

> "Bug 1 — stream trails off after `agent_thinking` on non-breach paths:
> `_collect()` had no timeout, so a rate-limit retry sleep (15/30/60s) in any agent
> would block the entire orchestrator indefinitely."

Fix: `_collect_safe()` wrapping every stage in `asyncio.wait_for(45s)`, still in
the code [api/agents/orchestrator.py:99-118].

> "Bug 2 — `batch_updated.breached` emits None/string instead of boolean:
> `batch_tracker.md` prompt said 'breached is true when fulfillment_pct <
> sla_threshold' — **wrong formula** (tool uses `defect_rate >= sla_threshold`,
> completely different metrics). Agent got confused and output 'true' as a string
> or null."

A prompt bug, not a code bug — the prompt described a different metric than the
tool computed. Fix was to tell the agent to copy the tool's `breached` field
verbatim.

**The honest sequence** is visible in the log: `4579c95` marked F-T17/F-T18 done
("smoke 26/26"), then **`04f5b64` reverted it** — "F-T17 reverted to 🟡: smoke test
catches 2 real bugs (non-breach trails off, breached=None)" — then `8b80654` fixed
them, then `5480258` ("F-T17 ✅ — 5/19 done; breached=None known minor with FE
workaround"). Note the last one: the bug was closed with a *frontend workaround*,
not a full fix.

### 3. Vercel auto-deploy silently stopped

**Commit `3d148a7`**: "F-T1 ✅ + auto-deploy reliability finding (webhook dropped,
manual `vercel --prod` rescued)". The root cause was git identity: three separate
commits exist titled "chore: re-trigger Vercel deploy with valid git author"
[`bc1b5be`, `de563dd`, `604d359`] — the last two are the *same message committed
twice*, once as `r@r` and once as Mahyar, i.e. the fix commit itself was first made
under the broken identity. Vercel wouldn't attribute (and so wouldn't build)
commits from an unrecognized author.

### 4. Mailtrap took Railway down twice in ten minutes

**`420b9cb`** (01:45): "fix(api): add mailtrap to requirements.txt so Railway
doesn't crash on import" — `import mailtrap as mt` [api/routers/production.py:20]
was merged without the dependency. Then **`558b57d`** (01:56, eleven minutes
later): "fix(api): bump pydantic to 2.11.7 to satisfy mailtrap dependency" — the
new dependency forced a pydantic upgrade [api/requirements.txt:3]. Both at ~2am on
the last night.

### 5. The contract vocabulary war

A recurring cost of the hand-mirrored Python/TypeScript contract. `702f846` aligned
the frontend to a "realigned contract vocab", `4695ddb` **reverted it 7 minutes
later**, and at least five more commits re-aligned vocabulary across the boundary
(`3f892e6`, `201dc5a`, `12dcdaf`, `c173c0d`, `6f86613` "remove duplicate sim route
and align DecisionAction enum with contract"). Also `5e32ec4`:
"docs(SUBMISSION): correct decision threshold 0.5 → 0.80 to match prompt" — the
submission doc had been describing a different threshold than the prompt used.

### 6. Security bump under deadline

**`0262f33`**: "fix: bump next 14.2.5 → 14.2.35 (CVE-2025-55184/67779); status
25/47; flag+fix Railway deploy" — done mid-sprint [web/package.json:12].

### 7. The Google Maps round trip

`4fcdc47` "Add google map public api" (Elham, Thu 10:40) → `eced851` `Revert "Add
google map public api"` (Elham, 11:52). In and out in 72 minutes. The diff touched
only `front/line-detail.html` and its mirror; no key was committed.

### Late-night pattern

The last night runs `c3b5e81` (23:47) → `bbecba2` (00:56) → `14de528` (01:08) →
`3f16f65` (01:22) → `711cec0` (01:30) → `ee288bc` (01:41) → `558b57d` (01:56) →
`8fe5a23` (02:15). Eight commits and four branch merges between midnight and 2am
on the night before the Friday demo.

---

## 9. Publishable assets

**Screenshots — 4, real UI, publishable:**
- [web/public/pitch/shots/line-portal.png] (58 KB)
- [web/public/pitch/shots/line-detail.png] (127 KB)
- [web/public/pitch/shots/login.png] (49 KB)
- [web/public/pitch/shots/roles.png] (54 KB)

These are the only images tracked in the repo
(`git ls-files | grep -iE '\.(png|jpg|gif|svg|mp4|pdf)$'` → 4 results). They show
real seeded data, not lorem ipsum. **Caveat:** the roster names shown in
`line-detail` are fabricated staff ("Nina Torres", "Ben Adeyemi", "Grace Park" —
[data/sentinel.db].involved_people), which is fine to publish but should not be
presented as real personnel.

**No recordings or GIFs.** `README` commit `ade89d8` mentions "add F-T19 fallback
video" as a backlog item; no video file is in the repo.

**Diagrams:**
- Mermaid architecture diagram in [README.md] — **do not publish as-is**, its
  control flow is wrong (see §3: it gates Batch Tracker on breach; the code does not).
- ASCII agent-pipeline diagram in [docs/internal/SUBMISSION.md] — this one **is**
  accurate against the code and is the better source.
- ER diagram in [shared/schema.md] and [data/DATA_TECHNICAL.md] (commit `93df048`).

**Pages that render standalone:**
- [web/public/pitch/index.html] — the pitch deck, self-contained, live at the
  Vercel root. **Flag:** it says "FGF Sentinel" and "Five agents" [lines 5-6],
  contradicting the README's "Maridian" and "six agents".
- [docs/fgf-sentinel-briefing.html] — 1,416-line briefing doc, standalone.
- [docs/status-wed.html] — **untracked**, not in git.

**Sample data / example outputs:**
- [data/sentinel.db] and [api/data/sentinel.db] — seeded, synthetic, well-documented
  in [data/DATA_DICTIONARY.md], [data/DATA_OVERVIEW.md], [data/DATA_TECHNICAL.md].
- [docs/internal/api.http] — a request collection showing real payload shapes.
- [api/smoke_test.py:8-45] — two complete example request/response payloads with
  the expected SSE event sequence. Good case-study material.

**Branding:** design tokens in [web/public/pitch/index.html:13+] and
[web/tailwind.config.ts]; typefaces Geist / Geist Mono / Fraunces
[web/public/pitch/index.html:10]. No logo file exists in the repo.

**Placeholder content to flag:**
- Simulator defect images are `placehold.co` URLs, not photographs
  [api/sim/router.py:31-41]. Anything showing a "defect image" in the Next.js demo
  is a colored rectangle.
- `POST /problems/{id}/analyze/stream` passes `image_url: ""`
  [api/routers/production.py:406] — the production path has no image at all.
- The Next.js `/demo`, `/dashboard`, `/specs` routes are not the demo the README
  points at, and `/demo` falls back to a client-side mock when the API is absent
  [web/lib/simulator.ts:85].

---

## 10. Do-not-publish list

### CRITICAL — live secret in git history

**A Mailtrap API token is committed in the repo's history.**
Commit `0a88cc0` (2026-05-29) moved it to an env var, but the prior state is
permanently in history:

```
-_MAILTRAP_TOKEN  = "83eedddb86ac4ea224dbeaf3ab769d8d"
-_TEST_RECIPIENT  = "maridian.agent@gmail.com"
```

(from `git show 0a88cc0 -- api/routers/production.py`). It was live in
`api/routers/production.py` from `14de528` (2026-05-29 01:08) until `0a88cc0`
(21:32). **Rotate that token before publishing the repo.** Removing it from HEAD
does nothing — `git log -p` still shows it, and this repo is already public enough
to have a README written for LinkedIn.

Also exposed by the same diff: the operational mailbox **maridian.agent@gmail.com**.

### Other credentials

- [api/.env] exists on disk and is gitignored [.gitignore: `.env`]. Confirmed
  **not** tracked (`git ls-files | grep env` → only the two `.env.example` files).
  It presumably holds a live `ANTHROPIC_API_KEY` — never publish it, and check
  whether the key it holds was ever used in a screenshot or log.
- Every seeded user row carries the plaintext password `pass123`
  ([data/sentinel.db].users, 50 rows). Synthetic, but a committed database file
  full of `password` columns reads badly in a security-conscious review. It is also
  reachable in the published repo via `data/sentinel.db`.

### Dead / broken things a visitor will hit

- **The API is 404.** Every link in the README to
  `https://fgf-sentinel-api-production.up.railway.app/health` [README.md:8, the
  "API" link, the "Agent streaming endpoint" section] is dead, and the
  `status-deployed` badge [README.md:7] is false. Anyone clicking "Live Demo" and
  pressing "Run AI Analysis" gets a broken page — the portal fetches from that dead
  host [web/public/maridian/line-detail.html:1030]. **Fix the badge and the links,
  or redeploy, before pointing anyone at this.**
- The README smoke-test command [README.md, "Smoke-test the live API"] will fail
  against the dead host.
- `front/*.html` hardcodes `http://localhost:8001` [front/line-portal.html:335 and
  three others] — harmless but visibly a dev artifact.
- The generated email body links to `http://localhost:5501/line-detail.html`
  [api/routers/production.py:521] — a localhost URL in an outbound customer-facing
  email template.

### Third-party / confidentiality

- **Real company names as customer records:** Loblaws, Tim Hortons, Metro, Sobeys,
  Bulk Barn, Second Harvest — with fabricated SLA thresholds, order quantities, and
  defect rates attached ([data/sentinel.db].customers; commit `9ea27b3`). This data
  is invented, but a page showing "Loblaws — SLA breached, 4% defect rate" is a
  named real company attached to a fabricated quality failure. Label it clearly as
  synthetic, or rename the accounts, before publishing screenshots.
- **FGF Brands** is named as a partner throughout [README.md, CONTRIBUTORS.md,
  LICENSE-adjacent docs]. `UNVERIFIED:` whether there is an NDA or any agreement
  governing what may be said about that relationship, or whether FGF approved the
  use of their name and logo-adjacent branding on a public portfolio page.
- **License is All Rights Reserved** [LICENSE:7, commit `b65cfcf`: "license: switch
  to all-rights-reserved proprietary (team consensus)"]. Copyright is held jointly
  by five named people [LICENSE:4-5]. **A case study is fine; publishing code
  excerpts is a joint-ownership question, not Mahyar's alone.**
- Four teammates' full names and LinkedIn URLs are in [CONTRIBUTORS.md], and six
  personal email addresses are in `git shortlog`. Fine to credit by name; do not
  republish the email addresses.

### Internal material

- [INTERVIEW_PREP.md] (34 KB, repo root) — **untracked**, not in git. Make sure it
  stays that way; it is a personal prep document sitting in a repo that is
  otherwise public.
- [docs/status-wed.html] — untracked, unreviewed.
- [docs/internal/] is tracked and public: BACKLOG, BACKLOG_FRIDAY, TEAM (daily
  ownership grid naming who was behind on what), TESTING reports listing bugs.
  This is honest and arguably a strength — but confirm every teammate is fine with
  their daily task status being public before linking to it.

---

## 11. Open questions for Mahyar

1. **The Mailtrap token `83eedddb…` is in git history (commit `14de528`→`0a88cc0`).
   Has it been rotated?** If not, rotate it before the case study goes live.
2. **Is the Railway API coming back?** It currently 404s. Do you redeploy it, or do
   you rewrite the README to describe a decommissioned demo and lead with the
   screenshots?
3. **How many agents do you claim?** The code has 6; README says 6, ROADMAP says 7,
   `production.py:355` says 5, and the deployed pitch page says "Five agents". Pick
   one and fix the other three.
4. **Is it "Maridian" or "FGF Sentinel"?** The README and the live pitch page
   disagree. Which is the portfolio name?
5. **Why no agent framework (LangGraph/LangChain)?** The README states the fact but
   never the reason, and no commit records it. What was the actual reasoning?
6. **Why SQLite, committed to git, rather than a hosted Postgres?** Nothing in the
   repo records this choice or any alternative considered.
7. **Why SSE rather than WebSockets** for the reasoning stream? No alternative
   appears anywhere in the history.
8. **Why was the Next.js app abandoned for vanilla HTML** three days in? The
   `front/` portal replaced it, and `web/app/page.tsx` now just redirects away. No
   commit explains the switch.
9. **Where does "~30 seconds" come from?** The only artifact says **30–40s**, in a
   commit subject line (`87848c8`). Do you have a timing you actually measured?
10. **Where does "~13 tool calls per decision" come from?** It matches an
    *expectation* in [api/smoke_test.py:23], not a measurement. Was it ever averaged
    over real runs?
11. **README says "~1000+ QC rows"; the DB has 579.** Which number do you want to
    stand behind?
12. **Was the smoke test's "26/26" ever captured as output?** No log is committed.
13. **What did the TMLS judges actually say?** "Strong reception from the sponsor
    judge panel" [README.md] has zero supporting artifact. Was there a placement,
    a score, a written comment, a photo?
14. **What did FGF Brands actually provide?** The README credits them with the
    operational context and decision matrix, but no FGF-supplied file is in the
    repo and all data is synthetic. What can you say publicly about that
    relationship, and is there an NDA?
15. **Are the 9 `r <r@r>` commits yours?** The style matches your `status:` commits
    exactly, and you committed the "valid git author" fix — but the repo never says
    so. It changes your commit count from 74 to 83.
16. **CONTRIBUTORS credits Saba with "production API endpoints" — git shows Elham
    and you wrote `production.py` and Saba has no `api/routers/` commits.** Is the
    credit line wrong, or did she write code that someone else committed?
17. **CONTRIBUTORS credits Bahar with the "distributor portal" — git shows Matin
    and you.** Same question.
18. **"25+ pull requests" — the repo has 24 merge commits (PRs #1–#25).** Was one
    squashed or closed, or should that read 24?
19. **Were the PRs actually reviewed?** No review metadata exists locally. Can you
    pull approval counts from GitHub if a reader asks?
20. **The license is All Rights Reserved, jointly held by five people.** Do you have
    the team's sign-off to publish code excerpts and screenshots in a portfolio
    piece?
21. **Are you comfortable publishing `docs/internal/` (the daily ownership grid names
    who owned what and when it slipped)?** Have the other four seen it?
22. **The seeded customers are real companies (Loblaws, Tim Hortons, Metro) attached
    to fabricated SLA breaches.** Rename them for public screenshots, or label the
    data as synthetic prominently?
