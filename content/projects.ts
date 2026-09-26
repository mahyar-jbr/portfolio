import type { BriefProject, CaseStudyProject, Project, SoonProject } from './types';

/**
 * The projects on the site, in display order (`order`).
 *
 * What each entry is written from:
 *   - BowlWise: its verified extract, content/sources/BowlWise_PORTFOLIO_EXTRACT.md,
 *     where every claim traces to a file:line citation.
 *   - Realest, Maridian, Tactical DNA and Graph-Native Retrieval: each project's own
 *     portfolio brief, copied to content/sources/<Name>_PORTFOLIO_BRIEF.md with
 *     anything private or unreleased withheld, and every fact re-checked against the
 *     project's repo and its live links on 2026-09-23. A `source:` comment names the
 *     file in that project's repo that proves the field beside it.
 *   - The MoneyMind card: only what Mahyar has stated. Its verified write-up,
 *     `heldBack`, comes from content/sources/MoneyMindHackathon_PORTFOLIO_EXTRACT.md
 *     and stays unrendered.
 *
 * Editorial standard: present the work as impressively as the facts allow, and
 * never further. On BowlWise that costs nothing — the verified numbers came back
 * larger than the ones the June draft was guessing at. A team project says only
 * what Mahyar built himself, and names no teammate.
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

// HELD BACK (2026-09-22). MoneyMind is becoming a co-founded product. Since
// 2026-09-23 Mahyar shows it by name, but only as the "Coming soon" card
// `moneymind` below: its screenshots and details stay off every public page until
// launch. The one thing shown is the product's face, its gator, as that card's
// banner (Mahyar's choice, 2026-09-23). This verified write-up is kept,
// unrendered, for launch day.
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

/**
 * Maridian: a team of five, five days. Written from Maridian_PORTFOLIO_BRIEF.md;
 * `source:` paths are in the maridian-sentinel repo at b65cfcf. Rewritten
 * 2026-09-23: the team is five, not six. The git identity `r <r@r>` that made it
 * look like six is Mahyar (bc1b5be: "re-trigger Vercel deploy ... (was r@r)").
 */
