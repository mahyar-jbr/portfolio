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
 *   stay put, live, over it (styles/site.css, "Navigation journey"). Without
 *   view transitions the page dips out and back instead, as the kit's page
 *   swap does without them, and is set down just as short.
 * - Reduced motion: the page is simply there, as the kit's own scrollTo does.
 *
 * Either way the lens goes straight to the section's item. Once the page has
 * landed, the section takes focus (keyboards and screen readers continue from
 * it) and the address names it, until the reader leaves for another page. A
 * wheel, a touch or a scrolling key hands the page straight back, except the
 * momentum of a flick made just before the click, which the journey rides out;
 * a click on another link sets a new course from wherever the page is.
 */
import { prefersReducedMotion } from './lucent';

/** Closer than this many screens, the page glides the whole way. */
const NEAR = 1.5;
/** A far journey glides this much of a screen at its end (and the old view drifts as far: 30svh, styles/site.css). */
const LAND = 0.3;
/**
 * The glide is a spring, critically damped so the page never swings past its
 * section. A hop within reach moves at 26 rad/s: a screen in about a third of a
 * second, most of it in the first 150ms, where 20 took half a second over two
 * thirds of a screen (Safari's own smooth scroll takes 0.2s). The last stretch
 * of a far journey keeps 20 rad/s (stiffness 400), settling in 0.28s as the
 * cross-fade ends. A glide is done once it is within 1px and nearly still:
 * closer than that, nothing the eye can see moves.
 */
const OMEGA_NEAR = 26;
const OMEGA = 20;
/** However the page shifts under it, a glide lands within this long (ms). */
const LIMIT = 2500;
/**
 * Wheel events further apart than this (ms) belong to separate gestures. A
 * trackpad sends them every 8 to 17ms; the rest is room for a page busy
 * setting down a cross-fade, which holds them back (see fileWheel).
 */
const GAP = 200;
/**
 * Momentum slows, steadily, where a hand turning a wheel or moving on a
 * trackpad keeps its pace or picks it up. A gesture counts as momentum while
 * each event moves the page less than SLOWING times the furthest one of 30
 * to 150ms before, or it has slowed to a crawl (under CRAWL px/ms, a few px a
 * frame: a flick's tail, whose events come in at the same 1 or 2px). See
 * slows().
 */
const SLOWING = 0.97;
const CRAWL = 0.25;

type Nav = HTMLElement & { __luLens?: Lucent.LensApi };

interface Glide {
  el: HTMLElement;
  /** where the page is on the spring (px, fractional) and how fast it moves (px/s) */
  x: number;
  v: number;
  /** how stiff the spring is (rad/s) */
  omega: number;
  /** where the section was last frame, and the scroll position we last set */
  to: number;
  written: number;
  start: number;
  last: number;
  raf: number;
}

let glide: Glide | null = null;
let fold: ViewTransition | null = null;
/** the fade out or back in of a far journey without view transitions */
let dip: Animation | null = null;
/** the frame that keeps a landed page in place while a flick's momentum drains */
let stayRaf = 0;
/** bumped by every new journey and every stop, so a late callback knows it is stale */
let course = 0;
/** when the current journey began (performance.now()) */
let begun = 0;
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

/* ---------- Momentum ----------
 * A flick on a trackpad goes on sending wheel events after the fingers lift,
 * slowing, for up to a second; and once a gesture has begun unprevented,
 * browsers send the rest of it uncancellable. A reader who flicks and then
 * clicks the nav hasn't taken the page back. So every wheel event is filed
 * into gestures: one goes on while its events keep coming (within GAP of each
 * other), the same way, and no faster. A pause, a turn or a push starts a new
 * one. A journey begun while a gesture was slowing (see SLOWING) rides out
 * its momentum: it swallows the events it can, and holds its course over the
 * ones it can't. Anything else hands the page back: the next gesture, or this
 * one keeping its pace (a wheel still turning after the click). */

interface Gesture {
  sign: number;
  /** when its last event was sent (Event.timeStamp), and when the page got it */
  at: number;
  seen: number;
  /** its speed and the one before (px/ms) */
  speed: number;
  was: number;
  /** its events of the last 150ms or so: when each was sent, how far it moved the page (px), and its speed (px/ms) */
  trail: { at: number; d: number; v: number }[];
  /** whether it was slowing as momentum does, as of its last event */
  slowing: boolean;
}
let gesture: Gesture | null = null;
/** the gesture a journey began in */
let coast: Gesture | null = null;

