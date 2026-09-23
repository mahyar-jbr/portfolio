'use client';

import { useEffect } from 'react';
import { MORPH, stageSpan, TOTAL } from './timeline';

/**
 * Drives the opening: while the hero is pinned, scroll progress `p` (0 → 1)
 * turns the formula into the name, in place.
 *
 *   0.02–0.32  the other terms leave, farthest from the Σ first        (CSS, from --p)
 *   0.20–0.70  the Σ slides to the start of the name, resizing          (here)
 *   0.22–0.67  …and turns a quarter clockwise into the M                (here)
 *   0.54–0.90  the rest of the name writes itself, letter by letter      (CSS)
 *   0.78–0.96  the properties and actions rise in beneath               (CSS)
 *
 * The Σ in flight (.hero-fly) is the same TeX glyph as the name's M, in the
 * same box, so at p = 1 it sits exactly on the M; at p = 0 it is scaled and
 * turned back so it sits exactly on the formula's Σ. Scrolling back up plays it
 * in reverse. Positions come from layout offsets, not getBoundingClientRect(),
 * so the entrance animations running at load can't skew them.
 *
 * The pinned layout itself is CSS, under html.sigma (see app/layout.tsx). This
 * keeps that class honest: it withdraws it — and the page falls back to the
 * resting stack — under reduced motion, on screens too short for the stage,
 * and when the landed hero wouldn't fit the screen; and it follows the reader
 * changing those settings mid-visit.
 */

/** When the stage can run at all. The same query gates the CSS. */
const STAGE_QUERY = '(prefers-reduced-motion: no-preference) and (min-height: 600px)';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const inOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** An element's layout position inside `ancestor`, ignoring transforms. */
function offsetIn(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export default function SigmaMorph() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('[data-sigma-hero]');
    const stage = hero?.querySelector<HTMLElement>('.hero-stage');
    const sticky = hero?.querySelector<HTMLElement>('.hero-sticky');
    const line = hero?.querySelector<HTMLElement>('.hero-line');
    const eq = hero?.querySelector<HTMLElement>('.hero-eq');
    /* KaTeX's own glyph box for the Σ, inside the \htmlData wrapper */
    const from = hero?.querySelector<HTMLElement>('[data-sigma="from"] .mop');
    const to = hero?.querySelector<HTMLElement>('[data-sigma-to]');
    const fly = hero?.querySelector<HTMLElement>('[data-sigma-fly]');
    const below = hero?.querySelector<HTMLElement>('.hero-below');
    if (!hero || !stage || !sticky || !line || !eq || !from || !to || !fly || !below) {
      root.classList.remove('sigma');
      return;
    }

    /** Sets the stage up; returns its teardown. */
    function start(): () => void {
      root.classList.add('sigma');
      let raf = 0;
      let alive = true;
      let geo = { dx: 0, dy: 0, s0: 1 };

      /** Would the landed hero — name, properties, actions — fit on the pinned screen? */
      const fits = () =>
        line!.offsetTop + line!.offsetHeight + parseFloat(getComputedStyle(below!).marginTop) + below!.offsetHeight + 12 <=
        sticky!.clientHeight;

      function measure() {
        const a = offsetIn(from!, line!);
        const b = offsetIn(to!, line!);
        const glyph = to!.firstElementChild as HTMLElement;
        /* park the flying copy on the M; it travels by transform from the Σ to here */
        fly!.style.left = `${b.x}px`;
        fly!.style.top = `${b.y}px`;
        geo = {
          dx: a.x + from!.offsetWidth / 2 - (b.x + to!.offsetWidth / 2),
          dy: a.y + from!.offsetHeight / 2 - (b.y + to!.offsetHeight / 2),
          s0: parseFloat(getComputedStyle(from!).fontSize) / parseFloat(getComputedStyle(glyph).fontSize),
        };
      }

      function frame() {
        raf = 0;
        /* read live: the stage's height is in viewport units, which move with mobile
           browser chrome. The morph is the first MORPH of TOTAL (timeline.ts). */
        const span = stageSpan(hero!, stage!, sticky!);
        const p = clamp((window.scrollY - span.top) / ((span.dist * MORPH) / TOTAL));
        hero!.style.setProperty('--p', p.toFixed(4));

        const slide = clamp((p - 0.2) / 0.5);
        const t = inOutCubic(slide);
        const x = lerp(geo.dx, 0, t);
        const y = lerp(geo.dy, 0, inOutSine(slide)); /* x and y ease apart: a slight arc */
        const s = lerp(geo.s0, 1, t);
        /* the M's glyph is turned 90° in its box; turning the box back −90° shows the upright Σ */
        const turnT = clamp((p - 0.22) / 0.45);
        const turn = -90 + 90 * inOutCubic(turnT);
        fly!.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(4)}) rotate(${turn.toFixed(2)}deg)`;

        /* which Σ is on screen: the formula's (at rest), the flying copy (moving), the name's (arrived) */
        hero!.dataset.sigmaAt = slide <= 0 ? 'formula' : slide >= 1 && turnT >= 1 ? 'name' : 'move';
        hero!.classList.toggle('is-landed', p >= 0.97);
        /* while the opening fills the screen, no nav section is "current" */
        root.classList.toggle('hero-in-view', hero!.getBoundingClientRect().bottom > window.innerHeight * 0.45);
      }

      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      const relayout = () => {
        if (!alive) return;
        if (!fits()) {
          /* too short for the landed hero: rest instead (a resize may bring it back) */
          stop();
          return;
        }
        measure();
        frame();
      };

      /* Keyboard users can reach the properties and actions before they have
         risen in; focusing one plays the reveal to its end. */
      const reveal = () => {
        if (hero!.classList.contains('is-landed')) return;
        const span = stageSpan(hero!, stage!, sticky!);
        window.scrollTo({ top: span.top + (span.dist * MORPH) / TOTAL, behavior: 'instant' });
      };

      window.addEventListener('scroll', schedule, { passive: true });
      below!.addEventListener('focusin', reveal);
      const ro = new ResizeObserver(relayout);
      ro.observe(line!);
      ro.observe(sticky!);
      void document.fonts?.ready.then(relayout);
      relayout();

      /* The flying Σ takes over from the formula's own only once the formula
         has finished arriving, so it never shows ahead of the fade-in. */
      void Promise.allSettled(eq!.getAnimations().map((a) => a.finished)).then(() => {
        if (!alive) return;
        relayout();
        if (alive) hero!.classList.add('is-live');
      });

      function stop() {
        if (!alive) return;
        alive = false;
        window.removeEventListener('scroll', schedule);
        below!.removeEventListener('focusin', reveal);
        ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
        hero!.classList.remove('is-live', 'is-landed');
        delete hero!.dataset.sigmaAt;
        hero!.style.removeProperty('--p');
        root.classList.remove('sigma', 'hero-in-view');
        fly!.style.transform = '';
      }
      return stop;
    }

    const mq = matchMedia(STAGE_QUERY);
    let stop: (() => void) | null = null;
    const sync = () => {
      stop?.();
      stop = null;
      if (mq.matches) stop = start();
      else root.classList.remove('sigma');
    };
    sync();
    mq.addEventListener('change', sync);

    return () => {
      mq.removeEventListener('change', sync);
      stop?.();
      /* leave html.sigma for the next visit to the home page to paint pinned */
      if (mq.matches) root.classList.add('sigma');
    };
  }, []);

  return null;
}
