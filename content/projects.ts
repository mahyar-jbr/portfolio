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
 *   - Palimpsest: its portfolio brief, portfolio-assets/PORTFOLIO_BRIEF.md in its own
 *     private repo (Nov 2, 2026), where every fact cites a file:line. Not copied here.
 *   - Landline: its own portfolio brief, kept in the team's repo; its entry says which facts are his.
 *   - The MoneyMind card: only what Mahyar has stated. Its verified write-up,
 *     `heldBack`, comes from content/sources/MoneyMindHackathon_PORTFOLIO_EXTRACT.md
 *     and stays unrendered.
 *
 * Editorial standard: present the work as impressively as the facts allow, and
 * never further. On BowlWise that costs nothing — the verified numbers came back
 * larger than the ones the June draft was guessing at. A team project says only
 * what Mahyar built himself, and names no teammate.
 *
 * No page tells a war story any more ("remove what broke", Mahyar, 2026-09-25).
 * BowlWise's and MoneyMind's stay, verified, in their extracts in content/sources/.
 */

/**
 * BowlWise, rewritten 2026-11-02 from the project's own brief,
 * Pet-AI-Assistant/portfolio-assets/PORTFOLIO_BRIEF.md (local main at ce2d522,
 * production at 408fda8), which replaces the extract named above. `brief §n` and
 * `brief An` below point into it; every claim there cites a file, a command or
 * Mahyar. Nothing it marks private is on this page or in these comments.
 *
 * Mahyar's own answers (brief §12, 2026-11-02): still on tablets in both stores,
 * launched in April 2026, no visitor totals to cite (the first-month visitors
 * metric is gone), more than 200 dog profiles, and the work credited to him alone.
 */