/**
 * Whether `g` slows as momentum does, as of its last event. By how far each
 * event moves the page, as the events come evenly: a page busy for a moment
 * gets those sent meanwhile merged into one, which moves it further in a
 * longer time, so that one is weighed by its speed instead. (Speed alone
 * mistook a wheel's even notches, a little unevenly spaced, for slowing.)
 * Against the furthest of 30 to 150ms before (or, the events being sparse,
 * the last before that), as a flick's events move the page by whole px:
 * several in a row can move it the same, still slowing.
 */
function slows(g: Gesture): boolean {
  const last = g.trail[g.trail.length - 1];
  if (last.v < CRAWL) return true;
  let d = -1;
  let v = 0;
  for (let i = g.trail.length - 2; i >= 0; i--) {
    const ref = g.trail[i];
    const age = last.at - ref.at;
    if (age < 30) continue;
    if (age > 150 && d >= 0) break;
    d = Math.max(d, ref.d);
    v = Math.max(v, ref.v || 0);
    if (age > 150) break;
  }
  if (d < 0) return false;
  return last.d < d * SLOWING || (last.d > d && last.v < v * SLOWING);
}

function fileWheel(e: WheelEvent) {
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport() : 1);
  if (!dy) return;
  const now = performance.now();
  const g = gesture;
  const dt = g ? e.timeStamp - g.at : Infinity;
  /* A page busy for a moment gets the events sent meanwhile late, or merged
     into one, so the pause between two events is the shorter of the two
     measures: between their sending, and between their arrival. */
  const same = !!g && Math.sign(dy) === g.sign && Math.min(dt, now - g.seen) < GAP;
  /* speed, not size, for the same reason */
  const speed = Math.abs(dy) / (same ? Math.max(dt, 8) : 16);
  if (g && same && speed <= Math.max(g.speed, g.was) * 1.5 + 0.2) {
    g.was = g.speed;
    g.speed = speed;
    g.at = e.timeStamp;
    g.seen = now;
    g.trail.push({ at: e.timeStamp, d: Math.abs(dy), v: speed });
    while (g.trail.length > 2 && e.timeStamp - g.trail[1].at > 150) g.trail.shift();
    g.slowing = slows(g);
  } else {
    /* the first event's speed is a guess, with nothing to measure it from */
    const trail = [{ at: e.timeStamp, d: Math.abs(dy), v: NaN }];
    gesture = { sign: Math.sign(dy), at: e.timeStamp, seen: now, speed, was: speed, trail, slowing: false };
  }
}

/** The gesture still coming in at `now`, if any. */
function live(now: number): Gesture | null {
  return gesture && now - gesture.seen < GAP ? gesture : null;
}

/** The momentum of a flick still coming in at `now`, if any. */
function momentum(now: number): Gesture | null {
  const g = live(now);
  return g?.slowing ? g : null;
}

/** Whether the momentum the journey began in is still coming in. */
function coasting(now: number): boolean {
  return !!coast && coast === momentum(now);
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
/* From the first keystroke on, so the Enter that starts a journey is seen, and
   the first wheel event, so a flick is known before the click after it. */
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeyState, true);
  window.addEventListener('keyup', onKeyState, true);
  window.addEventListener('blur', onKeyState);
  window.addEventListener('wheel', fileWheel, { capture: true, passive: true });
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
 * is and goes as the hero comes back (NavHandoff). While the hero hides it,
 * it moves under the item at once, to come on there rather than slide in. */
let hold: { lens: Lucent.LensApi; select: Lucent.LensApi['select'] } | null = null;

const navLens = () => document.querySelector<Nav>('.site-nav .lu-nav')?.__luLens ?? null;

function holdLens(el: HTMLElement): void {
  releaseLens();
  unfollow?.();
  const lens = navLens();
  if (!lens) return;
  const item = lens.items.find((it) => it.getAttribute('href') === `#${el.id}`) ?? null;
  const hidden = root().classList.contains('hero-in-view');
  if (item && (hidden || lens.current !== item)) lens.select(item, hidden);
  const select = lens.select;
  /* the spy calls the lens's select; a click on an item calls the kit's own */
  lens.select = (it, instant) => {
    if (it === item) select(it, instant);
  };
  hold = { lens, select };
}

