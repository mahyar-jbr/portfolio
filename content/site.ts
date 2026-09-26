import type { ExternalLink, Identity, SiteMeta, SkillGroup } from './types';
import { education } from './experience';

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
    'I build AI agent systems and full-stack products, with occasional detours into football data.',

  location: 'Aurora, ON',
  email: 'jaberi.mahyar@gmail.com',
  phone: '437-986-1383',
  domain: 'mahyar-portfolio.dev',

  socials: [
    { label: 'GitHub', href: 'https://github.com/mahyar-jbr', status: 'live' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mahyar-jaberi/', status: 'live' },
    { label: 'Email', href: 'mailto:jaberi.mahyar@gmail.com', status: 'live' },
  ],
};

/**
 * Hero (2026-09-23): his name set huge in ink on two lines, then the details as
 * an iOS card and two actions. The properties ARE the pitch (Lucent Hero
 * guideline): no paragraph beside them. He turned down the magnifier lens over
 * the name and the dot canvas behind it.
 *
 * The facts are this file's, not the kit's sample copy: no availability status,
 * no graduation year, Aurora rather than "Toronto area". The status slot shows
 * the role he is actually in, as plain text — in Lucent a green dot means
 * "Available for work", which he is not.
 *
 * `id` names the property so the design can give it a glyph; the words are content.
 */
export const hero = {
  name: identity.fullName,

  properties: [
    // Was "Role: AI Agent & Full-Stack Engineer", which read like a second job
    // title next to Now (Mahyar, 2026-09-23). Builds says what he makes, in the
    // tagline's own words; roleTitle still heads the page title and previews.
    { id: 'builds', label: 'Builds', value: 'AI agent systems and full-stack products' },
    // Was "Incoming AI Solutions Engineer at FGF · September 2026". He started in
    // September, so it now reads as the present. Plain text, NOT the kit's green
    // status tag: in Lucent a green dot means "Available for work", which under his
    // name would read as open-to-work — the opposite of the truth (2026-09-22 review).
    { id: 'now', label: 'Now', value: 'AI Solution Engineer co-op at FGF Brands' },
    { id: 'studying', label: 'Studying', value: `${education.credential}, ${education.institution}` },
    { id: 'based', label: 'Based', value: identity.location, timeZone: 'America/Toronto' },
  ],
  ctas: [
    { label: 'View my work', href: '#work' },
    { label: 'Get in touch', href: '#contact' },
    // Résumé stays pulled until public/resume.pdf is replaced — the current file
    // is the June version and predates FGF entirely.
  ],
} as const;

/**
 * Home-page section heads, and the nav labels that point at them.
 * The nav is built from this list, so a section and its nav item cannot drift.
 */
export const sections = {
  work: {
    id: 'work',
    nav: 'Work',
    kicker: 'Selected work',
    title: 'Projects',
    filters: [
      { value: 'all', label: 'All' },
      { value: 'product', label: 'Products' },
      { value: 'prototype', label: 'Prototypes' },
      { value: 'research', label: 'Research' },
    ],
  },
  experience: { id: 'experience', nav: 'Experience', kicker: 'Experience', title: 'Where I’ve worked' },
  drawings: { id: 'drawings', nav: 'Drawings', kicker: 'Drawings', title: 'Off the keyboard' },
  contact: { id: 'contact', nav: 'Contact', kicker: 'Contact', title: 'Get in touch' },
} as const;

/**
 * SEO / social metadata.
 *
 * app/layout.tsx currently hardcodes its own title and description, which disagree
 * with these. This object should be the single source — otherwise the tab title, the
 * search result, and the link preview drift apart and nobody notices for months.
 */
export const meta: SiteMeta = {
  title: 'Mahyar Jaberi · AI Agent & Full-Stack Engineer',
  // 2026-08-08 it read "Starting September 2026", because he hadn't started and a
  // description cannot run ahead of the facts. He started in September 2026.
  description:
    'I build AI agent systems and full-stack products. AI Solution Engineer co-op at FGF Brands.',
  ogImageAlt: 'Mahyar Jaberi, AI Agent & Full-Stack Engineer',
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
  // 2026-09-23: "anything someone is building" became "anything you're building":
  // the same invitation, said to the person reading it.
  body: 'Always happy to talk about agent systems, football data, or anything you’re building. The inbox is open.',
  // Deliberately absent: availability status, "hire me", "open to work",
  // response-time promises.

  /**
   * Contact tiles. One-word labels, values of three words at most (Lucent ContactTiles).
   * The email tile shows the address itself rather than a value: it is the thing
   * people came for, to read, type elsewhere or select (was "Tap to copy", which
   * hid it and said "tap" to mice too).
   */
  email: { label: 'Email', address: identity.email },
  links: [
    { label: 'GitHub', value: 'Code and experiments', href: 'https://github.com/mahyar-jbr', status: 'live' },
    { label: 'LinkedIn', value: 'Work history', href: 'https://www.linkedin.com/in/mahyar-jaberi/', status: 'live' },
    // Pending until public/resume.pdf is replaced: the current file is the June
    // version and predates FGF. Flip to 'live' and the tile appears.
    { label: 'Resume', value: 'Download PDF', href: '/resume.pdf', status: 'pending' },
  ] satisfies (ExternalLink & { value: string })[],
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