const maridian: CaseStudyProject = {
  slug: 'maridian',
  name: 'Maridian',
  kind: 'prototype',
  page: 'case-study',
  depth: 'standard',
  order: 4,
  // source: git log, first commit 4b28ece 2026-05-25, last b65cfcf 2026-05-29
  year: '2026',
  // source: git log 2026-05-25 to 2026-05-29; CONTRIBUTORS.md:3 "built in five days"
  status: { label: 'Built in 5 days', kind: 'hackathon' },
  // source: api/agents/orchestrator.py:3 (the six agents); front/line-portal.html (the line operator portal)
  cardLine: 'Six agents triaging defects on a bakery line',
  facts: [
    // source: README.md:145, CONTRIBUTORS.md:3 and the repo description all use this form of the name
    { label: 'Event', value: 'TMLS Agentic Hackathon 2026' },
    // source: CONTRIBUTORS.md:3 "a team of five" and its five rows; LICENSE:4-5 (five names)
    { label: 'Team', value: '5 people' },
  ],

  steps: [
    {
      title: 'Run the analysis',
      // source: front/line-detail.html:811 (Run AI Analysis), :2041-2043 (POST /problems/{id}/analyze/stream);
      // api/routers/production.py:353-412 (the defect event comes from the batch's highest-confidence QC row)
      body: 'The operator opens a flagged line and runs the analysis; the API builds a defect event from that batch’s QC data.',
    },
    {
      title: 'Six agents reason',
      // source: api/agents/orchestrator.py:1-4, 121-232; Recovery Planner runs only on a breach (:214-215)
      body: 'Triage, Options, Scorer and Decision pick an action; Batch Tracker checks the SLA; Recovery Planner runs only on a breach.',
    },
    {
      title: 'A person decides',
      // source: api/routers/production.py:425 (text/event-stream), :463-469 (accepted or overridden);
      // api/contracts.py:93 `ready_to_send: Literal[False]`; front/line-detail.html:1979 (Send to customer disabled).
      // "Each agent's steps", not "live reasoning": orchestrator.py:84-118 drains each agent, then yields its events.
      body: 'Each agent’s steps stream to the screen over SSE; the operator accepts or overrides, and customer emails stay drafts.',
    },
  ],

  // Real screenshots of the team's line operator portal (front/), from a local run on
  // 2026-09-23 with customers shown as the placeholders "Customer A–F". The screens are
  // Mahyar's redesign (bbecba2). The first is also the card: cropped to exactly 4:3, its
  // right edge falls between "Show technical detail" and the Re-run button.
  shots: [
    {
      // source: portfolio-assets/01-agent-reasoning.png, cropped to (0, 0, 1180, 885)
      src: '/work/maridian/agent-run.png',
      width: 1180,
      height: 885,
      alt: 'Maridian’s line operator portal on LINE-3: an Escalate recommendation marked pending, its written reasoning, and the agent reasoning panel with the Triage and Options steps.',
      caption: 'One run on LINE-3: the recommendation, its reasoning, and each agent’s steps.',
    },
    {
      // source: portfolio-assets/02-sla-breach-recovery.png, cropped to (554, 766, 1394, 1179);
      // the draft UI is front/line-detail.html:1976-1980. Same shape as the next shot, so the pair sits level.
      src: '/work/maridian/breach-draft.png',
      width: 840,
      height: 413,
      alt: 'A partial-shipment recovery proposal above a customer fulfillment draft marked “Draft · pending account manager”, with the Send to customer button disabled.',
      caption: 'On an SLA breach, the customer update is only a draft; a person has to send it.',
    },
    {
      // source: portfolio-assets/03-production-lines.png, cropped to (140, 88, 1300, 660)
      src: '/work/maridian/production-lines.png',
      width: 1160,
      height: 572,
      alt: 'The Production Lines overview: 2 of 7 lines running, 5 needing action, 12 active problems and 4 SLA breaches, with each line’s product, defect rate and status.',
      caption: 'The overview: every line’s defect rate and SLA status.',
    },
  ],

  // source: api/agents/orchestrator.py:3; api/agents/runtime.py:27 (claude-haiku-4-5-20251001);
  // api/routers/production.py:463-469 (the operator accepts or overrides)
  oneLiner: 'Six Claude agents that recommend what to do with a flagged bakery defect, for line operators.',

  badges: ['TMLS Agentic Hackathon 2026', 'Team of 5', 'Built in 5 days'],

  // source: api/agents/runtime.py:27; api/requirements.txt:1, 4; api/runtime.txt:1 (python-3.11.9);
  // api/db/schema.sql; api/routers/production.py:425 (SSE); front/*.html (plain HTML, CSS and JS);
  // api/Procfile:1 (Railway). Not Next.js: web/ only redirects to the static pitch page.
  stack: [
    'Claude Haiku 4.5',
    'Anthropic SDK',
    'Python',
    'FastAPI',
    'SQLite',
    'Server-sent events',
    'JavaScript',
    'Railway',
  ],

  links: [
    // Public, 200 signed out (checked 2026-09-23). The repo's old name, TMLS_hacketon-, redirects here.
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/maridian-sentinel', status: 'live' },
    // NO LIVE LINK. Checked 2026-09-23: the Railway API 404s ("Application not found"), so the
    // Vercel portals show "Unable to load lines". The pitch page at fgf-sentinel-web.vercel.app
    // still loads, but every demo button on it leads to those dead portals, and it carries the
    // project's old name. That URL must not ship.
  ],

  // source: docs/fgf-sentinel-briefing.html:867, the team's own problem statement, nearly verbatim
  problem:
    'Cameras on a bakery line can flag defects at line speed, but what happens after the flag is still manual. A QA technician pulls the unit, classifies it, checks specs, phones a coordinator, works out the recovery value and picks an outcome.',

  // source: api/agents/orchestrator.py:121-232 (fixed order); api/agents/runtime.py:199-289 (a hand-written
  // tool-use loop; no agent framework in api/requirements.txt); api/db/schema.sql (seeded SQLite)
  approach:
    'Six agents run in a fixed order, each a Claude tool-use loop over a seeded SQLite database, with no agent framework. They recommend; the operator decides.',

  // source: CONTRIBUTORS.md:21 "Fri: live demo at TMLS 2026"; docs/internal/BACKLOG.md:5 "Demo: Friday May 29";
  // the Railway API 404s and the portal shows "Unable to load lines" (checked 2026-09-23)
  result:
    'We demoed it live at the TMLS Agentic Hackathon 2026 on May 29. The hosted API is gone now, so the demo no longer loads; the code is on GitHub.',

  metrics: [
    {
      value: '32.6 s',
      label: 'One full analysis, all six agents',
      source:
        'The UI timer in portfolio-assets/01-agent-reasoning.png (front/line-detail.html:2034, 2076-2078), a local run on 2026-09-23 that breached, so all six ran; the team logged 30–40 s a run in 87848c8',
    },
    {
      value: '11',
      label: 'Tools the agents call, over 14 tables',
      source: 'api/tools/: 12 tool specs, 11 imported by api/agents/*.py; api/db/schema.sql: 14 CREATE TABLE',
    },
    {
      value: '245',
      label: 'Commits in 5 days, team of 5',
      source: 'git rev-list --count HEAD, 4b28ece (2026-05-25) to b65cfcf (2026-05-29); team per CONTRIBUTORS.md:3',
    },
  ],

  contribution: {
    // source: CONTRIBUTORS.md:9 "Infrastructure Lead · Coordinator"
    role: 'Infrastructure lead and coordinator',
    teamSize: 5,
    // source: dd3898a (Mahyar: the monorepo, and the contract whose `ready_to_send: Literal[False]` is now
    // api/contracts.py:93); docs/internal/BACKLOG.md:164-165 (Vercel and Railway deploys, owner Mahyar);
    // bbecba2 (Mahyar's redesign of the screens shown; git blame gives him 1,897 of 2,143 lines of
    // front/line-detail.html). "Redesigned", not "built": a teammate made the first version.
    owned:
      'I set up the monorepo, the Vercel and Railway deploys, and the API contract, where a customer email draft can never be marked ready to send. I also redesigned the operator portal shown here; teammates built the agents, tools and database.',
  },
};

