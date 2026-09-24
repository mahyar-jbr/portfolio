/**
 * The journey to a section: what "Work" in the nav, or "View my work" in the
 * hero, does to the page (Mahyar, 2026-09-23: it must not be "laggy and bad").
 *
 * The browser's own smooth scroll dragged the page through everything in
 * between: 1.1 to 1.5s in Chrome, through the pinned About story, the cards and
 * the gallery; 0.2s in Safari, which flashes 8,000px by in 13 frames. The lens
 * walked through every item it passed, and a section still waiting on its
 * reveal landed 12px past its place. Now:
 *
 * - Near (within 1.5 screens): the page glides there on a spring, critically
 *   damped so it never swings past, re-measuring the section every frame so it
 *   lands exactly even if the page shifts under it.
 * - Far: the page doesn't travel through what lies between. Under a short
 *   cross-fade (a view transition, like the kit's page swap and theme change)
 *   it is set down just under a third of a screen short of the section and
 *   glides the rest: the old view drifts off the way the page is moving as it
 *   fades, the new one arrives and settles. The capsule and the theme button
 *   stay put, live, over it (styles/site.css, "Navigation journey").
 * - Reduced motion: the page is simply there, under a fade of 150ms at most.
 *
 * Either way the lens goes straight to the section's item, and the section
 * takes focus once it has landed (keyboards and screen readers continue from
 * it). A wheel, a touch or a scrolling key hands the page straight back; a
 * click on another link sets a new course from wherever the page is.
 */
import { prefersReducedMotion } from './lucent';

/** Closer than this many screens, the page glides the whole way. */
const NEAR = 1.5;
/** A far journey glides this much of a screen at its end. */
const LAND = 0.3;
/**
 * The glide is a spring, critically damped so the page never swings past its
 * section, at 20 rad/s (stiffness 400): a screen's glide is within 2px of it
 * in about 0.4s, the last stretch of a far journey in 0.25s. The kit's lens
 * spring (260) took half a second over a short hop, longer than a far journey.
 */
const OMEGA = 20;
/** However the page shifts under it, a glide lands within this long (ms). */
const LIMIT = 2500;

type Nav = HTMLElement & { __luLens?: Lucent.LensApi };

interface Glide {
  el: HTMLElement;
  /** where the page is on the spring (px, fractional) and how fast it moves (px/s) */
  x: number;
  v: number;
  /** where the section was last frame, and the scroll position we last set */
  to: number;
  written: number;
  start: number;
  last: number;
  raf: number;
}

let glide: Glide | null = null;
let fold: ViewTransition | null = null;
/** bumped by every new journey and every stop, so a late callback knows it is stale */
let course = 0;
let arrival: { path: string; hash: string; at: number } | null = null;

const root = () => document.documentElement;
const viewport = () => root().clientHeight;

/**
 * Where the page rests with `el` arrived: its top at its scroll-margin
 * (styles/site.css), within the page. Layout positions, not the painted box,
 * so a section still waiting on its reveal (drawn 12px low) lands where it
 * will rest.
 */
function destination(el: HTMLElement): number {
  let top = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const max = root().scrollHeight - viewport();
  return Math.round(Math.max(0, Math.min(max, top - margin)));
}

function scrollToY(y: number): void {
  window.scrollTo({ top: y, behavior: 'instant' });
}

/* ---------- Focus ----------
 * The section takes focus where the page lands, so Tab and a screen reader go
 * on from it. It isn't a control, so it gets no ring (site.css). A key still
 * held keeps focus where it is until it's released: the nav item's soft press
 * springs back on that keyup. */

let held = false;
function onKeyState(e: Event) {
  held = e.type === 'keydown';
}
/* from the first keystroke on, so the Enter that starts a journey is seen */
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeyState, true);
  window.addEventListener('keyup', onKeyState, true);
  window.addEventListener('blur', onKeyState);
}

function focusOn(el: HTMLElement): void {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1');
      el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
    }
    el.focus({ preventScroll: true });
  };
  if (!held) return go();
  window.addEventListener('keyup', go, { once: true, capture: true });
  /* a key held down (or let go outside the window) doesn't keep focus away for long */
  setTimeout(go, 1000);
}

