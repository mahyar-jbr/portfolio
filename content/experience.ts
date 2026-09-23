import type { Role, Education, Credential } from './types';

/**
 * Work history, newest first.
 *
 * Nova Ventures and Sepantech copy was reviewed and approved unchanged on
 * 2026-08-08. FGF and Pet Valu are new/reframed and carry open questions.
 *
 * 2026-09-22: merged with the Lucent kit's experience list — EECS 4070 and
 * BowlWise added as rows, FGF moved from incoming to current (the co-op started
 * in September). The kit's bullets for FGF were placeholders and are NOT used.
 */
export const roles: Role[] = [
  {
    company: 'FGF Brands',
    title: 'AI Solutions Engineer Co-op',
    period: 'Sept 2026 – Sept 2027',
    // From the Lucent kit ("FGF Brands · Vaughan"), which closed the old
    // TODO(verify) on the office location.
    location: 'Vaughan, ON',
    monogram: 'FG',
    current: true,
    context:
      'A one-year co-op term building AI agent systems.',
    // Deliberately no bullets: the role has not started. Listing responsibilities
    // for work not yet done reads as padding and is the easiest thing on the site
    // to catch someone out on. Replace with real accomplishments after ~2 months in.
    bullets: [],
    stack: [],
  },
  {
    company: 'York Data Mining Lab',
    title: 'Directed Studies, EECS 4070',
    period: 'Fall 2026 – Winter 2027',
    location: 'Toronto, ON',
    subline: 'York Data Mining Lab · Prof. Manos Papagelis',
    monogram: 'YU',
    context: 'Graph-native retrieval for clinical LLM agents.',
    // From the Lucent kit — Mahyar's own description of the project. Plans, not
    // results: rewrite as outcomes once there are some.
    bullets: [
      'Graph-native retrieval for clinical LLM agents, evaluated on FHIR-AgentBench.',
      'A graph traversal tool over FHIR references, measured against published baselines.',
    ],
    stack: ['Graphs', 'RAG', 'FHIR'],
  },
  {
    company: 'BowlWise',
    title: 'Founder and builder',
    period: '2026',
    location: 'Aurora, ON',
    subline: 'BowlWise Inc. · bowlwise.app',
    monogram: 'BW',
    context: 'A dog food recommendation platform, built and shipped solo.',
    // Every figure here is from content/projects.ts, which cites the extract.
    bullets: [
      'Built and shipped solo a platform that scores 260 dog foods against each dog, on AAFCO, NRC and WSAVA guidance.',
      'Launched April 4, 2026; it runs on customer tablets in Pet Valu Oak Ridges and Aurora.',
      '133 commits and 121 passing tests, then incorporated as BowlWise Inc.',
    ],
    stack: ['Python', 'FastAPI', 'React', 'MongoDB'],
  },
  {
    company: 'Pet Valu',
    title: 'Animal Care Expert → Assistant Manager',
    // TODO(verify): the end date is an INFERENCE — Mahyar confirmed he was still there
    // through summer 2026, and the FGF co-op starts in September, so this assumes he
    // leaves. If he stays on part-time, this should read "Aug 2023 – Present".
    period: 'Aug 2023 – Sept 2026',
    location: 'Ontario',
    monogram: 'PV',
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
    monogram: 'NV',
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
    monogram: 'ST',
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
