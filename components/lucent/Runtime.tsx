'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { loadLucent, routeSettled } from '@/lib/lucent';

/**
 * Wires the Lucent runtime into the rendered page (Lucent Handoff: "In React, keep
 * the classes and call Lucent.auto() in an effect after mount").
 *
 * auto() is idempotent per element, so running it after every route change wires
 * the new page without re-wiring the persistent nav. The nav's liquid lens follows
 * the section in view on the home page and fades out everywhere else, since no nav
 * item matches a case study (NavBar guideline: call clear()).
 */
export default function LucentRuntime() {
  const pathname = usePathname();

  /* After the first render, later route changes play the arrival (site-route). */
  useEffect(() => {
    const t = setTimeout(() => document.documentElement.classList.add('site-navigated'), 0);
    return () => clearTimeout(t);
  }, []);

  /* A page that arrived without the arrival animation keeps it that way: the
     first page (its own entrances already play), and any page that came in
     through the kit's page swap (a view transition), which would otherwise
     fade in a second time when the transition hands back. */
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('site-navigated') || html.classList.contains('lu-vt-page')) {
      document.querySelectorAll('.site-route').forEach((el) => el.classList.add('is-first'));
    }
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    loadLucent()
      .then((L) => {
        if (cancelled) return;

        /* Wire the nav before auto() does: left to itself, the lens selects its first
           item a frame after wiring, which would land it on "Work" on a case study.
           `selectFirst` is a lens option the kit's types don't list. */
        const nav = document.querySelector<HTMLElement>('.lu-nav');
        const navOpts = { selectFirst: pathname === '/' } as Parameters<typeof L.liquidNav>[1];
        const lens = nav ? L.liquidNav(nav, navOpts) : null;

        /* The gallery rests as a plain grid; packing needs its 4px rows back first. */
        document.querySelectorAll('.lu-gallery').forEach((g) => g.classList.add('is-wired'));
        L.auto(document);
        if (lens) {
          if (pathname === '/') {
            if (!lens.current && lens.items[0]) lens.select(lens.items[0], true);
            /* let the scroll spy correct it for wherever the page landed (e.g. /#contact) */
            requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
          } else {
            lens.clear();
          }
        }
      })
      .catch((err) => {
        /* Without the runtime the page is still complete: every component rests visible. */
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) routeSettled();
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