/** Lets the spy move the lens again; returns the lens it held, if any. */
function releaseLens(): Lucent.LensApi | null {
  if (!hold) return null;
  const { lens } = hold;
  lens.select = hold.select;
  hold = null;
  return lens;
}

/* The kit's scroll spy, run once (bundle.js, liquidNav): the last item whose
   section's top has passed 45% of the screen, else the first. The kit's runs
   on scrolling, and not for 900ms after a click on an item, so on its own it
   can leave the lens on an item the page has left. */
function spy(lens: Lucent.LensApi): void {
  let best: HTMLElement | null = null;
  for (const it of lens.items) {
    const href = it.getAttribute('href') ?? '';
    const target = href.length > 1 && href[0] === '#' ? document.getElementById(href.slice(1)) : null;
    if (!target) continue;
    best ??= it;
    if (target.getBoundingClientRect().top < window.innerHeight * 0.45) best = it;
  }
  if (best && best !== lens.current) lens.select(best);
}

/* After the reader takes the page back, the lens follows it through the rest
   of the kit's 900ms hold. */
let unfollow: (() => void) | null = null;
function follow(lens: Lucent.LensApi): void {
  spy(lens);
  const left = begun + 1000 - performance.now();
  if (left <= 0) return;
  let raf = 0;
  const onScroll = () => {
    raf ||= requestAnimationFrame(() => {
      raf = 0;
      spy(lens);
    });
  };
  const end = () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(raf);
    if (unfollow === end) unfollow = null;
  };
  unfollow?.();
  unfollow = end;
  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(end, left);
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

/* fileWheel has already filed this event: it either went on the gesture the
   journey began in, or began another */
function onWheel(e: WheelEvent) {
  if (!e.deltaY) return;
  if (coast && coast === gesture && coast.slowing) {
    if (e.cancelable) e.preventDefault();
    return;
  }
  handBack();
}
function onKey(e: KeyboardEvent) {
  if (SCROLL_KEYS.has(e.key)) handBack();
}
/* A press on the capsule may be the next journey: its click sets the course. */
function onPointer(e: PointerEvent) {
  if (!controlAt(e.clientX, e.clientY)) handBack();
}
/* The window changing size (a phone turned) moves the page under the glide
   for a few frames as the layout settles (Safari even puts it back near where
   it was, and the gallery repacks). That's not the reader. */
