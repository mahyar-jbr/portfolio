'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/lucent';

/**
 * ThemeToggle — light and dark, from a glass circle in the corner: the kit's
 * glass icon button (.lu-btn.is-glass.is-icon, soft press from Lucent.auto())
 * holding a sun that becomes a moon — its rays turn away and a shadow slides
 * across it, on the kit's spring.
 *
 * The new theme spreads out from the button as a growing circle (a view
 * transition), so the change starts where the hand is. Reduced motion or no
 * View Transitions: it switches at once.
 *
 * The choice is remembered (app/layout.tsx applies it before first paint).
 * Choosing what the system already shows forgets it, so the page follows the
 * system again. The icon is drawn by CSS from the root's theme, so the server
 * markup never has to guess it.
 */
const KEY = 'lucent:theme';
type Theme = 'light' | 'dark';

/* Lucent `bg` in each theme, for the browser chrome (app/layout.tsx viewport). */
const GROUND: Record<Theme, string> = { light: '#fbfbfa', dark: '#191919' };

const darkQuery = () => matchMedia('(prefers-color-scheme: dark)');
const system = (): Theme => (darkQuery().matches ? 'dark' : 'light');
const current = (): Theme => {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'light' || t === 'dark' ? t : system();
};

function syncChrome() {
  const forced = document.documentElement.getAttribute('data-theme') as Theme | null;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    const own: Theme = m.media.includes('dark') ? 'dark' : 'light';
    m.content = GROUND[forced ?? own];
  });
}

function apply(next: Theme) {
  const root = document.documentElement;
  const follow = next === system();
  if (follow) root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', next);
  try {
    if (follow) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  syncChrome();
}

export default function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(current() === 'dark');
    syncChrome();
    const mq = darkQuery();
    const onSystem = () => setDark(current() === 'dark');
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  function toggle() {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const btn = ref.current;
    setDark(next === 'dark');
    if (!btn || typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
      apply(next);
      return;
    }
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const css = getComputedStyle(root);
    root.classList.add('theme-reveal');
    const vt = document.startViewTransition(() => apply(next));
    vt.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
          {
            duration: parseFloat(css.getPropertyValue('--dur-morph')) || 640,
            easing: css.getPropertyValue('--ease-settle').trim() || 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        /* the transition was skipped: the theme is already applied */
      });
    void vt.finished.finally(() => root.classList.remove('theme-reveal'));
  }

  return (
    <button
      ref={ref}
      type="button"
      className="lu-btn is-glass is-icon site-theme"
      aria-label="Dark mode"
      aria-pressed={dark ?? undefined}
      onClick={toggle}
    >
      <svg className="theme-glyph" viewBox="0 0 24 24" aria-hidden="true">
        <mask id="theme-bite">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-bite" cx="18" cy="6" r="7" fill="#000" />
        </mask>
        <circle className="theme-body" cx="12" cy="12" r="8.5" fill="currentColor" mask="url(#theme-bite)" />
        <path
          className="theme-rays"
          d="M19.2 12h2.4M2.4 12h2.4M12 19.2v2.4M12 2.4v2.4M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M5.2 5.2l1.7 1.7M17.1 6.9l1.7-1.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
