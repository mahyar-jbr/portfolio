'use client';

import { useEffect } from 'react';

/**
 * The name hands over to the nav. While the hero's name is on screen the nav
 * capsule doesn't repeat it (html.name-in-view); as the name scrolls up under
 * the capsule, "Mahyar" opens in it on the kit's brand transition — the name
 * shows where it went. And no nav item is "current" until its section arrives
 * (html.hero-in-view): through the hero and the About story the lens rests,
 * where the kit's scroll spy would otherwise default to Work.
 *
 * app/layout.tsx sets name-in-view before first paint on "/", so the brand
 * never flashes; if this never runs, its failsafe takes the class away.
 */
export default function NavHandoff() {
  useEffect(() => {
    const root = document.documentElement;
    const name = document.querySelector<HTMLElement>('.site-hero h1');
    if (!name) {
      root.classList.remove('name-in-view');
      return;
    }
    const navBottom = Math.round(document.querySelector('.site-nav .lu-nav')?.getBoundingClientRect().bottom ?? 76);
    const io = new IntersectionObserver(([e]) => root.classList.toggle('name-in-view', e.isIntersecting), {
      rootMargin: `-${navBottom}px 0px 0px 0px`,
    });
    io.observe(name);

    let raf = 0;
    const spy = () => {
      raf = 0;
      const work = document.getElementById('work');
      /* the kit's scroll spy picks a section once its top passes 45% of the screen */
      root.classList.toggle('hero-in-view', !!work && work.getBoundingClientRect().top > window.innerHeight * 0.45);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(spy);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    spy();
    root.classList.add('hero-wired');

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('name-in-view', 'hero-in-view', 'hero-wired');
    };
  }, []);

  return null;
}