const bowlwise: CaseStudyProject = {
  slug: 'bowlwise',
  name: 'BowlWise',
  kind: 'product',
  page: 'case-study',
  depth: 'deep',
  order: 1,
  // source: brief §1 (the launch year)
  year: '2026',
  // brief §1: live at bowlwise.app, and on tablets in two Pet Valu stores (Mahyar, 2026-11-02)
  status: { label: 'Live in stores', kind: 'live' },
  // source: brief §1
  cardLine: 'Scores 265 dog foods against your dog',
  // The product's own app icon, byte-identical to its frontend/public/icon.svg (brief §10)
  mark: '/work/bowlwise/mark.svg',
  // brief §0 and §12: still on tablets in both stores, and launched in April 2026 (Mahyar,
  // 2026-11-02; ROADMAP.md:11, and commit 9ba5e15 marks the launch shipped)
  facts: [
    { label: 'In stores', value: 'Pet Valu Oak Ridges and Aurora' },
    { label: 'Launched', value: 'April 2026' },
  ],

  // brief §6: the three beats, in the order a request runs
  steps: [
    {
      title: 'Describe your dog',
      // source: brief §0 (8 steps, no sign-in: frontend/src/form/steps.js:9-12, backend/pet_routes.py:46-48),
      // §5 (size, age, activity, allergies); the weight goal and the health conditions it asks are in the
      // brief's own screens (results.png: "holding weight"; form-tablet.png: step 6 of 8)
      body: 'An eight-step form: size, age, activity, weight goal, allergies and any health conditions. No account needed.',
    },
    {
      title: 'Score every food',
      // source: brief §6 (backend/on_offer.py:62-87; backend/engine.py:2059-2124, 1398-1406, 1717-1735;
      // backend/import_products.py:273-274)
      body: 'Complete diets for the dog’s life stage, minus any with an allergen or the wrong kibble size, are scored out of 100 on six factors, on dry‑matter values worked out at import.',
    },
    {
      title: 'Ask why',
      // source: brief §6 (backend/chat_agent.py:421, 955; backend/abilities.py:178; backend/connector.py:500)
      body: 'Claude calls tools that run the same engine and writes its answer around their numbers: in Ask BowlWise on the site, or in Claude itself through the connector.',
    },
  ],

  // Real screenshots from the brief's portfolio-assets (§10), taken 2026-11-02 and copied
  // as they are (their PNGs hold no metadata). home.png is the live site; the others are a
  // local build of ce2d522 with a made-up dog, Maple. Captions and alt text are the brief's.
  // The card shows its own crop of the first (`cover`, below). Not used: ask-bowlwise.png, the
  // homepage's scripted demo (the live answer below replaces it); form-tablet.png, whose
  // 1.44 shape can't sit level in a pair and whose "143 foods fit Maple" bowl the results
  // band already shows; card.png, a crop of food-detail.png; and the points chart, a chart
  // rather than a screen of the product.
  shots: [
    {
      src: '/work/bowlwise/home.png',
      width: 2880,
      height: 1800,
      alt: 'The BowlWise homepage: a headline, a box for a dog’s name, and an Orijen bag in a score ring reading 99 of 100 for a sample dog named Troy.',
      caption: 'The BowlWise homepage: type a dog’s name, see a food scored for a sample dog.',
    },
    {
      src: '/work/bowlwise/results.png',
      width: 2880,
      height: 1800,
      alt: 'BowlWise results for a sample dog named Maple: a blue band saying 143 foods fit, then the best kibble, gently cooked, air-dried and freeze-dried food, each with a score out of 100.',
      caption: 'Results for one dog: 143 foods fit, the best of each kind first.',
    },
    {
      src: '/work/bowlwise/food-detail.png',
      width: 2880,
      height: 1800,
      alt: 'An opened food: an Acana bag in a six-part score ring, 99 of 100 for Maple, 1st of 83, and the 99 points split by part.',
      caption: 'One food opened: its score for this dog and where each point comes from.',
    },
    {
      // A real answer: one model call on the local server (brief §10, §12 question 9).
      // The panel is scrolled to the end of the answer, so the question is out of view.
      src: '/work/bowlwise/ask-bowlwise-live.png',
      width: 2880,
      height: 1800,
      alt: 'The BowlWise results page for a sample dog named Maple, with the Ask BowlWise panel open on the right. The answer lists the points an Acana food earned on each part and says it lost 1 point on price. A card below shows its score of 99 out of 100.',
      caption: 'Ask BowlWise answering a real question about a sample dog, next to that dog’s results.',
    },
  ],
  // The card's crop of home.png: x 327-2527, y 150-1800 (2200x1650, exactly 4:3). It drops
  // the homepage's own nav bar, which sat right where the card's status label goes, and
  // keeps the whole hero with even margins. Cut with sharp, then stripped to IHDR, IDAT, IEND.
  // cardFocus: on the wide "Next project" card (16:6) the crop keeps the band with the whole
  // headline above the caption; the 4:3 cards show the whole cover anyway.
  cover: {
    src: '/work/bowlwise/cover.png',
    width: 2200,
    height: 1650,
    cardFocus: '50% 26%',
    alt: 'The BowlWise homepage: a headline, a box for a dog’s name, and an Orijen bag in a score ring reading 99 of 100 for a sample dog named Troy.',
  },

  // source: brief §2 (README.md:3-8; A1; backend/connector.py:108)
  oneLiner:
    'For dog owners in Canada: BowlWise scores 265 dog foods for your dog, explains each score, and answers questions on its site or in Claude.',

  badges: ['Live in production', 'Solo build', 'BowlWise Inc.'],

  // brief §7, its first six items in its order (Clerk sign-in and the Vercel and Railway
  // hosting left off). Docker is gone: it now only rehearses the build and runs the test
  // database (brief §0, §7).
  stack: ['Python', 'FastAPI', 'Claude API', 'MCP', 'MongoDB Atlas', 'React', 'Vite', 'Pydantic'],

  links: [
    // Checked 2026-11-02 (brief A9): 200 on /, /claude and /scoring.
    { label: 'bowlwise.app', href: 'https://bowlwise.app', status: 'live' },
    // No repo link: the GitHub repo is private and 404s to visitors (brief §3). No link to
    // the connector's listing either: it answers a script with a bot check (403), so it
    // can't be verified here; bowlwise.app/claude links it.
  ],

  // source: brief §5 (README.md:3-4; frontend/src/components/home/HomeHero.jsx:168; backend/utils/dmb.py:3-6).
  // "Dry-matter" in this entry's copy has U+2011, a non-breaking hyphen, so it never splits across lines.
  problem:
    'Dog owners in Canada have to choose one food among many brands and formats, for a dog with its own size, age, activity and allergies. So they guess, or compare labels whose as-fed numbers mislead: a food that is 70% moisture reads 11% protein, which is 37% on a dry‑matter basis.',

  // source: brief §9.1 (backend/abilities.py:18-19: "so the chat, the connector and the page agree");
  // §0: a Claude agent with 15 tools (backend/chat_agent.py:101, 301-375), a read-only MCP server with
  // 7 (backend/connector.py:257-260, 279, 290), health data never reaches the chat (held by tests)
  approach:
    'One scoring engine, three ways in: the results page, Ask BowlWise (the chat on the site), and a connector inside Claude. Ask BowlWise is a Claude agent with 15 tools; the connector is a read-only MCP server with 7. Both read every number from the engine, so all three agree. A dog’s health details never reach the chat.',

  // source: brief §3 (bowlwise.app 200; the chat switched on, GET /api/chat/texts enabled: true);
  // §0 and §12 (on tablets in two Pet Valu stores; listed in Claude's connector directory, Mahyar,
  // 2026-11-02); §4 (solo: every commit is his). "In Claude's connector directory", never a partnership.
  result:
    'Live at bowlwise.app and on tablets in two Pet Valu stores. Ask BowlWise answers questions on the site, and the connector is listed in Claude’s connector directory, so an owner can get the same scores inside Claude. I built it alone, from the engine to the connector.',

  // brief §8, plus the dog profiles Mahyar gave (§12). Nothing private: no store, chat or
  // connector counts.
  metrics: [
    {
      value: '265',
      label: 'Dog foods scored, from 15 brands',
      source:
        'backend/product_data.csv counted with csv.DictReader: 265 rows, 15 brands (brief A1); live GET /api/home agreed, 2026-11-02',
    },
    {
      value: 'More than 200',
      label: 'Dog profiles created',
      source: 'Mahyar, production count, November 2026 (brief §0 and §12, question 3: “more than 200”)',
    },
    {
      value: '111 of 111',
      label: 'Chat eval cases passed',
      source:
        'The eval run of 2026-10-14, played as 189 conversations; the agent, its tools, the engine and the catalog are unchanged since (brief §0, A8)',
    },
    {
      value: '30 of 30',
      label: 'Claude answers passed the connector’s checks',
      source:
        'Commit 18d79da (2026-10-11): 30 of 30 with the server’s instructions, 29 of 30 with the tools alone; the connector is unchanged since (brief §0)',
    },
    {
      value: '14 ms',
      label: 'Median time to score all 265 foods',
      source:
        'engine.score_catalog over the 265 foods, 1,000 timed runs after a warm-up, no network or database: median 14.07 ms, p95 20.70 ms (brief A7, 2026-11-02)',
    },
    {
      value: '6,393',
      label: 'Public backend tests passing',
      source: 'pytest tests/ on 2026-11-02, counting the public tests only (brief §8, A3)',
    },
    {
      value: '35',
      label: 'Public API routes, all rate-limited',
      source:
        'Routes counted as backend/tests/app_files.app_routes() does, each with its own rate limit (brief §0, A5; backend/tests/test_routes_stay.py:27-67)',
    },
  ],

  // brief §9, both decisions as it gives them
  decisions: [
    {
      decision: 'One engine behind every number',
      // source: backend/abilities.py:18-19 (343f3e0); backend/chat_agent.py:217-218, 42-45, 104-105
      why: 'The chat and the connector read every number through one module over the results page’s engine, so the chat, the connector and the page agree. The model only writes words: its instructions forbid stating a score or number from memory, and the cards beside an answer are built from tool results, never from its text. The trade-off is tool calls: up to 6 model calls and 8 tool calls a turn.',
    },
    {
      decision: 'Dry matter at import, not per request',
      // source: backend/utils/dmb.py:1-10 (a4a0f2f), :25-28 ("We never invent moisture")
      why: 'As-fed numbers make wet foods look low in protein, so every nutrient is converted to a dry‑matter basis when the catalog is imported, and converting once spares the engine the work on every request. A food with no moisture figure gets no dry‑matter value: moisture is never invented.',
    },
  ],

  // Solo: `role` fills the summary row and no "My role" section renders. source: brief §4, §12
  // question 7 (every commit is his; only Mahyar is credited)
  contribution: {
    role: 'Founder and sole engineer',
    teamSize: 1,
    owned: 'Everything: the scoring engine, Ask BowlWise and the connector, the backend and frontend, the catalog, CI and deployment',
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
    'Every budgeting app remembers your transactions. None of them remember you. Telling Mint that you’re bulking this month, or that there’s a birthday party this week, is impossible, so the advice stays generic and the app stays passive, waiting for you to open it and read a pie chart you already understand.',

  approach:
    'A single agent with a memory of the person, not just the ledger. Behavioural observations are written as first-class "memories," embedded with Voyage AI at 1024 dimensions and retrieved by vector search on MongoDB Atlas, so the agent recalls context by meaning rather than keyword. It runs as a LangGraph ReAct loop over 18 purpose-built tools (memory, goals, budgets, interventions, analytics) plus read-only MongoDB access through MCP, and streams its answer back through three services on a single asyncio event loop. Statements arrive as CSV or PDF and are parsed by a separate Gemini multimodal pass.',

  result:
    'Built in 19 days for the Google Cloud Rapid Agent Hackathon on the MongoDB track, and verified end to end on live infrastructure before the code freeze, from Clerk sign-in through to a real Gemini reply grounded in real Atlas data. I wrote 156 of the 201 commits and owned the agent layer, the deployment, and the streaming path across all three services.',

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
      source: 'git log: 2026-05-21 to 2026-06-08, 201 commits',
    },
    {
      value: '78%',
      label: 'Of commits mine',
      source: 'git log author counts: 156 of 201',
    },
  ],

  decisions: [
    {
      decision: 'Plain-text chunked streaming instead of SSE',
      why: 'SSE buys named events, auto-reconnect and event IDs, none of which a single-turn response stream that closes when the agent finishes actually uses. The one place it earns its keep is statement ingest, which takes 5–30 seconds; there the progress events are the difference between a visible pipeline and a spinner the user assumes has hung.',
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
      why: 'The Mongo aggregation would have been cleaner, but the mock driver the test suite runs on doesn’t implement $dateTrunc, so every affected test would have had to hit real Atlas at roughly 30 seconds a run instead of under one. Hermetic tests were worth the uglier query.',
    },
    {
      decision: 'Read from the database before the graph runs, never inside the prompt builder',
      why: 'This one came out of a bug. The prompt builder runs inside an already-running event loop, and the async Mongo driver binds cursors to the loop that created them, so a read from inside it fails with "future attached to a different loop" on the second message. Pre-fetching everything at the entry point and passing it through graph state made the prompt builder pure and the failure impossible.',
    },
  ],

  contribution: {
    role: 'Agent architecture and deployment',
    teamSize: 3,
    owned: 'The agent layer end to end (tools, LangGraph wiring, MCP integration, prompt), plus the container deploy and the streaming path across all three services',
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
      // Plain "stream", no "SSE": the acronym went with the "Server-sent events" tag (Mahyar, 2026-09-25).
      body: 'Each agent’s steps stream to the screen; the operator accepts or overrides, and customer emails stay drafts.',
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
  // api/db/schema.sql; front/*.html (plain HTML, CSS and JS); api/Procfile:1 (Railway). Not Next.js:
  // web/ only redirects to the static pitch page. Not "Server-sent events" either (Mahyar, 2026-09-25):
  // it is how the steps stream, not a tool, and the third step already says so.
  stack: ['Claude Haiku 4.5', 'Anthropic SDK', 'Python', 'FastAPI', 'SQLite', 'JavaScript', 'Railway'],

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

  // Mahyar's clip and photos from demo day, May 29 (CONTRIBUTORS.md:21; the files were shot 13:26 to 14:08
  // that day): 401492.MOV, IMG_2710.JPG and IMG_2711.JPG, cut for the web on 2026-09-25. The clip is 720p
  // H.264 with no audio track. The photos are the full frames, uncropped (Mahyar: "its my photo"), at
  // 1400x1050 sRGB: the widest they show is 684 CSS px (one column, at the 760px break), 1368 px at 2x.
  // None of them carries its metadata (the originals have GPS). The table sign's QR code is blurred in every
  // frame: it opens the dead demo (fgf-sentinel-web.vercel.app/maridian/login.html), which this page doesn't
  // link. No captions (his call); no alt names anyone but Mahyar.
  demoDay: {
    clip: {
      src: '/work/maridian/demo-table.mp4',
      still: '/work/maridian/demo-table.jpg',
      width: 1280,
      height: 720,
      alt: 'A handheld shot past people standing at the team’s table, coming to rest on its sign: “TMLS · Team #16 · Maridian · Scan to view project”, the QR code blurred, in front of two open laptops.',
    },
    photos: [
      {
        src: '/work/maridian/demo-talk.jpg',
        width: 1400,
        height: 1050,
        alt: 'Mahyar, in a black T-shirt and a “MAHYAR 16” name tag, talking with a visitor in a crowded room.',
      },
      {
        src: '/work/maridian/demo-team.jpg',
        width: 1400,
        height: 1050,
        alt: 'Mahyar, seen from behind, talking with two teammates at their laptops.',
      },
    ],
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
    line: 'Too early. Don’t rush. I\u00a0haven’t finished my coffee.',
  },
};

