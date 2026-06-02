// Deep-dive case-study content for the two AI flagships.
// Keyed by slug → /work/[slug]. Resume-accurate; some technical specifics
// (agent breakdown, decision rationales) are INFERRED and flagged for Mahyar to
// verify — search "VERIFY" before publishing.

export const caseStudies = {
  maridian: {
    slug: 'maridian',
    title: 'Maridian',
    oneLiner: 'A six-agent AI system for factory defect triage.',
    badges: ['TMLS 2026', 'Technical Lead', 'Live Demo'],
    stack: ['Next.js', 'React', 'Python', 'FastAPI', 'Pydantic', 'SQLite'],
    links: {
      demo: 'https://fgf-sentinel-web.vercel.app/maridian/login.html',
      code: null,
    },
    glance: {
      Role: 'Technical Lead',
      Team: '5 people',
      Context: 'TMLS 2026 Agentic AI Hackathon',
      Owned: 'Architecture · API contract · deployment · operator UI',
    },
    problem:
      'Factory staff had no fast, consistent way to triage flagged product defects and decide the right customer-facing action. Reviews were manual, slow, and hard to keep consistent across a team — and a wrong call has real cost downstream.',
    approach:
      'I led the technical build of a six-agent AI system end to end. Rather than one monolithic model, the work is split across specialized agents — each independently promptable and testable — coordinated by an orchestrator, with operator and distributor web portals on top where staff review a flagged defect, see the AI’s recommended action, and approve the customer status update.',
    // VERIFY: agent breakdown inferred to illustrate the topology — correct to match the real system.
    diagram: 'agents',
    decisions: [
      {
        decision: 'A multi-agent split instead of one large prompt',
        why: 'Separating intake, classification, recommendation, and review into distinct agents means each has one job, can be prompted and tested in isolation, and can be reasoned about when something goes wrong — far more maintainable than one opaque mega-prompt.',
      },
      {
        decision: 'An operator-in-the-loop portal, not full automation',
        why: 'The AI recommends; a human approves. For decisions with real customer cost, keeping a person in the loop builds trust and gives a clean audit trail — the agents accelerate the human rather than replace them.',
      },
      {
        decision: 'Owned the API contract up front',
        why: 'With a 5-person team moving fast, locking the FastAPI contract early let the frontend and agent work proceed in parallel without constant renegotiation.',
      },
    ],
    warStory: {
      title: 'The production outage',
      body: 'During the build, every API route started failing in production at once — the kind of total outage that kills a demo. I traced it methodically: not the code logic, not the agents, but a database path that resolved correctly in development and outside the deploy directory in production. I shipped a fix that corrected the path resolution and restored the live service. It’s the part I’m most proud of — staying systematic under pressure and owning the fix end to end.',
    },
    result:
      'Demoed live at the TMLS 2026 Agentic AI Hackathon as a working six-agent system with functioning operator and distributor portals — and a production incident diagnosed and fixed under time pressure.',
    resultMetrics: [
      { value: '6', label: 'Coordinated agents' },
      { value: '5-page', label: 'Operator/distributor UI' },
      { value: '0', label: 'Downtime after the fix' },
    ],
    next: { slug: 'moneymind', title: 'MoneyMind' },
  },

  moneymind: {
    slug: 'moneymind',
    title: 'MoneyMind',
    oneLiner: 'A streaming AI finance agent over real transaction data.',
    badges: ['Google Cloud Hackathon', 'Architecture Lead'],
    stack: ['Next.js', 'React', 'FastAPI', 'MongoDB Atlas', 'LangGraph', 'Gemini'],
    links: {
      demo: null,
      code: 'https://github.com/mahyar-jbr/MoneyMind',
    },
    glance: {
      Role: 'Architecture Lead',
      Team: '3 people',
      Context: 'Google Cloud Agent Hackathon',
      Owned: 'System architecture · agent service · Atlas schema + vector index',
    },
    problem:
      'Personal finance tools show you charts, not answers. The goal was to make finance conversational — let someone ask plain-language questions and get grounded responses about their own actual spending, not generic advice or hallucinated numbers.',
    approach:
      'As architecture lead I designed a three-layer system — Next.js client, a FastAPI agent service, and MongoDB Atlas — and built the agent service and the Atlas schema and 1024-dim vector index the rest of the stack runs on. A LangGraph agent retrieves the user’s relevant transactions by semantic similarity and streams a grounded answer back token by token through Gemini.',
    diagram: 'pipeline',
    decisions: [
      {
        decision: 'A 1024-dim vector index on the user’s transactions',
        why: 'So the agent answers from the user’s real data. Embedding transactions and retrieving by semantic similarity grounds every response in what actually happened — the difference between “you spent $312 on groceries” and a plausible-sounding guess.',
      },
      {
        decision: 'Token-by-token streaming end to end',
        why: 'Perceived latency matters more than total latency. Streaming the response as it generates lets the user see the agent thinking immediately, instead of staring at a spinner — and it forced a clean async path through every layer.',
      },
      {
        decision: 'A three-layer separation (client / agent service / data)',
        why: 'Isolating the agent service behind FastAPI kept the LLM and vector logic independently testable and let the rest of a 3-person team build against a stable contract.',
      },
    ],
    warStory: null,
    result:
      'Built and verified a working end-to-end streaming pipeline — Next.js → FastAPI → LangGraph → Atlas → Gemini — delivering token-by-token responses grounded in a user’s real transaction data, presented at the Google Cloud Agent Hackathon.',
    resultMetrics: [
      { value: '1024-d', label: 'Vector index' },
      { value: '3-layer', label: 'Architecture' },
      { value: 'token-by-token', label: 'Streaming' },
    ],
    next: { slug: 'maridian', title: 'Maridian' },
  },
};

export const caseStudySlugs = Object.keys(caseStudies);
