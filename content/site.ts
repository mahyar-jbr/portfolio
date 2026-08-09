import type { Identity, SiteMeta, SkillGroup } from './types';

export const identity: Identity = {
  fullName: 'Mahyar Jaberi',
  roleTitle: 'AI Agent & Full-Stack Engineer',

  // LOCKED 2026-08-08.
  //
  // Replaced June's: "I design and ship production multi-agent AI systems — live in
  // stores, not just on GitHub." Retired for two reasons. It was defensive — it argued
  // his projects weren't toys, an argument he no longer needs to win. And it was
  // subtly false: the thing that's "live in stores" is BowlWise, a full-stack
  // recommendation platform, not a multi-agent system. It implied a production
  // multi-agent deployment that does not exist.
  //
  // This line is true of all four projects, oversells none, and the detour clause
  // signals curiosity rather than resume-assembly — which suits a site whose job is
  // credibility, not conversion.
  tagline:
    'I build AI agent systems and full-stack products — with occasional detours into football data.',

  location: 'Aurora, ON',
  email: 'jaberi.mahyar@gmail.com',
  phone: '437-986-1383',
  domain: 'mahyar-portfolio.dev',

  socials: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr', status: 'live' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/mahyar-jaberi', status: 'live' },
    { label: 'Email', href: 'mailto:jaberi.mahyar@gmail.com', status: 'live' },
  ],
};

/**
 * Hero.
 *
 * The credential line replaces the deleted availability slot — same position, but it
 * states a fact instead of making a request, which is the whole shift from hunting to
 * presence. It is also the only line above the fold that someone other than Mahyar can
 * vouch for; everything else in a hero is self-assigned by definition.
 */
export const hero = {
  eyebrow: 'AI Agent & Full-Stack Engineer',
  name: 'Mahyar Jaberi',
  tagline: identity.tagline,
  credential: 'Incoming AI Solutions Engineer at FGF · September 2026',
  // Swap "Incoming" for "AI Solutions Engineer at FGF" once he actually starts.

  ctas: [
    { label: 'View work', href: '#work' },
    { label: 'Email', href: 'mailto:jaberi.mahyar@gmail.com' },
    // Résumé pill stays pulled until public/resume.pdf is replaced — the current file
    // is the June version and predates FGF entirely.
  ],
};

/**
 * The hero signature: a rendered agent trace.
 *
 * This is CONTENT, not decoration — the point is that it shows what a real agent call
 * chain looks like, so it lives here rather than as strings inside a component.
 *
 * Every tool name below is real, taken from MoneyMind's agent and verified three ways
 * in content/MoneyMindHackathon_PORTFOLIO_EXTRACT.md §3. It deliberately does NOT use
 * the Maridian pipeline that design/SECTIONS.md §3.2 proposed — those four agent names
 * (intake/classify/recommend/review) were invented by an earlier session and have never
 * been confirmed against Maridian's source. A fabricated diagram is the one thing this
 * particular site cannot open with.
 *
 * The result strings are illustrative of shape, not transcribed from a specific run —
 * so present this as an example call chain, never as captured output.
 */
export const heroTrace = {
  caption: 'An agent call chain from MoneyMind',
  steps: [
    { call: 'recall_memory("groceries")', result: '3 memories · vector match' },
    { call: 'query_transactions(30d)', result: '47 rows' },
    { call: 'get_spend_anomaly()', result: '+38% vs baseline' },
    { call: 'propose_intervention()', result: 'awaiting user' },
    { call: 'write_memory("bulking")', result: 'persisted' },
  ],
};

/**
 * SEO / social metadata.
 *
 * app/layout.tsx currently hardcodes its own title and description, which disagree
 * with these. This object should be the single source — otherwise the tab title, the
 * search result, and the link preview drift apart and nobody notices for months.
 */
export const meta: SiteMeta = {
  title: 'Mahyar Jaberi — AI Agent & Full-Stack Engineer',
  // Was "Currently an AI Solutions Engineer at FGF" — corrected 2026-08-08. He starts
  // in September; today he is not one. A description is the one string that gets
  // scraped, cached and quoted back at you, so it cannot run ahead of the facts.
  description:
    'I build AI agent systems and full-stack products. Starting September 2026 as an AI Solutions Engineer at FGF.',
  ogImageAlt: 'Mahyar Jaberi — AI Agent & Full-Stack Engineer',
};

/**
 * Contact section copy.
 *
 * Rewritten 2026-08-08 for the positioning change. Mahyar is not job hunting
 * ("I just like to look professional"), so this section no longer advertises
 * availability, and there is no hiring CTA. A stale "open to opportunities"
 * banner on the site of someone who just signed a one-year co-op reads as
 * either inattentive or untrue — both worse than saying nothing.
 */
export const contact = {
  heading: 'Get in touch',
  body: 'Always happy to talk about agent systems, football data, or anything someone is building. The inbox is open.',
  // Deliberately absent: availability status, "hire me", "open to work",
  // response-time promises.
};

/**
 * Skills. Reviewed 2026-08-08 — Mahyar: "leave skills like this for now."
 *
 * The June resume set, extended with what the project extracts actually proved he has
 * used: Voyage AI and Vertex AI (MoneyMind), MCP (MoneyMind's read-only Mongo server),
 * NetworkX / scikit-learn / XGBoost (Tactical DNA), Railway (both).
 *
 * Standing rule if this is ever revisited: everything here must be something he could
 * be interviewed on. A short defensible list beats a long one. Note that "Anthropic
 * Claude API" is now backed by Maridian's direct SDK tool-use loop, and will shortly be
 * backed by the FGF role too.
 */
export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'C', 'HTML/CSS'],
  },
  {
    label: 'AI & Agents',
    items: [
      'LangGraph',
      'Anthropic Claude API',
      'Gemini / Vertex AI',
      'Voyage AI embeddings',
      'MCP',
      'Atlas Vector Search',
      'pandas',
      'NumPy',
      'scikit-learn',
      'XGBoost',
      'NetworkX',
    ],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'FastAPI', 'Pydantic', 'Node.js', 'Express', 'Tailwind'],
  },
  {
    label: 'Data',
    items: ['MongoDB Atlas', 'PostgreSQL', 'MySQL', 'SQLite'],
  },
  {
    label: 'Tools & Infra',
    items: ['Git', 'Docker', 'GitHub Actions', 'Vercel', 'Railway', 'Linux', 'Postman', 'Figma'],
  },
];