let resizedAt = -Infinity;
function onResize() {
  resizedAt = performance.now();
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
  /* not passive: it swallows the momentum it can */
  window.addEventListener('wheel', onWheel, { capture: true, passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointerdown', onPointer, true);
  window.addEventListener('click', onClick, true);
  window.addEventListener('resize', onResize);
}
function unlisten() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('wheel', onWheel, true);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('pointerdown', onPointer, true);
  window.removeEventListener('click', onClick, true);
  window.removeEventListener('resize', onResize);
}
/** Stops listening once nothing is moving the page. */
function idle() {
  if (!glide && !fold && !dip && !stayRaf) unlisten();
}

/** Ends whatever the journey is doing, where the page is. */
function stop(): void {
  course++;
  if (glide) cancelAnimationFrame(glide.raf);
  glide = null;
  cancelAnimationFrame(stayRaf);
  stayRaf = 0;
  const f = fold;
  fold = null;
  f?.skipTransition();
  const d = dip;
  dip = null;
  if (d) {
    d.cancel();
    if (!f) unmark();
  }
  unlisten();
  releaseLens();
}

/** The reader has taken the page: the journey ends where it is, and the lens follows the reader. */
function handBack(): void {
  stop();
  coast = null;
  const lens = navLens();
  if (lens) follow(lens);
}

/* ---------- Landing ---------- */

/* The address names the section, without a new history entry: a copied link
   opens it, and Back still leaves the page. The hero (#top) is the page itself. */
function address(el: HTMLElement): void {
  const hash = el.id === 'top' ? '' : `#${el.id}`;
  if (window.location.hash === hash) return;
  window.history.replaceState(null, '', hash || window.location.pathname + window.location.search);
}

/**
 * The page is being left for another: the address gives up its #section, so
 * Back returns to the exact place the reader left. Coming back to /#work,
 * Chrome goes to Work instead, however far the reader had scrolled on from
 * it (938px above the card they had opened, on a laptop).
 */
export function unaddress(): void {
  const { pathname, search, hash } = window.location;
  if (hash) window.history.replaceState(null, '', pathname + search);
}

/* The page stays on the section while the momentum of the flick it began in
   drains (it can't all be cancelled, see Momentum): nothing that comes after
   drifts it off. */
function stay(el: HTMLElement): void {
  listen();
  const step = (now: number) => {
    stayRaf = 0;
    if (!coasting(now) || now - begun > LIMIT) return idle();
    const to = destination(el);
    if (Math.abs(window.scrollY - to) > 0.5) scrollToY(to);
    stayRaf = requestAnimationFrame(step);
  };
  stayRaf = requestAnimationFrame(step);
}

/** The page is on the section: the lens and the address say so, and the section takes focus. */
function land(el: HTMLElement): void {
  const lens = releaseLens();
  /* #top has no item: the lens shows what scrolling there would */
  if (lens && !lens.items.some((it) => it.getAttribute('href') === `#${el.id}`)) spy(lens);
  address(el);
  focusOn(el);
  if (coasting(performance.now())) stay(el);
  else idle();
}

/* ---------- The glide ---------- */

function run(now: number) {
  const g = glide;
  if (!g) return;
  const to = destination(g.el);
  const moved = window.scrollY - g.written;
  if (Math.abs(moved) > 2) {
    /* The browser held what's on screen in place as the page above it changed
       height (scroll anchoring), or moved it as the window changed size: carry
       on from there. A flick's momentum the journey rides out is written over.
       Anything else moving the page (the scrollbar, find in page) is the
       reader, who has it now. */
    if (performance.now() - resizedAt < 300 || Math.abs(moved - (to - g.to)) <= 2) g.x += moved;
    else if (!coasting(now)) {
      handBack();
      return;
    }
  }
  g.to = to;
  const dt = g.last ? Math.min((now - g.last) / 1000, 0.1) : 1 / 60;
  g.last = now;
  /* the critically damped spring's exact step: e(t) = (e + (v + ωe)t)·e^(−ωt) */
  const w = g.omega;
  const e = g.x - to;
  const b = g.v + w * e;
  const decay = Math.exp(-w * dt);
  g.x = to + (e + b * dt) * decay;
  g.v = (g.v - w * b * dt) * decay;
  if ((Math.abs(g.x - to) < 1 && Math.abs(g.v) < 40) || now - g.start > LIMIT) {
    scrollToY(to);
    glide = null;
    land(g.el);
    return;
  }
  scrollToY(g.x);
  g.written = window.scrollY;
  g.raf = requestAnimationFrame(run);
}

/** Glides to `el` from where the page is at `v` px/s; one already under way just changes course. */
function glideTo(el: HTMLElement, v: number, omega: number) {
  listen();
  /* a landed page held against momentum gives way to the new course */
  cancelAnimationFrame(stayRaf);
  stayRaf = 0;
  if (glide) {
    glide.el = el;
    glide.omega = omega;
    glide.to = destination(el);
    glide.start = performance.now();
    return;
  }
  const y = window.scrollY;
  glide = { el, x: y, v, omega, to: destination(el), written: y, start: performance.now(), last: 0, raf: 0 };
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
   fade, or row by row as a glide passes it, rising on for most of a second
   after the page has stopped: on the way and in the view the journey lands
   in, it arrives at rest. */
function settleInView(from: number, to: number) {
  const vh = viewport();
  const lo = Math.min(0, to - from);
  const hi = vh + Math.max(0, to - from);
  document.querySelectorAll('.lu-pending').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom > lo && r.top < hi) el.classList.remove('lu-pending');
  });
}

/* A far journey is under way (styles/site.css, "Navigation journey"): which
   way the page goes, for the old view's drift, and whether the lens comes on
   with it, leaving the hero, or goes, coming back to it. */
function mark(el: HTMLElement, dir: number) {
  const html = root();
  html.classList.add('site-journey');
  html.dataset.journey = dir > 0 ? 'down' : 'up';
  html.toggleAttribute('data-journey-handoff', html.classList.contains('hero-in-view') !== (el.id === 'top'));
}
function unmark() {
  const html = root();
  html.classList.remove('site-journey');
  delete html.dataset.journey;
  html.removeAttribute('data-journey-handoff');
}

