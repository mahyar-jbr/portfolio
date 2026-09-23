# PORTFOLIO_EXTRACT — MoneyMind

Factual extraction pass, 2026-08-08. Every claim cites source. Gaps are marked
`UNVERIFIED:` or `RATIONALE NOT IN REPO` rather than filled in.

**Method note:** paths are given relative to the git repo root (`moneymind/`).
The outer folder `MoneyMind-GoogleHackathon/` is not a git repo and holds two extra
files (`moneymind-pitch.html`, `AGENT-LAYER-LEARNING-GUIDE.md`).
Some `git log` walks that require tree diffs (`--numstat`, `--name-only`, path-limited
logs) **hang on this volume** — a `pytest` run also died with
`TimeoutError: [Errno 60] Operation timed out` reading a file out of `.venv`. Anything
I could not measure because of that is flagged, not estimated.

---

## 1. Identity

**Canonical name: `MoneyMind`.**

| Name / identifier | Where it appears |
| --- | --- |
| `MoneyMind` | [README.md:1](README.md#L1); FastAPI `title="MoneyMind Backend"` [backend/app/main.py:16](backend/app/main.py#L16); `<title>MoneyMind — An AI co-pilot that remembers who you are.` [frontend/app/layout.tsx:11-15](frontend/app/layout.tsx#L11-L15) |
| `moneymind` | default Mongo DB name [backend/app/db/client.py:24](backend/app/db/client.py#L24), [agent/db/client.py:28](agent/db/client.py#L28) |
| `frontend` (v0.1.0) | npm package name — **not** "moneymind" [frontend/package.json:2-3](frontend/package.json#L2-L3) |
| `money-mind-seven.vercel.app` | Vercel deploy name [README.md:7](README.md#L7) |
| `moneymind-production-2a7e.up.railway.app` | Railway deploy name [BACKLOG.md:14](BACKLOG.md#L14) |
| `moneymind-hack` | GCP project id [BACKLOG.md:12](BACKLOG.md#L12) |
| `X-MoneyMind-User-Id` | internal loopback auth header [backend/app/api/chat.py:61](backend/app/api/chat.py#L61) |
| `github.com/mahyar-jbr/MoneyMind` | git remote; linked from the landing page [frontend/app/page.tsx:141](frontend/app/page.tsx#L141) |

No old names or internal codenames found.

**One sentence:** A personal-finance chat agent that ingests a user's transactions
(CSV or PDF bank statement), stores behavioural observations about them as vector-searchable
"memories," and uses those memories plus stated context to answer spending questions and
propose interventions — built for a hackathon, aimed at an individual consumer managing
their own spending.

**Current status: half-dead deployment, development stopped 2026-06-08.**

- Frontend **live**: `https://money-mind-seven.vercel.app` → HTTP 200, page title `MoneyMind — An AI co-pilot that remembers who you are.` (curl, 2026-08-08).
- Backend + agent **gone**: `https://moneymind-production-2a7e.up.railway.app/health` → HTTP 404 with Railway's edge body `{"status":"error","code":404,"message":"Application not found"}`. DNS still resolves (69.46.46.127) but no app is bound. The `/health` route does exist in code [backend/app/main.py:28-30](backend/app/main.py#L28-L30), so this is a torn-down deploy, not a routing bug.
- **Consequence:** the frontend proxies all data through `BACKEND_URL` [frontend/lib/backend.ts:3-6](frontend/lib/backend.ts#L3-L6), so chat, dashboard and ingest on the live URL cannot function. **This contradicts [README.md:103](README.md#L103) "What works on the live URL right now."**
- Last commit `ada89ca`, 2026-06-08 16:29:39 -0400. 201 commits on HEAD, 204 across all refs.
- Working tree is dirty: 25 uncommitted changes (23 staged renames into `_archive/`, 2 untracked files), dated 2026-07-14 by directory mtime, never committed.
- No CI of any kind — no `.github/`, no `.gitlab-ci.yml`, no workflow files anywhere.

---

## 2. The problem

**Stated in the repo**, not reconstructed:

> "A personal finance agent that learns your patterns, holds the context you give it
> ("I'm bulking this month", "birthday party this week"), and acts proactively — instead
> of waiting for you to open an app and stare at a pie chart." — [README.md:13](README.md#L13)

> "Every finance app (Mint, YNAB, Cleo, Copilot, Monarch) has a memory of your
> **transactions**. MoneyMind has a memory of **you**." — [README.md:17](README.md#L17)

**Target user:** not stated as a segment anywhere. The repo names competitor products
[README.md:17](README.md#L17) but no persona, no user research, no interviews.
`UNVERIFIED:` who this is specifically for beyond "an individual with a bank account."

**What people did before:** the repo asserts the alternative is the named budgeting apps
[README.md:17](README.md#L17). No evidence of user research supporting that framing.

**Origin context:** built for the Google Cloud Rapid Agent Hackathon, MongoDB Track.
Code freeze 2026-06-04, submission 2026-06-11 [README.md:5-6](README.md#L5-L6),
[CLAUDE.md](CLAUDE.md) "Identity" section.

---

## 3. Architecture

### Layers

Three deployables. Backend and agent ship in **one** Docker container under supervisord;
frontend is on Vercel and deliberately excluded from the image
([.dockerignore:3-4](.dockerignore#L3-L4), comment: "not in this image; lives on Vercel").

### Traced request path — one chat message, end to end

Verified hop by hop:

1. Keystroke → `send(input)` on Enter-without-Shift [frontend/app/chat/page.tsx:171-174](frontend/app/chat/page.tsx#L171-L174)
2. Builds outgoing turn, filtering out card items so only text goes to the model [frontend/app/chat/page.tsx:93-118](frontend/app/chat/page.tsx#L93-L118)
3. `fetch("/api/chat", {method:"POST", body: JSON.stringify({messages})})` — **no** Authorization header; browser auth rides the Clerk session cookie [frontend/lib/chat-stream.ts:2-11](frontend/lib/chat-stream.ts#L2-L11)
4. Next route: `await auth()` → 401 if no userId; `await getToken()` → 401 if no token [frontend/app/api/chat/route.ts:13-20](frontend/app/api/chat/route.ts#L13-L20)
5. Next → FastAPI: `${BACKEND_URL}/chat` with `Authorization: Bearer ${token}` and the **full** message history [frontend/app/api/chat/route.ts:41-48](frontend/app/api/chat/route.ts#L41-L48)
6. FastAPI verifies the Clerk RS256 JWT against `{issuer}/.well-known/jwks.json`; `user_id` = `sub` claim [backend/app/auth/clerk.py:60-90](backend/app/auth/clerk.py#L60-L90)
7. FastAPI → agent: `httpx.AsyncClient(timeout=None)` streaming POST to `${AGENT_URL}/chat` with header `X-MoneyMind-User-Id`. **The JWT is not forwarded** [backend/app/api/chat.py:42-68](backend/app/api/chat.py#L42-L68)
8. Agent rejects any client host not in `{127.0.0.1, ::1, localhost, testclient}` [agent/serve.py:113-123](agent/serve.py#L113-L123)
9. Agent streams `compiled.astream(initial, stream_mode="messages")`, skipping chunks whose `langgraph_node != "agent"` [agent/graphs/main.py:529-554](agent/graphs/main.py#L529-L554)
10. Back out as `text/plain; charset=utf-8` at all three hops [agent/serve.py:173](agent/serve.py#L173), [backend/app/api/chat.py:72](backend/app/api/chat.py#L72), [frontend/app/api/chat/route.ts:80](frontend/app/api/chat/route.ts#L80)
11. Next re-pipes through a manual `ReadableStream` rather than returning `upstream.body` — in-code comment says this works around Vercel Node-runtime buffering "observed in prod 2026-06-06" [frontend/app/api/chat/route.ts:54-84](frontend/app/api/chat/route.ts#L54-L84)
12. Browser consumes via `res.body.getReader()` [frontend/lib/chat-stream.ts:13-23](frontend/lib/chat-stream.ts#L13-L23)

**The chat stream is not SSE and not a WebSocket** — plain-text chunked HTTP. The PDF upload
path *is* SSE, hand-parsed on `\n\n` boundaries rather than via `EventSource`
[frontend/lib/api.ts:107-171](frontend/lib/api.ts#L107-L171).

### External dependencies

| Service | Used for | Cited at |
| --- | --- | --- |
| Google Vertex AI — `gemini-2.5-flash` | agent LLM | [agent/graphs/main.py:65](agent/graphs/main.py#L65), [:399-411](agent/graphs/main.py#L399-L411) |
| Google Vertex AI — `gemini-2.5-flash` | PDF statement extraction (separate call site) | [backend/app/ingestion/statement_parser.py:144](backend/app/ingestion/statement_parser.py#L144), [:238-249](backend/app/ingestion/statement_parser.py#L238-L249) |
| Voyage AI — `voyage-3`, 1024-dim | memory embeddings, raw httpx, no SDK | [agent/embeddings/voyage.py:15-19](agent/embeddings/voyage.py#L15-L19) |
| MongoDB Atlas | sole datastore, via `motor` | [agent/db/client.py:23-28](agent/db/client.py#L23-L28), [backend/app/db/client.py:18-25](backend/app/db/client.py#L18-L25) |
| MongoDB MCP Server (`npx -y mongodb-mcp-server@latest --readOnly`) | read-only Mongo tools exposed to the agent | [agent/mcp_integration/client.py:44-64](agent/mcp_integration/client.py#L44-L64) |
| Clerk `@clerk/nextjs ^6.39.4` | auth | [frontend/middleware.ts:16](frontend/middleware.ts#L16), [backend/app/auth/clerk.py:31-90](backend/app/auth/clerk.py#L31-L90) |
| Vercel | frontend hosting (live) | [README.md:7](README.md#L7); no `vercel.json` in repo |
| Railway | backend + agent hosting (**dead**) | [railway.json:1-14](railway.json#L1-L14) |
| Spline (`my.spline.design`) | 3D iframe on the landing page | [frontend/app/page.tsx:40](frontend/app/page.tsx#L40) |
| NodeSource / astral.sh | build-time only (Node 20 for MCP; `uv`) | [Dockerfile:17-23](Dockerfile#L17-L23) |

### Data model — 9 collections referenced in code

`transactions`, `memories`, `goals`, `budgets`, `user_context`, `interventions`,
`outcomes`, `reminders`, `inbox_messages`.
(Counted with `grep -rhoE 'get_database\(\)\.[a-z_]+|db\.[a-z_]+' --include="*.py"` over
`agent/` + `backend/app/`.)

- **`langgraph_store` is documented but does not exist in code.** [docs/data-model.md:280](docs/data-model.md#L280) and [docs/architecture.md:34](docs/architecture.md#L34) describe it as "managed by LangGraph … GA, persistent, namespaced per user." A grep for `langgraph_store|InMemoryStore|MongoDBStore|store=` across `agent/` and `backend/` returns **zero** hits. **Flagged contradiction.**

**Indexes: 6, all created in one function** [backend/app/db/client.py:33-58](backend/app/db/client.py#L33-L58) —
`transactions_user_date`, `transactions_user_category_date`, `inbox_user_created`,
`inbox_user_type_week`, `reminders_due`, `interventions_user_status_proposed`.

- The Atlas **vector index `memories_vector_idx` is not created by any code in this repo** — the name is hardcoded at [agent/tools/recall_memory.py:62](agent/tools/recall_memory.py#L62) and [agent/tools/forget_memory.py:149](agent/tools/forget_memory.py#L149). `UNVERIFIED:` whether it exists in Atlas and with what config. [BACKLOG.md:38](BACKLOG.md#L38) claims 1024-dim cosine filtered on `user_id`+`type`; that is a doc claim, not code.

### AI agents — there is exactly ONE

**One agent. Not a multi-agent system.** There is a single `create_react_agent(...)` call in
the entire agent layer [agent/graphs/main.py:437-442](agent/graphs/main.py#L437-L442). There
are **no** `StateGraph`, `add_node`, `add_edge`, or `set_entry_point` calls anywhere in
`agent/` — no sub-agents, no supervisor, no handoff tools, no second graph. State schema is
`ChatState(AgentState)` carrying `user_id` + `active_context_block`
[agent/graphs/main.py:68-80](agent/graphs/main.py#L68-L80).

To the project's credit, **the repo never claims otherwise** — [docs/architecture.md:3](docs/architecture.md#L3)
says "Three layers. One agent." That is accurate.

**The 18 native tools** it can call, all registered in one list
[agent/graphs/main.py:354-373](agent/graphs/main.py#L354-L373). Count verified three ways:
`ls agent/tools/*.py | grep -v __init__ | wc -l` → 18;
`grep -cE '_wrap_tool\([a-z_]+, name="' agent/graphs/main.py` → 18.

| Group | Tools |
| --- | --- |
| Memory | `recall_memory` (Voyage `$vectorSearch`), `write_memory`, `forget_memory` (soft-delete via `deleted_at`), `update_user_context` |
| Goals | `write_goal`, `list_goals`, `abandon_goal`, `check_goal_pace` |
| Budgets | `set_budget`, `list_budgets`, `abandon_budget` |
| Interventions | `propose_intervention`, `respond_to_intervention`, `log_outcome` |
| Analytics | `summarize_week`, `query_transactions`, `get_spend_anomaly` |
| Other | `schedule_reminder` |

Plus a **runtime-variable** set of `mongo_*` tools from the MCP subprocess.
`UNVERIFIED:` the exact `mongo_*` tool names — they are enumerated by
`npx mongodb-mcp-server@latest` at spawn time and nothing in the repo pins the list.

**Coordination:** none between agents (there is one). Tools are flat by explicit design —
see §4.

---

## 4. Technical decisions and their rationale

[docs/decisions.md](docs/decisions.md) is unusually good: 15 dated entries, each with
Context / Decision / Trade-off / Revisit. Rationale below is **quoted from the repo**, not
reconstructed.

**1. Chat wire format: plain-text chunked, not SSE** — [docs/decisions.md:145-153](docs/decisions.md#L145-L153)
Alternative considered and rejected: SSE (which `docs/architecture.md` had already committed
to — the mismatch was caught in PR #7 review). Stated why: *"SSE's value (named events,
auto-reconnect, event IDs) is unused for a single-turn, one-response stream that closes when
the agent finishes; the shell already does plain text, so this is also the zero-rework path."*
Trade-off recorded: loses reconnect semantics.

**2. Statement ingest is the one SSE exception** — [docs/architecture.md:131-144](docs/architecture.md#L131-L144)
Why: the pipeline takes 5–30s and *"Without progress signals the user stares at a spinner and
assumes the request hung."*

**3. Tools never call other tools** — [docs/decisions.md:15-23](docs/decisions.md#L15-L23)
Alternative tried in thought: `summarize_week` importing `check_goal_pace`'s 8-verdict ladder.
Stated why: *"LangGraph's tool-call routing sees ONE tool call from the LLM, but multiple Mongo
reads happen, each with its own user_id injection path and its own error surface."* Accepted
cost: duplicated helpers across tools.

**4. Memory writers embed manually; Atlas auto-embed is OFF** — [docs/decisions.md:95-103](docs/decisions.md#L95-L103)
Alternative: Atlas auto-embed — *"#13 verified live: the cluster has the vector index set up
correctly … but the auto-embed pipeline on a source field was never configured."* Cost recorded:
*"~200ms latency to memory writes."*

**5. Anomaly tool buckets in Python, not Mongo `$dateTrunc`** — [docs/decisions.md:105-113](docs/decisions.md#L105-L113)
Alternative rejected: reuse `weekly_spend_by_category`. Stated why: *"mongomock-motor doesn't
implement `$dateTrunc`, so calling the aggregation would force every Sprint 2 tool test against
real Atlas — ~30s per run × 9 remaining tools × every CI run, vs. <1s hermetic."*

**6. Tools take `collection=None` for DI; graph wiring batched** — [docs/decisions.md:115-123](docs/decisions.md#L115-L123)
Stated why: *"proven in #11: 12 tests run in <1s vs. ~30s/run against Atlas"*; per-tool wiring
*"would mean rewriting the graph 10 times."*

**7. DB reads happen before the graph runs, not in the prompt builder** — [docs/decisions.md:55-63](docs/decisions.md#L55-L63)
This is a bug post-mortem: *"motor's cursors bind to the loop they were created on … motor blows
up with 'Future attached to a different loop.'"*

**8. Flatten `gemini-2.5-flash` list-content before streaming** — [docs/decisions.md:65-73](docs/decisions.md#L65-L73)
*"`#11a`'s live demo broke on the chat wire format because `gemini-2.5-flash` returns
`AIMessage.content` as a list of content blocks … when its default thinking mode is on."*

**9. `PYTHONPATH=..` instead of an editable install** — [docs/decisions.md:155-163](docs/decisions.md#L155-L163)
Alternative **attempted and abandoned**: *"Option (b) was attempted and burned 20 min — `uv sync`
reported the editable install succeeded, but `pytest` then hung indefinitely during collection."*

**10. Base64-encode the GCP service-account JSON for env transport** — [deploy/entrypoint.sh:5-9](deploy/entrypoint.sh#L5-L9), [BACKLOG.md:12](BACKLOG.md#L12)
Why: *"raw JSON corrupted PEM newlines."* Same commit records a measured import fix:
*"cold-import 236s → 2.1s"* via importing the `langchain_google_vertexai.chat_models` submodule.

**11. "This week" = latest week with data, not calendar week** — [docs/decisions.md:135-143](docs/decisions.md#L135-L143)
Explicitly a demo accommodation: *"the real calendar week (today 2026-05-27) is empty, so a
strict calendar-week reading would cite nothing and the demo reply would be hollow."*

**12. No streaming re-smoothing** — [docs/decisions.md:125-133](docs/decisions.md#L125-L133)
*"`gemini-2.5-flash` via langchain emits only 2–3 coarse blocks (~3.5s to first block)."*
Decision: leave it; deferred to Sprint 3, never revisited.

**13. Backend has no POST for goals/budgets — writes go only through agent tools** —
rationale in module docstrings [backend/app/api/goals.py:1-8](backend/app/api/goals.py#L1-L8),
[backend/app/api/budgets.py:1-7](backend/app/api/budgets.py#L1-L7).

**Decisions with NO recorded rationale:**

- Choice of **Gemini 2.5 Flash** over any other model. The migration to Vertex AI is logged as done [BACKLOG.md:12](BACKLOG.md#L12) but no entry says why Gemini, or why Flash over Pro. `RATIONALE NOT IN REPO — ask Mahyar`
- Choice of **Voyage AI** for embeddings over Vertex/OpenAI embeddings. `RATIONALE NOT IN REPO — ask Mahyar`
- Choice of **Clerk** over NextAuth/Auth0/Supabase. `RATIONALE NOT IN REPO — ask Mahyar`
- Choice of **LangGraph `create_react_agent`** over a hand-rolled loop or another framework. `RATIONALE NOT IN REPO — ask Mahyar`
- Choice of **Railway** for backend and **Vercel** for frontend. `RATIONALE NOT IN REPO — ask Mahyar`
- Why the dashboard computes all analytics **client-side** from raw transactions while `/agg/weekly` exists server-side and is never called. `RATIONALE NOT IN REPO — ask Mahyar`

---

## 5. Implementation facts

### Backend HTTP endpoints — 13

`grep -rEn "@(router|app)\.(get|post|put|patch|delete)\(" backend/app | wc -l` → 13.
Full paths resolved through `APIRouter(prefix=…)` + [backend/app/main.py:17-25](backend/app/main.py#L17-L25).

| Method + path | Auth | File |
| --- | --- | --- |
| `GET /health` | **none** | [backend/app/main.py:28](backend/app/main.py#L28) |
| `POST /ingest/csv` | Clerk | [backend/app/api/ingest.py:17](backend/app/api/ingest.py#L17) |
| `POST /ingest/statement` | Clerk | [backend/app/api/ingest.py:50](backend/app/api/ingest.py#L50) |
| `GET /agg/weekly` | Clerk | [backend/app/api/aggregations.py:31](backend/app/api/aggregations.py#L31) |
| `GET /transactions` | Clerk | [backend/app/api/transactions.py:10](backend/app/api/transactions.py#L10) |
| `POST /chat` | Clerk | [backend/app/api/chat.py:28](backend/app/api/chat.py#L28) |
| `GET /inbox` | Clerk | [backend/app/api/inbox.py:22](backend/app/api/inbox.py#L22) |
| `GET /interventions/pending` | Clerk | [backend/app/api/interventions.py:142](backend/app/api/interventions.py#L142) |
| `POST /interventions/{intervention_id}/respond` | Clerk | [backend/app/api/interventions.py:159](backend/app/api/interventions.py#L159) |
| `GET /goals` | Clerk | [backend/app/api/goals.py:41](backend/app/api/goals.py#L41) |
| `GET /budgets` | Clerk | [backend/app/api/budgets.py:40](backend/app/api/budgets.py#L40) |
| `POST /agent/run-weekly-summary` | Clerk | [backend/app/api/agent.py:13](backend/app/api/agent.py#L13) |
| `POST /agent/run-reminders` | Clerk | [backend/app/api/agent.py:29](backend/app/api/agent.py#L29) |

12 of 13 declare `Depends(current_user)`; `/health` is the only unauthenticated route.

**Agent service — 2 endpoints:** `GET /health`, `POST /chat`
[agent/serve.py:126,131](agent/serve.py#L126).

**Frontend route handlers — 9** (6 GET, 3 POST):
`/api/chat`, `/api/transactions`, `/api/inbox`, `/api/goals`, `/api/budgets`,
`/api/agg/weekly`, `/api/interventions/pending`, `/api/interventions/[id]/respond`,
`/api/ingest/statement`. No PUT/PATCH/DELETE exists anywhere in the frontend.

**Frontend pages — 5:** `/`, `/chat`, `/dashboard`, `/sign-in/[[...sign-in]]`,
`/sign-up/[[...sign-up]]` (`find app -name "page.tsx" | wc -l` → 5).

### Tests

- **34 test files**: 23 in `agent/tests/`, 11 in `backend/tests/`, **0** in the frontend.
- **372 test functions**: 317 agent + 55 backend
  (`grep -rhE '^[[:space:]]*(async )?def test_' agent/tests | wc -l` → 317; same for backend → 55).
- Run commands: `cd agent && PYTHONPATH=.. .venv/bin/python -m pytest`, and the backend
  equivalent. pytest config at [agent/pyproject.toml:19-21](agent/pyproject.toml#L19-L21),
  [backend/pyproject.toml:22-23](backend/pyproject.toml#L22-L23). The only Make target is
  `seed` [Makefile:1-4](Makefile#L1-L4).
- **`UNVERIFIED:` current pass/fail. I tried to run the agent suite and it aborted with
  `TimeoutError: [Errno 60] Operation timed out` while importing `httpx` from `.venv` — a
  filesystem I/O failure on this volume, not a test failure.** I will not claim the suite passes.
- The **only committed test-run measurement** is in the self-audit:
  *"agent 232 passed, backend 35 passed (267 total). Frontend `tsc --noEmit` exits 0"*
  [docs/prod-readiness-audit-2026-06-06.md:19](docs/prod-readiness-audit-2026-06-06.md#L19).
  That was 2026-06-06; the suite has since grown to 372 functions, so 267 is stale.
- LLM and Atlas calls are mocked: `conftest.py` autouse-stubs `get_mcp_tools()` to `[]`
  [agent/tests/conftest.py:14-39](agent/tests/conftest.py#L14-L39); `mongomock-motor` fakes Mongo;
  `$vectorSearch` / `$dateTrunc` paths use a hand-written `FakeCollection`
  [agent/tests/_fakes.py:27-68](agent/tests/_fakes.py#L27-L68). No integration test hits a real DB or API.
- **Broken test dependency:** `backend/tests/test_statement_pipeline.py:20` imports
  `mongomock_motor`, but `mongomock` appears **0 times** in `backend/pyproject.toml` and 0 times
  in `backend/uv.lock`. A clean `uv sync` would not install it and that file would fail to collect.

### Other counts

- 116 Python + 20 TS + 13 TSX source files (excluding `.venv`, `node_modules`, caches).
- Backend app: 27 `.py` files, 2267 lines. Frontend: 3808 lines across `app/`, `components/`, `lib/`.
- 6 frontend production dependencies, 9 dev.
- 43 allowed transaction categories [backend/app/ingestion/category_vocab.py:20-77](backend/app/ingestion/category_vocab.py#L20-L77); 62 merchant-canonicalisation regex rules [backend/app/ingestion/merchant_canonical.py:43-127](backend/app/ingestion/merchant_canonical.py#L43-L127).
- Synthetic data: `data/synthetic.csv` 331 lines, `data/synthetic-tiny.csv` 31 lines.
- **Zero** `TODO`/`FIXME`/`HACK`/`XXX` markers in `backend/app`, `backend/scripts`, `backend/tests`.

### Performance

**`NO MEASUREMENT IN REPO`** for every performance number the docs assert. Specifically:

| Claim | Where | Status |
| --- | --- | --- |
| "~3–8s warm latency, 20–45s on a cold container" | [README.md:107](README.md#L107) | no benchmark, log, or test in repo |
| "~$0.02 per statement extraction on Flash 2.5" | [backend/app/ingestion/statement_parser.py:26-27](backend/app/ingestion/statement_parser.py#L26-L27) | comment only; no billing export |
| "60–240s cold import" | [agent/serve.py:30-35](agent/serve.py#L30-L35) | no benchmark artifact |
| forget_memory score bands (0.78–0.85 exact / 0.65–0.75 paraphrase) | [agent/tools/forget_memory.py:31-34](agent/tools/forget_memory.py#L31-L34) | prose, no measurement |
| "~200ms latency to memory writes" | [docs/decisions.md:101](docs/decisions.md#L101) | asserted, not measured |

The **one** measured number I can find with a source is **"cold-import 236s → 2.1s"**
[BACKLOG.md:12](BACKLOG.md#L12), attributed to switching to the
`langchain_google_vertexai.chat_models` submodule import. Even that has no committed
benchmark file — it is a claim in a backlog row.

`agent/.benchmarks/` and `backend/.benchmarks/` exist as directories but contain no committed results.

---

## 6. Results and evidence

**Shipped to:** a hackathon submission and the team. **No evidence of real external users
anywhere in the repo.**

- **No analytics of any kind.** `frontend/lib/analytics.ts` is **not** telemetry — it is 237 lines of client-side financial aggregation, whose only import is a type-only `import type { Transaction }`. Zero `fetch`/`sendBeacon`/`navigator` calls [frontend/lib/analytics.ts:1-4](frontend/lib/analytics.ts#L1-L4). A grep for posthog/mixpanel/segment/gtag/@vercel/analytics/amplitude/sentry/datadog across the frontend returns **zero** matches. So there is no usage data, and none can be reconstructed.
- **Deployment evidence:** [railway.json](railway.json) + [Dockerfile](Dockerfile) + [deploy/supervisord.conf](deploy/supervisord.conf) are complete and coherent. Railway is now 404.
- **Recorded live verification** (self-reported, by the team, not third-party):
  - *"End-to-end live verified 2026-06-06 17:02 EDT: 3-turn conversation with active-context recall, real Atlas data, intervention card render, all responses under 5s after warmup"* [BACKLOG.md:9](BACKLOG.md#L9)
  - *"Clerk sign-in → dashboard renders $17,380/26-weeks → chat returns live Vertex Gemini reply"* [BACKLOG.md:14](BACKLOG.md#L14)
  - The birthday-party conversation transcript in [README.md:19-30](README.md#L19-L30) is presented as *"A real exchange from the live app."* `UNVERIFIED:` there is no log, screenshot, or recording committed to corroborate it.
- **Competition:** Google Cloud Rapid Agent Hackathon, MongoDB Track. Submission 2026-06-11 [README.md:5-6](README.md#L5-L6). [_archive/hackathon-docs/DEVPOST.md](_archive/hackathon-docs/DEVPOST.md) is dated "2026-06-11 (submission day)" and contains field-by-field submission copy.
- **`UNVERIFIED:` any award, placement, or result. Nothing in the repo records an outcome.** The README still says *"Video: coming Jun 9"* and *"Devpost: coming Jun 11"* [README.md:142-143](README.md#L142-L143) — those were never updated. **Ask Mahyar whether it was actually submitted and how it placed.**
- **Demo video:** a production kit exists (script, subtitles, companion pages) but **no video file is in the repo.** `UNVERIFIED:` whether it was recorded.

---

## 7. Contribution

Three-person team. `git log -400 --format="%an <%ae>" | sort | uniq -c`:

| Author | Commits | Share of 201 |
| --- | --- | --- |
| **Mahyar Jaberi** (two identities: `jaberi.mahyar@gmail.com` 106 + `107087318+mahyar-jbr@users.noreply.github.com` 50) | **156** | **77.6%** |
| Kasra Bashizadeh | 30 | 14.9% |
| Aydin ([withheld: private]) | 15 | 7.5% |

- 50 merged pull requests, branch names up to `#52`. **Every PR branch is under `mahyar-jbr/`** — Kasra and Aydin committed on branches in Mahyar's namespace or directly.
- Timeline: first commit 2026-05-21, last 2026-06-08 — **19 days**. Peak day 2026-05-31 with 57 commits; 2026-06-02 with 32; 2026-06-06 with 25.
- 55 of 201 commits (27.4%) landed between 22:00 and 04:59 local.

**Ownership by commit-subject scope** (the honest caveat: I could **not** run
`git log --name-only`/`--numstat` per author — those walks hang on this volume, so I have
**no line-churn numbers and no per-file ownership map**):

- **Mahyar** — the agent layer, end to end. Commit subjects `feat(agent):`/`fix(agent):` are essentially all his: tool implementations (`write_goal`, `abandon_goal`, `forget_memory`, `log_outcome`, `schedule_reminder`, `summarize_week`, `set_budget`), the LangGraph wiring, the MCP integration, the prompt. Also the deploy (`fix(deploy): R4 base64-encode service-account JSON`), the streaming wire fixes across all three legs, and — late — a large share of frontend fixes (`fix(frontend): pipe upstream stream through manual ReadableStream`, `fix(dashboard): TrendChart + IncomeExpenses bars now actually render`).
- **Kasra** — backend and data pipeline. All `fix(backend):` CSV-ingest work (`preserve timezone offsets`, `preserve previous csv import on insert failure`, `tighten csv source keys`) and the `fix(auth):` cluster (`bind agent to loopback only`, `trust backend for agent chat`, `ignore csv user_id overrides`).
- **Aydin** — frontend. `fix(frontend): use SignedIn/SignedOut with clerk v6`, `fix(frontend): send clerk jwt to backend, drop user_id query (#23)`, and the `23a-inbox` branch.

**The honest read for an interview:** [README.md:147-149](README.md#L147-L149) lists Mahyar as
"Agent + memory architecture," which the history supports — but it *understates* his footprint.
At 77.6% of commits he also did the deploy, the streaming plumbing, and a meaningful share of
the frontend polish that the README credits to Aydin's lane. Note also that the two Google-Cloud
tracks the submission depended on (Vertex migration R2, MCP integration R1) are both marked
`@mahyar` in [BACKLOG.md:12-16](BACKLOG.md#L12-L16). Conversely: **Aydin's 15 commits are a small
slice**, so describing the frontend as a delegated workstream is generous to the split.

`UNVERIFIED:` line-level churn per author, and which files each person *owned* rather than
merely touched. Re-run `git log --numstat --author=…` on a healthy filesystem to get this.

---

## 8. War stories

Every one of these is a real commit with a real diagnosis recorded in the repo.

**1. Motor cursors crossing event loops — `RuntimeError: Event loop is closed` on message two.**
`ac18503` *"fix(agent): astream_chat keeps everything on one event loop"* and `02b64b0`
*"fix(agent): drive sync stream_chat generator from threadpool."* The post-mortem is written up
as a decision entry: `create_react_agent`'s prompt builder runs inside an already-running loop,
`asyncio.run` makes a new one, and motor *"blows up with 'Future attached to a different loop'"*
[docs/decisions.md:55-63](docs/decisions.md#L55-L63). Fix: pre-fetch every DB read in the entry
point and pass it through graph state; the prompt builder became pure-sync.
[BACKLOG.md:16](BACKLOG.md#L16) records it as reproduced then fixed.

**2. Gemini Flash silently refused a tool.** `9d98b99` *"fix(agent): write_memory tag is optional
— Gemini Flash silently refused the tool."* Part of a four-commit run on 2026-06-06 fighting the
model into writing memories: `9f70612` *"make write_memory mandatory on behavioral signals"* →
`65ca22d` *"collapse memory-write rule + harden tool description"* → `9d98b99` → `42b9c18`
*"unblock write_memory in the proposal-chain turn."* The scar tissue is still visible in the
prompt as an all-caps mandate [agent/prompts/system.py:39-52](agent/prompts/system.py#L39-L52).

**3. Vercel buffered the stream in production.** `4dd7f29` *"fix(frontend): pipe upstream stream
through manual ReadableStream."* The code comment dates the observation: returning
`new Response(upstream.body)` buffered on Vercel's Node serverless runtime, "observed in prod
2026-06-06" [frontend/app/api/chat/route.ts:54-58](frontend/app/api/chat/route.ts#L54-L58).

**4. React's effect cleanup was killing live chat requests.** `ea2c575` *"fix(frontend): stop
canceling in-flight chat requests on effect cleanup."* Comment records the symptom precisely:
the unmount `abortRef.current?.abort()` fired mid-stream in production, showing as "(canceled)"
at ~1.8s. Resolution was to delete the cleanup entirely — *"Users can refresh to abort; we don't
need fancier UX"* [frontend/app/chat/page.tsx:87-91](frontend/app/chat/page.tsx#L87-L91).

**5. A build failed on a Vercel plan ceiling.** `c76d4ff` *"fix(frontend): maxDuration=300
(Hobby ceiling, was 800 — failed build)."*

**6. camelCase vs kebab-case broke the MongoDB-track headline in Railway logs.** `48f23e6`
*"fix(agent): R1 use --readOnly (camelCase) for MongoDB MCP server."* [BACKLOG.md:16](BACKLOG.md#L16):
*"kebab-case form was caught failing in Railway logs and fixed in `48f23e6`"* — and a regression
test was added (`test_server_config_includes_read_only_flag`).

**7. Cold-start nearly caused a Railway restart loop.** `f156444` *"fix(agent): lifespan warmup so
uvicorn ready is instant."* [BACKLOG.md:16](BACKLOG.md#L16) records the heavy graph import at
30–240s cold, so uvicorn's "ready" had to be decoupled onto a background thread or the healthcheck
would restart the container. Related: the `236s → 2.1s` import fix in R2.

**8. Raw JSON in an env var corrupted a PEM key.** `682228c` *"fix(deploy): R4 base64-encode
service-account JSON for env var transport."* The fallback path in
[deploy/entrypoint.sh:21-27](deploy/entrypoint.sh#L21-L27) still logs "(raw, may be malformed)".

**9. The team shipped deceptive demo KPIs and then pulled them.** `9b9506a` *"fix(frontend): drop
deceptive demo KPIs + log V6 budgets ticket"*, then `915ffaa` *"fix(dashboard): TrendChart +
IncomeExpenses bars now actually render."* This is the tail of the self-audit's blocker — see below.

**10. The headline feature was fake in the UI, and the team caught it themselves.** The
2026-06-06 self-audit opens with: *"The intervention card is 100% mock theater — the headline
feature is fake in the UI … `respondToIntervention()` is a literal no-op … Accept/Decline/Modify
persists nothing"* [docs/prod-readiness-audit-2026-06-06.md:26-33](docs/prod-readiness-audit-2026-06-06.md#L26-L33).
It was subsequently fixed — `ad94ab3` *"fix(frontend): wire interventions to real backend"* and PR
#49 `22a-real-intervention-backend`; the current [frontend/lib/interventions.ts](frontend/lib/interventions.ts)
makes real network calls. **This is the strongest story in the repo: they audited themselves,
found the demo was lying, and fixed it before submission.**

**11. Kasra's CSV ingest was reviewed into three rewrites.** `d75c46d`/`a822488`/`7b68c20` all
titled *"fix(backend): preserve previous csv import on insert failure (#4)"*, and three more
titled *"preserve timezone offsets in csv dates"*. The design rationale that came out of it is
logged: overwrite-on-duplicate-source, with *"the blocking fix on PR #2 (insert-then-delete
instead of delete-then-insert)"* [docs/decisions.md:165-173](docs/decisions.md#L165-L173).

---

## 9. Publishable assets

**Thin. There is almost nothing visual to publish.**

`find` for png/jpg/gif/svg/mp4/mov/webp/ico across the whole tree (excluding
`node_modules`/`.git`/`.venv`/`.next`) returns **7 files**:

| Path | What it is | Publishable? |
| --- | --- | --- |
| [frontend/app/favicon.ico](frontend/app/favicon.ico) | favicon | yes |
| `_archive/nextjs-scaffold-svgs/{file,globe,next,vercel,window}.svg` | **stock Next.js scaffold SVGs**, not project art | no — they are Vercel's, not the team's |
| [_archive/hackathon-docs/demo/SUBTITLES.srt](_archive/hackathon-docs/demo/SUBTITLES.srt) | subtitle track for a demo video | only useful if the video exists |

**No screenshots. No GIFs. No recordings. No exported architecture diagram.**

What *does* exist:

- **[../moneymind-pitch.html](../moneymind-pitch.html)** — a 78KB, 16-slide self-contained pitch deck, `<title>MoneyMind · Pitch</title>`. **Not self-contained for publishing**: it loads Tailwind from `cdn.tailwindcss.com`, React/framer-motion/lucide from `esm.sh`, and fonts from Google. It would need those inlined to publish as an artifact. [CLAUDE.md](CLAUDE.md) calls it *"the canonical product vision."*
- **[_archive/hackathon-docs/demo/companions/](_archive/hackathon-docs/demo/companions/)** — 3 HTML companion pages (`architecture.html`, `memory-loop.html`, `tools.html`) built as on-camera visuals. These are the closest thing to publishable diagrams. `UNVERIFIED:` I did not open them; check whether they carry placeholder numbers.
- **ASCII architecture diagrams** in [README.md:59-82](README.md#L59-L82) and [docs/architecture.md:41-51](docs/architecture.md#L41-L51) — accurate, and the cleanest asset in the repo. **Caveat: the README's tool diagram is the version to redraw, not to paste** — it lists `check_goal_pace` twice with an asterisked footnote.
- **[_archive/hackathon-docs/DEVPOST.md](_archive/hackathon-docs/DEVPOST.md)** — polished submission copy. `_archive/README.md` itself flags it: *"worth mining for a future landing page."*
- **The README chat transcript** [README.md:19-30](README.md#L19-L30) — the single best narrative asset, and it needs no screenshot. But see §6: it is uncorroborated.
- **[data/synthetic.csv](data/synthetic.csv)** (331 rows) — safe, clearly synthetic sample data.

**Flagged as looking presentable but not being real:**

- The **landing page hero demo is fake**. `EXAMPLES` hardcodes 3 scripted conversations / 12 messages with invented figures ("$310 on dining this week", "saved $1,840 of $3,000", "12% under budget"), fake-streamed word-by-word on a 45ms loop forever [frontend/app/page.tsx:232-336](frontend/app/page.tsx#L232-L336). **A screenshot of the landing page is a screenshot of fabricated numbers.** Do not present it as product output.
- `StatementCard` hardcodes the currency `"CAD"` in three places regardless of the data [frontend/components/chat/statement-card.tsx:99,122,143](frontend/components/chat/statement-card.tsx#L99).
- `ImportProgress` hardcodes vendor strings as idle hints ("Gemini 2.5 Flash multimodal", "Saving to MongoDB Atlas") [frontend/components/chat/import-progress.tsx:48,60](frontend/components/chat/import-progress.tsx#L48).
- A dead amber `"sample"` pill exists in the dashboard but **no call site passes the `demo` prop**, so it never renders [frontend/components/dashboard/widgets.tsx:29-41](frontend/components/dashboard/widgets.tsx#L29-L41).

---

## 10. Do-not-publish list

### Critical — real credentials sitting in the working tree

**Good news first:** none of these are in git. `git ls-files --error-unmatch .env` → exit 1;
same for `.gcloud/service-account.json`; `git log --all -- .env .gcloud/service-account.json`
returns zero commits. `git ls-files | grep -iE '\.env|gcloud|credential|secret|service-account'`
returns exactly one file: `.env.example`, which contains only placeholders and blanks.
`.gitignore` covers `.env`, `.env.local`, `.env.*.local`, `.gcloud/`, `*.pem`, `*.key`.

**But on disk, unencrypted:**

1. **`.env` holds real, live-format credentials** — verified by prefix/length without printing values: `MONGODB_URI` (130 chars, `mongodb+srv://` with embedded credentials, no placeholder brackets), `GEMINI_API_KEY` (39 chars, `AIza…`), `VOYAGE_API_KEY` (46 chars, `pa-…`), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_test_…`), `CLERK_SECRET_KEY` (`sk_test_…`). Clerk keys are *test* keys; the other three are not.
2. **`.gcloud/service-account.json` is a real GCP private key** — 2365 bytes, `type: "service_account"`, a 1704-char `private_key` containing `BEGIN PRIVATE KEY`, 40-char `private_key_id`, `client_email` on `moneymind-hack.iam.gserviceaccount.com`. Grants Vertex AI access.
3. **`frontend/.env.local` is a symlink to `../.env`** — so the Next.js app loads the full real secret set. Gitignored, but any copy of `frontend/` drags the secrets along.
4. **`frontend/.clerk/.tmp/keyless.json`** contains `publishableKey` and `secretKey`. Gitignored (`frontend/.gitignore:44`), not committed.

**Recommendation: rotate the Atlas URI, the Google API key, the Voyage key, and the GCP service
account before publishing anything.** They have sat in a working tree for months.

### Also do not publish

- **The MCP subprocess receives `MONGODB_URI` as a plaintext `--connectionString` argv element** [agent/mcp_integration/client.py:52-63](agent/mcp_integration/client.py#L52-L63), making the credential visible in the container process table. Worth knowing before you present this as a security-conscious design.
- **The wildcard-issuer auth fallback.** If `CLERK_JWT_ISSUER` is unset, the backend accepts a JWT from **any** issuer whose host ends in `clerk.accounts.dev` or `accounts.clerk.com` — i.e. any Clerk tenant, not just this project's — and fetches JWKS from that attacker-supplied issuer [backend/app/auth/clerk.py:31-52](backend/app/auth/clerk.py#L31-L52). `CLERK_JWT_ISSUER` is **absent from the local `.env`**. `aud` is also not verified [backend/app/auth/clerk.py:70](backend/app/auth/clerk.py#L70). Don't cite the auth design as a strength without fixing or caveating this. `UNVERIFIED:` whether Railway set the var in prod.
- **Personal data:** team members are named with school affiliations in [README.md:147-149](README.md#L147-L149) (Kasra — "4th yr, TMU Comp Sci"; Aidin — "Seneca grad") and full legal names appear in [LICENSE:1-3](LICENSE#L1-L3). **Get their consent before republishing their names, schools, or contribution split.** Kasra's commits also leak a machine hostname (`kasrabshz@Kasras-MacBook-Pro.local`).
- **Name inconsistency:** the README spells the third teammate "Aidin" [README.md:149](README.md#L149) while git spells it "Aydin". Confirm the correct spelling before publishing.

### Links that would embarrass you if a visitor followed them

- **`https://moneymind-production-2a7e.up.railway.app` — 404, dead.** Do not link it. It appears in [BACKLOG.md:14](BACKLOG.md#L14) and [_archive/hackathon-docs/demo/SCRIPT.md:54](_archive/hackathon-docs/demo/SCRIPT.md#L54).
- **`https://money-mind-seven.vercel.app` — loads, but is a shell.** Sign-in works (Clerk is client-side); every data path fails because the backend is gone. **If you link this, a visitor who signs up gets a broken app.** Either redeploy the backend first or link a recording instead.
- The README's *"Video: coming Jun 9 · Devpost: coming Jun 11"* [README.md:142-143](README.md#L142-L143) reads as an abandoned project. Fix or cut before pointing anyone at the repo.
- **No bank statements are in git** — `git ls-files | grep -i '\.pdf$'` returns nothing, and `.gitignore:63-79` blocks statement filename patterns for amex/chase/rbc/bmo/td/scotia/cibc/wells. Two commit subjects say "untrack bank statements," but I could **not** verify whether any were tracked earlier: path-limited `git log` walks hang on this volume. `UNVERIFIED:` **run `gitleaks`/`trufflehog` over all 204 commits on a healthy disk before making the repo public.**

---

## 11. Open questions for Mahyar

1. **Did MoneyMind actually get submitted to the Devpost, and how did it place?** Nothing in the repo records an outcome; the README still says "Devpost: coming Jun 11."
2. **Was the demo video ever recorded?** A full production kit exists (`SCRIPT.md`, `SUBTITLES.srt`, 3 companion pages) but no video file. If it exists, where?
3. **Is the README's birthday-party chat transcript a verbatim real exchange?** It is the single best asset in the repo and there is no log or screenshot backing it.
4. **Why Gemini 2.5 Flash?** No rationale recorded. What did you compare it against?
5. **Why Voyage AI for embeddings** rather than Vertex or OpenAI embeddings? No rationale recorded.
6. **Why Clerk** over NextAuth/Auth0/Supabase? No rationale recorded.
7. **Why LangGraph's `create_react_agent`** rather than a hand-rolled loop or another framework? No rationale recorded.
8. **Why Railway for the backend and Vercel for the frontend** — cost, the single-container MCP requirement, something else? No rationale recorded.
9. **Why does the dashboard compute every metric client-side** from raw transactions when `/agg/weekly` exists server-side and is called by nothing? Deliberate, or drift?
10. **Do you want the Railway backend back up?** Right now the live URL is a shell that breaks after sign-in — that's the single biggest publishing blocker.
11. **Does the Atlas vector index `memories_vector_idx` still exist**, and with what dimension/similarity config? It's hardcoded in two tools but created by no code in the repo.
12. **Does the current test suite still pass?** I could not run it — the filesystem threw `TimeoutError: [Errno 60]`. The only committed figure is 267 passing as of 2026-06-06, now stale against 372 test functions.
13. **`backend/tests/test_statement_pipeline.py` imports `mongomock_motor`, which is in neither `pyproject.toml` nor `uv.lock`.** Was that dropped by accident? A clean `uv sync` would fail to collect that file.
14. **Have you rotated the Atlas URI, Google API key, Voyage key, and GCP service-account key?** All four are real and sitting in `.env` / `.gcloud/` on disk.
15. **Was `CLERK_JWT_ISSUER` set in the Railway environment?** If not, production was accepting JWTs from any Clerk tenant.
16. **Do Kasra and Aydin consent to being named**, with schools and contribution split, in a public case study? And is it "Aidin" (README) or "Aydin" (git)?
17. **What is your line-level contribution split?** I could only measure commits (156/201 = 77.6%). `git log --numstat` hangs on this volume — re-run it elsewhere if you want the real number for an interview.
18. **Were bank-statement PDFs ever committed and later untracked?** Two commit subjects say so; I couldn't verify because path-limited git walks hang. Run a secret scanner over full history before going public.
19. **`langgraph_store` is documented in `data-model.md` and `architecture.md` but referenced by zero lines of code.** Was it planned and dropped, or is the doc simply wrong?
20. **Was the "18 native tools" count ever meant to include MCP tools?** `agent/mcp_integration/client.py:15,32,72` and `.env.example:49` still say "11 native tools."
21. **`README.md:112` says the frontend "polls" for interventions.** It doesn't — it fetches once after each reply. Was polling planned?
22. **Both READMEs list shadcn/ui in the stack; it is not installed** (no `components/ui/`, no `components.json`, no radix/cva/clsx/tailwind-merge in `package.json`). Was it removed, or never added?
23. **The system prompt contradicts itself:** the slide-8 chain instructs `write_memory` then `propose_intervention` in the same turn [agent/prompts/system.py:30-31](agent/prompts/system.py#L30-L31), while the anti-patterns list forbids exactly that [agent/prompts/system.py:100](agent/prompts/system.py#L100). Which is correct?
24. **There are 25 uncommitted changes** from 2026-07-14 sitting in the working tree (the `_archive/` reorganisation). Commit or discard before anyone clones this.

---

### Appendix: contradictions found (README/docs vs code)

| Doc says | Code does | Cited |
| --- | --- | --- |
| Live app works [README.md:103](README.md#L103) | Railway backend 404s; all data paths dead | curl, 2026-08-08 |
| Endpoint `/ingest/pdf` [README.md:37](README.md#L37) | Route is `/ingest/statement` | [backend/app/api/ingest.py:50](backend/app/api/ingest.py#L50) |
| "frontend polls" for interventions [README.md:112](README.md#L112) | One fetch after each reply; no timer anywhere | [frontend/app/chat/page.tsx:128-132](frontend/app/chat/page.tsx#L128-L132) |
| "browser —Clerk JWT→ Vercel" [README.md:60](README.md#L60) | Browser sends no JWT; it's minted server-side by `getToken()` | [frontend/lib/chat-stream.ts:6-11](frontend/lib/chat-stream.ts#L6-L11) |
| shadcn/ui in the stack [README.md:51](README.md#L51), [frontend/README.md:4](frontend/README.md#L4) | Not installed, not used | [frontend/package.json:11-29](frontend/package.json#L11-L29) |
| `langgraph_store` collection [docs/architecture.md:34](docs/architecture.md#L34) | Zero code references | grep |
| `CLERK_SECRET_KEY` used for JWT verification [backend/README.md:52](backend/README.md#L52) | Never read; verification uses public JWKS + `CLERK_JWT_ISSUER` | [backend/app/auth/clerk.py:32](backend/app/auth/clerk.py#L32) |
| `POST /chat` returns "SSE stream" [backend/README.md:63-68](backend/README.md#L63-L68) | `text/plain; charset=utf-8` | [backend/app/api/chat.py:72](backend/app/api/chat.py#L72) |
| Routes take `user_id` param [backend/README.md:63-68](backend/README.md#L63-L68) | `user_id` comes from the JWT `sub`; no route accepts it | [backend/app/auth/clerk.py:86](backend/app/auth/clerk.py#L86) |
| "All 10 backend routes" [docs/prod-readiness-audit-2026-06-06.md:12](docs/prod-readiness-audit-2026-06-06.md#L12) | 13 routes, and `/health` is not authed | [backend/app/main.py:28](backend/app/main.py#L28) |
| "All 11 agent tools" [docs/prod-readiness-audit-2026-06-06.md:13](docs/prod-readiness-audit-2026-06-06.md#L13), [agent/mcp_integration/client.py:15](agent/mcp_integration/client.py#L15) | 18 registered | [agent/graphs/main.py:354-373](agent/graphs/main.py#L354-L373) |
| "There is no GEMINI_API_KEY" [.env.example:14](.env.example#L14) | `.env` defines one (unused by any code) | grep → 0 reads |
| dev script has `--turbo --env-file` [frontend/README.md:44](frontend/README.md#L44) | `"dev": "next dev"` | [frontend/package.json:6](frontend/package.json#L6) |
| Ships "echo backend, no agent yet" [frontend/README.md:57-60](frontend/README.md#L57-L60) | Proxies to the real LangGraph agent | [frontend/app/api/chat/route.ts:41-48](frontend/app/api/chat/route.ts#L41-L48) |
| Python 3.12 [backend/README.md:4](backend/README.md#L4) | `.python-version` pins 3.13; pyproject says `>=3.12`; Docker uses 3.12 | [backend/.python-version:1](backend/.python-version#L1) |