/**
 * Tactical DNA: solo coursework. Written from TacticalDNA_PORTFOLIO_BRIEF.md;
 * `source:` paths are in the tactical-dna repo at b300747, and FR is its
 * final-report.pdf. Figures are the three decimals Mahyar published (README.md:226-235).
 */
const tacticalDna: CaseStudyProject = {
  slug: 'tactical-dna',
  name: 'Tactical DNA',
  kind: 'research',
  page: 'case-study',
  depth: 'standard',
  order: 6,
  // source: FR p.2 "Submitted, Spring 2026"; git log (both commits 2026-06-09)
  year: '2026',
  status: { label: 'Research', kind: 'research' },
  // source: FR p.1 §1, the central hypothesis
  cardLine: 'Does a coach leave a fingerprint on passing?',
  // source: README.md:3; FR p.1
  facts: [{ label: 'Course', value: 'EECS 4414 Information Networks' }],

  // One match traced through the pipeline; the lead shot is the same match.
  steps: [
    {
      title: 'Build the graph',
      // source: outputs/phase1_build_log.csv, match 69299 (2010-11-29, 11 nodes, 296 passes, first sub minute 45)
      body: 'Barcelona 5–0 Real Madrid, 29 November 2010: 296 completed passes between the eleven starters, up to the first substitution in minute 45.',
    },
    {
      title: 'Measure it',
      // source: src/phase3_p1.py feature_columns() (5 centralities x 4 statistics, 16 triad fractions, 8 global)
      body: '44 features: 8 global, 20 centrality and 16 three-player motif fractions.',
    },
    {
      title: 'Use it three ways',
      // source: outputs/features_all.csv (69299 is Guardiola's: a ground-truth label, not a prediction);
      // outputs/p2_embedding_coords.csv (cluster 1, "Possession" in src/deck_template.py:492);
      // outputs/p3_appearances.jsonl and outputs/player_roles.csv (all eleven starters profiled)
      body: 'Labelled Guardiola for the coach models, placed in the possession cluster, and counted in all eleven starters’ role profiles.',
    },
  ],

  shots: [
    {
      // source: portfolio-assets/04-clasico-passing-network.png (= outputs/example_network.png), cropped to
      // x 68, y 121, 1480 x 1110: drops the matplotlib title and colour bar, exactly 4:3 for the card
      src: '/work/tactical-dna/clasico-network.png',
      width: 1480,
      height: 1110,
      alt: 'Barcelona’s passing network from the 5–0 Clásico: eleven player nodes joined by arrows, with Xavi the largest node, at the centre',
      // source: the figure's own title (src/summarize_phase2.py:158-162)
      caption: 'Barcelona 5–0 Real Madrid, 2010: nodes sized and coloured by PageRank.',
    },
    {
      // source: portfolio-assets/01-coach-id-results.png (deck slide 7), cropped to x 72, y 40, 1280 x 700:
      // drops the deck's counter, dots and progress bar
      src: '/work/tactical-dna/coach-id-results.png',
      width: 1280,
      height: 700,
      alt: 'Slide “A modest signal, and an honest catch”: coach-identification accuracy for four models under random and leakage-free folds, beside a confusion matrix for eight Barcelona coaches',
      caption: 'Coach identification under random and season-grouped folds, with the confusion matrix.',
    },
    {
      // source: portfolio-assets/03-player-role-search.png (deck slide 10), the same crop as the slide above;
      // src/build_viz.py:86-92 (ten nearest neighbours, self dropped)
      src: '/work/tactical-dna/player-role-search.png',
      width: 1280,
      height: 700,
      alt: 'Slide “Type a player, watch its structural twins light up”: Xavi typed into the search box, his nearest neighbours ringed on a map of players coloured by position',
      caption: 'The deck’s live search: a player’s ten nearest structural neighbours light up.',
    },
  ],

  // source: FR p.1 §1 ("applications in opponent scouting, recruitment"; the central hypothesis)
  oneLiner:
    'Passing-network analysis for football scouting: does a coach leave a measurable fingerprint on how a team passes?',

  badges: ['Research', 'EECS 4414 Information Networks', 'Solo'],

  // source: src/features.py:43; src/phase3_p1.py:45-56; src/problem3_roles.py:326; requirements.txt:3;
  // src/build_viz.py:29
  stack: ['Python', 'NetworkX', 'scikit-learn', 'XGBoost', 'UMAP', 'pandas', 'Plotly'],

  links: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/tactical-dna', status: 'live' },
    // NOT YET: the GitHub Pages deck (outputs/viz/presentation.html). On a desktop it all works
    // (checked 2026-09-23); on phones it doesn't: iPhone taps don't advance the slides and the text
    // renders at about 6px, and Android crops every slide on both sides. Slide 6 also says
    // "50-dim fingerprint" where the code has 44. Link it once those are fixed.
  ],

  // source: FR p.1 abstract ("debated qualitatively but rarely measured") and §1 ("most studies are
  // descriptive"; the hypothesis, "strong enough to be recovered by a classifier")
  problem:
    'Coaches, pundits and fans talk about “possession football” or “gegenpressing”, but rarely measure it. Most passing-network studies describe one team or a few matches; I tested whether a coach leaves a signature on passing that a classifier can recover.',

  // source: outputs/features_all.csv (775 rows); FR p.1 abstract (directed weighted graphs of completed passes);
  // src/sb_cache.py:26. Naming StatsBomb credits the data, which its licence requires (README.md:110-112).
  approach:
    'I turned StatsBomb open data into 775 passing networks, one per team per match: players are nodes, and each edge counts one player’s completed passes to another. One match, traced step by step:',

  // source: FR p.1-2 ("Submitted, Spring 2026"); deck slide 7 ("collapses it to 0.250", src/deck_template.py:432-455);
  // FR abstract ("largely bound to the club and its roster rather than to the coach"; roles recover position
  // "strongly")
  result:
    'Submitted as my EECS 4414 final project in 2026, with the code and report public on GitHub. The coach signal collapsed once whole seasons were held out, so the report ties passing structure to the club and its roster rather than the coach; the player-role result held up.',

  metrics: [
    {
      value: '775',
      label: 'Passing networks from 42 teams',
      source: 'outputs/features_all.csv: 775 rows (517 Barcelona, 256 World Cup, 2 Bayern), 42 distinct teams',
    },
    {
      value: '0.358 → 0.250',
      label: 'Random-forest coach accuracy, random vs season-grouped folds (0.263 majority baseline)',
      source: 'outputs/phase3_p1_results.csv: 0.35780 and 0.24984; majority baseline 0.26306 = 136/517',
    },
    {
      value: '0.883',
      label: 'Position purity among each player’s 5 nearest neighbours (0.295 random)',
      source: 'outputs/p3_position_purity.csv row 2: 1,196 of 1,355 slots (271 players x 5)',
    },
  ],

  decisions: [
    {
      decision: 'Score the coach models on season-grouped folds too',
      // source: src/phase3_p1.py:248-252, the reason as the code records it
      why: 'Each coach held contiguous seasons and rosters change yearly, so random folds let same-season matches leak across the split, partly measuring which season instead of which coach.',
    },
  ],

  // Solo: `role` fills the summary row and no "My role" section renders.
  // source: git shortlog (one author); FR p.1 (one author)
  contribution: {
    role: 'Solo',
    teamSize: 1,
    owned: 'Data pipeline, network construction, feature engineering, all three analyses, the report and the presentation',
  },
};

