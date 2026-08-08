import type { Role, Education, Credential } from './types';

/**
 * Work history, newest first.
 *
 * Nova Ventures and Sepantech copy was reviewed and approved unchanged on
 * 2026-08-08. FGF and Pet Valu are new/reframed and carry open questions.
 */
export const roles: Role[] = [
  {
    company: 'FGF',
    title: 'AI Solutions Engineer',
    period: 'Sept 2026 – Sept 2027',
    location: 'TODO(verify): office location — Toronto? Hybrid or on-site?',
    incoming: true,
    context:
      'A one-year co-op term building AI agent systems.',
    // Deliberately no bullets: the role has not started. Listing responsibilities
    // for work not yet done reads as padding and is the easiest thing on the site
    // to catch someone out on. Replace with real accomplishments after ~2 months in.
    bullets: [],
    stack: [],
  },
  {
    company: 'Pet Valu',
    title: 'Animal Care Expert → Assistant Manager',
    period: 'Aug 2023 – Sept 2026',
    location: 'Ontario',
    context:
      'Three years on the retail floor, promoted to Assistant Manager — and the reason BowlWise exists.',
    bullets: [
      // This bullet does the heavy lifting — it converts a retail job from filler
      // into the origin story of the strongest project on the site.
      'Built BowlWise for the stores I helped run — it now runs on customer-facing tablets in two locations.',
      'Promoted from Animal Care Expert to Assistant Manager, leading a team on the floor and running the store under pressure.',
      'Spent three years helping customers make a decision they rarely had enough information for — which became the problem BowlWise solves.',
    ],
  },
  {
    company: 'Nova Ventures',
    title: 'Software Developer Intern',
    period: 'May – Aug 2025',
    location: 'Toronto, ON',
    context: 'A goalkeeper analytics platform for soccer clubs.',
    bullets: [
      'Built backend API endpoints in Python and FastAPI for a goalkeeper analytics platform, exposing per-session performance data to the coaching dashboard.',
      'Built a data pipeline that parsed and cleaned match stats from club PDFs and spreadsheets into structured database tables for analysis.',
      'Built interactive React heatmap components that visualized save patterns across goal zones.',
    ],
    stack: ['Python', 'FastAPI', 'React'],
  },
  {
    company: 'Sepantech',
    title: 'App Developer & Database Intern',
    period: 'May – Aug 2024',
    location: 'Sweden (Remote)',
    context: 'A course-management platform for medical professionals.',
    bullets: [
      'Built core features for a course-management platform serving 500+ medical professionals, including enrollment and automated certification.',
      'Designed 6+ MySQL tables and optimized 12+ queries, cutting average response time by 30%.',
      'Built 8+ Node.js API endpoints in an Agile team for authentication, enrollment, and certificate generation.',
    ],
    stack: ['Node.js', 'MySQL'],
  },
];

export const education: Education = {
  institution: 'York University',
  credential: 'Honours BA, Computer Science (Co-op)',
  started: 'Sept 2023',
  location: 'Toronto, ON',
  // No graduation date by decision (2026-08-08): it moved and is currently unknown.
  // Publishing a stale date on the page people cross-check against LinkedIn is a
  // worse outcome than publishing none. Nobody reads a missing date as odd.
};

export const credentials: Credential[] = [
  {
    name: 'Machine Learning Specialization',
    issuer: 'Stanford University & DeepLearning.AI',
    earned: null,
    inProgress: true,
  },
  {
    name: 'Python for Data Science and AI',
    issuer: 'IBM',
    earned: 'Jan 2026',
    // TODO(Mahyar): the old site linked a Credly badge — resend the URL if you
    // want it linked, otherwise this renders as plain text.
  },
];
