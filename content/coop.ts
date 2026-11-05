import { sections } from './site';

/**
 * The Co-op ePortfolio (/coop): his COOP 2100 ePortfolio, which the course
 * grades (2026-11-05). It holds what the course still asks for (goals and
 * portfolios, reflections, competency tags, course projects, a purpose
 * statement and a self-assessment). About Me and Career are already the home
 * page's About and Experience, so it links to them rather than repeating them.
 *
 * Every line is his own and final, word for word from his brief: change it
 * only with him. Kept off the page, by the course's rules and his: raw quiz
 * scores or the EQ rating table (summaries only), anything confidential from
 * FGF Brands (no internal platform names, no coworker names), and his student
 * number, phone number, address or birthdate.
 *
 * The About Me essay is his PDF, published as he sent it (public/coop/).
 */

/** A link in the copy: an anchor on this page, another page of the site, or a file. */
export interface CoopLink {
  label: string;
  href: string;
  /** For a file to keep (the essay): the name it saves as. LinkOut makes it a download. */
  download?: string;
}

/** Words with links among them. */
export type CoopText = string | (string | CoopLink)[];

/** A line led by its label in bold: Reflection, Progress, a goal's area. */
export interface CoopLabelled {
  label: string;
  text: string;
}

/** A competency the course grades, and why the work shows it, in his words. */
export interface CoopTag {
  name: string;
  why: string;
}

/** A piece of evidence: what it is, line by line, and the competencies it shows. */
export interface CoopArtifact {
  title: string;
  /** Where the title leads: the work's own page, or the file itself. */
  link?: Omit<CoopLink, 'label'>;
  lines: (CoopText | CoopLabelled)[];
  tags: CoopTag[];
}

export interface CoopPortfolio {
  id: string;
  title: string;
  intro: string;
  artifacts: CoopArtifact[];
}

/** An entry of the contents: its name is the link, and a few words may follow it. */
export interface CoopEntry {
  label: string;
  href: string;
  note?: string;
  entries?: CoopEntry[];
}

/* ---------- Goal: Discover Myself, in four portfolios ---------- */

const dreams: CoopPortfolio = {
  id: 'dreams-and-goals',
  title: 'Dreams and Goals',
  intro: 'Where I come from, why I chose computer science, and where I want to go.',
  artifacts: [
    {
      title: 'About Me essay (PDF)',
      link: { href: '/coop/about-me.pdf', download: 'Mahyar_Jaberi_About_Me.pdf' },
      lines: [
        {
          label: 'Reflection',
          text: 'In this essay I wrote about growing up in Tehran, moving to Canada for grade 11 with weak English, and building BowlWise after three years at Pet Valu. Writing it next to my SWOT and values results showed me that my real strength is taking projects end to end, and that right now most of my values are about work. My long-term goal is to build my own AI company the way my dad built his, keeping his rules: never lose yourself, keep your work clean, and help people.',
        },
      ],
      tags: [
        { name: 'Communication Skills', why: 'a personal story written for a professional reader' },
        { name: 'Life-Long Learning', why: 'it connects where I started to where I am going' },
      ],
    },
  ],
};