/**
 * The co-founded product MoneyMind grew into, shown by name since 2026-09-23 as a
 * low-key "Coming soon" card and nothing more. Its banner is the product's face,
 * the gator at his desk, which Mahyar chose to show (2026-09-23), and a tap on
 * it brings up its moose to say it's too early (2026-09-25). Still never a
 * screenshot or a detail, and no page, so /work/moneymind 404s until `heldBack`
 * replaces this at launch.
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
  // Mahyar's clip (a-gator-desk.mp4), cut to a 3.9s loop that ends where it starts.
  video: {
    src: '/work/moneymind/gator-desk.mp4',
    poster: '/work/moneymind/gator-desk.jpg',
    width: 1280,
    height: 720,
    description: 'A gator in a suit reads The Swamp Times at his desk, behind a nameplate that says A. Gator.',
  },
  // Tapped, the card has no page to open, so MoneyMind's moose (Mahyar's cutout,
  // m-moose-coffee.cutout.webp, 2026-09-25) comes up with his coffee to say so:
  // "its too early and dont rush", in Mahyar's words. The no-break spaces keep
  // the dash off the start of a line and "I" with its verb when the bubble wraps.
  cameo: {
    image: { src: '/work/moneymind/moose.webp', width: 243, height: 512 },
    line: 'Too early. Don’t rush\u00a0— I\u00a0haven’t finished my coffee.',
  },
};

/**
 * Realest: a team of four, built in a day. Written from Realest_PORTFOLIO_BRIEF.md;
 * `source:` paths are in the realest repo (AamelAI/realest, main at a980bf2).
 */
