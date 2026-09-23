import type { BriefProject, CaseStudyProject, Project, SoonProject } from './types';

/**
 * The projects on the site, in display order (`order`).
 *
 * BowlWise, Maridian and Tactical DNA are written from verified extracts — every
 * claim traces to a file:line citation in `content/sources/*_PORTFOLIO_EXTRACT.md`.
 * MoneyMind's card, Realest and Graph-Native Retrieval carry only what Mahyar has
 * stated, and no results.
 *
 * Editorial standard: present the work as impressively as the facts allow, and
 * never further. On BowlWise that costs nothing — the verified numbers came back
 * larger than the ones the June draft was guessing at.
 */

const bowlwise: CaseStudyProject = {
  slug: 'bowlwise',
  name: 'BowlWise',
  kind: 'product',
  page: 'case-study',
  depth: 'deep',
  order: 1,
  year: '2026',
  status: { label: 'Live in stores', kind: 'live' },
  cardLine: 'Scores 260 dog foods against your dog',
  mark: '/work/bowlwise/mark.png',
  facts: [
    { label: 'In stores', value: 'Pet Valu Oak Ridges and Aurora' },
    { label: 'Launched', value: 'April 4, 2026' },
  ],

  // Written from `approach` below — the same facts, cut into the three beats the
  // case study's "How it works" shows. Nothing here that approach doesn't say.
  steps: [
    {
      title: 'Describe your dog',
      body: 'An eight-step profile: life stage, activity, weight goal, allergies and any diagnosed conditions. No account needed.',
    },
    {
      title: 'Compare like with like',
      body: 'Every product is normalized to a dry-matter basis at import, so a raw food and a kibble are finally measured on the same scale.',
    },
    {
      title: 'Score and explain',
      body: 'Allergens and size mismatches are filtered out first. The rest score 0–100 on six weighted factors from AAFCO, NRC and WSAVA guidance, each explainable line by line.',
    },
  ],

  // Real screenshots of bowlwise.app, from the Lucent kit's Bowlwise asset group.
  shots: [
    {
      src: '/work/bowlwise/marketing-hero.png',
      width: 3840,
      height: 2160,
      alt: 'The BowlWise home page: "Stop guessing what to feed your dog", with an example match card',
      caption: 'The home page: one question, one clear answer.',
    },
    {
      src: '/work/bowlwise/petprofile.png',
      width: 3840,
      height: 2160,
      alt: 'A dog profile with breed size, age, activity, goal and allergies, and its top food matches',
      caption: 'A dog’s profile and its top matches.',
    },
    {
      src: '/work/bowlwise/foodcard.png',
      width: 3840,
      height: 2160,
      alt: 'One food in detail: match score, match reasons, nutrition bars and guaranteed analysis',
      caption: 'One food in detail: the score, the reasons, and the nutrition behind them.',
    },
    {
      src: '/work/bowlwise/marketing-brands.png',
      width: 3840,
      height: 2160,
      alt: 'The brands BowlWise scores, and its three-step explainer',
      caption: 'The brands it scores, and how it works in three steps.',
    },
  ],

  oneLiner:
    'A dog food recommendation engine that scores 260 products against veterinary nutrition standards — live on tablets in two Pet Valu stores.',

  badges: ['Live in production', 'Solo build', 'BowlWise Inc.'],

  stack: ['React', 'Vite', 'FastAPI', 'Python', 'Pydantic', 'MongoDB', 'Docker'],

  links: [
    // Verified serving 2026-08-08: HTTP 200 on / and /scoring. This is the only live
    // link on the entire site, so it is worth re-checking before any redeploy.
    { label: 'bowlwise.app', href: 'https://bowlwise.app', status: 'live' },
    // No public repo. Highest-ROI fix available: extract the scoring engine to a
    // standalone public repo with its tests — it's the most interesting code here
    // and the only thing currently unviewable.
    //
    // KNOWN ISSUE on the live site (not ours to fix, but it undercuts this link):
    // /scoring says "191 products and 9 brands"; the catalog is 260 across 15. It is
    // the page whose entire purpose is trust.
  ],

  problem:
    'Dog food labels can’t be compared to each other. A raw food that’s 70% moisture prints 11% protein on the bag; a kibble prints 26%. Normalized to a dry-matter basis the raw is actually 37% — the higher of the two. Nothing on the shelf tells an owner that, and the comparison tools that exist are either brand-sponsored or blind to format. I spent three years at Pet Valu watching people make a several-hundred-dollar-a-year decision with no way to see what they were actually buying.',

  approach:
    'A deterministic scoring engine, not a model. Every product is normalized to dry-matter basis at import, so the engine compares like with like, then scored 0–100 across six weighted factors drawn from AAFCO, NRC and WSAVA guidance — activity and weight goal, nutritional quality, life stage, formulation integrity, format suitability, and price value — with additive penalties for diagnosed conditions applied last. Allergens and breed/kibble-size mismatches are hard filters that return zero before scoring runs. Owners answer an eight-step profile, with no account required.',

  result:
    'Launched publicly on April 4, 2026 and running on customer tablets in Pet Valu Oak Ridges and Aurora. In its first measured month it drew 224 visitors and 707 page views, 54% from Canada, with 9% of sessions on tablets. Built and shipped solo — 133 commits across backend, frontend, catalog, CI, and the legal pages — and incorporated as BowlWise Inc.',

  metrics: [
    {
      value: '260',
      label: 'Products scored, 15 brands',
      source: 'Counted from backend/product_data.csv with csv.DictReader',
    },
    {
      value: '121',
      label: 'Automated tests, all passing',
      source: 'pytest tests/ -v → 121 passed; the same command CI runs',
    },
    {
      value: '20',
      label: 'API endpoints, 14 rate-limited',
      source: 'Counted from @app decorators in backend/main.py',
    },
    {
      value: '224',
      label: 'Visitors in first measured month',
      source: 'Vercel Analytics, Apr 1 – May 1 2026 (707 page views, 57% bounce)',
    },
    {
      value: '2',
      label: 'Pet Valu stores running it',
      source: 'Oak Ridges + Aurora; published on the live site’s trust badges',
    },
    {
      value: '100%',
      label: 'Of commits written solo',
      source: 'git shortlog -sne → 133 commits, one author',
    },
  ],

  decisions: [
    {
      decision: 'A deterministic scoring engine instead of a model',
      why: 'Rule-based scoring is the cold start — a model needs behavioural data that a launch-day product doesn’t have yet. It also means every score can be explained to the owner line by line, which matters when you’re asking someone to trust a recommendation about their dog’s health. ML is gated behind 500+ tracked purchases, and until then calling this “AI-powered” would be false.',
    },
    {
      decision: 'Normalize to dry-matter basis at import, not per request',
      why: 'The conversion is the whole point of the product, and doing it once at import lets the scoring engine read protein_dmb and fat_dmb directly instead of repeating the maths on every request.',
    },
    {
      decision: 'Never impute missing nutrition data',
      why: 'If moisture is missing, the converter returns null rather than assuming a default. Fabricating a plausible number would produce a confident score built on an invented input — the failure mode most likely to make the whole engine untrustworthy. Unpublished values score neutral, so brands that are transparent about gaps aren’t punished for it.',
    },
    {
      decision: 'Strip health conditions from the recommendations response',
      why: 'That endpoint is public and unauthenticated — anyone with a pet’s share link can curl it. Health conditions are PIPEDA-classified health data, so the profile is split into an internal object the engine scores against and a public object the API returns, and the health fields never make the round trip.',
    },
    {
      decision: 'Magic-link auth, with the token stored only as a SHA-256 hash',
      why: 'No passwords to manage or leak, and if the database were breached the stored tokens would be unusable. The raw token exists only in the email.',
    },
    {
      decision: 'No login wall anywhere in the recommendation flow',
      why: 'Requiring an account before showing any value kills conversion. Guests get a per-pet session token and full results; the account prompt comes after they’ve seen something worth saving.',
    },
    {
      decision: 'A frozen regression baseline for the scoring engine',
      why: 'Scoring changes are easy to make and hard to evaluate — a tweak that helps one profile can quietly wreck another. Fifty frozen (profile, product, score) tuples across five representative dogs get re-scored on demand and the run exits pass, yellow, or red on how many drifted.',
    },
  ],

  contribution: {
    role: 'Solo — founder and sole engineer',
    teamSize: 1,
    owned: 'Backend, frontend, scoring engine, catalog, CI, deployment, and the privacy and terms pages',
  },

  warStory: {
    title: 'The migration that ran a week early',
    body: 'A data migration renamed every product’s format from "dry" to "kibble" in Atlas. The matching backend code hadn’t shipped yet — production was still querying for "dry". The filter matched nothing, so every recommendation request returned an empty catalog, for every user, silently. Nothing errored; the app just stopped recommending anything. I rolled the rename back on Atlas to restore service, then shipped the code with both strings permanently accepted as defence-in-depth, and added the same tolerance to the scoring path and the regression harness. The rule I wrote down afterward: destructive migrations run in the same hour as the code that expects them, never before.',
  },
};