const interests: CoopPortfolio = {
  id: 'interests-and-skills',
  title: 'Interests and Skills',
  intro: 'My skills assessments and the SMART goals I built from them.',
  artifacts: [
    {
      title: 'Skills assessments (summary)',
      lines: [
        'My Undergraduate Competencies Self-Assessment ranked three priorities for this year: communication, collaboration and leadership, and initiative and entrepreneurship. Agility and adaptability, critical thinking, curiosity and accessing information are already strengths.',
        'My learning style is mainly visual, so I plan and explain my work with diagrams.',
      ],
      tags: [{ name: 'Life-Long Learning', why: 'I used the results to decide what to work on next' }],
    },
    {
      title: 'SMART Personal Development Goals (2026 to 2027)',
      lines: [
        {
          label: 'Communication',
          text: 'By March 26, 2027, present a short update on my work in team meetings at least every two weeks (at least 10) and ask my manager monthly how clearly I explained it. By May 28, 2027, write a plain-language user guide for the finance team on the part of the internal platform I am building.',
        },
        {
          label: 'Collaboration and leadership',
          text: 'By December 11, 2026, bring three evidence-backed technical proposals to my manager or team, each shaped by a teammate’s input, and track how many are adopted. By January 29, 2027, have three coffee chats with people outside my team and follow up with each.',
        },
        {
          label: 'Initiative and entrepreneurship',
          text: 'By August 20, 2027, take one real team problem at FGF Brands to a deployed AI tool that at least one team uses. By February 26, 2027, publicly launch the AI personal finance app I co-founded, then hold 5 user conversations by April 30.',
        },
        {
          label: 'Progress (November 2026)',
          text: 'communication is on track, with clear updates in standup every day. One of my three proposals is done and adopted. My initiative goal starts with choosing a real team problem by November 27.',
        },
        {
          label: 'Reflection',
          text: 'I set these goals to answer my SWOT weaknesses: English as my second language, working mostly alone, and avoiding areas I don’t know yet. At the mid-point, communication is ahead of plan, and my next step is choosing a real team problem for my initiative goal by November 27.',
        },
      ],
      tags: [
        { name: 'Life-Long Learning', why: 'goals for my own development, tracked over the year' },
        { name: 'Communication Skills', why: 'two of the six goals target it directly' },
      ],
    },
  ],
};

const values: CoopPortfolio = {
  id: 'values-and-personality',
  title: 'Values and Personality',
  intro: 'What I value, how I learn, and how I handle emotions at work.',
  artifacts: [
    {
      title: 'My values (summary)',
      lines: [
        'My top values are seeing people use what I build, long-term effort, helping people, intellectually stimulating work, creative work and being my own boss. The assessment missed the two that matter most to me: honesty and hard work.',
      ],
      tags: [
        {
          name: 'Professionalism',
          why: 'my values decide how I work, such as flagging problems instead of shipping them',
        },
      ],
    },
    {
      title: 'Learning style at work',
      lines: [
        'I am mainly a visual learner. At work I plan and explain my architecture with diagrams, and reading the team’s code was the fastest way for me to learn a new codebase in my first week.',
      ],
      tags: [{ name: 'Life-Long Learning', why: 'knowing how I learn best helps me learn new tools faster' }],
    },
    {
      title: 'EQ reflection: the competency I am developing',
      lines: [
        'My EQ self-assessment showed that my lowest areas are empathy and conflict management. At my co-op, I told my manager a change needed more testing, but when I was told it was fine, I let it go, and the release broke for some users the next morning. I fixed it before the deadline, but the lesson was about me: raising a concern is not enough. The competency I am developing is conflict management: bringing a disagreement with a concrete plan, not just a worry.',
      ],
      tags: [
        { name: 'Professionalism', why: 'handling disagreement and pressure at work' },
        { name: 'Individual and Teamwork', why: 'a concern only helps if the team can act on it' },
      ],
    },
  ],
};

const credentials: CoopPortfolio = {
  id: 'building-credentials',
  title: 'Building Credentials',
  intro: 'Work I have built and recognition I have earned, at school, at work and on my own.',
  artifacts: [
    {
      title: 'BowlWise',
      link: { href: '/work/bowlwise' },
      lines: [
        'A dog food recommendation platform I built after three years at Pet Valu. It is live on customer tablets in two Pet Valu stores.',
        {
          label: 'Reflection',
          text: 'Customers kept asking me what to feed dogs with allergies, so I built a tool that answers honestly for each dog. It puts three of my values into practice: a product I can see, long-term effort, and helping people. People doubted it, but I kept going until it was live in stores.',
        },
      ],
      tags: [
        { name: 'Design', why: 'a complete product built for real users' },
        { name: 'Use of Engineering Tools', why: 'Python, FastAPI, React, Claude API' },
      ],
    },
    {
      title: 'Recognition',
      lines: [
        'My manager has told me she is very happy with how I explain and demo my work.',
        // His fix (2026-11-05): no FGF numbers on a public course page.
        'My first technical proposal at work was adopted: a change to how an AI agent uses its tools that made it cheaper and faster on our benchmarks.',
        '3rd of 30+ teams at the Boson AI Higgs Audio Hackathon, and a Georgian Build North finalist.',
      ],
      tags: [
        { name: 'Communication Skills', why: 'feedback on how I explain my work' },
        { name: 'Problem Analysis', why: 'the proposal came from profiling where the agent wasted calls' },
      ],
    },
  ],
};

