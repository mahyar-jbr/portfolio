# PORTFOLIO_EXTRACT.md

Factual extraction pass over this repository, produced by reading source rather than
documentation. Every claim carries a file:line citation. Anything that could not be
verified from the code is marked `UNVERIFIED:` or `RATIONALE NOT IN REPO — ask Mahyar`.

**Extraction date:** 2026-08-08
**Repo state at extraction:** branch `main`, HEAD `95618ad` (2026-06-21 23:52 -0400), working tree dirty
(2 modified files: `ROADMAP.md`, `backend/product_data.csv`; 1 untracked dir: `.claude/`).

---

## 1. Identity

### Canonical name

**BowlWise.** It appears as the FastAPI app title `title="BowlWise API"` in
[backend/main.py:146](backend/main.py#L146), as the page `<title>` in
[frontend/index.html:7](frontend/index.html#L7), and as the H1 of both docs
([README.md:1](README.md#L1), [ROADMAP.md:1](ROADMAP.md#L1)).

There is **no package manifest carrying the project name**. The frontend `package.json`
declares `"name": "frontend", "version": "0.0.0"`
([frontend/package.json:2-4](frontend/package.json#L2-L4)) — the manifest name is a
Vite scaffold default, not the product name. The backend has no `pyproject.toml` or
`setup.py`; `requirements.txt` is a bare dependency list
([backend/requirements.txt:1](backend/requirements.txt#L1)).

### Other names in the repo

| Name | Where it appears | Status |
|---|---|---|
| **Pet AI Assistant** | Git remote `https://mahyar-jbr@github.com/mahyar-jbr/pet-ai-assistant.git` (`git remote -v`); local checkout path `/Users/mahyar/Desktop/Pet-AI-Assistant` | Pre-rebrand name. Rebrand commits: `94c22c8` "Rebrand: Pet AI Assistant → BowlWise (backend)" and `6ab5f0b` "(frontend)", both 2026-03-22 |
| **pet-ai-assistant-production** | Railway deploy hostname, hardcoded in [frontend/.env.production:1](frontend/.env.production#L1), [frontend/index.html:41](frontend/index.html#L41) (CSP `connect-src`), and [README.md:290](README.md#L290) | Live production backend URL still carries the old name |
| **petai** | MongoDB database name default, [backend/main.py:81](backend/main.py#L81) | Internal DB identifier, never rebranded |
| **`petai`** (logger) | `logging.getLogger("petai")`, [backend/main.py:74](backend/main.py#L74) | Internal |
| **BowlWise Inc.** | Legal entity named in [frontend/src/pages/TermsPage.jsx:73](frontend/src/pages/TermsPage.jsx#L73) and :79 | Post-incorporation naming; commit `a790c57` (2026-05-18) "Legal: post-incorporation Privacy + Terms updates (BowlWise Inc., PIPEDA…)" |
| **demo** (Java) | `archive/demo/` — a Spring Boot app, `archive/demo/src/main/java/com/example/demo/DemoApplication.java` | Abandoned earlier implementation, see §8 |

### One sentence

BowlWise takes a dog owner's profile of their dog (breed size, age group, activity level,
weight goal, allergies, diagnosed health conditions, preferred food format) and returns
a ranked list of commercial dog foods scored 0–100 by a deterministic rule-based engine
([backend/main.py:2786](backend/main.py#L2786)), with optional account creation for
purchase and bag-depletion tracking ([backend/main.py:1326](backend/main.py#L1326)).

### Current status

**Deployed and reachable, but not actively developed as of this extraction.**

Evidence for deployed:
- Production frontend URL `https://bowlwise.app` is hardcoded in
  [frontend/public/sitemap.xml:3-8](frontend/public/sitemap.xml#L3-L8) and
  [frontend/public/robots.txt:3](frontend/public/robots.txt#L3).
- Production backend URL is pinned in the app's CSP `connect-src`
  ([frontend/index.html:41](frontend/index.html#L41)) and the build-time env
  ([frontend/.env.production:1](frontend/.env.production#L1)).
- Vercel SPA rewrite config exists ([frontend/vercel.json:1-5](frontend/vercel.json#L1-L5)).
- Vercel Analytics is a runtime dependency
  ([frontend/package.json:12](frontend/package.json#L12)).
- CI runs on every push/PR to `main` against a MongoDB 7 service container
  ([.github/workflows/ci.yml:1-38](.github/workflows/ci.yml#L1-L38)).
- A built `frontend/dist/` exists on disk dated 2026-06-21 (same day as HEAD), though
  `dist/` is gitignored ([.gitignore:19](.gitignore#L19)).

Evidence for "not actively developed":
- Last commit is **2026-06-21**, ~7 weeks before this extraction (`git log -1`).
- The working tree has been left dirty since then with an unpushed status update to
  `ROADMAP.md` and 5 product-image URL swaps in `backend/product_data.csv` (`git diff`).

`UNVERIFIED:` Whether bowlwise.app and the Railway backend are *currently* serving traffic.
Nothing in the repo can confirm live reachability today — no uptime log, no health-check
artifact, no CI deploy job. The CI workflow runs tests only; it contains **no deploy step**
([.github/workflows/ci.yml:9-38](.github/workflows/ci.yml#L9-L38)).

---

## 2. The problem

### As stated in the repo

The problem statement lives in user-facing marketing copy, not in a design doc:

- `"Stop guessing what to feed your dog."` — hero headline in the noscript fallback,
  [frontend/index.html:56](frontend/index.html#L56).
- `"Personalized dog food recommendations scored against AAFCO, NRC, and WSAVA veterinary
  nutrition standards. Free, no signup required."` —
  [frontend/index.html:21](frontend/index.html#L21).
- `"built on vet nutrition standards, not brand marketing"` —
  [frontend/index.html:57](frontend/index.html#L57).
- The anti-conflict-of-interest framing is explicit on the scoring page:
  `"No sponsorships. No brand favoritism. Just math and data."`
  ([frontend/src/pages/ScoringPage.jsx:128](frontend/src/pages/ScoringPage.jsx#L128)) and
  `"No brand pays us to rank higher."`
  ([frontend/src/pages/ScoringPage.jsx:252](frontend/src/pages/ScoringPage.jsx#L252)).
- Code comments state the specific technical problem the scoring engine solves:
  `"As-fed percentages make a 70% moisture raw look low-protein (e.g. 11%) when on a
  dry-matter basis it's actually 37%."` —
  [backend/utils/dmb.py:4-6](backend/utils/dmb.py#L4-L6).

### Specific user

Canadian dog owners shopping at PetValu. Evidence: 248 of 260 catalog rows carry
`retailer = "PetValu.ca"` (counted from `backend/product_data.csv`); all prices are CAD
([backend/main.py:453](backend/main.py#L453) `price: Optional[float] = None  # Price in dollars`,
with `"Price data | Largest bag, CAD, PetValu.ca"` logged at
[ROADMAP.md:1044](ROADMAP.md#L1044)). Privacy law targeted is PIPEDA (Canada's federal
privacy statute), referenced at [backend/main.py:3248](backend/main.py#L3248).

### What those people did before

**RECONSTRUCTED, NOT STATED.** The repo contains no user research, interview notes, or
competitor analysis. The closest thing is one line in the Decision Log asserting that
prior tools couldn't do cross-format comparison — but that claim only appears in the
gitignored `internal/resume-briefing.md:61` (`"Solved cross-format nutritional comparison
problem that prior consumer dog-food tools couldn't handle"`), which is a self-authored
resume-prep document, not evidence.

`UNVERIFIED:` What dog owners actually did before BowlWise. Nothing in the repo documents
the status quo it replaced.

---

## 3. Architecture

### Layers

Three tiers, no queue, no cache, no worker:

1. **Frontend** — React 19 + Vite 7 SPA, deployed to Vercel.
   [frontend/package.json:12-21](frontend/package.json#L12-L21).
2. **Backend** — single-file FastAPI app, **3,611 lines**
   (`wc -l backend/main.py`), served by uvicorn.
   [backend/main.py:145-153](backend/main.py#L145-L153).
3. **Database** — MongoDB via Motor (async driver).
   [backend/main.py:83-88](backend/main.py#L83-L88).

The backend docstring itself calls the architecture out:
`"BowlWise — FastAPI Backend (Single-file Architecture)"`
([backend/main.py:2](backend/main.py#L2)).

### One real request traced end to end: `GET /api/recommendations/{pet_id}`

| Hop | What happens | Citation |
|---|---|---|
| 1 | User completes 8-step wizard; `TOTAL_STEPS = 8` | [frontend/src/pages/PetForm.jsx:25](frontend/src/pages/PetForm.jsx#L25) |
| 2 | `createPet()` POSTs the profile, attaching a JWT header if one exists | [frontend/src/api/petApi.js:28-40](frontend/src/api/petApi.js#L28-L40) |
| 3 | Backend validates against `PetCreate` Pydantic model (5 field validators) | [backend/main.py:239-329](backend/main.py#L239-L329) |
| 4 | Server mints `public_id` + `session_token` (both UUID4), hashes the client IP to a 16-char SHA-256 prefix, stores the doc | [backend/main.py:929-951](backend/main.py#L929-L951) |
| 5 | Frontend calls `getRecommendations(petId, format)`; `format` is omitted when preference is `'all'` | [frontend/src/api/petApi.js:42-52](frontend/src/api/petApi.js#L42-L52) |
| 6 | Route handler (rate-limited 20/min) fetches the pet by `public_id` | [backend/main.py:3190-3234](backend/main.py#L3190-L3234) |
| 7 | Builds an **internal** `pet_profile` including `health_conditions`, then a **public** `pet_public` with `health_conditions` stripped — PIPEDA guard, since this endpoint is unauthenticated | [backend/main.py:3239-3257](backend/main.py#L3239-L3257) |
| 8 | `_score_catalog_for_pet()` queries Mongo: format in enum + legacy `"dry"`, life_stage matches or `"all"`, AAFCO filter with the freeze-dried-topper exception | [backend/main.py:3058-3092](backend/main.py#L3058-L3092) |
| 9 | Computes intra-format price percentiles (p25/p50/p75) plus a synthetic `"freeze_dried_topper"` bucket, gated at n≥4 | [backend/main.py:3097-3140](backend/main.py#L3097-L3140) |
| 10 | Secondary allergen scan over raw `ingredients` text; logs a data-quality warning when an allergen is in ingredients but missing from `allergen_tags` | [backend/main.py:3148-3164](backend/main.py#L3148-L3164) |
| 11 | `score_product_for_pet()` per product; FD toppers branch to `score_topper()` | [backend/main.py:2832-2844](backend/main.py#L2832-L2844) |
| 12 | Hard filters return 0 immediately (allergen tag intersection; kibble-size/breed mismatch) | [backend/main.py:2900-2922](backend/main.py#L2900-L2922) |
| 13 | Six factors summed; `apply_health_condition_modifier()` applies additive penalties last, floored at 0 | [backend/main.py:2932-3017](backend/main.py#L2932-L3017) |
| 14 | Items scoring ≥ 50 bucketed by format, sorted descending | [backend/main.py:3171-3181](backend/main.py#L3171-L3181) |
| 15 | Advisory codes computed from `visible_formats` + `health_conditions` | [backend/utils/advisories.py:63-112](backend/utils/advisories.py#L63-L112) |
| 16 | Response shaped: grouped `results_by_format` (top 20/format; freeze_dried is an **object** with `complete_meals`/`toppers`) or flat `recommendations` (top 60) | [backend/main.py:3336-3374](backend/main.py#L3336-L3374) |
| 17 | Frontend flattens either shape via `flattenRecommendationsResponse()` | [frontend/src/api/petApi.js:67-77](frontend/src/api/petApi.js#L67-L77) |
| 18 | Each item normalized by `transformRecommendation()` into the UI view-model | [frontend/src/api/petApi.js:163-242](frontend/src/api/petApi.js#L163-L242) |

### External dependencies

| Dependency | Purpose | Configured / called at |
|---|---|---|
| **MongoDB** (Atlas in prod, per docs) | Primary datastore, 4 collections | [backend/main.py:80-88](backend/main.py#L80-L88); Atlas named at [ROADMAP.md:1032](ROADMAP.md#L1032) |
| **Resend** | Transactional email — magic links + "email my results" | [backend/main.py:58](backend/main.py#L58), :102-104, :867-872, :3594-3599 |
| **Vercel** | Frontend hosting + SPA rewrites | [frontend/vercel.json:1-5](frontend/vercel.json#L1-L5) |
| **Vercel Analytics** | Anonymous usage tracking | [frontend/package.json:12](frontend/package.json#L12); CSP allowlist `https://va.vercel-scripts.com` at [frontend/index.html:41](frontend/index.html#L41) |
| **Railway** | Backend hosting | [frontend/.env.production:1](frontend/.env.production#L1); disclosed to users at [frontend/src/pages/PrivacyPage.jsx:61](frontend/src/pages/PrivacyPage.jsx#L61) |
| **Google Fonts** (Plus Jakarta Sans) | Typeface | [frontend/index.html:44-47](frontend/index.html#L44-L47) |
| **Google Sheets** (published CSV) | Optional product-import source | [backend/import_products.py:44-48](backend/import_products.py#L44-L48) — **URL is hardcoded as a fallback**, see §10 |
| **Product image CDNs** (5) | `orijenpetfoods.com`, `acana.com`, `images.ctfassets.net`, `pvimages-prod.azureedge.net`, `openfarmpet.com` | preconnected at [frontend/index.html:14-18](frontend/index.html#L14-L18) |

**There is no LLM provider, no vector store, no embedding model, no queue, and no third-party
auth provider (no OAuth, no Auth0, no Clerk).** Verified: `grep -riE 'anthropic|openai'` over
`backend/requirements.txt` and `frontend/package.json` returns nothing. A repo-wide grep for
`anthropic|openai|langchain|llm|gpt-|embedding|vector` across all Python and JSX source returns
only two hits, both the word "agents" inside legal boilerplate
([frontend/src/pages/TermsPage.jsx:73](frontend/src/pages/TermsPage.jsx#L73), :79).

### Data model — 4 MongoDB collections

Declared at [backend/main.py:85-88](backend/main.py#L85-L88):

| Collection | Purpose | Key fields (from code) |
|---|---|---|
| `pets` | Dog profiles, anonymous or claimed | `public_id` (UUID), `session_token` (UUID), `breedSize`, `ageGroup`, `activityLevel`, `weightGoal`, `allergies`, `health_conditions`, `food_format_preference`, `user_id`, `ip_hash` — [backend/main.py:929-940](backend/main.py#L929-L940), [backend/main.py:586-615](backend/main.py#L586-L615) |
| `products` | Food catalog | custom string `_id`, plus the fields enumerated in `ProductCreate` [backend/main.py:411-509](backend/main.py#L411-L509) |
| `users` | Accounts | `email` (unique), `email_verified`, `magic_link_token` (SHA-256 hash), `preferences` — [backend/main.py:701-712](backend/main.py#L701-L712) |
| `purchases` | Purchase + depletion log | `user_id`, `pet_id`, `product_id`, `product_snapshot`, `bag_size_kg`, `cups_per_day`, `estimated_depletion_at`, `status`, `tracking_mode` — [backend/main.py:715-742](backend/main.py#L715-L742) |

**9 indexes**, all created at startup
([backend/main.py:118-128](backend/main.py#L118-L128)):

1. `products` compound `{format: 1, life_stage: 1}`
2. `products.brand`
3. `products.life_stage`
4. `products.breed_size`
5. `pets.public_id` (unique)
6. `users.email` (unique)
7. `users.magic_link_token`
8. `purchases` compound `{user_id: 1, status: 1}`
9. `purchases` compound `{user_id: 1, pet_id: 1, purchased_at: -1}`

### AI agents

**There are zero AI agents in this codebase.** The recommendation engine is a deterministic
rule-based scoring function — a sum of six arithmetic factor scores with hardcoded numeric
thresholds ([backend/main.py:2932-3004](backend/main.py#L2932-L3004)). No model is called at
any point in the request path.

The word "AI" appears in the repo in exactly two contexts, neither of which is a shipped agent:

1. **The old project name** — "Pet AI Assistant", replaced 2026-03-22 (commits `94c22c8`, `6ab5f0b`).
2. **A roadmap aspiration** — "AI-powered explanations (Anthropic/OpenAI integration)" is listed
   under Future/Planned, not built.

The `internal/resume-briefing.md` (gitignored) itself instructs against the claim:
`"Don't claim 'AI-powered recommendations' — the scoring algorithm is deterministic, not ML"`
([internal/resume-briefing.md:160](internal/resume-briefing.md#L160)). That is consistent with
what the code does.

**The "10 Claude Code tabs" described in `CLAUDE.md` and `internal/resume-briefing.md:94` are
not agents in this system.** They are a human-driven development workflow: role instructions
in a markdown file that a developer pastes into separate chat sessions. `CLAUDE.md` is
gitignored ([.gitignore:13](.gitignore#L13)) and contains no executable code. There is no
orchestration code, no agent registry, no tool definitions, and no inter-agent protocol
anywhere in the repo. Presenting these as a multi-agent architecture would be false.

---

## 4. Technical decisions and their rationale

The repo has an unusually good rationale record: `ROADMAP.md` contains a 57-row
**Decision Log** at [ROADMAP.md:1027-1096](ROADMAP.md#L1027-L1096), and `backend/main.py`
carries long inline rationale comments. Below, "why" is quoted only where the repo states it.

### Decisions WITH recorded rationale

| Decision | Chosen | Alternatives shown in repo | Recorded rationale |
|---|---|---|---|
| **Auth method** | Magic link (passwordless) + JWT HS256, 30-day expiry | Passwords; Apple Sign-In | `"Fastest to build, no password management, iOS-compatible, sidesteps Apple Sign-In requirement"` — [ROADMAP.md:1073](ROADMAP.md#L1073). Implementation: [backend/main.py:770-801](backend/main.py#L770-L801) |
| **Magic-link token storage** | SHA-256 hash in DB, raw token only in the email | Store raw token | `"If MongoDB breached, tokens unusable"` — [ROADMAP.md:1035](ROADMAP.md#L1035) |
| **Guest auth** | Per-pet UUID `session_token` in `X-Session-Token` header | Require account | `"Works without account"` — [ROADMAP.md:1034](ROADMAP.md#L1034). Enforced at [backend/main.py:966-970](backend/main.py#L966-L970) |
| **Guest mode retained** | No login wall anywhere in the recommendation flow | Login wall | `"PO research: login wall kills conversion. Prompt account creation after value is shown"` — [ROADMAP.md:1077](ROADMAP.md#L1077) |
| **Database** | MongoDB Atlas | — | `"Free tier, managed, same driver as local"` — [ROADMAP.md:1032](ROADMAP.md#L1032) |
| **Backend hosting** | Railway | Render (named as the alternative in the same row) | `"Free tier, easy Python deploy, env vars"` — [ROADMAP.md:1030](ROADMAP.md#L1030); later `"Easy Python deploy, env vars, auto-scaling"` with cost `"~$5-7/mo"` — [ROADMAP.md:1054](ROADMAP.md#L1054) |
| **Frontend hosting** | Vercel | — | `"Free, instant deploy, automatic HTTPS"` — [ROADMAP.md:1031](ROADMAP.md#L1031) |
| **Email provider** | Resend | — | `"Simple API, sandbox for testing, real domain verification for production"` (free tier 100/day) — [ROADMAP.md:1074](ROADMAP.md#L1074) |
| **Docker** | Skipped for MVP, added later pre-iOS | — | Two entries, chronologically opposed: `"Skipped for MVP — Railway/Render handle builds directly"` [ROADMAP.md:1037](ROADMAP.md#L1037), then `"Docker | Pre-iOS | Cleaner deployment, easier scaling, consistent dev/prod environments"` [ROADMAP.md:1071](ROADMAP.md#L1071). Shipped in commit `0ae001e` (2026-03-28) |
| **DMB normalization** | Convert all nutrition to dry-matter basis **at import time**, not at scoring time | Convert per-request | `"so the scoring engine can read protein_dmb / fat_dmb / fiber_dmb / kcal_per_kg_dmb directly without repeating the conversion per request"` — [backend/utils/dmb.py:8-10](backend/utils/dmb.py#L8-L10) |
| **Missing-data policy in DMB** | Return `None`, never impute | Impute a default moisture | `"We never invent moisture or fabricate DMB values from partial data."` — [backend/utils/dmb.py:25-28](backend/utils/dmb.py#L25-L28) |
| **No grain-free bonus** | Removed from scoring | Was previously scored | `"No grain-free bonus (FDA/DCM investigation)"` — [README.md:197](README.md#L197); `"Scoring algorithm | 6-factor vet-validated (removed grain-free, added life stage) | PO vet science audit: AAFCO, NRC, WSAVA, Tufts references"` — [ROADMAP.md:1049](ROADMAP.md#L1049) |
| **"Unknown" AAFCO/credential is neutral** | No penalty, no bonus | Penalize unknowns | `"Default 'unknown' / False for existing catalog; Data tab backfills as verified."` — [backend/main.py:461](backend/main.py#L461) |
| **Null phosphorus = neutral for CKD pets** | Skip the penalty, emit a debug log | Penalize missing data | `"Null phosphorus = neutral (don't penalize transparent brands missing the value)."` — [backend/main.py:2467-2468](backend/main.py#L2467-L2468) |
| **Ca:P null-check** | Neutral 7/15 | Score 0 | `"Products with unpublished Ca:P shouldn't be penalized to 0 — neutral is fairer than guessing"` — [ROADMAP.md:1066](ROADMAP.md#L1066) |
| **Dual response shape** (grouped vs flat) | Single endpoint, shape keyed off `?format=` | API versioning | `"Single value (kibble, gently_cooked, …) -> flat recommendations list filtered to that format (back-compat shape)"` — [backend/main.py:3195-3202](backend/main.py#L3195-L3202) |
| **FD `both` routes to complete-meal scoring** | Default to the stricter path | Route to topper scoring | `"if a product is marketed both ways, the complete-meal scoring is the strictest evaluation"` — [backend/main.py:2846-2848](backend/main.py#L2846-L2848) |
| **Topper price percentiles gated at n≥4** | Omit the bucket below 4 toppers | Always compute | `"With 1-3 toppers the p25/p50/p75 indices collapse onto the same 1-2 values, which would surface the 'Excellent topper value…' reason on the single cheapest topper as a tautology"` — [backend/main.py:3128-3133](backend/main.py#L3128-L3133) |
| **`freeze_dried` response key is an object, not an array** | `{complete_meals, toppers}` | Flat array | Empty-state must mirror it `"or Frontend's data.results_by_format.freeze_dried.complete_meals access throws TypeError on cold-start"` — [backend/main.py:3283-3286](backend/main.py#L3283-L3286); regression-locked by `test_empty_catalog_returns_fd_bucket_as_object_not_array` ([backend/tests/test_recommendations.py](backend/tests/test_recommendations.py)) |
| **`health_conditions` stripped from public recs response** | Strip | Round-trip it | `"/api/recommendations is PUBLIC + UNAUTHENTICATED (anyone with the pet's share UUID can curl it). health_conditions is PIPEDA-classified health data — MUST NOT round-trip in the response object."` — [backend/main.py:3248-3253](backend/main.py#L3248-L3253) |
| **`health_conditions` enum tightened to drop `"other"`** | Reject `"other"` at the API | Keep it | `"chip was eliminated from the frontend wizard because the engine no-ops it (no consensus macro lever…). Enum tightened so a manually crafted POST can't sneak 'other' in."` — [backend/main.py:305-312](backend/main.py#L305-L312) |
| **Shared enums module** | `utils/enums.py` imported by both `main.py` and `import_products.py` | Duplicate constants | `"Duplicating these in two files caused DRY violations where the app's accepted set drifted from the import's accepted set."` — [backend/utils/enums.py:8-11](backend/utils/enums.py#L8-L11) |
| **`"supplemental"` kept in the AAFCO enum** | Keep | Drop | `"without 'supplemental' here, every such SKU was being silently coerced to 'unknown' at import, defeating the exception path"` — [backend/utils/enums.py:31-34](backend/utils/enums.py#L31-L34) |
| **Single source of truth for enabled formats** | `frontend/src/utils/formats.js` | Duplicate `enabled` flags per component | `"The Phase 2 air_dried silent-drop bug and the Phase 3 freeze_dried near-miss both happened because the same enabled: boolean flag was duplicated across FormatPicker, FilterBar, and Recommendations."` — [frontend/src/utils/formats.js:5-8](frontend/src/utils/formats.js#L5-L8) |
| **`pathogen_testing_protocol` is free text, not an enum** | Free text | Enum | `"Strict enum would force lossy categorization — brands publish wildly different language."` — [backend/main.py:500-504](backend/main.py#L500-L504) |
| **Orphan-cleanup safety model** | Dry-run default, `--confirm` + stdin `y/N`, recovery log written *before* prompting | Direct delete | `"Even with --confirm, the script writes the recovery log to disk FIRST, then prompts stdin y/N."` — [backend/scripts/orphan_cleanup.py:12-21](backend/scripts/orphan_cleanup.py#L12-L21) |
| **Result caps raised 10→20 / 40→60** | Larger slices | Keep old caps | Commit `95618ad` message: `"catalog grew from 150 to 260; cap hadn't scaled … 52 FD SKUs were 22 invisible to See-all … Payload ~50KB -> ~80KB, negligible."` |
| **Purchase tracking: two modes** | `full` (kibble, depletion math) / `basic` (everything else) | One mode | `"Option C (basic mode for non-kibble — no depletion math, simple date/cost/notes logging)"` — [ROADMAP.md](ROADMAP.md) Phase 1 locked decisions; server-derived at [backend/main.py:362-371](backend/main.py#L362-L371) |
| **Comparison verdict `format_mismatch` tier fires first** | First in priority order | Numeric delta only | `"prevents a kibble-vs-raw pair with a 3-point delta from being misread as a decisive win"` — [internal/resume-briefing.md:79](internal/resume-briefing.md#L79) (note: this rationale is only in the gitignored resume doc, not in the source) |
| **iOS = SwiftUI, not React Native/Flutter** | SwiftUI | RN, Flutter | `"Best UX, Apple ecosystem (widgets, push, Health), App Store credibility"` — [ROADMAP.md:1067](ROADMAP.md#L1067). **Not built** |
| **ML recommendations deferred** | Rule-based now | ML | `"Rule-based scoring is the cold-start; ML needs behavioral data to improve on it"`, gated on 500+ purchases — [ROADMAP.md:1069](ROADMAP.md#L1069). **Not built** |

### Decisions WITHOUT recorded rationale

- **Single-file backend (3,611 lines in one module).** The file documents *that* it is
  single-file ([backend/main.py:2](backend/main.py#L2)) and lists its 17 sections, but
  nowhere states why this was chosen over a router/module split.
  `RATIONALE NOT IN REPO — ask Mahyar`.
- **FastAPI over Django/Flask.** No decision-log row, no comment.
  `RATIONALE NOT IN REPO — ask Mahyar`.
- **MongoDB over Postgres.** The Decision Log row justifies *Atlas* as a host
  ([ROADMAP.md:1032](ROADMAP.md#L1032)) but never justifies a document store over a
  relational one, despite the data being highly regular (a fixed 49-column product schema).
  `RATIONALE NOT IN REPO — ask Mahyar`.
- **React 19 + Vite over Next.js**, despite SEO being an explicitly stated priority
  ([ROADMAP.md:1101](ROADMAP.md#L1101) "focus on discovery (SEO)") and the app being a
  client-rendered SPA with a hand-written `<noscript>` fallback
  ([frontend/index.html:54-60](frontend/index.html#L54-L60)).
  `RATIONALE NOT IN REPO — ask Mahyar`.
- **The specific numeric thresholds in the scoring engine** (e.g. pancreatitis fat DMB
  cut at 25%/32% for −8/−15; CKD phosphorus at 1.2%/1.4% for −5/−10,
  [backend/main.py:2389-2403](backend/main.py#L2389-L2403)). The code cites *sources*
  (`"therapeutic renal diets target <0.5% P DMB; OTC complete foods sit 1.0-1.6% DMB"`)
  and attributes the spec to `"Vet Test spec (2026-06-21, locked)"`
  ([backend/main.py:2423](backend/main.py#L2423)), but no vet-review artifact,
  citation list, or source document is committed to the repo.
  `RATIONALE NOT IN REPO — ask Mahyar` (specifically: where does the Vet Test spec live?).
- **Why the catalog is PetValu-exclusive.** [ROADMAP.md:1050](ROADMAP.md#L1050) gives the
  operational reason (`"All 114 products available, live pricing via schema.org scraping"`)
  but not the strategic one. Partially recorded.
- **Migration to React+FastAPI from the earlier Java Spring Boot implementation**
  (`archive/demo/`, commit `d6392ff` 2025-11-06 "Major refactor: Migrate to React + FastAPI
  stack with web scraping"). The commit records *what*, not *why*.
  `RATIONALE NOT IN REPO — ask Mahyar`.

---

## 5. Implementation facts

All counts below were produced by counting, with the command shown.

### API endpoints — 20

`grep -c '@app\.\(get\|post\|put\|patch\|delete\)' backend/main.py` → **20**

| # | Method | Path | Auth | Rate limit | Line |
|---|---|---|---|---|---|
| 1 | GET | `/` | none | global 60/min | [884](backend/main.py#L884) |
| 2 | GET | `/health` | none | **exempt** | [894](backend/main.py#L894) |
| 3 | POST | `/api/pets` | none (opportunistic JWT) | 5/min | [916](backend/main.py#L916) |
| 4 | GET | `/api/pets/{pet_id}` | `X-Session-Token` | global 60/min | [966](backend/main.py#L966) |
| 5 | PUT | `/api/pets/{pet_id}` | `X-Session-Token` | 5/min | [996](backend/main.py#L996) |
| 6 | DELETE | `/api/pets/{pet_id}` | `X-Session-Token` | 5/min | [1041](backend/main.py#L1041) |
| 7 | POST | `/api/auth/magic-link` | none | 3/min | [1079](backend/main.py#L1079) |
| 8 | GET | `/api/auth/verify/{token}` | none | 10/min | [1126](backend/main.py#L1126) |
| 9 | GET | `/api/auth/me` | JWT | global 60/min | [1223](backend/main.py#L1223) |
| 10 | DELETE | `/api/auth/me` | JWT | 5/min | [1246](backend/main.py#L1246) |
| 11 | POST | `/api/pets/{pet_id}/claim` | JWT | 5/min | [1277](backend/main.py#L1277) |
| 12 | POST | `/api/purchases` | JWT | 10/min | [1326](backend/main.py#L1326) |
| 13 | GET | `/api/purchases` | JWT | global 60/min | [1425](backend/main.py#L1425) |
| 14 | DELETE | `/api/purchases/{purchase_id}` | JWT | 5/min | [1449](backend/main.py#L1449) |
| 15 | PUT | `/api/purchases/{purchase_id}` | JWT | 5/min | [1475](backend/main.py#L1475) |
| 16 | PATCH | `/api/purchases/{purchase_id}/extend` | JWT | 5/min | [1537](backend/main.py#L1537) |
| 17 | GET | `/api/products` | none | global 60/min | [1590](backend/main.py#L1590) |
| 18 | GET | `/api/products/{product_id}` | none | global 60/min | [1643](backend/main.py#L1643) |
| 19 | GET | `/api/recommendations/{pet_id}` | none | 20/min | [3190](backend/main.py#L3190) |
| 20 | POST | `/api/email-results` | none | 3/min | [3388](backend/main.py#L3388) |

Rate limits verified from the 14 `@limiter.limit(...)` decorators plus one `@limiter.exempt`
(`grep -n 'limiter.limit\|limiter.exempt' backend/main.py`); un-decorated routes fall to the
global default `["60/minute"]` at [backend/main.py:143](backend/main.py#L143).

> **README contradiction:** [README.md:159-179](README.md#L159-L179) lists **19** endpoints
> and omits `POST /api/email-results` entirely, even though the feature is described at
> [README.md:560](README.md#L560)-adjacent roadmap text and implemented at
> [backend/main.py:3388](backend/main.py#L3388).

### Collections and indexes

**4 collections, 9 indexes** — enumerated in §3 above, from
[backend/main.py:85-88](backend/main.py#L85-L88) and
[backend/main.py:118-128](backend/main.py#L118-L128).

### Automated tests — 121, all passing

**Command:** `cd backend && pytest tests/ -v` — this is exactly what CI runs
([.github/workflows/ci.yml:36-38](.github/workflows/ci.yml#L36-L38)).

**Result at extraction time:** `121 passed, 67 warnings in 0.61s`
(run against a locally started `mongod` on port 27017).

- **121 tests collected** (`pytest tests/ --collect-only -q`)
- **116 `def test_` definitions** (`grep -h 'def test_' tests/*.py | wc -l`) — the 5-test gap
  is `@pytest.mark.parametrize` expansion.
- **10 test files:**

| File | `def test_` count |
|---|---|
| [backend/tests/test_recommendations.py](backend/tests/test_recommendations.py) | 26 |
| [backend/tests/test_complement_fit.py](backend/tests/test_complement_fit.py) | 27 |
| [backend/tests/test_advisories.py](backend/tests/test_advisories.py) | 17 |
| [backend/tests/test_dmb.py](backend/tests/test_dmb.py) | 12 |
| [backend/tests/test_health_condition_penalties.py](backend/tests/test_health_condition_penalties.py) | 12 |
| [backend/tests/test_pets.py](backend/tests/test_pets.py) | 7 |
| [backend/tests/test_products.py](backend/tests/test_products.py) | 6 |
| [backend/tests/test_validation.py](backend/tests/test_validation.py) | 5 |
| [backend/tests/test_health.py](backend/tests/test_health.py) | 2 |
| [backend/tests/__init__.py](backend/tests/__init__.py) | 0 (empty) |

**Important caveat:** the suite requires a reachable MongoDB. With no `mongod` running, the
same command yields `9 failed, 83 passed, 30 errors` — every failure traces to
`Connection refused` on `localhost:27017`. CI provides one as a service container
([.github/workflows/ci.yml:12-16](.github/workflows/ci.yml#L12-L16)); a fresh local clone
does not, and the README's setup instructions do not mention starting MongoDB before
running tests.

**There are zero frontend tests.** `frontend/package.json` has no test script and no test
runner in devDependencies ([frontend/package.json:5-10](frontend/package.json#L5-L10),
:22-33). The only frontend quality gate is `eslint`, which CI does **not** run
([.github/workflows/ci.yml:30-38](.github/workflows/ci.yml#L30-L38)).

### The regression gate

`backend/scripts/run_regression_gate.py` (141 lines) re-scores **50 frozen tuples** —
5 pet profiles × top-10 kibble each — against the live engine, and exits 0 (PASS) /
1 (YELLOW, ≤20% bust) / 2 (RED, >20% bust)
([backend/scripts/run_regression_gate.py:7-18](backend/scripts/run_regression_gate.py#L7-L18)).
The 50 tuples and the frozen price percentiles `{p25: 9.21, p50: 10.76, p75: 11.92}` are in
[backend/tests/baseline_scores.json](backend/tests/baseline_scores.json) (verified by
parsing the JSON: 5 profiles × 10 entries = 50).

**This gate is not wired into CI** — `.github/workflows/ci.yml` runs `pytest` only. It also
requires `MONGODB_URL` pointing at a catalog matching the baseline
([backend/scripts/run_regression_gate.py:65-68](backend/scripts/run_regression_gate.py#L65-L68)),
so it cannot be run in this extraction. Its last reported state is in commit `95618ad`'s
message: `"Regression YELLOW 10%, same 5 baseline busts."`

> **Contradiction on the bust rate:** `CLAUDE.md` says `"YELLOW 8% (4 known busts)"`;
> commit `95618ad` says `"YELLOW 10%, same 5 baseline busts"`;
> `internal/resume-briefing.md:64` says `"Current state YELLOW 10%"`. The commit message is
> the most recent. `UNVERIFIED:` current actual bust count — cannot run the gate without
> the production catalog.

### Frontend routes — 13

Counted from `<Route>` elements in
[frontend/src/App.jsx:75-87](frontend/src/App.jsx#L75-L87):

`/` (HomePage) · `/start` (PetForm) · `/login` · `/auth/verify/:token` · `/recommendations` ·
`/results/:petId` · `/privacy` · `/terms` · `/scoring` · `/roadmap` · `/dashboard` (protected) ·
`/dashboard/add-pet` (protected) · `/account` (protected)

All 13 pages are lazy-loaded via `React.lazy`
([frontend/src/App.jsx:32-43](frontend/src/App.jsx#L32-L43)).

> **README contradiction:** [README.md:142-155](README.md#L142-L155) lists **12** routes and
> maps `/` to PetForm. In the code `/` is HomePage and PetForm moved to `/start`
> ([frontend/src/App.jsx:75-76](frontend/src/App.jsx#L75-L76)). `/results/:petId` is listed in
> the README table but `/start` is not. The `sitemap.xml` lists only 6 URLs and also omits
> `/start` ([frontend/public/sitemap.xml:3-8](frontend/public/sitemap.xml#L3-L8)) — meaning the
> primary conversion entry point is absent from the sitemap.

### Frontend file counts

`ls frontend/src/…`:
- **12 page components** (`frontend/src/pages/*.jsx`)
- **15 components** (`frontend/src/components/*.jsx`)
- **6 utility modules** (`frontend/src/utils/`)
- **11 CSS files** (10 in `styles/` + `components/PrimaryButton.css`)
- **1 API client** (`frontend/src/api/petApi.js`, 341 lines)

Largest source files: `Recommendations.jsx` 1,117 lines · `HomePage.jsx` 968 ·
`ProductDetail.jsx` 852 · `PetForm.jsx` 751 · `Dashboard.jsx` 698 ·
`ComparisonTool.jsx` 598 · `foodUtils.js` 559 · `comparisonVerdict.js` 518.

### Backend file counts

`backend/main.py` **3,611** · `import_products.py` **497** · `utils/` 3 modules (261 lines
total) · `scripts/` **7** scripts (704 lines total) · `tests/` 10 files.

### Catalog — 260 products, 15 brands, 4 formats

Counted by parsing `backend/product_data.csv` with `csv.DictReader` (both the committed
version at HEAD and the dirty working copy give identical counts — the working-tree diff is
5 image-URL swaps only):

| Format | Count |
|---|---|
| kibble | 169 |
| freeze_dried | 52 |
| gently_cooked | 26 |
| air_dried | 13 |
| **total** | **260** |

**15 brands:** Open Farm 76 · Performatrin Ultra 34 · Acana 28 · Go! Solutions 24 ·
Now Fresh 18 · Vital Essentials 14 · Orijen 13 · Primal 10 · Stella & Chewy's 9 ·
Tom & Sawyer 8 · Performatrin Culinary 7 · Smack 6 · K9 Natural 5 · Freshpet 4 · Ziwi Peak 4.

**49 CSV columns.** `aafco_statement` distribution: 253 `complete_and_balanced_nutrient_profile`,
7 `unknown`. `fd_intended_use`: 23 `both`, 19 `complete`, 10 `topper`, 208 blank (non-FD).
Retailers: PetValu.ca 248, tomandsawyer.com 8, freshpet.com 4.

> **Three-way contradiction on the format split.** All three sources agree on 260 total and
> 15 brands, but disagree on the per-format breakdown:
> | Source | kibble | GC | air-dried | FD |
> |---|---|---|---|---|
> | **`product_data.csv` (counted)** | **169** | **26** | **13** | **52** |
> | `CLAUDE.md` | 165 | 26 | 17 | 52 |
> | `ROADMAP.md:4` | 169 | 26 | 13 | 52 |
>
> The CSV and ROADMAP agree; `CLAUDE.md` is wrong on kibble and air-dried.

### Scoring engine — verified weights

**Complete-meal path** (`score_product_for_pet`,
[backend/main.py:2786-3019](backend/main.py#L2786-L3019)), max 100:

| Factor | Max | Function |
|---|---|---|
| Activity + Goal | 35 | [`calculate_activity_goal_score`](backend/main.py#L1824) |
| Nutritional Quality | 25 | [`calculate_nutritional_quality_score`](backend/main.py#L2006) |
| Life Stage Nutrition | 15 | [`calculate_life_stage_score`](backend/main.py#L2232) |
| Formulation Integrity | 10 | [`calculate_formulation_integrity_score`](backend/main.py#L2131) |
| Format Suitability | 10 | [`calculate_format_suitability_score`](backend/main.py#L1744) |
| Price Value | 5 (floor 3.0, neutral 4.0 when price missing) | inline, [backend/main.py:2989-3002](backend/main.py#L2989-L3002) |

Then `apply_health_condition_modifier()` subtracts, floored at 0
([backend/main.py:3015-3019](backend/main.py#L3015-L3019)).

**Topper path** (`score_topper`, [backend/main.py:2610-2779](backend/main.py#L2610-L2779)),
max 100 — read from the code, not the docstring:

| Factor | Max | How |
|---|---|---|
| Activity + Goal | 15 | full score × 15/35, [backend/main.py:2692](backend/main.py#L2692) |
| Nutritional Quality | 25 | unscaled, [backend/main.py:2701-2707](backend/main.py#L2701-L2707) |
| Life Stage | 5 | full score × 5/15, [backend/main.py:2716](backend/main.py#L2716) |
| Formulation Integrity | 20 | full score × 20/10, [backend/main.py:2729](backend/main.py#L2729) |
| Format Suitability | 10 | unscaled, [backend/main.py:2738-2741](backend/main.py#L2738-L2741) |
| Complement Fit | 25 | [`compute_complement_fit_score`](backend/main.py#L2493), capped at 25 |
| Price | **0 — not a scoring factor**; only emits a reason string | [backend/main.py:2752-2763](backend/main.py#L2752-L2763) |

> **`CLAUDE.md` contradicts the code on topper scoring.** `CLAUDE.md` states
> `"Complement Fit replaces Activity+Goal"` and gives `Price Value | 0-25`. The code keeps
> Activity+Goal at a scaled 15 ([backend/main.py:2692](backend/main.py#L2692)) and awards
> **zero** points for price. `CLAUDE.md`'s table also sums to 110, not 100.
>
> **The `compute_complement_fit_score` docstring contradicts its own body.** The docstring
> lists **six** +5 bonuses including `"Formulator credential +5 (DACVN or PhD_nutrition)"`
> ([backend/main.py:2503](backend/main.py#L2503)). The body implements only **five**:
> omega-3 ([2532](backend/main.py#L2532)), protein ([2541](backend/main.py#L2541)),
> limited-ingredient ([2568](backend/main.py#L2568)), novel protein ([2591](backend/main.py#L2591)),
> AAFCO-complete ([2602](backend/main.py#L2602)). **There is no formulator-credential rule.**
> Plus a flat +5 floor at [backend/main.py:2517](backend/main.py#L2517), capped at 25 at
> [backend/main.py:2607](backend/main.py#L2607).

**Health-condition penalties**, from
[backend/main.py:2389-2403](backend/main.py#L2389-L2403):
- pancreatitis → `fat_dmb`: neutral ≤25%, **−8** at 25–32%, **−15** >32%
- ckd → `phosphorus_dmb`: neutral ≤1.2%, **−5** at 1.2–1.4%, **−10** >1.4%
- ibd → **no engine penalty**, advisory only ([backend/main.py:2487](backend/main.py#L2487))

**Advisory registry: 13 codes, 5 with live triggers.** Codes at
[backend/utils/advisories.py:30-47](backend/utils/advisories.py#L30-L47); triggers at
[backend/utils/advisories.py:83-101](backend/utils/advisories.py#L83-L101). Active:
`gently_cooked_intro`, `freeze_dried_intro`, `ckd_diet`, `pancreatitis_diet`, `ibd_diet`.
The other 8 are registered stubs with `TODO` markers
([backend/utils/advisories.py:106-110](backend/utils/advisories.py#L106-L110)).

### Performance measurements

- **Lighthouse (desktop): Performance 95, Accessibility 93, Best Practices 77, SEO 100** —
  [ROADMAP.md:647](ROADMAP.md#L647). Recorded as prose in a markdown file dated
  "DONE (Mar 28)". **No Lighthouse JSON/HTML report is committed** — this is a self-reported
  number, not a reproducible artifact.
- **Mobile Lighthouse Performance ~74-80** — [ROADMAP.md:686](ROADMAP.md#L686), with the
  stated cause `"limited by ~2MB of product images from external CDNs"`. Same caveat.
- **Bundle sizes**, [ROADMAP.md:655-660](ROADMAP.md#L655-L660):
  main JS 417KB → 375KB (115KB gzipped); main CSS 118KB → 101KB (18KB gzipped);
  8 lazy route chunks. Same caveat — prose, no build report committed.
- **Image compression: ~6.6MB total savings**, itemized at
  [ROADMAP.md:649-654](ROADMAP.md#L649-L654) (e.g. `logo-mark.png: 6.1MB → 27KB`). The
  27KB result is verifiable on disk (`ls -la frontend/public/logo-mark.png` → 27,544 bytes);
  the 6.1MB "before" is not in the repo.
- **Response payload ~50KB → ~80KB** after the result-cap increase — commit `95618ad`
  message. Estimate stated in the commit, no measurement artifact.

**Everything else performance-related: `NO MEASUREMENT IN REPO`.** No latency numbers, no
p50/p95, no query timings, no cache metrics (there is no cache), no load test, no APM
integration, no benchmark script.

---

## 6. Results and evidence

### What shipped, and to whom

**Public web app.** The strongest in-repo evidence is the CSP `connect-src` pinning a
specific Railway host ([frontend/index.html:41](frontend/index.html#L41)) — a value that
only makes sense if that backend is deployed — plus a Vercel SPA config
([frontend/vercel.json](frontend/vercel.json)) and a sitemap/robots pair pointing at
`bowlwise.app` ([frontend/public/sitemap.xml](frontend/public/sitemap.xml),
[frontend/public/robots.txt](frontend/public/robots.txt)).

**Retail tablet deployment (2 PetValu stores).** Claimed in three places:
- `"Deployed on tablets in 2 PetValu retail locations (Oak Ridges + Aurora)"` — a checked box
  at [ROADMAP.md:318](ROADMAP.md#L318) (tracked file).
- `"Live at bowlwise.app + 2 PetValu in-store tablets"` — [ROADMAP.md:4](ROADMAP.md#L4)
  (currently an *uncommitted* working-tree edit).
- **In shipped product code:** the homepage trust badge array literally contains
  `'Live at PetValu Oak Ridges & Aurora'`
  ([frontend/src/pages/HomePage.jsx:75](frontend/src/pages/HomePage.jsx#L75)) — so this
  claim is published to every visitor.

`UNVERIFIED:` There is **no technical artifact** of a tablet deployment — no kiosk mode, no
in-store build target, no device-specific route, no session-reset-between-users code, no
signage asset. The ROADMAP itself lists `"In-store tablets — data cleared between users?
Privacy signage posted?"` as an **unchecked** item at [ROADMAP.md:993](ROADMAP.md#L993).
The retail claim rests entirely on the founder's own assertion.

### Measured usage — the only hard numbers in the repo

Two Vercel Analytics dashboard screenshots, dated 2026-05-01, in the gitignored
`internal/` directory:

**`internal/Screenshot 2026-05-01 at 8.45.20 PM.png`** — bowlwise.app Production, Last 30 Days:
- **224 visitors** (+36%)
- **707 page views** (+23%)
- **57% bounce rate**
- Top pages: `/` 189 · `/recommendations` 56 · `/start` 36 · `/login` 28 · `/roadmap` 27 ·
  `/scoring` 14 · `/dashboard` 13
- Referrers: google.com 15 · linkedin.com 7 · com.linkedin.android 5 · github.com 2 · bing.com 1

**`internal/Screenshot 2026-05-01 at 8.45.27 PM.png`** — same period:
- Countries: Canada 54% · USA 33% · Germany 2% · Netherlands 2% · New Zealand 2%
- Devices: Desktop 54% · Mobile 37% · **Tablet 9%**
- OS: iOS 33% · Windows 21% · Mac 18% · GNU/Linux 15% · Android 13%

These are real, third-party-measured numbers covering roughly Apr 1 – May 1, 2026. They are
the only usage evidence in the repo. Note the 9% tablet share is *consistent with* but not
proof of the in-store deployment.

`UNVERIFIED:` Usage from May 2026 onward. No later analytics capture exists in the repo.

### Launch and reception

- **Public launch: April 4, 2026** — `"Official public launch — LinkedIn post with demo video"`,
  [ROADMAP.md:312](ROADMAP.md#L312).
- **LinkedIn engagement: 30 reactions, 17 comments** —
  [ROADMAP.md:1101](ROADMAP.md#L1101). Self-reported; no screenshot.
- The same line records the founder's own conclusion:
  `"Key lesson: marketing matters more than product at this stage."`

### Ship cadence, from git

133 commits on `main` (`git log --oneline | wc -l`), across 8 active months:
2025-07 (7) · 2025-08 (4) · 2025-11 (8) · 2026-01 (7) · **2026-03 (60)** · 2026-04 (26) ·
2026-05 (12) · 2026-06 (9). Total churn across the repo's history:
**+12,683 / −5,001 lines** (`git log --numstat --pretty=tformat: | awk …`).

Named shipping phases, from commit subjects: Phase 1 Culinary (`a4a0f2f`, `0328373`,
2026-04-26) · Phase 2 Air-dried (`718e2e4`, `a93f47a`, 2026-05-19) · Phase 3 Freeze-Dried
(`73595a7`, `88e82a8`, `95f9347`, 2026-06-21).

### Awards, demos, presentations

- **Demo video:** `"Demo video recorded and edited in Canva"` — a checked box at
  [ROADMAP.md:317](ROADMAP.md#L317). **The video file is not in the repo.**
- **Portfolio/resume:** `"Added to resume with live demo link"` —
  [ROADMAP.md:315](ROADMAP.md#L315).
- **Academic feedback:** the Decision Log records three changes attributed to a
  `"Professor's heuristic evaluation"` — price filter rounding to nearest $5, the
  "Sign in to track" CTA, and the creation of the `/scoring` transparency page
  ([ROADMAP.md:1092-1094](ROADMAP.md#L1092-L1094), [ROADMAP.md:1091](ROADMAP.md#L1091)).
  `UNVERIFIED:` who the professor was, what course/program, and whether this was graded work.
- **No awards, competitions, or conference talks are recorded anywhere in the repo.**

---

## 7. Contribution

**This is a solo project. There is no team.**

`git shortlog -sne --all`:

```
   134	Mahyar Jaberi <jaberi.mahyar@gmail.com>
     5	Mahyar Jaberi <107087318+mahyar-jbr@users.noreply.github.com>
```

Both identities are the same person — the second is the GitHub noreply address used for
web-UI commits (the 5 include the PR merge `2486e8b` "Merge pull request #2 from
mahyar-jbr/feature/bowlwise-logo-rebrand"). **100% of commits are Mahyar's**, across
100% of subsystems: backend, frontend, data, scripts, tests, CI, docs, and legal pages.

There is nothing to deflate here — but also nothing to attribute to collaborators. Three
things worth being precise about in an interview:

1. **The "10-tab team" is not a team.** `CLAUDE.md` and `internal/resume-briefing.md:94`
   describe PM / PO / Security / Backend / Frontend / Data / Marketing / Vet Test /
   Customer Test / Design Director "tabs." These are prompt-scoping conventions for AI
   chat sessions, all driven by one person. Git shows one author. Describing this as a
   team, or the roles as reviewers, would misrepresent it. Describing it as *"I used
   role-scoped AI sessions as a solo workflow"* is accurate and is itself the interesting claim.
2. **"Vet Test approved" / "PO audit" / "Security audit" attributions throughout the code**
   (e.g. `"Vet Test spec (2026-06-21, locked, do not revise without Vet re-pass)"`,
   [backend/main.py:2423](backend/main.py#L2423)) refer to those same AI sessions, not to a
   credentialed veterinarian or a professional security auditor. No external review artifact,
   sign-off, or vet CV is in the repo. `UNVERIFIED:` whether any licensed veterinary
   professional reviewed the scoring thresholds.
3. **Branch/PR activity is minimal.** 3 local branches (`main`,
   `feature/bowlwise-logo-rebrand`, `temp-branch`), 0 tags, 1 merged PR (#2). Most work
   landed directly on `main`.

---

## 8. War stories

Sourced from `git log` subjects and bodies, plus incident write-ups in `ROADMAP.md`.

### 1. The production outage caused by migrating data before shipping the code

**The best story in this repo, and it is written down in the founder's own words.**

> `"Never run a destructive data migration days ahead of code push. Atlas migration ran
> weeks before backend code was committed. When Atlas had format: "kibble" but production
> Backend still queried format: "dry", every recommendation request returned 0 products.
> Production was down until format rename was rolled back on Atlas. Future rule: destructive
> migrations run within the same hour as the matching code push, not before."`
> — [ROADMAP.md:1131-1133](ROADMAP.md#L1131-L1133), dated 2026-04-25.

**What broke:** total recommendation failure — the Mongo query filtered on `format: "dry"`
while every document had been renamed to `"kibble"`, so the filter matched nothing and the
endpoint returned an empty catalog for every user.

**The fix, and the defenses added afterward:**
- The migration script itself: [backend/scripts/migrate_phase1_culinary.py](backend/scripts/migrate_phase1_culinary.py),
  whose docstring says `products.format: "dry" -> "kibble" (rename; no "dry" synonym retained)`.
- The engine now permanently accepts both strings as defense-in-depth:
  `format_filter_values = list(FORMAT_VALUES) + ["dry"]` with the comment
  `"this is defense-in-depth — protects against any un-migrated row slipping in"`
  ([backend/main.py:3054-3058](backend/main.py#L3054-L3058)).
- The same tolerance was added to the scoring path
  ([backend/main.py:1781-1785](backend/main.py#L1781-L1785)) and to the regression harness
  ([backend/scripts/run_regression_gate.py:76-78](backend/scripts/run_regression_gate.py#L76-L78)).
- The CSV was rewritten to match in commit `a00f21e` (2026-05-05):
  `"rewrite CSV format dry → kibble (160 rows)"`.

### 2. Cross-browser pet claiming — fixed twice with the identical commit message

Commits `8b98ebe` (2026-03-28 23:08) and `3778351` (2026-03-30 22:23) carry the **exact same
subject**: `"Fix: pet claiming works cross-browser — embed pet_id + session_token in magic
link URL"`. Two days apart, same message — the first fix didn't hold.

**What broke:** a guest creates a pet in browser A (session token in A's `localStorage`),
requests a magic link, then opens the email in browser B. B has no session token, so the
claim fails and the user's dog profile is orphaned.

**The fix:** carry the credentials in the magic-link URL itself —
[backend/main.py:811-814](backend/main.py#L811-L814):
```python
verify_url = f"{MAGIC_LINK_BASE_URL}/auth/verify/{token}"
if pet_id and session_token:
    verify_url += "?" + urlencode({"pet_id": pet_id, "session_token": session_token})
```
Two follow-on commits in the same session address the related gap where an already-logged-in
user creates a pet: `61368d0` "Fix: auto-link pet to user account on creation when
authenticated (JWT)" and `b1fcca1` "Fix: createPet sends JWT header". The server-side half is
at [backend/main.py:941-950](backend/main.py#L941-L950) — it decodes an optional
`Authorization` header and swallows `jwt.InvalidTokenError` so a bad token degrades to
anonymous creation instead of a 500.

**Security note worth naming honestly:** this design puts a bearer-equivalent
`session_token` in a URL query string, where it lands in email provider logs, browser history,
and any referrer. It was a deliberate tradeoff for a real UX failure. It is the kind of
decision an interviewer will probe.

### 3. Railway would not start the container — two commits, two different causes

- `932a353` (2026-03-28 22:41): `"Fix: Dockerfile uses shell form for PORT env var (Railway
  dynamic port)"`. Railway injects `$PORT` at runtime; exec-form `CMD` doesn't expand it. The
  surviving shell-form line is [backend/Dockerfile.local:20](backend/Dockerfile.local#L20):
  `CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}`.
- `1208767` (2026-03-28 22:49, 8 minutes later): `"Rename Dockerfile to Dockerfile.local
  (prevent Railway auto-detection)"`. Railway saw a `Dockerfile` and switched off its
  Python buildpack. The rename is why the file is called `Dockerfile.local` today.
- `6624839` (2026-03-28 20:53): `"Fix: docker-compose MongoDB URL uses service name instead of
  localhost"` — the classic container-networking mistake. The fix is visible at
  [docker-compose.yml:11](docker-compose.yml#L11): `MONGODB_URL=mongodb://mongodb:27017`.

### 4. Python 3.13 on Railway broke the pinned dependencies

`b3e8cd2` (2026-03-10): `"Relax dependency pins for Python 3.13 compatibility on Railway"`.
The result is the range-pinned `requirements.txt` in use today —
e.g. `fastapi>=0.109.0,<1.0.0` ([backend/requirements.txt:5](backend/requirements.txt#L5))
rather than exact pins.

### 5. A silent CSS import loss shipped an unstyled page

`c5b1e60` (2026-04-12): `"Fix: shared results page missing recommendation.css import — food
cards unstyled"`. A new page reused `FoodCard` but never imported the stylesheet, so every
card rendered naked. The identical class of bug recurred on mobile:
`315c156` (2026-03-28) `"Fix: email modal mobile UI — missing CSS import"` — also recorded in
the ROADMAP at [ROADMAP.md:694](ROADMAP.md#L694).

### 6. `navigator.share()` corrupted the share URL

`86810a0` (2026-04-12): `"Fix: share URL corruption — removed text property from
navigator.share()"`. Passing both `text` and `url` causes several mobile share targets to
concatenate them into one broken string. Fixed by dropping `text`.

### 7. Two dashboard bugs that only appear with more than one record

- `705901b` (2026-03-31): `"Fix: dashboard shows newest pet profile — backend sorts by
  created_at, frontend matches localStorage"` — server ordering and client state disagreed
  about which pet was "current."
- `36653ba` (2026-03-31): `"Fix: account page shows correct pet count (was always 0)"` —
  a count that was hardcoded-wrong and shipped.

### 8. Product images kept rotting

A recurring, unglamorous maintenance thread:
`c07a889` "Acana image URLs encoded for email clients (%20 spaces, %26 ampersand)" ·
`93d51e8` "Now Fresh image fix: 12 grain-free SKUs swapped to homesalive front-facing pack
photos" · `27517ed` "Fix: Orijen Original image URL on scoring page" ·
`2434d60` "Phase 3 launch-day catalog polish: Open Farm + Stella image re-source". The problem
is unresolved: `"Performatrin Ultra product images: 34 SKUs still on expired CDN"` is an open
item at [ROADMAP.md](ROADMAP.md), and the **current uncommitted working-tree diff is 5 more
image-URL swaps** (`git diff backend/product_data.csv`).

### 9. The CSP-vs-localhost leak that happened twice

The comparison-tool commit `3ed9547` carries `"CSP revert"` in its subject, and the Phase 1
backlog records: `"Frontend P2: CSP localhost pre-commit hook (prevent recurring leak —
happened twice now)"` ([ROADMAP.md](ROADMAP.md)). The hook was never built — there is no
`.husky/`, no `.pre-commit-config.yaml`, and no git hook in the repo.

### 10. The abandoned Java implementation

`archive/demo/` contains a Spring Boot app —
`archive/demo/src/main/java/com/example/demo/DemoApplication.java` with `PetController.java`,
`PetRepository.java`, `Pet.java`, and a `pom.xml`. Alongside it, `archive/old-frontend/` holds
a vanilla HTML/CSS/JS version (`index.html`, `recommendation.html`, `js/form.js`). Commit
`d6392ff` (2025-11-06) is the pivot: `"Major refactor: Migrate to React + FastAPI stack with
web scraping"`. `RATIONALE NOT IN REPO — ask Mahyar` why Spring Boot was abandoned.

### 11. Late-night shipping is the norm, not the exception

Of 133 commits, the overwhelming majority land between 22:00 and 02:00 local
(`git log --format='%ad' --date=format:'%H:%M'`). The Phase 3 launch sequence —
`73595a7`, `88e82a8`, `95f9347` — all carry the timestamp **01:21 on 2026-06-21**, and the
final three commits of the project land at **23:26, 23:27, 23:52** the same night.

---

## 9. Publishable assets

### Exists and is publishable as-is

| Asset | Path | Note |
|---|---|---|
| Wordmark (full) | [frontend/public/logo-full.png](frontend/public/logo-full.png) | 81KB, 512px |
| Logo mark (PNG) | [frontend/public/logo-mark.png](frontend/public/logo-mark.png) | 27KB, 256px |
| Logo mark (SVG) | [frontend/public/logo-mark.svg](frontend/public/logo-mark.svg) | 92KB — larger than the PNG; likely un-optimized traced output |
| Alt logo | [frontend/public/logo.png](frontend/public/logo.png) | 38KB |
| Favicon source | [frontend/public/favicon-source.png](frontend/public/favicon-source.png) | 36KB |
| OG / social card | [frontend/public/og-image-final.png](frontend/public/og-image-final.png) | **1.37MB, 1200×630** — needs compression before use |
| OG (older) | [frontend/public/og-image.png](frontend/public/og-image.png) | 61KB — superseded; `index.html:27` points at `og-image-final.png` |
| Format icons (5 SVG) | [frontend/public/format-icons/](frontend/public/format-icons/) | kibble, gently-cooked, raw, freeze-dried, air-dried |
| Launch animation | [frontend/public/marketing/launch-animation.html](frontend/public/marketing/launch-animation.html) | 8.5KB standalone HTML, added `dbb659b` 2026-04-26. Self-authored |
| Architecture diagram | [internal/architecture.pdf](internal/architecture.pdf) | 88KB PDF, dated 2026-04-27. **Gitignored.** `UNVERIFIED:` whether its contents are current — it predates Phase 2 and Phase 3 |

### Example output / sample data

- **[backend/product_data.csv](backend/product_data.csv)** — 260 real rows, 49 columns, 362KB.
  Real brand names, real CAD prices, real PetValu SKU links. Excellent for showing schema
  design and the DMB columns. **Note:** the derived DMB columns are computed at import, not
  stored in the CSV.
- **[backend/tests/baseline_scores.json](backend/tests/baseline_scores.json)** — 50 frozen
  `(profile, product, score)` tuples across 5 named profiles
  (`large-adult-high-maintenance`, `small-adult-low-maintenance`,
  `medium-puppy-medium-musclegain`, `large-senior-low-weightloss`,
  `large-adult-high-chickenallergy`). This is the single most portfolio-legible artifact in
  the repo — it demonstrates the regression-testing idea in ~8KB.
- **Provenance docs** in [docs/](docs/) — 17 files including
  `docs/phase_3_provenance.md`, `docs/phase_2_provenance.md`,
  `docs/gently_cooked_cap_provenance.md`. These show real sourcing methodology and
  explicit data-integrity rules (`"Data tab never claims HPP when it's not there."`,
  `docs/phase_3_provenance.md`). **All gitignored** ([.gitignore:47](.gitignore#L47)).

### Flagged — looks presentable but is NOT publishable as-is

| Asset | Problem |
|---|---|
| `internal/Screenshot 2026-05-01 at 8.45.20 PM.png` | Real Vercel Analytics dashboard. Contains the referrer `mongodb.lightning.force.com` (a Salesforce instance) in the visible list, and the exact bowlwise.app production project view. Crop or redact before use. Numbers themselves (224 visitors / 707 views) are fine to cite |
| `internal/Screenshot 2026-05-01 at 8.45.27 PM.png` | Country/device/OS breakdown. Publishable if you're comfortable disclosing traffic scale |
| **Brand logos** — 20 files in [frontend/public/brands/](frontend/public/brands/) | Orijen, Acana, Open Farm, Performatrin Ultra, Go! Solutions, Now Fresh, Performatrin Culinary, Tom & Sawyer, Freshpet, Ziwi Peak, Smack, Stella & Chewy's, Primal, Vital Essentials, K9 Natural — **all third-party trademarks used without any license recorded in the repo**. See §10 |
| `frontend/public/hero-orijen-large-breed.png` | 134KB product shot of a specific commercial Orijen bag. Third-party product photography, no license in repo |
| **Product images referenced in `product_data.csv`** | All hotlinked from brand/retailer CDNs (acana.com, orijenpetfoods.com, azureedge.net, homesalive.ca). Not owned; several are known-broken (34 Performatrin Ultra SKUs on an expired CDN, per ROADMAP) |
| `archive/demo/target/` | Compiled Java build output committed to disk. Not publishable, not interesting |

### Missing — worth noting for a case study

- **No screenshots of the app itself.** Zero UI captures of the wizard, results page,
  product-detail overlay, comparison tool, or dashboard exist in the repo. The README has an
  open, unchecked item for exactly this: `"README: add screenshot/demo GIF + live demo link"`
  ([ROADMAP.md:319](ROADMAP.md#L319)).
- **No demo video/GIF file.** The ROADMAP says one was recorded in Canva
  ([ROADMAP.md:317](ROADMAP.md#L317)); it is not in the repo.
- **No architecture diagram in a web-friendly format** — only the gitignored PDF.

---

## 10. Do-not-publish list

### Secrets

- **`backend/.env` exists on disk and contains live credentials.** It is correctly
  **gitignored** ([.gitignore:12](.gitignore#L12)) and confirmed untracked
  (`git ls-files --error-unmatch backend/.env` → not tracked). Keys present:
  `MONGODB_URL` (25 chars — `mongodb://localhost:27017`, local only, no Atlas string),
  `RESEND_API_KEY` (**36 chars — a real key**), `JWT_SECRET` (**75 chars — a real secret**),
  `DATABASE_NAME`, `MAGIC_LINK_BASE_URL`. **Never publish this file, never screenshot a
  terminal in this directory with it open, and rotate the Resend key + JWT secret before
  sharing the repo with anyone.**
- **No secrets found in any tracked file.** A scan over all 136 tracked files for
  `sk-…`, `re_…`, `mongodb+srv://`, `AKIA…`, and PEM private-key headers
  (`git grep -nIE '…'`) returned **zero matches**.

### Internal URLs and endpoints

- **`https://pet-ai-assistant-production.up.railway.app`** — the live backend origin, hardcoded
  in three tracked files: [frontend/.env.production:1](frontend/.env.production#L1),
  [frontend/index.html:41](frontend/index.html#L41), [README.md:290](README.md#L290). Already
  public (it's in the shipped CSP header), but it exposes the old project name and the exact
  API origin. Decide deliberately whether a case study should reprint it.
- **A hardcoded Google Sheets published-CSV URL** at
  [backend/import_products.py:44-48](backend/import_products.py#L44-L48) — a `2PACX-…/pub?…&output=csv`
  link that serves the founder's product spreadsheet to anyone who has it. It is a *fallback
  default*, so it ships even when `SHEETS_CSV_URL` is unset. **Redact this line from any
  published code excerpt, and consider unpublishing the sheet.**

### Personal / identifying data

- Author email `jaberi.mahyar@gmail.com` is in every commit (`git shortlog -sne`).
- Personal LinkedIn profile URL is hardcoded in shipped frontend code
  ([frontend/src/pages/HomePage.jsx:947](frontend/src/pages/HomePage.jsx#L947)) — intentional,
  but flagged so it isn't a surprise.
- `internal/mastery-program.md` (132KB) and `internal/resume-briefing.md` (14KB) are personal
  career-planning documents. Both gitignored. `resume-briefing.md` in particular contains a
  "What NOT to claim" section that would be awkward published verbatim.

### Business-sensitive material

- **`ROADMAP.md` is a tracked file, 85KB, and contains a full monetization plan** — a
  PetValu corporate pitch to `"formalize the 2-store tablet pilot into a paid SaaS"`, B2B
  data sales (`"Sell anonymized scoring data to pet food brands"`), and freemium thresholds
  ([ROADMAP.md:1179-1182](ROADMAP.md#L1179-L1182)). It also names specific retail locations,
  hosting costs, and pre-launch bug counts. **Do not link the raw ROADMAP from a public
  case study.** Excerpt selectively.
- **Named third-party businesses:** PetValu (Oak Ridges + Aurora), plus 15 named brands.
  `docs/phase_3_provenance.md` records an item to send a `"Courtesy email to Tom & Sawyer
  (info@tomandsawyer.com) flagging brand use"` — an unchecked box, meaning at least one
  brand may not know their trademark is in use.

### Unlicensed third-party assets

- **20 brand logo files** in [frontend/public/brands/](frontend/public/brands/) covering
  15 trademarked brands. **No license, permission record, or fair-use analysis exists
  anywhere in the repo.** They are displayed publicly on bowlwise.app's homepage marquee
  ([frontend/src/pages/HomePage.jsx:52-70](frontend/src/pages/HomePage.jsx#L52-L70)).
  This is the single largest legal exposure in the project. Do not reproduce the marquee in
  portfolio screenshots without thinking about it.
- **Product photography** — hotlinked from brand CDNs throughout `product_data.csv`, plus
  one committed copy (`hero-orijen-large-breed.png`).

### Stale or embarrassing things a visitor could reach by following a link

1. **`bowlwise.app/scoring` states the wrong catalog size, publicly, right now.**
   [frontend/src/pages/ScoringPage.jsx:252](frontend/src/pages/ScoringPage.jsx#L252) reads
   `"Scores across all 191 products and 9 brands come from the same algorithm"`. The actual
   catalog is **260 products across 15 brands**. This is on a page whose entire purpose is
   trust and transparency. **Fix before pointing anyone at `/scoring`.**
2. **`README.md` is substantially stale.** It claims 186 products / 9 brands
   ([README.md:3](README.md#L3), :84-86), lists the *pre-Phase-1* scoring table with
   "Activity + Goal 0-40", "Ingredient Quality", and "Breed/Kibble Size 0-5"
   ([README.md:187-194](README.md#L187-L194)) — none of which match the code — and
   describes `utils/advisories.py` as handling `"DCM flag, sodium warnings"`
   ([README.md:221](README.md#L221)), which the module does not do at all. It also
   references a `backend/scrapers/` directory ([README.md:217](README.md#L217)) that no
   longer exists (moved to `archive/scrapers_legacy_pre_phase1/` in commit `a00f21e`).
   **The README is the first thing a recruiter reads. It currently describes a different,
   older product.**
3. **`sitemap.xml` omits `/start`** ([frontend/public/sitemap.xml](frontend/public/sitemap.xml)),
   the primary funnel entry, while `robots.txt` allows everything
   ([frontend/public/robots.txt:2](frontend/public/robots.txt#L2)).
4. **`/roadmap` is a live public route** ([frontend/src/App.jsx:84](frontend/src/App.jsx#L84))
   described in the code comment as `"(visual roadmap, private)"` and in
   [README.md:155](README.md#L155) as `"Public roadmap"`. It received **27 visitors** in the
   April analytics window and carries no `noindex` tag (the only `noindex` in the codebase is
   on `/results/:petId`, [frontend/src/pages/SharedResultsPage.jsx:44](frontend/src/pages/SharedResultsPage.jsx#L44)).
   **Verified: it does NOT render `ROADMAP.md`.** `RoadmapPage.jsx` has its own hand-curated
   `ROADMAP_DATA` literal ([frontend/src/pages/RoadmapPage.jsx:13](frontend/src/pages/RoadmapPage.jsx#L13))
   with the comment `"Personal planning tool for the founder … edit ROADMAP_DATA directly"`
   ([frontend/src/pages/RoadmapPage.jsx:1-4](frontend/src/pages/RoadmapPage.jsx#L1-L4)). The
   SaaS pitch and B2B data-sales lines are **not** exposed. What *is* public: unannounced
   product plans — Phase 4 Raw with named Canadian brands, an August 2026 iOS app, and
   `"Affiliate Integration (PetValu) … First monetization layer"`
   ([frontend/src/pages/RoadmapPage.jsx:35-37](frontend/src/pages/RoadmapPage.jsx#L35-L37)).
   Judgment call, not a leak — but know it's there before linking it.
5. **`archive/` is gitignored but 7 files are still tracked** —
   `archive/scrapers_legacy_pre_phase1/*.py`, `archive/data_normalizer_legacy_pre_phase1.py`,
   `archive/test_scraper_legacy_pre_phase1.py` (`git ls-files archive`). Dead scraper code
   that `CLAUDE.md` itself describes as `"NOT production-ready"`. A visitor browsing the repo
   will find it.
6. **`main.py` emits 67 `DeprecationWarning`s** during the test run, all
   `datetime.datetime.utcnow() is deprecated` (e.g.
   [backend/main.py:932](backend/main.py#L932), :933, :1022). Cosmetic, but visible in any
   live test output you might screenshot.

---

## 11. Open questions for Mahyar

Each of these is one `UNVERIFIED:` or `RATIONALE NOT IN REPO` from above, phrased so you can
answer it in a sentence.

1. **Is bowlwise.app and the Railway backend still live and serving traffic today?** The repo
   proves it *was* deployed; nothing proves it still is, and the last commit was 2026-06-21.
2. **Why a single 3,611-line `main.py` instead of splitting into routers/modules?** The file
   documents that it's single-file; it never says why.
3. **Why FastAPI over Django or Flask?** No decision-log row exists.
4. **Why MongoDB over Postgres,** given the product schema is a fixed 49-column table? The
   Decision Log justifies *Atlas as a host*, not the document model.
5. **Why React + Vite rather than Next.js,** when SEO was named a top post-launch priority and
   the app ships as a client-rendered SPA with a hand-written `<noscript>` fallback?
6. **Where does the "Vet Test spec (2026-06-21, locked)" actually live?** `main.py:2423` treats
   it as a binding external document, but no such artifact is in the repo.
7. **Did any licensed veterinary professional review the scoring thresholds,** or is "Vet Test"
   entirely an AI-session role? This determines whether "validated against AAFCO/NRC/WSAVA"
   can be said in a portfolio without qualification.
8. **What did dog owners actually do before BowlWise?** The repo has no user research,
   competitor analysis, or interview notes — only marketing copy.
9. **What is the current regression-gate bust rate?** `CLAUDE.md` says YELLOW 8% / 4 busts;
   commit `95618ad` says YELLOW 10% / 5 busts. The gate can't be run without the production catalog.
10. **Which per-format catalog split is correct?** The CSV and `ROADMAP.md` say
    169/26/13/52; `CLAUDE.md` says 165/26/17/52.
11. **Is `score_topper`'s docstring wrong, or is the code missing a rule?** The docstring lists
    a `"Formulator credential +5 (DACVN or PhD_nutrition)"` bonus in `compute_complement_fit_score`
    that is not implemented ([backend/main.py:2503](backend/main.py#L2503) vs the body at
    :2527-2607).
12. **Is `CLAUDE.md`'s topper scoring table simply obsolete?** It says Complement Fit *replaces*
    Activity+Goal and gives Price Value 0-25; the code keeps Activity+Goal at a scaled 15 and
    gives price **zero** weight. Its columns also sum to 110.
13. **What technically exists for the PetValu tablet deployment?** No kiosk mode, no
    session-reset code, no in-store build target is in the repo — and ROADMAP:993 still lists
    "data cleared between users? / privacy signage posted?" as unchecked.
14. **Is there analytics data after May 2026?** The only measured usage in the repo is the
    Apr 1 – May 1, 2026 window (224 visitors / 707 views).
15. **Who was the "Professor" whose heuristic evaluation drove three logged UX decisions,**
    and what was the context — a course, a capstone, an informal review?
16. **Do you have the demo video file?** ROADMAP:317 says it was recorded in Canva; it isn't
    in the repo, and there are **no app screenshots of any kind** for a case study.
17. **Do you have any license or permission for the 15 brand logos** shipped in
    `frontend/public/brands/` and displayed on the live homepage?
18. **Did the courtesy email to Tom & Sawyer about brand use ever get sent?** It's an unchecked
    item in `docs/phase_3_provenance.md`.
19. **Do you intend `/roadmap` to be publicly indexable?** It renders its own curated data (not
    `ROADMAP.md`), so no SaaS-pitch leak — but it does publish unannounced plans: Phase 4 Raw
    with named brands, an August 2026 iOS app, and PetValu affiliate monetization. No `noindex`.
20. **Why was the Java/Spring Boot implementation (`archive/demo/`) abandoned** for React +
    FastAPI in Nov 2025? The commit records the what, not the why.
21. **Is the hardcoded Google Sheets CSV URL** at `backend/import_products.py:48` still live,
    and should the sheet be unpublished?
22. **Has the `RESEND_API_KEY` / `JWT_SECRET` in your local `backend/.env` been rotated?** They
    are real values sitting in the working directory (correctly gitignored, but present).
23. **Is `internal/architecture.pdf` current?** It's dated 2026-04-27 — before Phase 2
    (air-dried) and Phase 3 (freeze-dried) shipped.
24. **Do you want to fix `ScoringPage.jsx:252` ("191 products and 9 brands") and the README
    before this project is linked publicly?** Both are wrong on the live site / first-read
    surface, and both are one-line fixes.