const realest: CaseStudyProject = {
  slug: 'realest',
  name: 'Realest',
  kind: 'prototype',
  page: 'case-study',
  depth: 'standard',
  order: 3,
  // source: git log, 2026-09-12 02:51 to 2026-09-13 01:04 (-0400)
  year: '2026',
  // source: README.md:25 "Built in a day by AAMEL at Agents, Everywhere"
  status: { label: 'Built in a day', kind: 'hackathon' },
  // source: README.md:6-8, 43 ("Realest makes those calls for you")
  cardLine: 'Calls listing agents so renters don’t have to',
  // The product's own icon, byte-identical to web/app/icon.svg (the live page's, commit d2591da)
  mark: '/work/realest/mark.svg',
  facts: [
    // source: README.md:25 "Agents, Everywhere: Bots, Channels & More · Toronto · 12 September 2026"
    { label: 'Event', value: 'Agents, Everywhere: Bots, Channels & More' },
    // source: TODO.md:43 ("all four have pulled it"); git shortlog (four people)
    { label: 'Team', value: '4 people' },
  ],

  // The loop in the order it runs.
  steps: [
    {
      title: 'Say what you want',
      // source: server/main.py:361-403 (/agent/preferences ranks; SHORTLIST_SIZE = 4 at :49);
      // 104 = the rentals.ca rows scripts/scrape_rentals.py keeps (124 scraped), recounted 2026-09-23
      body: 'The renter phones in and describes the place. The backend ranks 104 Toronto listings and keeps four.',
    },
    {
      title: 'Call every listing at once',
      // source: server/calls.py:336-379 (fan_out: asyncio.gather, one call per listing);
      // agent/listing-prompt.txt:1 "Identify yourself as an AI in your FIRST sentence, always."
      body: 'On “call them”, one outbound call per listing goes out in parallel, each opening by saying it is an AI.',
    },
    {
      title: 'Re-rank on the answers',
      // source: server/calls.py:583-600 (transcript to CallOutcome, structured output); server/listings.py:41-47,
      // 148-216 (real rent is listed rent plus add-ons; a leased unit sinks); web/components/Listings.tsx:137-146
      body: 'Each transcript becomes a typed outcome. Real rent replaces listed rent, leased units sink, and the cards slide into place.',
    },
  ],

  // Real screenshots of the page a renter watches. The names on them (Nadia, Dana, Raj,
  // Mark, Priya) are made up (scripts/scrape_rentals.py:94-97); the listings are public.
  shots: [
    {
      // source: portfolio-assets/realest-loop.png (= docs/media/realest-loop.png, README.md:56-59), not cropped.
      // Its gutters are transparent, so they take the page's ground in either theme. The card shows its top 4:3.
      src: '/work/realest/three-states.png',
      width: 1680,
      height: 1456,
      alt: 'The shortlist in three states: four Toronto listings reordered after the renter says parking matters most, all four on the phone at once, then rewritten from the calls as booked, no answer, over budget and leased',
      caption: 'One demo session: reordered by “parking matters most”, four calls in flight, then rewritten from the answers.',
    },
    {
      // source: portfolio-assets/02-detail-sheet.png, cropped to x 280-1160, y 40-870. The demo board's own
      // state (web/lib/mock.ts): a visitor who opens the demo board sees the same sheet.
      src: '/work/realest/detail-sheet.png',
      width: 880,
      height: 830,
      alt: 'The detail sheet for 322 Dupont Street: $3,470 a month, the listed $3,290 struck through with +$180/mo, and what the agent said: over the $3,400 budget, parking $180',
      caption: 'Listed at $3,290, really $3,470 once the $180 parking is in.',
    },
  ],

  // source: README.md:3-8
  oneLiner:
    'A voice agent that phones Toronto listing agents for renters and re-ranks their shortlist while they watch.',

  badges: ['AI Tinkerers hackathon', 'Team of 4', 'Built in a day'],

  // source: server/voice/elevenlabs.py:19-23; server/calls.py:233-236 (Twilio); server/calls.py:583-600 and
  // server/chat.py:36-41 (OpenAI); pyproject.toml (Python 3.12, FastAPI); web/package.json (Next.js 15, React 19, TS)
  stack: ['ElevenLabs', 'Twilio', 'OpenAI', 'Python', 'FastAPI', 'Next.js', 'React', 'TypeScript'],

  links: [
    // Checked 2026-09-23 in Chromium and WebKit at 390px and 1280px: 200, no failed requests
    // or console errors, and a tapped card opens its detail sheet. It is the static template
    // board (web/app/page.tsx: "Static mock data, polling off"), so it outlives the backend;
    // "Demo board" so nobody takes it for a live session. Never link /s/<id>: without a
    // phone call it is an empty "Connecting" board.
    { label: 'Demo board', href: 'https://realest-kohl.vercel.app', status: 'live' },
    // Public: 200 signed out; the GitHub API says visibility "public".
    { label: 'GitHub', href: 'https://github.com/AamelAI/realest', status: 'live' },
    // Not the YouTube demo the README links: it is on a teammate's own channel, and this
    // page would label it "Live".
  ],

  // source: README.md:41; docs/SUBMISSION.md:9
  problem:
    'Toronto rental listings are often wrong: already leased, parking extra, pet policy unknown. The only way to know is to phone every listing agent yourself and play voicemail tag.',

  // source: README.md:49 (the link is texted at pickup); README.md:108, 177 (one session store, two channels);
  // server/main.py:120-133 (/api/state); web/lib/usePolling.ts:31-34 (intervalMs = 1200)
  approach:
    'While the renter talks to the agent, a page texted to their phone shows the shortlist. The agent writes to one session; the page reads it every 1.2 seconds.',

  // source: README.md:25 (event, Toronto, date); docs/SUBMISSION.md:82 ("for AI Tinkerers"); README.md:67,
  // 302, 310 (real calls on the day, each to a teammate's phone); README.md:23, 303 (the recorded demo is
  // scripted); the demo board checked 2026-09-23
  result:
    'Built in a day at Agents, Everywhere, an AI Tinkerers hackathon in Toronto. Real calls worked on the day, to teammates playing listing agents; the recorded demo uses scripted ones, and the demo board is still online.',

  metrics: [
    {
      value: '104',
      label: 'Real Toronto rentals, ranked on every brief',
      source:
        'scripts/scrape_rentals.py: 124 rows from rentals.ca, 104 kept once MIN_RENT drops room shares; README.md:304',
    },
    {
      value: '4',
      label: 'Listing agents called at once, one per card',
      source: 'SHORTLIST_SIZE = 4 (server/main.py:49); asyncio.gather in fan_out (server/calls.py:336-379)',
    },
  ],

  contribution: {
    // source: TODO.md:29, Mahyar's D3 lane ("Data + the page — listings, rank(), the live surface")
    role: 'Ranker and live page',
    teamSize: 4,
    // source: git blame server/listings.py (commit 48c6c22) and web/components (Listings, DetailSheet, Money,
    // CallsPanel: all his); commits 812c7ed, 09e718f, 2b64d47, 90a8e1f; 48c6c22 "Vercel project live"
    owned:
      'I wrote the ranker that orders every shortlist and built the page the renter watches: the sliding reorder, the rent corrections and the detail sheet. I also deployed it on Vercel.',
  },
};

