'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Reveals its children once, when they first come into view.
 *
 * Deliberately restrained: an 18px rise and a fade, once, never replayed on
 * scroll-back. Fade-up-on-everything is the laziest possible use of scroll, so
 * this is used only where a list benefits from arriving in order — and the
 * stagger is what carries the meaning, not the movement itself.
 *
 * IntersectionObserver rather than a scroll handler, so nothing runs per frame,
 * and the observer disconnects the moment it has fired.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.shown = 'true';
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = 'true';
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown="false"
      className={`reveal-on-view ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