// ---------------------------------------------------------------------------
// Written from content/sources/*_PORTFOLIO_EXTRACT.md (content/sources/PROJECT_EXTRACTION_PROMPT.md).
// ---------------------------------------------------------------------------

// HELD BACK (2026-09-22). MoneyMind is becoming a co-founded product. Since
// 2026-09-23 Mahyar shows it by name, but only as the "Coming soon" card
// `moneymind` below: its screenshots, characters and details stay off every public
// page until launch. This verified write-up is kept, unrendered, for that day.
export const heldBack: CaseStudyProject = {
  slug: 'moneymind',
  name: 'MoneyMind',
  kind: 'prototype',
  page: 'case-study',
  depth: 'deep',
  order: 99,
  year: '2026',
  status: { label: 'Hackathon build', kind: 'hackathon' },
  cardLine: 'A finance agent that remembers the user',

  oneLiner:
    'A personal finance agent that remembers the user, not just their transactions.',

  badges: ['Google Cloud Rapid Agent Hackathon', 'MongoDB Track', 'Agent architecture'],

  stack: [
    'Next.js',
    'FastAPI',
    'LangGraph',
    'Gemini 2.5 Flash',
    'Vertex AI',
    'Voyage AI',
    'MongoDB Atlas',
    'MCP',
    'Clerk',
    'Docker',
  ],

  links: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/MoneyMind', status: 'live' },
    // DO NOT LINK money-mind-seven.vercel.app. The frontend still loads, but the
    // Railway backend was torn down and 404s, so a visitor who signs in gets a broken
    // app. Worse than no link. A production version is in progress with Kasra.
  ],

  problem:
    'Every budgeting app remembers your transactions. None of them remember you. Telling Mint that you’re bulking this month, or that there’s a birthday party this week, is impossible — so the advice stays generic and the app stays passive, waiting for you to open it and read a pie chart you already understand.',

  approach:
    'A single agent with a memory of the person, not just the ledger. Behavioural observations are written as first-class "memories," embedded with Voyage AI at 1024 dimensions and retrieved by vector search on MongoDB Atlas, so the agent recalls context by meaning rather than keyword. It runs as a LangGraph ReAct loop over 18 purpose-built tools — memory, goals, budgets, interventions, analytics — plus read-only MongoDB access through MCP, and streams its answer back through three services on a single asyncio event loop. Statements arrive as CSV or PDF and are parsed by a separate Gemini multimodal pass.',

  result:
    'Built in 19 days for the Google Cloud Rapid Agent Hackathon on the MongoDB track, and verified end to end on live infrastructure before the code freeze — Clerk sign-in through to a real Gemini reply grounded in real Atlas data. I wrote 156 of the 201 commits and owned the agent layer, the deployment, and the streaming path across all three services.',

  metrics: [
    {
      value: '18',
      label: 'Agent tools, plus MCP',
      source: 'Verified three ways: tool files, registrations, and _wrap_tool calls',
    },
    {
      value: '372',
      label: 'Test functions across 34 files',
      source: 'grep over agent/tests + backend/tests (317 agent, 55 backend)',
    },
    {
      value: '19',
      label: 'Days from first commit to freeze',
      source: 'git log — 2026-05-21 to 2026-06-08, 201 commits',
    },
    {
      value: '78%',
      label: 'Of commits mine',
      source: 'git log author counts — 156 of 201',
    },
  ],

  decisions: [
    {
      decision: 'Plain-text chunked streaming instead of SSE',
      why: 'SSE buys named events, auto-reconnect and event IDs — none of which a single-turn response stream that closes when the agent finishes actually uses. The one place it earns its keep is statement ingest, which takes 5–30 seconds; there the progress events are the difference between a visible pipeline and a spinner the user assumes has hung.',
    },
    {
      decision: 'Tools never call other tools',
      why: 'LangGraph routing sees one tool call from the model, but a tool that calls another fans out into several database reads, each with its own user-scoping path and its own way to fail. Keeping the tool surface flat costs some duplicated helpers and buys an error surface you can actually reason about.',
    },
    {
      decision: 'Embed memories manually rather than using Atlas auto-embedding',
      why: 'Auto-embed was configured at the index but never wired to a source field, and discovering that late would have been fatal. Embedding on write costs about 200ms and makes the path explicit and testable.',
    },
    {
      decision: 'Bucket spending anomalies in Python, not with Mongo $dateTrunc',
      why: 'The Mongo aggregation would have been cleaner, but the mock driver the test suite runs on doesn’t implement $dateTrunc — so every affected test would have had to hit real Atlas at roughly 30 seconds a run instead of under one. Hermetic tests were worth the uglier query.',
    },
    {
      decision: 'Read from the database before the graph runs, never inside the prompt builder',
      why: 'This one came out of a bug. The prompt builder runs inside an already-running event loop, and the async Mongo driver binds cursors to the loop that created them — so a read from inside it fails with "future attached to a different loop" on the second message. Pre-fetching everything at the entry point and passing it through graph state made the prompt builder pure and the failure impossible.',
    },
  ],

  contribution: {
    role: 'Agent architecture and deployment',
    teamSize: 3,
    owned: 'The agent layer end to end — tools, LangGraph wiring, MCP integration, prompt — plus the container deploy and the streaming path across all three services',
  },

  warStory: {
    title: 'We audited ourselves and found the demo was lying',
    body: 'Five days before submission we ran a production-readiness audit on our own build. The first line of it reads: the intervention card is 100% mock theater — the headline feature is fake in the UI. Accept, Decline and Modify all rendered perfectly and persisted nothing; the handler was a literal no-op. It would have demoed beautifully and been false. We wired it to the real backend and cut a set of dashboard KPIs that were similarly decorative. Finding it ourselves, with the clock running, was worth more than shipping it unnoticed.',
  },
};

