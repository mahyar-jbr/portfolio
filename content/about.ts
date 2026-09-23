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
 * The About section on the home page (added 2026-09-22), right after the hero:
 * photos of Mahyar, a short paragraph about him and his goal, and what he's into.
 *
 * `paragraph` is Mahyar's own (2026-09-22), lightly edited for flow with his
 * phrasing kept: forced into CS in grade 11, hated it, found a new way of
 * thinking; from drawing imaginary creatures to turning ideas into code; the
 * inner child; searching for greatness. Change it only with him.
 *
 * PLACEHOLDERS until Mahyar sends them:
 *   - `photos` — public/about/photo-1…5.jpg are neutral stand-ins. Replace the
 *     files (4:5 portrait works best for the first; any aspect for the rest),
 *     then update each `alt` and flip `placeholder` off.
 * The first photo is the one the hero's M opens onto.
 */
export const aboutSection = {
  kicker: 'About',
  title: 'A bit about me',
  paragraph:
    'This journey started in grade 11, when I was forced to take computer science, and at the time I hated it. But it gave me a new way of thinking, and my creativity slowly moved from drawing imaginary creatures on paper to turning my ideas into code. Now here we are: always building something, to keep the inner child happy and keep searching for greatness. Thanks for reading.',
  interests: ['Drawing', 'Gym', 'Football', 'Anime', 'DC and Marvel', 'Series and movies'],
  photos: [
    { src: '/about/photo-1.jpg', width: 1600, height: 2000, alt: 'Placeholder for a photo of Mahyar', placeholder: true },
    { src: '/about/photo-2.jpg', width: 1600, height: 2000, alt: 'Placeholder for a photo of Mahyar', placeholder: true },
    { src: '/about/photo-3.jpg', width: 1600, height: 2000, alt: 'Placeholder for a photo of Mahyar', placeholder: true },
    { src: '/about/photo-4.jpg', width: 1600, height: 2000, alt: 'Placeholder for a photo of Mahyar', placeholder: true },
    { src: '/about/photo-5.jpg', width: 1600, height: 2000, alt: 'Placeholder for a photo of Mahyar', placeholder: true },
  ],
};
