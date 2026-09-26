'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/lucent';

/**
 * The roll's one bespoke motion, and its one repair. Everything else is the
 * server's finished page:
 * - a promotion ladder that starts below the fold waits undrawn (.is-pending)
 *   and draws once (.is-climbing), as a climb, when it is fully in view: the
 *   rail rises from the first title, then the latest node fills
 *   (styles/site.css). A ladder
 *   already on screen never un-draws, and with reduced motion it never waits;
 * - a logo that can't load gives way to the company's letters under it.
 */
export default function ExperienceMotion({ root }: { root: string }) {
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(root);
    if (!list) return;
    const unwire = [...list.querySelectorAll<HTMLImageElement>('.xp-tile img')].map(fallBack);

    const ladders = [...list.querySelectorAll<HTMLElement>('.xp-ladder')].filter(
      (l) => l.getBoundingClientRect().top > innerHeight,
    );
    if (!ladders.length || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      return () => unwire.forEach((off) => off());
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          e.target.classList.replace('is-pending', 'is-climbing');
        }
      },
      /* the whole ladder, clear of the bottom edge, so the climb is seen */
      { threshold: 1, rootMargin: '0px 0px -15% 0px' },
    );
    for (const l of ladders) {
      l.classList.add('is-pending');
      io.observe(l);
    }
    return () => {
      io.disconnect();
      for (const l of ladders) l.classList.remove('is-pending', 'is-climbing');
      unwire.forEach((off) => off());
    };
  }, [root]);

  return null;
}

/** A logo that can't load gives way to the letters under it. */
function fallBack(img: HTMLImageElement): () => void {
  const missing = () => img.parentElement?.classList.add('is-missing');
  /* a load that already failed before this ran is complete with no pixels */
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) missing();
  img.addEventListener('error', missing);
  return () => img.removeEventListener('error', missing);
}
