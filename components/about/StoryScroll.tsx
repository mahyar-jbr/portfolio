'use client';

import { useEffect } from 'react';

/**
 * Steps the About story while its stage is pinned: the scroll through the stage
 * is split evenly between the steps (four chapters and the coda), and the
 * current step's photo and line get `is-active`, while the kit's segmented
 * control slides its lens to the step. Choosing a step in that control scrolls
 * the story there. The cross-fades
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
    /* the Liquid Glass segmented control: one item per chapter (not the coda) */
    const seg = section.querySelector<HTMLElement & { __luLens?: Lucent.LensApi }>('.story-seg');
    const segItems = seg ? [...seg.querySelectorAll<HTMLElement>('.lu-seg-item')] : [];

    const span = () => {
      const top = stage!.getBoundingClientRect().top + window.scrollY;
      return { top, dist: Math.max(1, stage!.offsetHeight - sticky!.offsetHeight) };
    };

    let raf = 0;
    let current = -1;

    function frame() {
      raf = 0;
      const pinned = getComputedStyle(sticky!).position === 'sticky';
      let step = 0;
      if (pinned) {
        /* page position from the box itself: the section isn't positioned, so
           offsetTop chains don't add up here */
        const { top, dist } = span();
        const t = (window.scrollY - top) / dist;
        step = Math.max(0, Math.min(steps - 1, Math.floor(t * steps)));
      }
      if (step === current) return;
      current = step;
      section!.dataset.storyStep = String(step);
      for (const el of parts) el.classList.toggle('is-active', el.dataset.step === String(step));
      /* move the lens without re-announcing the change: the kit's lens takes a
         third `silent` argument its published types leave out */
      const lens = seg?.__luLens;
      if (lens) {
        const select = lens.select as (item: HTMLElement, instant?: boolean, silent?: boolean) => void;
        if (segItems[step]) select(segItems[step], false, true);
        else lens.clear();
      }
    }

    /* choosing a step scrolls the story to the middle of it */
    const onChoose = (e: Event) => {
      const k = Number((e as CustomEvent<{ value: string }>).detail?.value);
      if (Number.isNaN(k) || getComputedStyle(sticky!).position !== 'sticky') return;
      const { top, dist } = span();
      window.scrollTo({ top: top + (dist * (k + 0.5)) / steps, behavior: 'smooth' });
    };
    seg?.addEventListener('change', onChoose);

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
      seg?.removeEventListener('change', onChoose);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
