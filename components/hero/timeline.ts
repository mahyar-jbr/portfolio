/**
 * The opening's scroll timeline, shared by the CSS stage height, SigmaMorph and
 * ThroughTheM. Lengths are in svh of scroll while the hero is pinned:
 *
 *   MORPH  the formula turns into the name, details rise in       (SigmaMorph: p 0 → 1)
 *   HOLD   the landed hero rests, long enough to read
 *   ZOOM   details leave; the M fills with a photo and grows
 *          until the photo covers the screen                       (ThroughTheM: q 0 → 1)
 *
 * After the pin releases, ThroughTheM settles the full-screen photo into the
 * About section's portrait as the section scrolls in.
 *
 * styles/site.css sets `.sigma .hero-stage { height: calc(100svh + 240svh) }` —
 * keep TOTAL in step with it.
 */
export const MORPH = 110;
export const HOLD = 40;
export const ZOOM = 90;
export const TOTAL = MORPH + HOLD + ZOOM;

/** Where the pinned stage is, in page pixels: its start and how far it scrolls. */
export function stageSpan(hero: HTMLElement, stage: HTMLElement, sticky: HTMLElement) {
  return {
    top: hero.offsetTop + stage.offsetTop,
    dist: Math.max(1, stage.offsetHeight - sticky.offsetHeight),
  };
}