const maridian: CaseStudyProject = {
  slug: 'maridian',
  name: 'Maridian',
  kind: 'prototype',
  page: 'case-study',
  depth: 'deep',
  order: 4,
  year: '2026',
  status: { label: 'Built in 5 days', kind: 'hackathon' },
  cardLine: 'Six agents triaging defects on a bakery line',
  facts: [
    { label: 'Event', value: 'TMLS 2026 Agentic AI Hackathon' },
    { label: 'Team', value: '6 people' },
  ],

  // Cut from `approach`: the six agents, in the order they run, as three beats.
  steps: [
    {
      title: 'Classify the defect',
      body: 'Triage classifies what the camera flagged. Options finds the routes that customer’s contract allows.',
    },
    {
      title: 'Price it and decide',
      body: 'Scorer prices each route. Decision commits one and logs why, streaming its reasoning to the operator as it goes.',
    },
    {
      title: 'Check the batch',
      body: 'Batch Tracker checks the batch against its SLA, and Recovery Planner proposes a recovery if it was breached.',
    },
  ],

  oneLiner:
    'Six Claude agents that triage defects on a bakery production line and recommend what to do with the batch.',

  badges: ['TMLS 2026 Agentic AI Hackathon', 'Team of 6', 'Built in 5 days'],

  stack: ['Python', 'FastAPI', 'Pydantic', 'Claude Haiku 4.5', 'Anthropic SDK', 'SQLite', 'SSE', 'Next.js'],

  links: [
    // NO LINKS. The Railway API is decommissioned and 404s; the Vercel frontend still
    // loads but every fetch and the "Run AI Analysis" button hit that dead host, so a
    // visitor gets a broken page. The old fgf-sentinel-web.vercel.app URL must not ship.
    // Four real UI screenshots exist at web/public/pitch/shots/ — those carry this page.
  ],

  problem:
    'On a commercial bakery line, computer-vision cameras flag hundreds of defects per batch, and every one needs a human call: scrap it, downgrade it to B-grade, or repack it. The information required to make that call — current inventory, the customer’s contracted defect tolerance, whether there’s B-grade demand, what capacity is free — is scattered across systems. Operators make this decision dozens of times a shift, under time pressure, while also running equipment.',

  approach:
    'Six specialised agents run in a fixed sequence, each with its own prompt and its own small set of tools: Triage classifies the defect, Options finds the routes available under that customer’s contract, Scorer prices them, Decision commits and logs one, Batch Tracker checks the batch against its SLA, and Recovery Planner proposes a recovery action if the SLA is breached. There’s no agent framework — it’s the Anthropic SDK’s tool-use loop against Claude Haiku 4.5, with a hand-written orchestrator, and every stage streams its reasoning to the operator’s screen over SSE as it happens. Twelve tools read and write a fourteen-table factory database. One invariant is enforced in the type system rather than the prompt: a customer-facing email draft can never be auto-sent, only prepared for a human to approve.',

  result:
    'Built in five days by a team of six and demoed at the TMLS 2026 Agentic AI Hackathon, sponsored by FGF Brands. The system runs end to end — a flagged defect becomes a costed recommendation with a written audit trail in about half a minute. The backend has since been decommissioned, so what remains is the code, the screenshots, and the write-up.',

  metrics: [
    {
      value: '6',
      label: 'Agents, each with its own prompt and tools',
      source: 'api/agents/ — Triage, Options, Scorer, Decision, Batch Tracker, Recovery Planner',
    },
    {
      value: '21',
      label: 'API endpoints across 3 routers',
      source: 'Counted from @app/@router decorators in api/',
    },
    {
      value: '14',
      label: 'Database tables, 12 agent tools',
      source: 'api/db/schema.sql (14 CREATE TABLE) and api/tools/ (12 specs, 11 agent-reachable)',
    },
    {
      value: '5 days',
      label: '245 commits, 6 people',
      source: 'git log — 2026-05-25 to 2026-05-29',
    },
  ],

  decisions: [
    {
      decision: 'Claude Haiku 4.5 instead of Sonnet',
      why: 'Six agents run in sequence, so per-call latency compounds six times over before the operator sees an answer. Haiku’s faster calls and higher rate limits mattered more here than the extra reasoning depth of a larger model — the work is bounded lookups against a database, not open-ended analysis.',
    },
    {
      decision: 'No agent framework — the Anthropic SDK tool-use loop directly',
      why: 'RATIONALE NOT IN REPO — Mahyar to supply. The README states the fact and calls it interesting; nothing records the reasoning, and no commit shows a framework being tried and dropped.',
    },
    {
      decision: 'A customer email draft can never auto-send',
      why: 'It’s typed as a literal false in the shared contract, not left to a prompt to respect, and a test asserts it. The system can prepare the message to a customer about a quality failure; a person has to be the one who sends it. That boundary is what makes an operations team willing to switch it on at all.',
    },
    {
      decision: 'A hard timeout around every agent stage',
      why: 'A rate-limit retry inside any single agent sleeps for 15, 30, then 60 seconds — and with a sequential chain that would silently stall the entire pipeline with the stream still open. Wrapping each stage in a 45-second ceiling turns an indefinite hang into a degraded stage the operator can see.',
    },
  ],

  contribution: {
    role: 'Infrastructure lead and integrator',
    teamSize: 6,
    owned:
      'The API contract the six of us built against, the operator and distributor portals, deployment, and integration — including the production outage below and all 24 pull-request merges. The agents, the tools and the database schema were written by teammates.',
  },

  warStory: {
    title: 'Production down on Wednesday afternoon',
    body: 'Every route started returning 502 in the middle of a build day. The Railway build log was green, which is what made it confusing — the failure only appeared in the runtime log, where the traceback stopped inside sqlite3.connect. Railway deploys with the root directory set to /api, so the database path we resolved relative to the source tree pointed above the container root; the file simply wasn’t there. The connection error propagated out of startup and killed the app before it could serve anything. I fixed it in three parts: resolve the database path from an environment variable first and fall back through two known locations, commit a seeded copy of the database inside the deploy root, and — the part I’d keep in any project — make startup non-fatal, so a database problem can degrade the app instead of taking down the health check with it.',
  },
};