const goal = {
  id: 'discover-myself',
  title: 'Goal: Discover Myself',
  intro:
    'Before I plan my career, I want to understand what drives me, what I am good at, and where I still need to grow. These four portfolios collect the assessments, goals and work that answer those questions.',
  portfolios: [dreams, interests, values, credentials],
};

/* ---------- Course Projects ---------- */

const courseProjects = {
  id: 'course-projects',
  title: 'Course Projects',
  intro: 'Selected course work, each tagged with the competency it shows.',
  projects: [
    {
      title: 'EECS 4070 Directed Studies: graph retrieval for clinical LLM agents',
      link: { href: '/work/graph-rag-fhir' },
      lines: [
        'Research with Prof. Manos Papagelis on how tool-calling LLM agents find information in FHIR health records.',
        {
          label: 'Reflection',
          // His fix (2026-11-05): the results stay under wraps here too, as on the research page.
          text: 'I built a tool that lets an agent follow the links between a patient’s records, and tested it the strict way: 1,489 agent runs under a test plan fixed before the main runs. The results are under wraps for now. This project pushed me into an area I didn’t know, which my SWOT lists as a weakness, and showed me how much I still have to learn.',
        },
      ],
      tags: [
        { name: 'Investigation', why: 'a planned experiment with statistical tests' },
        { name: 'Use of Engineering Tools', why: 'Python, FHIR, LLM agents' },
      ],
    },
    /* Both pieces of this course's work are evidence above already, so this
       points to them (no tags of its own: they carry theirs). */
    {
      title: 'COOP 2100: About Me and SMART goals',
      lines: [
        [
          'Both are in the goal sections above: the About Me essay in ',
          { label: dreams.title, href: `#${dreams.id}` },
          ', and the SMART goals in ',
          { label: interests.title, href: `#${interests.id}` },
          '.',
        ],
      ],
      tags: [],
    },
  ] satisfies CoopArtifact[],
};

/* ---------- Self-Assessment ---------- */

const selfAssessment = {
  id: 'self-assessment',
  title: 'Self-Assessment',
  body: 'Where I am strong: taking projects end to end, and adapting fast when priorities change. Where I am still growing: speaking confidently in my second language, raising disagreements with a plan, and slowing down to test before I ship. My next step is my initiative goal: one AI tool that a team at work actually uses.',
};

export const coop = {
  href: '/coop',
  /** The page's title, and the footer's link to it. */
  title: 'Co-op ePortfolio',
  /** Shown right under the title. The first sentence is also the page's description. */
  purpose: [
    'This ePortfolio shows who I am as an emerging AI engineer, the evidence behind my growth during my co-op at FGF Brands, and the goals I am working toward.',
    'It is organized around one goal, Discover Myself, with my course projects as proof of what I can build.',
  ],
  /**
   * Descriptive and linked. About Me and Career are the home page's sections;
   * the rest are this page's own, named as their headings are.
   */
  contents: {
    label: 'Contents',
    entries: [
      { label: 'About Me', href: `/#${sections.about.id}`, note: 'who I am and where I’m going' },
      { label: 'Career', href: `/#${sections.experience.id}`, note: 'experience, education and resume' },
      {
        label: goal.title,
        href: `#${goal.id}`,
        entries: goal.portfolios.map((p) => ({ label: p.title, href: `#${p.id}` })),
      },
      { label: courseProjects.title, href: `#${courseProjects.id}` },
      { label: selfAssessment.title, href: `#${selfAssessment.id}` },
    ] satisfies CoopEntry[],
  },
  /** Over each artifact's competency tags. */
  tagsLabel: 'Tags',
  goal,
  courseProjects,
  selfAssessment,
};
