import type { Role, Education, Credential } from './types';

/**
 * Work history, newest first.
 *
 * 2026-09-23: synced with Mahyar's LinkedIn (content/sources/LinkedIn_EXPERIENCE.md),
 * which now wins on titles, dates, locations and duties. BowlWise's row is gone at
 * his request: it is a project, and lives in Work. The York lab row isn't on
 * LinkedIn and stays as he described it.
 *
 * Earlier: Nova Ventures and Sepantech copy was reviewed and approved on
 * 2026-08-08; the Lucent kit's placeholder bullets for FGF were never used.
 */
export const roles: Role[] = [
  {
    company: 'FGF Brands',
    title: 'AI Solution Engineer Co-op',
    period: 'Sept 2026 – Present',
    location: 'Toronto, ON (Hybrid)',
    monogram: 'FG',
    logo: { src: '/experience/fgf.png', width: 104, height: 104 },
    current: true,
    context: 'A one-year co-op term building AI agent systems.',
    // From his LinkedIn, cut to three and stripped of adjectives ("scalable"). The
    // "collaborating with cross-functional teams" line said nothing, so it's out.
    bullets: [
      'Building a promotion pipeline that moves AI agents between environments without a rebuild, to cut deployment overhead and configuration drift.',
      'Adding live web search to AI chat agents: the backend services, the frontend integration, source citations, and the testing and validation tooling.',
      'Working in Python, Azure services and Docker with containerized deployments, and writing the technical docs and architecture guides for onboarding.',
    ],
    stack: ['Python', 'FastAPI', 'Azure', 'Docker'],
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
    company: 'Pet Valu',
    title: 'Assistant Manager',
    // LinkedIn closes the old TODO(verify) on the end date: Aug 2026. It also lists
    // the first title as Retail Sales Associate, not Animal Care Expert.
    period: 'Aug 2023 – Aug 2026',
    location: 'Richmond Hill, ON',
    monogram: 'PV',
    logo: { src: '/experience/pet-valu.jpg', width: 156, height: 156 },
    positions: [
      { title: 'Assistant Manager', since: 'Aug 2025' },
      { title: 'Retail Sales Associate', since: 'Aug 2023' },
    ],
    context:
      'Three years on the retail floor, promoted to Assistant Manager — and the reason BowlWise exists.',
    bullets: [
      'Trained new staff on service, nutrition basics, store routines, safety and the POS, and helped plan schedules and tasks.',
      'Tracked weekly sales patterns and adjusted product placement, signage and recommendations to match.',
      'Helped customers choose food by breed size, age, allergies and dietary goals.',
    ],
  },
  {
    company: 'Nova Ventures',
    title: 'Software Developer Intern',
    period: 'May – Aug 2025',
    location: 'Toronto, ON (Hybrid)',
    monogram: 'NV',
    logo: { src: '/experience/nova-ventures.png', width: 81, height: 83 },
    context: 'A goalkeeper analytics platform for competitive soccer teams.',
    bullets: [
      'Built backend API endpoints in Python and FastAPI for a goalkeeper analytics platform, exposing per-session performance data to the coaching dashboard.',
      'Built a data pipeline that parsed and cleaned match stats from club PDFs and spreadsheets into structured database tables for analysis.',
      'Built interactive React heatmap components that visualized save patterns across goal zones.',
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript'],
  },
  {
    company: 'Sepantech',
    // LinkedIn has the title and the March start; the old copy said "App Developer &
    // Database Intern" and May.
    title: 'Software Engineer Intern',
    period: 'Mar – Aug 2024',
    location: 'Sweden (Remote)',
    monogram: 'ST',
    logo: { src: '/experience/sepantech.jpg', width: 116, height: 116 },
    context: 'A course-management platform for healthcare and physiotherapy professionals.',
    bullets: [
      'Built core features for a course-management platform used by 500+ healthcare and physiotherapy professionals across Sweden: enrollment, progress tracking and automated certification.',
      // LinkedIn says "about thirty percent", so the copy does too.
      'Designed 6+ MySQL tables in a normalized schema and optimized 12+ queries with composite indexes, cutting average response time by about 30%.',
      'Built 8+ Node.js API endpoints for authentication, enrollment, progress updates and certificate generation, in an Agile team.',
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