/* ---------- The lens ----------
 * The lens goes to the section's item once (a nav item's own click has already
 * sent it) and stays there while the page travels: the kit's scroll spy, which
 * moves it through every section the page passes, is held off until the page
 * lands. The spy only holds off for 900ms after a nav click, and not at all
 * after the hero's buttons. To #top there is no item: the lens stays where it
 * is and fades as the hero comes back (NavHandoff). */
let hold: { lens: Lucent.LensApi; select: Lucent.LensApi['select'] } | null = null;

function holdLens(el: HTMLElement): void {
  releaseLens();
  const lens = document.querySelector<Nav>('.site-nav .lu-nav')?.__luLens;
  if (!lens) return;
  const item = lens.items.find((it) => it.getAttribute('href') === `#${el.id}`) ?? null;
  if (item && lens.current !== item) lens.select(item);
  const select = lens.select;
  /* the spy calls the lens's select; a click on an item calls the kit's own */
  lens.select = (it, instant) => {
    if (it === item) select(it, instant);
  };
  hold = { lens, select };
}

function releaseLens(): void {
  if (!hold) return;
  hold.lens.select = hold.select;
  hold = null;
}

/* ---------- Handing the page back ---------- */

const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** The capsule's links and the theme button: the controls that stay on screen through a journey. */
function controlAt(x: number, y: number): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>('.site-nav a[href], .site-theme')) {
    const r = el.getBoundingClientRect();
    if (r.width && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return el;
  }
  return null;
}

function onWheel() {
  stop();
}
function onKey(e: KeyboardEvent) {
  if (SCROLL_KEYS.has(e.key)) stop();
}
/* A press on the capsule may be the next journey: its click sets the course. */
function onPointer(e: PointerEvent) {
  if (!controlAt(e.clientX, e.clientY)) stop();
}
/* Through the cross-fade a view transition takes every click (the target is
   <html>), so a click on the capsule is passed on to the link under it. */
function onClick(e: MouseEvent) {
  if (!fold || e.target !== root()) return;
  const el = controlAt(e.clientX, e.clientY);
  if (!el) return;
  e.preventDefault();
  el.click();
}

let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointerdown', onPointer, true);
  window.addEventListener('click', onClick, true);
}
function unlisten() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('pointerdown', onPointer, true);
  window.removeEventListener('click', onClick, true);
}

/** Ends the journey where the page is: a scroll or a touch took over. */
function stop(): void {
  course++;
  if (glide) cancelAnimationFrame(glide.raf);
  glide = null;
  const f = fold;
  fold = null;
  f?.skipTransition();
  unlisten();
  releaseLens();
}

/* ---------- The glide ---------- */

function run(now: number) {
  const g = glide;
  if (!g) return;
  const to = destination(g.el);
  const moved = window.scrollY - g.written;
  if (Math.abs(moved) > 2) {
    /* The browser held what's on screen in place as the page above it changed
       height (scroll anchoring): the section moved by as much, so carry on from
       there. Anything else moving the page (the scrollbar, find in page) is the
       reader, who has it now. */
    if (Math.abs(moved - (to - g.to)) > 2) {
      stop();
      return;
    }
    g.x += moved;
  }
  g.to = to;
  const dt = g.last ? Math.min((now - g.last) / 1000, 0.1) : 1 / 60;
  g.last = now;
  /* the critically damped spring's exact step: e(t) = (e + (v + ωe)t)·e^(−ωt) */
  const e = g.x - to;
  const b = g.v + OMEGA * e;
  const decay = Math.exp(-OMEGA * dt);
  g.x = to + (e + b * dt) * decay;
  g.v = (g.v - OMEGA * b * dt) * decay;
  if ((Math.abs(g.x - to) < 0.5 && Math.abs(g.v) < 20) || now - g.start > LIMIT) {
    scrollToY(to);
    glide = null;
    if (!fold) unlisten();
    releaseLens();
    focusOn(g.el);
    return;
  }
  scrollToY(g.x);
  g.written = window.scrollY;
  g.raf = requestAnimationFrame(run);
}

/** Glides to `el` from where the page is at `v` px/s; one already under way just changes course. */
function glideTo(el: HTMLElement, v: number) {
  listen();
  if (glide) {
    glide.el = el;
    glide.to = destination(el);
    glide.start = performance.now();
    return;
  }
  const y = window.scrollY;
  glide = { el, x: y, v, to: destination(el), written: y, start: performance.now(), last: 0, raf: 0 };
  glide.raf = requestAnimationFrame(run);
}

