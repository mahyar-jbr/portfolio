/**
 * The opening's scroll timeline, shared by the CSS stage height and SigmaMorph.
 * Lengths are in svh of scroll while the hero is pinned:
 *
 *   MORPH  the formula turns into the name, details rise in       (SigmaMorph: p 0 → 1)
 *   HOLD   the landed hero rests, long enough to read
 *
 * Then the pin releases and the page scrolls on normally into About.
 * (Mahyar, 2026-09-22: no zoom through the M into About — a regular scroll.)
 *
 * styles/site.css sets `.sigma .hero-stage { height: calc(100svh + 150svh) }` —
 * keep TOTAL in step with it.
 */
export const MORPH = 110;
export const HOLD = 40;
export const TOTAL = MORPH + HOLD;

/** Where the pinned stage is, in page pixels: its start and how far it scrolls. */
export function stageSpan(hero: HTMLElement, stage: HTMLElement, sticky: HTMLElement) {
  return {
    top: hero.offsetTop + stage.offsetTop,
    dist: Math.max(1, stage.offsetHeight - sticky.offsetHeight),
  };
}
