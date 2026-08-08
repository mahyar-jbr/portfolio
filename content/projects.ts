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

const moneymind: Partial<Project> = {
  slug: 'moneymind',
  name: 'MoneyMind',
  kind: 'prototype',
  depth: 'deep',
  order: 2,
  oneLiner:
    'A personal finance agent that remembers the user, not just their transactions.',
  badges: ['Google Cloud Rapid Agent Hackathon', 'MongoDB Track', 'Architecture Lead'],
  stack: ['Next.js', 'FastAPI', 'LangGraph', 'Gemini 2.5 Flash', 'Voyage AI', 'MongoDB Atlas', 'Clerk'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/MoneyMind', status: 'live' },
    // Production version being built with Kasra — add when it ships.
  ],
  // TODO: fill from extract. Known from the README: LangGraph ReAct loop, 18 native
  // tools + MongoDB MCP read tools, voyage-3 embeddings at 1024 dims with cosine
  // search, Gemini 2.5 Flash on Vertex AI, async end-to-end on one event loop,
  // 201 commits, 3 contributors. No placement or award is recorded — do not imply one.
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

const tacticalDna: Partial<Project> = {
  slug: 'tactical-dna',
  name: 'Tactical DNA',
  kind: 'research',
  depth: 'standard',
  order: 4,
  oneLiner:
    'What football passing networks reveal about coaches, tactical styles, and player roles.',
  badges: ['Research', 'Information Networks course'],
  stack: ['Python', 'NetworkX', 'scikit-learn', 'XGBoost', 'UMAP', 'pandas'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr/tactical-dna', status: 'live' },
  ],
  // TODO: fill from extract. Known from the README: 775 passing networks across 42
  // teams from StatsBomb open data, 44 structural features (8 global + 20 centrality
  // + 16 motif), three inference problems. Lead the card on the FINDING, not the stack.
  //
  // The detail worth building around: season-grouped CV dropped accuracy from 0.358 to
  // 0.250 and he reported it as temporal leakage rather than keeping the better number.
  // Publishing the honest worse result is the strongest competence signal in the lineup.
};

export const projects = [bowlwise, moneymind, maridian, tacticalDna];
export const completeProjects: Project[] = [bowlwise];