/**
 * Directed studies, Fall 2026. Written from GraphRetrieval_PORTFOLIO_BRIEF.md;
 * `source:` paths are in the project's private repo. No results yet, so it gets a
 * brief page, not a case study, and nothing here may claim an outcome until one exists.
 */
const graphRag: BriefProject = {
  // Renamed from "Graph RAG for FHIR" (2026-09-23); the slug stays so links hold.
  slug: 'graph-rag-fhir',
  // source: README.md:1
  name: 'Graph-Native Retrieval for Clinical LLM Agents',
  kind: 'research',
  page: 'brief',
  order: 5,
  // source: git log (first commit 2026-09-23)
  year: '2026',
  // source: code/src/ holds only .gitkeep; there is no results/
  status: { label: 'In progress', kind: 'progress' },
  // source: CLAUDE.md:3-4
  cardLine: 'Directed studies, York Data Mining Lab',
  // What it is and what it asks, without repeating the title; no outcome. Also the
  // page's meta description. source: README.md:6-8
  lede: 'Giving AI agents a way to follow the links between a patient’s FHIR records, and measuring whether it helps.',
  // source: CLAUDE.md:4 ("Student: Mahyar Jaberi"); git log (one author)
  role: 'Student researcher (solo)',
  facts: [
    // source: README.md:3
    { label: 'Course', value: 'EECS 4070 Directed Studies' },
    // source: CLAUDE.md:4
    { label: 'Lab', value: 'York Data Mining Lab' },
    // source: README.md:4
    { label: 'Supervisor', value: 'Prof. Manos Papagelis' },
    // source: README.md:3 and CLAUDE.md:3 ("Fall 2026"). Was "Fall 2026 – Winter 2027", from the
    // Lucent kit; the repo names only the Fall 2026 term.
    { label: 'Timeline', value: 'Fall 2026' },
  ],
  building: [
    // source: CLAUDE.md:14-15 (the research question); code/FHIR-AgentBench/tools/resource_tools.py:12-47
    // (the benchmark's tools fetch every record of a type, or one record by ID)
    'A tool that follows the links between FHIR records in one call, instead of the agent fetching each linked record itself.',
    // source: CLAUDE.md:14-15, :40 (same model, judge, prompts, server and split). Not "against published
    // baselines": that model retires on Oct 23, 2026, so published numbers are reference points (:35-36, :55).
    // U+2011, a non-breaking hyphen: the benchmark's name never splits across lines.
    'A test on FHIR‑AgentBench: the same agent, model, judge and questions, run with and without the tool.',
    // source: notes/log/2026-09-23.md:10 (pinned at bbb42909), :13 (all files match SHA256SUMS.txt; 928,935
    // resources, 100 of them Patient), recounted 2026-09-23. Dated on purpose: update it after the first run.
    'As of September 2026: the benchmark is pinned and the data, 928,935 FHIR records for 100 patients, is checksum-verified. No results yet.',
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
 *   - Realest   — (added 2026-09-23) two ElevenLabs voice agents: one answers the
 *                 renter, the other places each call to a listing. Teammates built
 *                 them; Mahyar built the ranker and the page.
 *
 * RESOLVED 2026-08-08: Maridian's six agents are REAL — Triage, Options, Scorer,
 * Decision, Batch Tracker, Recovery Planner, each a module with its own prompt file and
 * tool wiring, chained by a hand-written sequential orchestrator. So "multi-agent" is
 * now supportable, but ONLY about Maridian, and only alongside the contribution note:
 * Mahyar did not write the agents. Never let the phrase migrate to MoneyMind (one
 * agent), BowlWise (no AI), Realest (voice agents he didn't write), or to a general
 * claim about him in the hero or About.
 */
