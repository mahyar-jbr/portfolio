// Project data — resume-accurate (2026). Lineup: BowlWise, Maridian, MoneyMind,
// WealthTrack. Each framed Problem → Approach → Result for recruiter legibility.
// `caseStudy` slug → a dedicated /work/[slug] page; null → rich inline modal.

export const projects = [
  {
    id: 'bowlwise',
    title: 'BowlWise',
    tagline: 'Live on customer tablets in 2 PetValu stores.',
    badges: ['Live · 2 Stores', 'Solo Build'],
    live: true,
    tech: ['React', 'FastAPI', 'MongoDB', 'Python', 'Pydantic', 'Docker'],
    problem:
      "Pet owners can't tell which of 150 foods actually fits their dog's breed, allergies, and activity level.",
    approach:
      'Scored every product against vet nutrition standards (AAFCO/NRC/WSAVA) and built a 7-step profile wizard, product overlays, and a side-by-side comparison tool — tuned for in-store tablets.',
    result:
      'Shipped solo end-to-end, now live in 2 PetValu stores. 20 FastAPI endpoints over a 4-collection MongoDB schema, magic-link auth, rate limiting, 61 automated tests.',
    liveDemo: 'https://bowlwise.app',
    github: null,
    caseStudy: null,
    images: [
      '/projects/bowlwise1.png',
      '/projects/bowlwise2.png',
      '/projects/bowlwise3.png',
      '/projects/bowlwise4.png',
    ],
    year: '2026',
  },
  {
    id: 'maridian',
    title: 'Maridian',
    tagline: 'A six-agent AI system — technical lead, 5-person team.',
    badges: ['TMLS 2026', 'Tech Lead', 'Live Demo'],
    live: true,
    tech: ['Next.js', 'React', 'Python', 'FastAPI', 'Pydantic', 'SQLite'],
    problem:
      'Factory staff needed a faster way to triage flagged product defects and decide customer-facing actions.',
    approach:
      'Led the technical build of a six-agent AI system end to end — owning the architecture, API contract, deployment, and the operator/distributor web portals where staff review defects, see the AI recommendation, and approve status updates.',
    result:
      'Demoed at the TMLS 2026 Agentic AI Hackathon. Diagnosed and fixed a production outage failing every API route — traced to a database path resolving outside the deploy directory — and shipped the fix that restored the live service.',
    liveDemo: 'https://fgf-sentinel-web.vercel.app/maridian/login.html',
    github: null,
    caseStudy: 'maridian',
    images: [],
    year: '2026',
  },
  {
    id: 'moneymind',
    title: 'MoneyMind',
    tagline: 'A streaming AI finance agent — architecture lead.',
    badges: ['Google Cloud Hackathon', 'Architecture Lead'],
    live: false,
    tech: ['Next.js', 'React', 'FastAPI', 'MongoDB Atlas', 'LangGraph', 'Gemini'],
    problem:
      'Make personal finance conversational — answer real questions over a user’s actual transaction data.',
    approach:
      'Architected a three-layer system (Next.js, FastAPI, MongoDB Atlas) as architecture lead, built the agent service in FastAPI, and designed the Atlas schema and 1024-dim vector index the rest of the stack runs on.',
    result:
      'Built and verified an end-to-end streaming pipeline (Next.js → FastAPI → LangGraph → Atlas → Gemini) delivering token-by-token responses from real transaction data.',
    liveDemo: null,
    github: 'https://github.com/mahyar-jbr/MoneyMind',
    caseStudy: 'moneymind',
    images: [],
    year: '2026',
  },
  {
    id: 'wealthtrack',
    title: 'WealthTrack',
    tagline: 'A cross-platform mobile investing tracker.',
    badges: ['iOS + Android'],
    live: false,
    tech: ['React Native', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL'],
    problem:
      'Track stocks, crypto, and ETFs with real-time prices and portfolio analytics in one mobile app.',
    approach:
      'Built a single-codebase React Native / Expo app for iOS and Android with a PostgreSQL + Prisma REST API, JWT/bcrypt auth, and a price-caching layer.',
    result:
      'Real-time pricing via Yahoo Finance + CoinGecko; caching cut external API calls ~60%; 12-endpoint REST API with full CRUD and a portfolio analytics engine.',
    liveDemo: null,
    github: 'https://github.com/mahyar-jbr/wealthtrack-mobile',
    caseStudy: null,
    images: [
      '/projects/wealthtrack-dashboard.jpg',
      '/projects/wealthtrack-asset.jpg',
      '/projects/wealthtrack-add.jpg',
    ],
    year: '2026',
  },
];