/* Runs `update` under the journey's cross-fade, as the journey's own: input
   hands the page back through it, and the capsule takes clicks through it
   (onClick). */
function fade(update: () => void): ViewTransition {
  listen();
  const vt = document.startViewTransition(update);
  fold = vt;
  vt.finished.finally(() => {
    if (fold === vt) fold = null;
    if (!fold && !dip) unmark();
    idle();
  });
  return vt;
}

/** Where a far journey sets the page down: `stretch` px short of the section, and which way it's going. */
function shortOf(to: number): { dir: number; stretch: number } {
  const from = window.scrollY;
  return { dir: Math.sign(to - from), stretch: Math.min(Math.abs(to - from), Math.round(viewport() * LAND)) };
}

function travel(el: HTMLElement, to: number) {
  stop();
  const id = course;
  const { dir, stretch } = shortOf(to);
  const start = to - dir * stretch;
  mark(el, dir);
  const vt = fade(() => {
    /* a journey begun since (a second click within a frame) has the page */
    if (course !== id) return;
    scrollToY(start);
    settleInView(start, to);
  });
  /* arriving at the speed a spring would carry it the last stretch, so the
     new view picks up the old one's drift and settles */
  const go = () => {
    if (course === id) glideTo(el, dir * OMEGA * stretch, OMEGA);
  };
  vt.ready.then(go, go);
}

/* Without View Transitions (Safari before 18, Firefox before 144), or with one
   of the kit's already running: the kit's page swap without them
   (Lucent.transition), not a glide through everything in between. The page
   dips out, is set down as short of the section, and comes back as it glides
   the rest. Only the page fades; the capsule and the theme button stay. */
function dipTo(el: HTMLElement, to: number) {
  stop();
  const id = course;
  const html = root();
  const main = document.querySelector<HTMLElement>('main') ?? document.body;
  const { dir, stretch } = shortOf(to);
  const start = to - dir * stretch;
  mark(el, dir);
  listen();
  const out = main.animate({ opacity: [1, 0] }, { duration: 140, easing: 'ease-in', fill: 'forwards' });
  dip = out;
  out.finished.then(
    () => {
      if (course !== id) return;
      scrollToY(start);
      settleInView(start, to);
      const ease = getComputedStyle(html).getPropertyValue('--ease-settle').trim() || 'ease-out';
      const back = main.animate({ opacity: [0, 1] }, { duration: 320, easing: ease });
      out.cancel();
      dip = back;
      glideTo(el, dir * OMEGA * stretch, OMEGA);
      back.finished.then(
        () => {
          if (dip !== back) return;
          dip = null;
          if (!fold) unmark();
          idle();
        },
        () => {},
      );
    },
    () => {},
  );
}

/**
 * Reduced motion: no travel, the page is simply there, as with the kit's own
 * scrollTo (and its page swap, which plays no transition then). A fade would
 * be allowed, but a view transition takes every click on the page while it
 * lasts.
 */
function jump(el: HTMLElement, to: number) {
  stop();
  holdLens(el);
  scrollToY(to);
  land(el);
}

/** Takes the page to `el`, a section (or #top). */
export function journeyTo(el: HTMLElement): void {
  warm(el);
  const to = destination(el);
  begun = performance.now();
  coast = momentum(begun);
  if (prefersReducedMotion()) {
    jump(el, to);
    return;
  }
  const y = glide ? glide.x : window.scrollY;
  if (Math.abs(to - y) > viewport() * NEAR) {
    if (canFade()) travel(el, to);
    else dipTo(el, to);
  } else {
    /* a fade still waiting to set the page down would move it under this glide */
    if ((fold || dip) && !glide) stop();
    settleInView(window.scrollY, to);
    glideTo(el, 0, OMEGA_NEAR);
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
  const to = destination(el);
  const top = to - vh * LAND;
  const bottom = to + vh * 1.5;
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
  begun = performance.now();
  coast = momentum(begun);
  scrollToY(destination(el));
  focusOn(el);
  /* a flick made on the page before, still coming in */
  if (coasting(begun)) stay(el);
}
