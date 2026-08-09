import type { Project } from './types';

/**
 * The four projects, in display order.
 *
 * BowlWise is complete — every claim below traces to a file:line citation in
 * `content/BowlWise_PORTFOLIO_EXTRACT.md`. The other three are stubs awaiting
 * their own extraction pass.
 *
 * Editorial standard: present the work as impressively as the facts allow, and
 * never further. On BowlWise that costs nothing — the verified numbers came back
 * larger than the ones the June draft was guessing at.
 */

const bowlwise: Project = {
  slug: 'bowlwise',
  name: 'BowlWise',
  kind: 'product',
  depth: 'deep',
  order: 1,

  oneLiner:
    'A dog food recommendation engine that scores 260 products against veterinary nutrition standards — live on tablets in two Pet Valu stores.',

  badges: ['Live in production', 'Solo build', 'BowlWise Inc.'],

  stack: ['React', 'Vite', 'FastAPI', 'Python', 'Pydantic', 'MongoDB', 'Docker'],

  links: [
    { label: 'bowlwise.app', href: 'https://bowlwise.app', status: 'live' },
    // No public repo. Highest-ROI fix available: extract the scoring engine to a
    // standalone public repo with its tests — it's the most interesting code here
    // and the only thing currently unviewable.
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
// Awaiting extraction. Run content/PROJECT_EXTRACTION_PROMPT.md in each repo.
// ---------------------------------------------------------------------------

const moneymind: Project = {
  slug: 'moneymind',
  name: 'MoneyMind',
  kind: 'prototype',
  depth: 'deep',
  order: 2,

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

const maridian: Partial<Project> = {
  slug: 'maridian',
  name: 'Maridian',
  kind: 'prototype',
  depth: 'standard',
  order: 3,
  badges: ['TMLS 2026 Agentic AI Hackathon', 'Technical Lead'],
  links: [
    // Deploy is DEAD. The old fgf-sentinel-web.vercel.app link must not ship.
  ],
  // TODO: the six-agent breakdown in the old data/caseStudies.js was INVENTED by a
  // previous session and never confirmed. It cannot be reused. Needs the real agents
  // from the repo, and screenshots — with no live demo, imagery is the only proof.
};

const tacticalDna: Project = {
  slug: 'tactical-dna',
  name: 'Tactical DNA',
  kind: 'research',
  depth: 'standard',
  order: 4,

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

export const projects = [bowlwise, moneymind, maridian, tacticalDna];
export const completeProjects: Project[] = [bowlwise, moneymind, tacticalDna];

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
 * So "multi-agent systems" is not currently supportable anywhere on this site. The
 * locked tagline deliberately says "AI agent systems". If Maridian's extract confirms
 * six real coordinated agents, this changes — until then it does not.
 */
