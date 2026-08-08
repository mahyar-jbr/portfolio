'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe prefers-reduced-motion hook.
 * Returns `false` on the server and first client render (stable, no hydration
 * mismatch), then updates after mount from matchMedia and on change.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Decide whether to render the heavy WebGL hero vs the static fallback.
 * Returns `true` (use 3D) only when: not reduced-motion, not a small screen,
 * the device has enough cores, and a WebGL context is available.
 * SSR-safe: returns `false` until mounted so the server renders the fallback.
 */
export function useCanRender3D() {
  const [can, setCan] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia?.('(max-width: 768px)').matches;
    // Only treat as weak if cores are reported AND very low (<= 2). Many capable
    // machines report 4; don't exclude them.
    const weakCpu =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 2;

    let webglOk = false;
    try {
      const canvas = document.createElement('canvas');
      webglOk = !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      webglOk = false;
    }

    setCan(Boolean(webglOk) && !reduced && !small && !weakCpu);
  }, []);

  return can;
}
