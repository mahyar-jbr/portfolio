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

export const meta: SiteMeta = {
  title: 'Mahyar Jaberi — AI Agent & Full-Stack Engineer',
  description:
    'I build AI agent systems and full-stack products. Currently an AI Solutions Engineer at FGF.',
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
 * Skills.
 *
 * TODO(Mahyar): this is the June resume set, unreviewed since. Two things to fix:
 *   1. Everything MoneyMind's README revealed is missing here — Voyage AI, Vertex
 *      AI, LangGraph ReAct, Clerk, Railway, MCP.
 *   2. Anything you've learned since June that isn't listed.
 * Cut anything you would not want to be interviewed on. A short list you can
 * defend beats a long one you can't.
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