const tacticalDna: CaseStudyProject = {
  slug: 'tactical-dna',
  name: 'Tactical DNA',
  kind: 'research',
  page: 'case-study',
  depth: 'standard',
  order: 6,
  // Source files dated 2026-05-13 to 2026-06-09 (TacticalDNA extract §git).
  year: '2026',
  status: { label: 'Research', kind: 'research' },
  cardLine: 'Does a coach leave a fingerprint on passing?',
  facts: [{ label: 'Course', value: 'EECS 4414 Information Networks' }],

  // Cut from `approach`.
  steps: [
    {
      title: 'Build the networks',
      body: '775 passing networks from StatsBomb open data, each cut at the first substitution so every graph has exactly eleven nodes.',
    },
    {
      title: 'Describe the structure',
      body: '44 features per network: global statistics, centrality summaries and triadic-census motif fractions.',
    },
    {
      title: 'Test it two ways',
      body: 'Coach classification, style clustering and a player-role embedding, each evaluated two ways rather than one.',
    },
  ],

  oneLiner:
    'Testing whether a football coach leaves a measurable fingerprint on how their team passes. Mostly, they don’t — the roster does.',

  badges: ['Research', 'EECS 4414 Information Networks', 'Solo'],

  stack: ['Python', 'NetworkX', 'scikit-learn', 'XGBoost', 'UMAP', 'pandas', 'Plotly'],

  links: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/tactical-dna', status: 'live' },
  ],

  problem:
    'Football’s tactical vocabulary — possession football, gegenpressing, “a coach’s style” — gets argued about constantly and measured almost never. The research that does exist on passing networks is descriptive: it characterises one team, or a handful of matches, and stops there. I wanted a falsifiable version of the question instead. Does a coach impose a structural signature on how their team passes — one strong enough for a classifier to recover, and strong enough to follow them when they change clubs?',

  approach:
    'I built 775 directed weighted passing networks from StatsBomb open data: 517 Barcelona matches across eight coaching eras, 256 World Cup matches, and the two Bayern games available for Guardiola. Every network is cut at the first substitution by either side, so all eleven starters are still on the pitch and every graph has exactly eleven nodes — otherwise motif and centrality statistics drift with graph size and you end up measuring squad rotation instead of tactics. Each one is reduced to 44 structural features: 8 global, 20 centrality summary statistics, and 16 triadic-census motif fractions. Three problems run on top of that corpus — supervised coach classification, unsupervised clustering of match styles, and a player-role embedding — each evaluated two ways rather than one.',

  result:
    'A random forest recovered the coach at 0.358 accuracy against a 0.263 majority baseline. Then I re-ran it with season-grouped cross-validation, so matches from the same season could never land on both sides of a split — and accuracy fell to 0.250, essentially the baseline. The gain had been leakage: the model was substantially identifying the season, not the manager. The transfer test agreed. Guardiola’s Bayern networks were recovered 0 times out of 2. The honest conclusion is that the passing signature belongs to the club and its roster far more than to the coach — which is the opposite of my hypothesis, and the finding the report leads with. One result did survive: the player-role embedding recovered on-pitch position at 0.883 purity against a 0.295 random baseline. Where a player sits in the passing structure genuinely does describe what they do.',

  metrics: [
    {
      value: '775',
      label: 'Passing networks, 42 teams',
      source: 'outputs/features_all.csv — 775 rows; 517 Barça + 256 World Cup + 2 Bayern',
    },
    {
      value: '44',
      label: 'Structural features per network',
      source: '20 centrality + 16 motif + 8 global, per src/phase3_p1.py',
    },
    {
      value: '0.358 → 0.250',
      label: 'Coach accuracy once leakage was removed',
      source: 'outputs/phase3_p1_results.csv — random CV vs season-grouped CV, 0.263 baseline',
    },
    {
      value: '0.883',
      label: 'Player-role position purity vs 0.295 random',
      source: 'outputs/p3_position_purity.csv — 5-nearest-neighbour purity, 271 players',
    },
  ],

  decisions: [
    {
      decision: 'Evaluate with season-grouped cross-validation, not just stratified random folds',
      why: 'Random folds let matches from the same season sit on both sides of the split, so the classifier can partly answer "which season is this" instead of "which coach is this" and the score flatters itself. Grouping by season removes that path and gives a leakage-free lower bound. It cost me most of my headline result, which is exactly why it was worth running.',
    },
    {
      decision: 'Cut every network at the first substitution and fix it at eleven nodes',
      why: 'Motif counts and centrality statistics are sensitive to graph size, so networks of different node counts aren’t comparable — differences in squad rotation would show up looking like differences in tactics. Cutting at the first substitution by either team is the most conservative window where all the starters are still on.',
    },
    {
      decision: 'Label the coach per match, not per season',
      why: 'Barcelona changed manager mid-season in 2019/20. A per-season label would have mis-assigned 19 matches to the wrong coach — a small error in the ground truth that would have quietly corrupted every result built on it.',
    },
    {
      decision: 'Treat edge distance as 1/weight',
      why: 'In a passing network more passes means a stronger tie, so more passes should mean a shorter path. Feeding the raw weight in as distance would invert the meaning of every betweenness and path-length figure in the study.',
    },
    {
      decision: 'Report both PCA and UMAP projections everywhere, never just one',
      why: 'UMAP preserves local structure better but is harder to interpret and easier to over-read. Showing both keeps the reader honest about which patterns are real and which are artefacts of the projection.',
    },
  ],

  contribution: {
    role: 'Solo',
    teamSize: 1,
    owned: 'Data pipeline, network construction, feature engineering, all three analyses, and the presentation',
  },

  warStory: {
    title: 'The one match that wouldn’t build',
    body: 'The first full run reported 516 of 517 networks built. One match had failed, and the easy move was to accept 516 and move on — a 0.2% loss changes nothing statistically. I went after it anyway. StatsBomb’s lineup data for that fixture tagged only two players as starters, because the rest were recorded under a "Tactical Shift" event instead. The fix was to fall back to the Starting XI event, which is authoritative and always contains exactly eleven. The build log now records 517 of 517, with a column noting which source each network’s starters came from — 516 from lineups, one from the fallback. If I hadn’t chased it, I would never have learned that the lineup field can lie, which is the sort of thing that silently corrupts a whole corpus.',
  },
};

