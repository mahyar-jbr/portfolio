'use client';

import { useEffect } from 'react';

/**
 * Steps the About story while its stage is pinned: the scroll through the stage
 * is split evenly between the steps (four chapters and the coda), and the
 * current step's photo, line and index label get `is-active`. The cross-fades
 * themselves are CSS transitions (dur-morph, ease-settle), so a step changes
 * the way the kit's other state changes do rather than scrubbing with the
 * wheel.
 *
 * When the section rests as a plain sequence (phones, reduced motion, no
 * script) nothing is pinned and every step simply shows.
 */
export default function StoryScroll() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-story]');
    const stage = section?.querySelector<HTMLElement>('.about-stage');
    const sticky = section?.querySelector<HTMLElement>('.about-sticky');
    if (!section || !stage || !sticky) return;
    const parts = [...section.querySelectorAll<HTMLElement>('[data-step]')];
    const steps = new Set(parts.map((el) => el.dataset.step)).size;

    let raf = 0;
    let current = -1;

    function frame() {
      raf = 0;
      const pinned = getComputedStyle(sticky!).position === 'sticky';
      let step = 0;
      if (pinned) {
        /* page position from the box itself: the section isn't positioned, so
           offsetTop chains don't add up here */
        const top = stage!.getBoundingClientRect().top + window.scrollY;
        const dist = Math.max(1, stage!.offsetHeight - sticky!.offsetHeight);
        const t = (window.scrollY - top) / dist;
        step = Math.max(0, Math.min(steps - 1, Math.floor(t * steps)));
      }
      if (step === current) return;
      current = step;
      section!.dataset.storyStep = String(step);
      for (const el of parts) el.classList.toggle('is-active', el.dataset.step === String(step));
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const reset = () => {
      current = -1;
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', reset);
    const mo = new MutationObserver(reset);
    /* the pinned layout comes and goes with html.sigma */
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', reset);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
