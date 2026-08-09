'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Tracks the pointer inside an element and writes its position to CSS custom
 * properties on that element (--px/--py in px, --pxp/--pyp in %).
 *
 * Deliberately never calls setState: a spotlight that re-renders React on every
 * pointermove is the single easiest way to make a "premium" site feel cheap.
 * Writes are batched into one rAF so we touch style at most once per frame.
 *
 * Returns a ref plus enter/leave handlers that drive --pa (pointer amount, 0-1)
 * so effects can fade in and out rather than snapping.
 */
export function usePointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const next = useRef({ x: 0, y: 0, w: 1, h: 1 });

  const flush = useCallback(() => {
    frame.current = 0;
    const el = ref.current;
    if (!el) return;
    const { x, y, w, h } = next.current;
    el.style.setProperty('--px', `${x}px`);
    el.style.setProperty('--py', `${y}px`);
    el.style.setProperty('--pxp', `${(x / w) * 100}%`);
    el.style.setProperty('--pyp', `${(y / h) * 100}%`);
    // -1..1 from centre, for tilt and directional lensing
    el.style.setProperty('--pdx', `${(x / w) * 2 - 1}`);
    el.style.setProperty('--pdy', `${(y / h) * 2 - 1}`);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      next.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        w: r.width,
        h: r.height,
      };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const onPointerEnter = useCallback(() => {
    ref.current?.style.setProperty('--pa', '1');
  }, []);

  const onPointerLeave = useCallback(() => {
    ref.current?.style.setProperty('--pa', '0');
  }, []);

  useEffect(() => {
    const id = frame.current;
    return () => {
      if (id) cancelAnimationFrame(id);
    };
  }, []);

  return { ref, onPointerMove, onPointerEnter, onPointerLeave };
}

/**
 * Drives the nav chrome from scroll position and direction, via two data
 * attributes on the element:
 *   data-scrolled — past `scrolledAt`, so the material can thicken
 *   data-hidden   — scrolling down past `hideAfter`; clears on any upward move
 *
 * Everything is written as attributes rather than state so a scroll never
 * re-renders React, and reads are rAF-gated behind a passive listener so we
 * touch layout once per frame at most.
 *
 * `delta` is the anti-jitter guard: direction only flips after a move that
 * clears it, otherwise trackpad noise and scroll-anchoring make the bar
 * flicker. `last` is deliberately only updated when the guard is cleared —
 * updating it every frame means a slow scroll never accumulates enough
 * difference to register at all.
 */
export function useNavChrome({
  scrolledAt = 8,
  hideAfter = 140,
  delta = 6,
}: { scrolledAt?: number; hideAfter?: number; delta?: number } = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY;

    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;

      el.dataset.scrolled = y > scrolledAt ? 'true' : 'false';

      if (y <= hideAfter) {
        // Near the top the bar always shows — hiding it here would just make
        // the first scroll feel broken.
        el.dataset.hidden = 'false';
        last = y;
        return;
      }

      const diff = y - last;
      if (Math.abs(diff) > delta) {
        el.dataset.hidden = diff > 0 ? 'true' : 'false';
        last = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrolledAt, hideAfter, delta]);

  return ref;
}
