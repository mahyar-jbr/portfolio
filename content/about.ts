/**
 * About section.
 *
 * Drafted 2026-08-08 from Mahyar's own answers — the phrasing is tightened but
 * every claim and every idea in here is his, not invented around him.
 *
 * The thesis is one sentence: he builds things people actually use. That is
 * genuinely what came back when asked why agents, what he cares about, and what
 * Pet Valu taught him — three separate questions, one answer. So the section
 * argues it once and lets the projects be the evidence.
 *
 * What's deliberately NOT here: "passionate about technology", "always learning",
 * "problem solver". Those are the sentences that make a person sound like a
 * template, and he already has better material than that.
 */

export const about = {
  /** Short version — for a hero sub-line, meta description, or nav peek. */
  short:
    'I build AI agent systems and full-stack products, and I care most about whether anyone actually ends up using them.',

  /** The main story. Three paragraphs; short on purpose. */
  story: [
    'For three years I worked the floor at Pet Valu, and ended up running it as Assistant Manager. Most of that time I was watching people try to make a decision they didn’t have enough information for — which food, which brand, what their dog actually needs. I had the AI and ML background to do something about it, so I did. BowlWise runs on the tablets in two of those stores now.',

    'That’s the reason I moved toward agents. Not because the technology is impressive — because it’s the most capable thing I have for making something genuinely useful. I care more about whether someone’s day got easier than whether the architecture was clever. The clever part only counts if the person on the other end notices a difference.',

    'The other half of me draws. In grade 11 and 12 I had the highest art mark in my school, and my piece Nightmare was exhibited in Aurora. There’s less time for it now, and most of that creative energy goes into what I build instead. It’s the same instinct either way — that a thing should feel right, not just work.',
  ],

  /**
   * Factual highlights. Every one is verifiable and specific.
   * No "5+ years experience" style filler — invented-sounding stats undercut the
   * real ones sitting next to them.
   */
  highlights: [
    {
      label: 'Retail floor to Assistant Manager',
      detail:
        'Three years at Pet Valu — sales, operating under pressure, leading a team, and talking to people all day. It’s also where BowlWise came from.',
    },
    {
      label: 'Exhibited artist',
      detail:
        // Venue confirmed by Mahyar 2026-08-08: Aurora City Hall, and Nightmare is the
        // only exhibited piece. data/artwork.js says "Aurora Art Gallery" — that's wrong
        // and must be corrected when gallery content migrates into content/.
        'Highest art mark in his school in grades 11 and 12; Nightmare (ink on paper, 2022) exhibited at Aurora City Hall.',
    },
    {
      label: 'Follows the question',
      detail:
        'Built football analytics professionally at Nova Ventures, then spent a course researching what passing networks reveal about coaches and player roles.',
    },
  ],
};

/**
 * The About section on the home page, right after the hero, told as a story
 * (2026-09-22): Travel → Play → Train → Build, then a coda with his paragraph.
 *
 * Mahyar gave the chapters as Play, Train, Travel, Build. Travel leads because
 * it is the strongest opening image: Preikestolen is 1350×2400 with him
 * centred, where the tennis shot is a 576×1024 export with him small in frame.
 * Swap the order back if he prefers, or when a full-resolution tennis photo
 * arrives.
 *
 * Lines are his, lightly edited: "travel" (on top of Preikestolen, Norway) ·
 * "i also really like to play sport like football and tennis" · "run and lift
 * weights" · "build random stuff" (the OpenAI and TMLS hackathons).
 *
 * `paragraph` is his own, lightly edited for flow and grammar with his phrasing
 * kept (2026-09-22): forced into CS in Grade 11, hated it, found a new way of
 * thinking; from drawing imaginary creatures to turning ideas into code; his
 * inner child; searching for greatness. Change it only with him.
 *
 * Photos are his (public/about/), resized to ≤2400px and stripped of all
 * metadata (the originals carry GPS). `position` is the focal point frames crop
 * around, so he stays in shot at any aspect.
 */
export interface StoryPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position: where he is in the photo. */
  position: string;
  /** The small glass caption on the photo: where, or what. */
  caption: { text: string; kind: 'place' | 'activity' | 'event' };
}

export interface StoryChapter {
  id: string;
  label: string;
  line: string;
  photos: StoryPhoto[];
}

export const aboutSection: { kicker: string; title: string; chapters: StoryChapter[]; paragraph: string } = {
  kicker: 'About',
  title: 'A bit about me',
  chapters: [
    {
      id: 'travel',
      label: 'Travel',
      line: 'I love to travel. This is me on top of Preikestolen, in Norway.',
      photos: [
        {
          src: '/about/preikestolen.jpg',
          width: 1350,
          height: 2400,
          alt: 'Mahyar standing on top of Preikestolen with his arms open, above the fjord in Norway',
          position: '50% 62%',
          caption: { text: 'Preikestolen, Norway', kind: 'place' },
        },
      ],
    },
    {
      id: 'play',
      label: 'Play',
      line: 'I really like playing sports, like football and tennis.',
      photos: [
        {
          src: '/about/tennis.jpg',
          width: 576,
          height: 1024,
          alt: 'Mahyar playing tennis on an outdoor court',
          position: '48% 70%',
          caption: { text: 'Tennis', kind: 'activity' },
        },
      ],
    },
    {
      id: 'train',
      label: 'Train',
      line: 'I run and lift weights.',
      photos: [
        {
          src: '/about/run.jpg',
          width: 1206,
          height: 2031,
          alt: 'Mahyar outside after a run',
          position: '50% 55%',
          caption: { text: 'After a run', kind: 'activity' },
        },
      ],
    },
    {
      id: 'build',
      label: 'Build',
      line: 'And I build random stuff, like at the OpenAI and TMLS hackathons.',
      photos: [
        {
          src: '/about/hackathon-openai.jpg',
          width: 2400,
          height: 1800,
          alt: 'Mahyar taking a selfie with his team at the OpenAI hackathon',
          position: '62% 55%',
          caption: { text: 'OpenAI hackathon', kind: 'event' },
        },
        {
          src: '/about/hackathon-tmls.jpg',
          width: 1800,
          height: 2400,
          alt: 'Mahyar talking with his team at the TMLS hackathon',
          position: '88% 28%',
          caption: { text: 'TMLS hackathon', kind: 'event' },
        },
      ],
    },
  ],
  paragraph:
    'My journey started in Grade 11, when I was forced to take computer science, and at the time I hated it. But it gave me a new way of thinking, and my creativity slowly moved from drawing imaginary creatures on paper to turning my ideas into code. Now here I am, always building something to keep my inner child happy and to keep searching for greatness. Thanks for reading.',
  // No "Also into" line (Mahyar, 2026-09-22): the story says it.
};