/**
 * Landline: a team of three, a hackathon build carried on to a demo day. Written
 * from its portfolio brief (portfolio-assets/PORTFOLIO_BRIEF.md, prepared on
 * 2026-11-02 from 2arian3/Landline at main 5758699), which is not copied into
 * content/sources/ because it holds unreleased notes. `source:` paths are in that
 * repo at 5758699. Two facts are Mahyar's own (2026-11-02): it was built at the
 * Boson AI Higgs Audio Hackathon (23 to 24 Oct 2026), and "Georgian Build North,
 * we were finalists". Held until he confirms: third place and "of 30+ teams", the
 * first-paint numbers, the 1.3 s re-rank and 60 fps. Its two decisions (the map's
 * loading, push on the iPhone app) are in the brief, §9: a page gets six sections,
 * and with My role and Demo day there is no room for a seventh.
 *
 * Every screenshot and the clip are from the live site's scripted demo, which
 * dials no one (server/landline/api/demo.py:8-13). The demo puts made-up answers
 * on real liv.rent listings, so every street address in them is blurred: the
 * brief's -safe copies. Never the unblurred originals, media/landline-demo.gif or
 * media/lucent-projector.png, and never the product's phone line or the API's
 * address.
 */
const landline: CaseStudyProject = {
  slug: 'landline',
  name: 'Landline',
  kind: 'prototype',
  page: 'case-study',
  depth: 'deep',
  // Just ahead of Realest, the build it grew out of (README.md:200-202), so the two
  // read in order. Renumber when the cards are merged.
  order: 2.5,
  // source: git log, first commit b577cad (2026-10-22), last 5758699 (2026-10-29)
  year: '2026',
  // Mahyar, 2026-11-02: "Georgian Build North, we were finalists"; BACKLOG.md:11-13 (one of ten finalists)
  status: { label: 'Georgian Build North finalist', kind: 'hackathon' },
  // The product's own line, under its panel in every screenshot. The brief's "Calls listing agents for
  // Toronto renters" is nearly Realest's card line, and the two cards sit side by side.
  cardLine: 'Toronto rentals, checked by phone',
  // The web app's own icon, identical to web/app/icon.svg (fe68335, his)
  mark: '/work/landline/mark.svg',
  facts: [
    // Mahyar, 2026-11-02; AGENTS.md:9 at 34d0236 names the event
    { label: 'Event', value: 'Boson AI Higgs Audio Hackathon' },
    // AGENTS.md:9 (Team AAMEL); git shortlog (three people)
    { label: 'Team', value: '3 people' },
  ],

  // The loop in the order it runs (brief §6).
  steps: [
    {
      title: 'Talk, and the map re-ranks',
      // source: server/landline/agents/concierge/tools.py:206-218 (update_preferences inside session_tx);
      // server/landline/orchestrator/runtime.py:234 and board.py:17-21 (each commit re-ranks the board);
      // server/landline/api/routes.py:94 and web/lib/live.ts:133 (the page hears it)
      body: 'The renter says what they want, like a one-bedroom up to $2,900. The voice agent saves each preference, and every save re-ranks the board on the live map.',
    },
    {
      title: 'Calls in parallel',
      // source: server/landline/voice/dispatch.py:383 (hanging up freezes the plan), :103-104 (one Caller per
      // place, all at once up to the line cap); server/landline/voice/outbound.py:226-230 (allowlisted only)
      body: 'Hanging up freezes the plan. Each listing then gets its own caller, dialing in parallel, and only numbers on an allowlist can be called.',
    },
    {
      title: 'Facts, then a text',
      // source: server/landline/agents/auditor/audit.py:182 (a fact stays only if its quote is in the listing
      // agent's turns); orchestrator/handlers.py:235-245 (the outcome re-ranks the card); orchestrator/narrator.py:1
      // and voice/dispatch.py:336 (a template text by SMS)
      body: 'A fact counts only if its quote is in what the listing agent said. The answers re-rank the cards, and the renter gets a text with what each agent said.',
    },
  ],

  // The live site's scripted demo on 2026-11-02, every street address blurred (the brief's -safe copies;
  // alt text and captions from its §10). The first is also the card, which keeps its right side: the panel
  // with the calls. calling-safe is left out (the same moment as the first), and so is map-ranked-safe:
  // it is the clip's resting frame at 2x. With a clip, the stills show one to a row (CaseStudy's
  // Shots), so every whole screen keeps the column's full width: at half width the panel text in
  // results and fact-source can't be read. The phone shows at a phone's width.
  shots: [
    {
      // source: portfolio-assets/landline-card-safe.png, the board mid-call drawn at 1024×640 CSS px
      src: '/work/landline/calls.png',
      width: 1600,
      height: 1000,
      alt: 'Landline’s map of Toronto with four amber pins being called, beside a live caption from one call.',
      caption: 'Landline calls four places at once and shows each call live. From the scripted demo, with addresses blurred.',
      cardFocus: '100% 0',
    },
    {
      // source: portfolio-assets/landline-results-safe.png
      src: '/work/landline/results.png',
      width: 2880,
      height: 1800,
      alt: 'The board after the calls: four results, and pins marked booked, checked, flagged and no answer.',
      caption: 'Each result says what the agent said, and each pin shows how the call went. The answers are scripted.',
    },
    {
      // source: portfolio-assets/landline-try-phone.png, /try at 390×844 before Start: the pop-up with the
      // phone line stays closed
      src: '/work/landline/try-phone.png',
      width: 780,
      height: 1688,
      alt: 'The Talk to Landline screen on a phone, with sample requests and a Start talking button.',
      caption: 'On /try you talk to Landline in the browser.',
    },
    {
      // source: portfolio-assets/landline-fact-source-safe.png (the address and the building's name blurred)
      src: '/work/landline/fact-source.png',
      width: 2880,
      height: 1800,
      alt: 'A listing’s details with a booked viewing and a quote from the listing agent about pets.',
      caption: 'Every fact keeps the agent’s exact words and says who said them. The quote and the booking are scripted.',
    },
  ],

  // source: portfolio-assets/landline-rerank-safe.mp4 (1440×900, 12.47 s, H.264, no audio track) and its
  // last frame, landline-rerank-last-safe.png. The demo's controls change the brief in it, not speech.
  // It leads the stills and loops, as Palimpsest's console clip does.
  clip: {
    src: '/work/landline/rerank.mp4',
    still: '/work/landline/rerank.png',
    width: 1440,
    height: 900,
    alt: 'A screen recording of the map and the list of Toronto rentals re-ranking twice as the budget and bedrooms change.',
    caption: 'Each change to the brief re-ranks the map and the list. From the scripted demo, where controls stand in for the voice.',
  },

  // source: brief §2
  oneLiner:
    'A voice agent for Toronto renters: you talk, a live map re-ranks, then it phones the listing agents and texts you what they said.',

  badges: ['Boson AI Higgs Audio Hackathon', 'Team of 3', 'Georgian Build North finalist'],

  // source: brief §7: server/landline/voice/higgs.py:19,39 (Higgs Realtime, not Higgs TTS: README.md:156);
  // voice/outbound.py:45 (Twilio); pyproject.toml:5,7,15 (Python, FastAPI, Clerk); db/migrations/0001_init.sql:4-5
  // (PostgreSQL); web/package.json:15,17-18 (MapLibre GL, Next.js, React); mobile/package.json:8,24 (Expo)
  stack: ['Higgs Realtime', 'Twilio', 'Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'React', 'MapLibre', 'Expo', 'Clerk'],

  // None until Mahyar decides (2026-11-02), not even as a held link: the live demo ends on a scripted red
  // flag over a real, unblurred address; the live site's cover shows the product's phone line; and the
  // team's README shows that line and the API's address (brief §11).
  links: [],

  // source: docs/slides/landline-demo-day.html:43-44, the team's own problem statement
  problem:
    'Toronto rental listings leave out what renters most need to know: is it still available, what does parking really cost, are dogs allowed. Renters chased agents one call at a time, and those agents work for the landlord.',

  // source: brief §6 (the code path) and §7 (Higgs Realtime, Twilio); README.md:200-202 ("Landline grows out of
  // Realest"). "We": Mahyar was on Realest's team too.
  approach:
    'A voice agent on Boson AI’s Higgs Realtime turns what the renter says into a brief, and the server re-ranks the board and streams each change to a live map. The calls go out in parallel over Twilio, and an auditor keeps only what the listing agent actually said. It grew out of Realest, which we built at an earlier hackathon.',

  // source: Mahyar (the event and its dates, the finalist place); BACKLOG.md:11-13 (one of ten finalists);
  // git log 27 to 29 Oct (the Build North week); the site answered 200 on 2026-11-02; demo.py:8-13;
  // docs/PITCH_NUMBERS.md:3 (no real renter; calls only to the team's phones)
  result:
    'We built it at the Boson AI Higgs Audio Hackathon on October 23 and 24, 2026, and kept building it for Georgian Build North’s demo day, where we were one of ten finalists. It is still live, with a scripted demo that dials no one. No real renter has used it: its calls only ever reached the team’s own phones.',

  // Only the three numbers checked for the brief (§8). Held until Mahyar confirms: first paint 3.4 s → 0.9 s
  // (PR #8's Lighthouse runs), the 1.3 s re-rank (one run) and 60 fps; 49 of 49 quotes is the team's testing.
  metrics: [
    {
      value: '7/21 → 0/21',
      label: 'Voice sessions where the agent skipped its tools, before and after my fix',
      source: 'PR #168 description (his), fixing a regression from #136',
    },
    {
      value: '10/15 → 15/15',
      label: 'Goodbyes in other languages that ended the call, on the tune set',
      source:
        'PR #222 description (his), measured on its tune set; the other 10/15 → 15/15, in docs/EVAL_FINDINGS.md:24, is a teammate’s',
    },
    {
      value: '473 → 186 kB',
      label: 'First-load JavaScript of the live board page',
      source:
        'next build at PR #8’s before and after commits, e29c60b and b074db4, rebuilt for the brief; the same on every device, so never "mobile"',
    },
  ],

  contribution: {
    // source: README.md:145 (the web app and its live map, the Expo app, the API's read side, Vercel, the video)
    role: 'Web app, Expo app and read API',
    teamSize: 3,
    // source: git blame -w at 5758699, code only (brief §4): all code 20,725 lines (36%); web/ app code 7,147 (74%);
    // mobile/ 2,340 (100%); server/landline/api/ 1,253 (63%); agents 26%, voice 15%, orchestrator and data 8% or
    // less. "Rebuilt": a teammate committed the web app's first version (044da70). His fixes: #168, #222.
    owned:
      'I wrote 36% of the code: 74% of the web app, all of the Expo app and 63% of the API. That covers the rebuilt board and its detail views, judge mode on /try, the read API’s captions and outcomes, and sign-in. Voice, agents and data were mostly my teammates’ work; my part there was fixes, like the agent’s tool use and its goodbyes.',
  },

  // Mahyar's photos from the Georgian Build North final (DSC03376, DSC03364 and DSC03343, 7008×4672 Sony files),
  // cut for the web on 2026-11-02: 1400×933, sRGB, no metadata at all (the originals carry EXIF, IPTC and XMP).
  // He is the one wearing the "MAHYAR" name tag. A teammate's full name, a video call's "screen" label on the
  // display behind the stage, is blurred in each. DSC03316, the About section's photo, isn't repeated. No
  // captions, and no alt text names anyone but Mahyar.
  demoDay: {
    photos: [
      {
        src: '/work/landline/demo-phone.jpg',
        width: 1400,
        height: 933,
        alt: 'Mahyar on stage, holding a phone up to the microphone, while two teammates watch the laptop.',
      },
      {
        src: '/work/landline/demo-stage.jpg',
        width: 1400,
        height: 933,
        alt: 'Mahyar gesturing on stage with a phone in one hand, two teammates at the laptop behind him.',
      },
      {
        src: '/work/landline/demo-room.jpg',
        width: 1400,
        height: 933,
        alt: 'The team on stage, seen from the audience: a teammate holds the microphone at the laptop while Mahyar stands to the right.',
      },
    ],
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
 * Directed studies, Fall 2026: a teaser. Written from the project's portfolio
 * brief of 2026-11-02 (its private repo's portfolio-assets/PORTFOLIO_BRIEF.md,
 * copied to content/sources/GraphRetrieval_PORTFOLIO_BRIEF.md with the results
 * withheld), whose "Page copy, teaser version" gives the card line, status,
 * lede, story, numbers and credit below, word for word.
 *
 * Mahyar, 2026-11-02: "lets keep it lowkey and suspicious but market it well as
 * of something very cool." So the page tells the story and hides the specifics.
 * Every line was chosen to stay true: "no measurable difference", not "it
 * failed"; "helped most", not "fixed it"; "a plan fixed before the main runs",
 * not "before any results". Reword nothing, and add nothing the page copy
 * doesn't say (no result, no figure, no method detail) until he clears it.
 * Still underway, so it keeps a brief page.
 */
const graphRag: BriefProject = {
  // Renamed from "Graph RAG for FHIR" (2026-09-23); the slug stays so links hold.
  slug: 'graph-rag-fhir',
  // source: brief §1 (README.md:1)
  name: 'Graph-Native Retrieval for Clinical LLM Agents',
  kind: 'research',
  page: 'brief',
  order: 5,
  // source: brief §1, §4 (first commit 2026-09-23)
  year: '2026',
  // source: brief, Page copy (status label); underway (brief §3), its results kept off the page
  status: { label: 'Results under wraps', kind: 'held' },
  // source: brief, Page copy (card line)
  cardLine: 'Why AI agents get lost in health records',
  // source: brief, Page copy (lede). Also the page's meta description.
  lede: 'Research into why AI agents get lost in linked health records, and the surprisingly small change that helped most.',
  // source: brief §0 and §4: one author, and the page names only Mahyar (his decision, 2026-11-02)
  role: 'Student researcher (solo)',
  // source: brief §0 (course, lab, supervisor and timeline, unchanged since September)
  facts: [
    { label: 'Course', value: 'EECS 4070 Directed Studies' },
    { label: 'Lab', value: 'York Data Mining Lab' },
    { label: 'Supervisor', value: 'Prof. Manos Papagelis' },
    { label: 'Timeline', value: 'Fall 2026' },
  ],
  // source: brief §0 and §7: BLAZE is the local FHIR server, the OpenAI API the model's, through LiteLLM.
  // The York row in content/experience.ts keeps its four.
  stack: ['Python', 'FHIR', 'BLAZE', 'LiteLLM', 'OpenAI API', 'pandas'],
  // source: brief, Page copy (body); every sentence is checked in the brief's table under it
  story:
    'AI agents that answer clinical questions stumble when one health record only points to another, like a prescription pointing to its drug. I built a tool that follows those links for the agent. Then I tested it the strict way: a plan fixed before the main runs, and 1,489 agent runs on a public benchmark. On its own, the tool made no measurable difference. The change that did fits in one sentence. I’m keeping it under wraps until it’s confirmed.',
  // The link from a prescription to its drug that card_teaser.png draws (brief §10), in ink: the card's
  // art and the page's figure (components/work/RecordLinks.tsx). Its record types and field names are
  // FHIR's own (brief §10). The caption is that picture's alt text in the brief, its first sentence.
  diagram: {
    alt: 'A prescription record (MedicationRequest) points to the patient (Patient) through its subject field, and to a separate drug record (Medication) through its medicationReference field.',
    caption: 'A prescription record points to the patient and to a separate drug record.',
  },
  // source: brief, Page copy (facts strip), in its order; the brief's table gives each one's count. None is a result.
  numbers: [
    { value: '1,489', label: 'agent runs' },
    { value: '928,935', label: 'health records for 100 patients' },
    { value: '2,931', label: 'benchmark questions' },
    { label: 'Test plan fixed before the main runs' },
  ],
  // source: brief, Page copy (credits), word for word. The data's licence asks for it wherever anything made
  // from the data is shown, and the page shows record counts. All three links returned 200 on 2026-11-02.
  // U+2011, a non-breaking hyphen, keeps the dataset's and the benchmark's names whole; no-break spaces
  // keep "Lee et al." and "ML4H 2025" whole.
  credit: [
    'Contains information from the ',
    {
      label: 'MIMIC‑IV Clinical Database Demo on FHIR (v2.1.0)',
      href: 'https://physionet.org/content/mimic-iv-fhir-demo/2.1.0/',
      status: 'live',
    },
    ', which is made available here under the ',
    { label: 'Open Database License (ODbL)', href: 'https://opendatacommons.org/licenses/odbl/1-0/', status: 'live' },
    '. Benchmark: ',
    { label: 'FHIR‑AgentBench', href: 'https://github.com/glee4810/FHIR-AgentBench', status: 'live' },
    ' (Lee\u00a0et\u00a0al., ML4H\u00a02025).',
  ],
};

/**
 * Palimpsest: solo research with a working prototype. Written from its portfolio
 * brief (Palimpsest repo, portfolio-assets/PORTFOLIO_BRIEF.md, Nov 2, 2026, at
 * e4144f5); `source:` paths are in that repo. The repo is private (GitHub 404s
 * signed out) and nothing is deployed, so the page links nowhere. The finding is
 * the headline (brief §1), so it leads, and the MCP server shows as the prototype.
 * Every visual replays the committed demo memory, whose people and bookshop are
 * invented (demo/halloween.json); nothing comes from data/me/.
 */
const palimpsest: CaseStudyProject = {
  slug: 'palimpsest',
  name: 'Palimpsest',
  kind: 'research',
  page: 'case-study',
  depth: 'deep',
  order: 7,
  // source: git log, first commit be35478 (2026-10-31)
  year: '2026',
  // The brief's label (§1); Mahyar may change it. 'research', not 'progress': the
  // study has its result. Both show the flask.
  status: { label: 'Benchmarked, in progress', kind: 'research' },
  // brief §1
  cardLine: 'Memory for Claude that keeps dated history',
  // The console's own icon (web/public/favicon.svg), byte-identical to portfolio-assets/logo.svg
  mark: '/work/palimpsest/mark.svg',
  facts: [
    // source: git log, be35478 (2026-10-31) to e4144f5 (2026-11-01); brief §4.
    // The year stands beside it in the summary row.
    { label: 'Timeline', value: 'Oct 31 – Nov 1' },
  ],

  // brief §6: the demo question end to end, each beat with its source
  steps: [
    {
      title: 'Extract dated facts',
      // source: src/palimpsest/ingest.py:60; web/public/demo/halloween.events.jsonl:62
      body: 'Claude Haiku reads the July 5 session (“moved to Vancouver last week”) and stores “moved to Vancouver” as valid from June 28.',
    },
    {
      title: 'Close, don’t delete',
      // source: src/palimpsest/invalidate.py:357-359; halloween.events.jsonl:63
      body: 'The “lives in Toronto” fact it contradicts gets an end date, June 28, instead of being deleted.',
    },
    {
      title: 'Fuse three signals',
      // source: src/palimpsest/retrieve.py:243-270; scripts/publish_demo.py:39-42;
      // web/public/demo/halloween.recall.jsonl:13-18
      body: 'The recall tool ranks facts by BM25, embeddings and a Personalized PageRank walk, then fuses the lists with reciprocal rank fusion. Claude Sonnet answers: “you lived in an apartment in Toronto”.',
    },
  ],

  // The four console screenshots, with the brief's captions and alt text (§10): a
  // server-free build of the console replaying the committed demo, 1440x900 at 2x.
  // Shown one to a row under the clip: paired, a whole window's text can't be read.
  shots: [
    {
      // source: portfolio-assets/console-memory-forming.png (replay paused at Jul 5)
      src: '/work/palimpsest/memory-forming.png',
      width: 2880,
      height: 1800,
      alt: 'Palimpsest console replaying a demo memory: a chat session on the left, a growing knowledge graph in the middle and a timeline below.',
      caption: 'A demo memory forming, one chat session at a time.',
    },
    {
      // source: portfolio-assets/console-retrieval-three-signals.png
      src: '/work/palimpsest/retrieval-three-signals.png',
      width: 2880,
      height: 1800,
      alt: 'Palimpsest console answering a question: three ranked lists of facts and their combined ranking beside the knowledge graph.',
      caption: 'Keywords, embeddings and a graph walk each rank facts; rank fusion combines them.',
    },
    {
      // source: portfolio-assets/console-history-as-of.png. It shows the model label
      // "claude-sonnet-5-5 · cached", which names a model it uses.
      src: '/work/palimpsest/history-as-of.png',
      width: 2880,
      height: 1800,
      alt: 'Palimpsest console answering a question about a past date, using facts that were later replaced, shown as dashed lines.',
      caption: 'Asked as of Aug 31, it answers from a fact that later changed.',
    },
    {
      // source: portfolio-assets/console-fact-history.png
      src: '/work/palimpsest/fact-history.png',
      width: 2880,
      height: 1800,
      alt: 'Palimpsest console card for a place, listing two past facts with the dates they stopped being true.',
      caption: 'Old facts get an end date instead of being deleted.',
    },
  ],

  // source: portfolio-assets/card.png, the brief's crop of the console for the card (§10),
  // cut to the card's 4:3 at its right edge (x 266 to 1600): every ranked list stays whole,
  // and only unlit graph on the left goes. Re-saved with only its image chunks.
  cover: {
    src: '/work/palimpsest/card.png',
    width: 1334,
    height: 1000,
    alt: 'Palimpsest console: a knowledge graph with highlighted paths, beside three ranked lists of facts and their combined ranking.',
  },

  // source: portfolio-assets/console-clip.mp4, shipped as it came: 1920x1080 H.264, 15 s, no
  // audio track, moov first. Its still is console-clip-last-frame.png (pixel for pixel the
  // clip's last frame) as a q90 WebP with no metadata. Caption and alt are the brief's (§10).
  clip: {
    src: '/work/palimpsest/console.mp4',
    still: '/work/palimpsest/console.webp',
    width: 1920,
    height: 1080,
    alt: 'Palimpsest console: a chat session adds facts to a knowledge graph and closes an old one, then a question lights up graph paths and three ranked lists of facts.',
    caption: 'A demo memory forms, then answers a question with three ranked lists.',
  },

  // source: src/palimpsest/mcp_server.py:233-275; README.md:35-42 (six tools; recall
  // with an optional as-of date). A prototype: no deploy config, release or usage data (brief §1).
  prototype:
    'The prototype is an MCP server for Claude Code with six tools, among them recall, which takes an as-of date. The console below replays a demo memory; its people and bookshop are invented.',

  // brief §2
  oneLiner:
    'A long-term memory engine for Claude Code users that keeps outdated facts as dated history, plus a 500-question study of which retrieval pieces help.',

  badges: ['Research', 'Working prototype', 'Solo'],

  // brief §7, most important first: pyproject.toml:5, 7, 9, 13, 14; src/palimpsest/config.py:34-39
  // (Haiku writes the memory; Sonnet answers and judges), :53 (bge-small-en-v1.5);
  // src/palimpsest/store.py:53 (FTS5 for BM25); src/palimpsest/retrieve.py:13 (SciPy for
  // PageRank); src/palimpsest/mcp_server.py:225 (FastMCP); web/package.json:22-41 (the
  // console). FastAPI, TypeScript, Vite and graphology are left off for the eight.
  stack: [
    'Python',
    'Claude Haiku 5.5',
    'Claude Sonnet 5.5',
    'SQLite FTS5',
    'sentence-transformers',
    'SciPy',
    'FastMCP',
    'React',
  ],

  links: [
    // NO LINKS. The repo is private: `gh repo view` says PRIVATE and github.com/mahyar-jbr/
    // Palimpsest returns 404 signed out (brief §3). Its early history quotes personal
    // details (BACKLOG.md:168), so it stays unlinked until Mahyar decides to publish it.
    // Nothing is deployed and no video is published.
  ],

  // brief §5; the research question is CLAUDE.md:5 (brief §1)
  problem:
    'Chat assistants forget between sessions, and when a fact changes (“I moved”), a memory has to know what is true now and what was true before. The usual fix is plain RAG over old chat turns. Graph memories add extraction, graph walks and time models, but are usually reported only as a whole, so I measured which piece helps which kind of question.',

  // brief §8, from results/phase-4.md (run 20261101-012006-s-500q-ABCDDXWT on LongMemEval S)
  finding: {
    // source: results/phase-4.md:9-11
    summary:
      'On the same 500 LongMemEval questions, the full system answered 437 correctly and plain RAG 422, a lead that is not significant (p = 0.14). On temporal reasoning the gain is significant, even after a Bonferroni correction: 119 against 104 of 133 questions (p = 0.006).',
    // The no-break spaces keep each p-value whole when a line wraps.
    metrics: [
      {
        value: '87.4% vs 84.4%',
        label: 'Answered correctly, full system vs plain RAG: 437 and 422 of 500. Not significant (p = 0.14)',
        source:
          'results/phase-4.md:9-10: McNemar p = 0.14; 95% Wilson intervals 84 to 90% and 81 to 87%',
      },
      {
        value: '119 vs 104 of 133',
        label: 'Temporal reasoning questions answered correctly. Significant (p = 0.006)',
        source: 'results/phase-4.md:11: McNemar p = 0.006, significant after a Bonferroni correction',
      },
      {
        value: '1,704 vs 6,128',
        label: 'Context tokens per question',
        source: 'results/phase-4.md:9',
      },
      {
        value: '$0.0052 vs $0.0105',
        label: 'Cost per answer',
        source: 'results/phase-4.md:86',
      },
    ],
    // source: results/phase-4.md:51-54, each condition against the one before it. As counts:
    // date ranges' temporal +11 −4 is not significant on its own.
    breakdown:
      'Five conditions answered the same questions, from plain RAG to the full system. Extracted facts alone lost 37 questions about what the assistant had said, and quoting the raw conversation won back 35. Date ranges gained 11 temporal questions and lost 4, but cost 3 knowledge-update questions. The graph walk barely moved the score: 9 questions gained, 8 lost.',
    figure: {
      // source: portfolio-assets/ablation-chart.png (results/phase-4.md:20-27, 36-43 and 11),
      // light ground only, as drawn
      src: '/work/palimpsest/ablation.png',
      width: 2400,
      height: 2098,
      alt: 'Dot chart: on 500 questions the full system scores 87.4% against plain RAG’s 84.4%, with a clear gain only on temporal questions.',
      caption: 'Accuracy on 500 LongMemEval questions, by question type, with 95% intervals.',
    },
  },

  // brief §6. The steps above carry the detail.
  approach:
    'Palimpsest turns chat sessions into dated facts in a graph and keeps the raw conversation beside it. One demo question, “Where did I live before I moved to Vancouver?”, end to end:',

  // source: ROADMAP.md:17-21 (phases 1 to 4 done on Nov 1; phase 5, the write-up and video,
  // under way); results/phase-4.md:3; `uv run pytest` 204 passed, 1 skipped (Nov 2, brief §3)
  result:
    'Four of its five phases are done, ending with the 500-question benchmark on November 1, 2026. The fifth, a write-up and a video, is under way. Its test suite passes (204 tests, 1 skipped), and the code is private.',

  decisions: [
    {
      decision: 'Close old facts, never overwrite them',
      // source: CLAUDE.md:69 ("so point-in-time questions still work"); invalidate.py:357-359;
      // README.md:42 (forget "closes a fact but keeps its history"); the as-of screenshot
      why: 'So point-in-time questions still work: a fact that changes gets an end date and stays in the history, and a question asked as of a past date answers from what was true then. Even the forget tool closes a fact and keeps its history.',
    },
    {
      decision: 'Keep the raw conversation beside the graph',
      // source: CLAUDE.md:35 (the reason); results/phase-4.md:51, 54 (the measurement)
      why: 'So questions about what the assistant said can fall back to the original text. The benchmark bore it out: facts alone lost 37 of those questions, and quoting the conversation won back 35.',
    },
  ],

  // Solo: `role` fills the summary row and no "My role" section renders.
  // source: git shortlog -sne --no-merges HEAD, one author (brief §4)
  contribution: {
    role: 'Solo',
    teamSize: 1,
    owned: 'The memory engine, the 500-question benchmark, the MCP server and the console',
  },
};

/**
 * Display order is `order`, derived rather than hand-maintained — a hand-kept list
 * once silently dropped Maridian. Eight cards since Landline and Palimpsest joined
 * (2026-11-02): an even count, so every card pairs. Under a filter with an odd
 * count, the lowest order there spans both columns.
 */
export const projects: Project[] = [
  bowlwise,
  moneymind,
  landline,
  realest,
  maridian,
  graphRag,
  tacticalDna,
  palimpsest,
].sort((a, b) => a.order - b.order);

/** Projects with a page of their own, for routing. */
export const pagedProjects = projects.filter(
  (p): p is CaseStudyProject | BriefProject => p.page !== 'none',
);

/**
 * A NOTE ON "MULTI-AGENT" — read before writing any copy that uses the phrase.
 *
 * Verified against source, the lineup contains exactly one agent system, and it is
 * a single agent:
 *   - BowlWise  — ONE agent (updated 2026-11-02). The scoring engine has no model in it;
 *                 Ask BowlWise, the chat, is a single Claude agent over 15 tools (the only
 *                 code that imports the Anthropic SDK), and the connector is an MCP server
 *                 that the user's own Claude calls. One agent, never "multi-agent".
 *   - MoneyMind — ONE agent. A single create_react_agent call, no StateGraph, no
 *                 sub-agents, no supervisor, no handoffs. Its own docs say so plainly:
 *                 "Three layers. One agent."
 *   - Maridian  — claims six agents. UNVERIFIED. The breakdown in the old
 *                 data/caseStudies.js was invented by a previous session.
 *   - Tactical DNA — research, no agents.
 *   - Realest   — (added 2026-09-23) two ElevenLabs voice agents: one answers the
 *                 renter, the other places each call to a listing. Teammates built
 *                 them; Mahyar built the ranker and the page.
 *   - Landline: (added 2026-11-02) a voice agent on Higgs Realtime, one caller per
 *                 listing and an auditor, mostly his teammates' work; his part there
 *                 was fixes (#168, #222). Never "multi-agent" about him.
 *
 * RESOLVED 2026-08-08: Maridian's six agents are REAL — Triage, Options, Scorer,
 * Decision, Batch Tracker, Recovery Planner, each a module with its own prompt file and
 * tool wiring, chained by a hand-written sequential orchestrator. So "multi-agent" is
 * now supportable, but ONLY about Maridian, and only alongside the contribution note:
 * Mahyar did not write the agents. Never let the phrase migrate to MoneyMind (one
 * agent), BowlWise (one chat agent), Realest (voice agents he didn't write), or to a general
 * claim about him in the hero or About.
 */