/* ---------- The far journey ---------- */

/* View Transitions, and none already running (the kit's page swap, the theme change) */
function canFade(): boolean {
  return (
    typeof document.startViewTransition === 'function' && !root().matches('.lu-vt-page, .lu-vt-theme, .theme-reveal')
  );
}

/* The kit's reveal would raise what the page lands on a second time after the
   fade: in the view the journey lands in, it arrives at rest. */
function settleInView(from: number, to: number) {
  const vh = viewport();
  const lo = Math.min(0, to - from);
  const hi = vh + Math.max(0, to - from);
  document.querySelectorAll('.lu-pending').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom > lo && r.top < hi) el.classList.remove('lu-pending');
  });
}

/* Runs `update` under the journey's cross-fade (styles/site.css), as the
   journey's own: input hands the page back through it, and the capsule takes
   clicks through it (onClick). */
function fade(update: () => void): ViewTransition {
  const html = root();
  html.classList.add('site-journey');
  listen();
  const vt = document.startViewTransition(update);
  fold = vt;
  vt.finished.finally(() => {
    if (fold === vt) fold = null;
    if (!fold) {
      html.classList.remove('site-journey');
      if (!glide) unlisten();
    }
  });
  return vt;
}

function travel(el: HTMLElement, to: number) {
  stop();
  const id = course;
  const from = window.scrollY;
  const dir = Math.sign(to - from);
  const land = Math.min(Math.abs(to - from), Math.round(viewport() * LAND));
  const start = to - dir * land;
  root().style.setProperty('--journey-drift', `${-dir * land}px`);
  const vt = fade(() => {
    /* a journey begun since (a second click within a frame) has the page */
    if (course !== id) return;
    scrollToY(start);
    settleInView(start, to);
  });
  /* arriving at the speed a spring would carry it the last stretch, so the
     new view picks up the old one's drift and settles */
  const go = () => {
    if (course === id) glideTo(el, dir * OMEGA * land);
  };
  vt.ready.then(go, go);
}

/** Reduced motion: no travel, the page is there (a fade of at most 150ms). */
function jump(el: HTMLElement, to: number) {
  stop();
  const id = course;
  holdLens(el);
  if (canFade()) {
    root().style.removeProperty('--journey-drift');
    fade(() => {
      if (course === id) scrollToY(to);
    }).finished.finally(() => {
      if (course === id) releaseLens();
    });
  } else {
    scrollToY(to);
    releaseLens();
  }
  focusOn(el);
}

/** Takes the page to `el`, a section (or #top). */
export function journeyTo(el: HTMLElement): void {
  warm(el);
  const to = destination(el);
  if (prefersReducedMotion()) {
    jump(el, to);
    return;
  }
  const y = glide ? glide.x : window.scrollY;
  if (Math.abs(to - y) > viewport() * NEAR && canFade()) {
    travel(el, to);
  } else {
    /* a fade still waiting to set the page down would move it under this glide */
    if (fold && !glide) stop();
    glideTo(el, 0);
  }
  holdLens(el);
}

/**
 * Starts loading the images the page will land among (they wait for the
 * reader to scroll near them), as soon as a link to them is pointed at,
 * focused or pressed: a first visit then lands on the pictures, not on their
 * empty frames filling in after the page has settled.
 */
export function warm(el: HTMLElement): void {
  const vh = viewport();
  const top = destination(el) - vh * LAND;
  const bottom = destination(el) + vh * 1.5;
  document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
    const r = img.getBoundingClientRect();
    const y = r.top + window.scrollY;
    if (y < bottom && y + r.height > top) img.loading = 'eager';
  });
}

/* ---------- Arriving from another page ----------
 * A link to /#work from a case study swaps the page (lib/lucent.ts navigate).
 * The runtime calls arrive() once the new page is wired, inside the swap, so
 * the swap's new view is already the section: no second jump once it shows. */

/** Notes that the route change about to happen should land on `hash` of `path`. */
export function expectArrival(path: string, hash: string): void {
  arrival = { path, hash, at: performance.now() };
}

/** Lands a pending arrival on this page, if there is one. */
export function arrive(): void {
  const a = arrival;
  arrival = null;
  if (!a || a.path !== window.location.pathname || performance.now() - a.at > 5000) return;
  const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
  if (!el) return;
  stop();
  scrollToY(destination(el));
  focusOn(el);
}
