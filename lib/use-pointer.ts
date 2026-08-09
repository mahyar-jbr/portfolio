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

/** True once the page has scrolled past `threshold`. Passive listener, rAF-gated. */
export function useScrolled(threshold = 8) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (el) el.dataset.scrolled = window.scrollY > threshold ? 'true' : 'false';
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
  }, [threshold]);

  return ref;
}