/**
 * The co-founded product MoneyMind grew into, shown by name since 2026-09-23 as a
 * low-key "Coming soon" card and nothing more. The frost stays over abstract art
 * (Lucent kit, MoneyMind asset group): never a screenshot, and no page, so
 * /work/moneymind 404s until `heldBack` replaces this at launch.
 */
const moneymind: SoonProject = {
  slug: 'moneymind',
  name: 'MoneyMind',
  kind: 'product',
  page: 'none',
  order: 2,
  year: '2026',
  status: { label: 'Coming soon', kind: 'soon' },
  cardLine: 'An AI money coach',
  frost: true,
};

/**
 * A prototype whose details Mahyar will send (2026-09-23). Until then the card is
 * its name and a status, nothing else: no line, no year, no stack, no claims.
 */
const realest: SoonProject = {
  slug: 'realest',
  name: 'Realest',
  kind: 'prototype',
  page: 'none',
  order: 3,
  status: { label: 'Details soon', kind: 'soon' },
};

/**
 * Directed studies, started Fall 2026. Facts from the Lucent kit's experience list,
 * which Mahyar wrote. No results yet, so it gets a brief page, not a case study —
 * and nothing here may claim an outcome until one exists.
 */
const graphRag: BriefProject = {
  // Renamed from "Graph RAG for FHIR" (2026-09-23); the slug stays so links hold.
  slug: 'graph-rag-fhir',
  name: 'Graph-Native Retrieval for Clinical LLM Agents',
  kind: 'research',
  page: 'brief',
  order: 5,
  year: '2026',
  status: { label: 'In progress', kind: 'progress' },
  cardLine: 'Directed studies, York Data Mining Lab',
  // The name says what it is, the facts row where, and `building` what; the lede is
  // the question the work asks. No outcome until there is one. Also the page's meta
  // description.
  lede: 'Does an agent answering clinical questions do better when it can follow the references between FHIR records?',
  role: 'Directed studies, EECS 4070',
  facts: [
    { label: 'Lab', value: 'York Data Mining Lab' },
    { label: 'Supervisor', value: 'Prof. Manos Papagelis' },
    { label: 'Timeline', value: 'Fall 2026 – Winter 2027' },
  ],
  building: [
    'A graph traversal tool over FHIR references, for clinical LLM agents.',
    // U+2011, a non-breaking hyphen: the benchmark's name never splits across lines.
    'An evaluation on FHIR\u2011AgentBench, measured against published baselines.',
  ],
};

