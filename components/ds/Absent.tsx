import { Label, Row } from './Kit';

/* A design system is defined as much by what it refuses. These are the effects
   that read as generated — they cluster on AI-built portfolios because they
   ship as copy-paste components, which is exactly why they signal the opposite
   of craft. Listed so the rule is checkable rather than vibes. */

const BANNED: [string, string][] = [
  [
    'Cursor-following spotlight',
    'The headline component of every generated-UI library. It was built here, then cut.',
  ],
  [
    'Aurora / mesh gradient blobs',
    'Drifting coloured washes behind the hero. Also built, also cut.',
  ],
  ['Gradient text', 'Purple-to-pink clipped headings. Never.'],
  ['Violet / indigo accent', 'The untouched shadcn default. Ours is a measured navy.'],
  ['Bento grids', 'A layout that exists to fill space, not to serve content.'],
  ['Dot-grid or graph-paper backdrops', 'Texture standing in for hierarchy.'],
  ['Count-up number tickers', 'Metrics belong in the sentence that earned them.'],
  ['Tilt-on-hover cards', '3D transform as decoration, unrelated to what the card does.'],
  ['Marquee logo strips', 'There is nothing to scroll — and no logos to borrow credibility from.'],
  ['Typewriter hero text', 'Delays the one sentence that has to land immediately.'],
  ['Emoji as section markers', '✨ is not a design system.'],
  ['Animated gradient borders', 'Motion with no meaning and a permanent repaint.'],
];

const KEPT: [string, string][] = [
  [
    'Directional rim light',
    'The specular gradient rotates toward the pointer — what a real bevel does under a moving light.',
  ],
  [
    'Press physics',
    'Scale and shadow collapse together, because an object pushed toward a surface casts a tighter shadow.',
  ],
  [
    'Scroll-reactive nav',
    'The glass thickens once content passes beneath it. Contextual, not decorative.',
  ],
  [
    'Springs from Apple’s own values',
    'Bounce 0.0 to 0.30, generated and simulated — not Framer’s 0.44 default.',
  ],
  [
    'Squircle corners',
    'Continuous curvature where the browser supports it, plain radius everywhere else.',
  ],
];

export default function Absent() {
  return (
    <div>
      <Row>
        <Label>Deliberately absent</Label>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {BANNED.map(([t, why]) => (
            <li key={t} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-4 shrink-0 bg-n-8"
              />
              <span className="min-w-0">
                <span className="text-[15px] text-n-11 line-through decoration-n-7">
                  {t}
                </span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-n-9">
                  {why}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Row>

      <Row>
        <Label>Kept — because each one is doing a job</Label>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {KEPT.map(([t, why]) => (
            <li key={t} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-a-9"
              />
              <span className="min-w-0">
                <span className="text-[15px] font-medium text-ink">{t}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-n-10">
                  {why}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Row>

      <p className="max-w-2xl text-sm leading-relaxed text-n-10">
        The test for anything new: does it describe a physical property of the
        material, or a state the interface is actually in? If it&rsquo;s neither,
        it&rsquo;s ornament — and ornament is what makes a site look generated.
      </p>
    </div>
  );
}
