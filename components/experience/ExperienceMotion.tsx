'use client';

import { useEffect } from 'react';
import { loadLucent, prefersReducedMotion } from '@/lib/lucent';

/**
 * Opens each role in place on the kit's spring. Every role is a native
 * <details>, so with scripts blocked it still opens and closes by itself and
 * the whole list reads; this only adds the motion:
 * - the body's height follows a Lucent spring ("lens": one soft overshoot) from
 *   where it is to its content's height, measured once per tap. The spring runs
 *   0 to 1 and scales that height, so a second tap mid-way turns it round
 *   smoothly from wherever it got to;
 * - the content cross-fades as it settles 8px (ease-settle); closing, it fades
 *   out first, faster (dur-exit), the way the kit's exits go;
 * - the chevron turns (CSS, ease-spring), and the company's tile gives under
 *   the finger with the kit's jelly, the way an app icon does on iOS.
 * Reduced motion: the spring jumps to rest (the kit's own rule) and the content
 * only fades, in 150ms.
 *
 * It also stands in for a company logo that fails to load: the tile drops the
 * broken image and shows the company's letters, which sit under it.
 */
export default function ExperienceMotion({ root }: { root: string }) {
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(root);
    if (!list) return;
    let cancelled = false;
    const unwire: (() => void)[] = [];
    for (const img of list.querySelectorAll<HTMLImageElement>('.xp-tile img')) unwire.push(fallBack(img));
    loadLucent()
      .then((L) => {
        if (cancelled) return;
        for (const item of list.querySelectorAll<HTMLDetailsElement>('details.xp-item')) unwire.push(wire(item, L));
      })
      .catch(() => {
        /* without the runtime the rows still open natively */
      });
    return () => {
      cancelled = true;
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

function cssTime(name: string, fallback: number): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isNaN(v) ? fallback : v;
}

function cssValue(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function wire(item: HTMLDetailsElement, L: typeof Lucent): () => void {
  const summary = item.querySelector('summary');
  const body = item.querySelector<HTMLElement>('.xp-body');
  const inner = body?.firstElementChild as HTMLElement | null;
  if (!summary || !body || !inner) return () => {};
  const tile = summary.querySelector<HTMLElement>('.xp-tile');

  let target = item.open ? 1 : 0;
  let progress = target;
  let full = 0;
  let fade: Animation | undefined;

  const height = L.spring(
    target,
    'lens',
    (p) => {
      progress = p;
      body.style.height = `${Math.max(0, p * full).toFixed(2)}px`;
      /* closing: the row is shut the moment it reaches zero, not when the
         spring's tail below zero (never seen) comes to rest */
      if (target === 0 && p <= 0 && item.open) item.open = false;
    },
    () => {
      /* at rest the body goes back to its natural height, and a closed row
         hands the state back to the element */
      body.style.height = '';
      item.classList.remove('is-moving');
      if (target === 0) item.open = false;
    },
  );
  body.style.height = '';
  item.classList.add('is-wired');
  item.classList.toggle('is-open', item.open);

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    const opening = target === 0;
    target = opening ? 1 : 0;
    if (opening) item.open = true;
    full = inner.offsetHeight;
    /* hold the current height before the first frame, so nothing flashes open */
    body.style.height = `${Math.max(0, progress * full)}px`;
    item.classList.add('is-moving');
    item.classList.toggle('is-open', opening);

    fade?.cancel();
    const reduced = prefersReducedMotion();
    fade = opening
      ? inner.animate(
          reduced
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, transform: 'translateY(-8px)' },
                { opacity: 1, transform: 'none' },
              ],
          {
            duration: reduced ? 150 : cssTime('--dur-jelly', 560),
            delay: reduced ? 0 : 40,
            easing: cssValue('--ease-settle', 'ease-out'),
            fill: 'backwards',
          },
        )
      : inner.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: reduced ? 150 : cssTime('--dur-exit', 180),
          easing: cssValue('--ease-exit', 'ease-in'),
          fill: 'forwards',
        });
    height.to(target);
  };

  /* the browser may open a row by itself (find in page): follow it, no motion */
  const onToggle = () => {
    if (item.open === (target === 1)) return;
    target = item.open ? 1 : 0;
    fade?.cancel();
    item.classList.toggle('is-open', item.open);
    height.to(target, true);
  };

  /* the kit's jelly (Lucent.jelly), felt on the tile while the whole row is pressed */
  const sx = tile ? L.spring(1, 'jelly', (x) => tile.style.setProperty('--sx', x.toFixed(4))) : null;
  const sy = tile ? L.spring(1, 'jelly', (y) => tile.style.setProperty('--sy', y.toFixed(4))) : null;
  tile?.classList.add('lu-jelly');
  let pressed = false;
  const down = () => {
    pressed = true;
    sx?.to(1.035);
    sy?.to(0.94);
  };
  const up = () => {
    if (!pressed) return;
    pressed = false;
    sx?.to(1).kick(-0.8);
    sy?.to(1).kick(1.1);
  };
  const cancel = () => {
    pressed = false;
    sx?.to(1);
    sy?.to(1);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') up();
  };

  summary.addEventListener('click', onClick);
  item.addEventListener('toggle', onToggle);
  summary.addEventListener('pointerdown', down);
  summary.addEventListener('pointerup', up);
  summary.addEventListener('pointercancel', cancel);
  summary.addEventListener('pointerleave', cancel);
  summary.addEventListener('keydown', onKeyDown);
  summary.addEventListener('keyup', onKeyUp);

  return () => {
    summary.removeEventListener('click', onClick);
    item.removeEventListener('toggle', onToggle);
    summary.removeEventListener('pointerdown', down);
    summary.removeEventListener('pointerup', up);
    summary.removeEventListener('pointercancel', cancel);
    summary.removeEventListener('pointerleave', cancel);
    summary.removeEventListener('keydown', onKeyDown);
    summary.removeEventListener('keyup', onKeyUp);
    fade?.cancel();
    item.classList.remove('is-wired', 'is-moving', 'is-open');
    tile?.classList.remove('lu-jelly');
  };
}