/**
 * Display order is `order`, derived rather than hand-maintained — a hand-kept list
 * once silently dropped Maridian. Six cards, two of each kind, so the grid reads in
 * pairs by kind (products, prototypes, research) and no card is featured; with an
 * odd count the lowest order would span both columns.
 */
export const projects: Project[] = [bowlwise, moneymind, realest, maridian, graphRag, tacticalDna].sort(
  (a, b) => a.order - b.order,
);

/** Projects with a page of their own, for routing. */
export const pagedProjects = projects.filter(
  (p): p is CaseStudyProject | BriefProject => p.page !== 'none',
);

/**
 * A NOTE ON "MULTI-AGENT" — read before writing any copy that uses the phrase.
 *
 * Verified against source, the lineup contains exactly one agent system, and it is
 * a single agent:
 *   - BowlWise  — zero AI. A deterministic scoring function. No model in the request path.
 *   - MoneyMind — ONE agent. A single create_react_agent call, no StateGraph, no
 *                 sub-agents, no supervisor, no handoffs. Its own docs say so plainly:
 *                 "Three layers. One agent."
 *   - Maridian  — claims six agents. UNVERIFIED. The breakdown in the old
 *                 data/caseStudies.js was invented by a previous session.
 *   - Tactical DNA — research, no agents.
 *
 * RESOLVED 2026-08-08: Maridian's six agents are REAL — Triage, Options, Scorer,
 * Decision, Batch Tracker, Recovery Planner, each a module with its own prompt file and
 * tool wiring, chained by a hand-written sequential orchestrator. So "multi-agent" is
 * now supportable, but ONLY about Maridian, and only alongside the contribution note:
 * Mahyar did not write the agents. Never let the phrase migrate to MoneyMind (one
 * agent), BowlWise (no AI), or to a general claim about him in the hero or About.
 */
