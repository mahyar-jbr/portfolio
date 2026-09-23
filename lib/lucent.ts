/**
 * The bridge between React and the Lucent kit's runtime (design-system/lucent/bundle.js).
 *
 * Lucent is CSS-first: components render the kit's markup and classes, and
 * window.Lucent adds the motion afterwards. The kit's bundle touches `window` at
 * load, so it can only ever be loaded in the browser — hence a lazy import rather
 * than a static one. Client code only.
 */

declare global {
  interface Window {
    Lucent?: typeof Lucent;
  }
}

let loading: Promise<typeof Lucent> | null = null;

/** Loads the kit's runtime once and resolves with window.Lucent. */
export function loadLucent(): Promise<typeof Lucent> {
  loading ??= import('@/design-system/lucent/bundle.js').then(() => {
    if (!window.Lucent) throw new Error('Lucent bundle loaded but did not register window.Lucent');
    return window.Lucent;
  });
  return loading;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---------- Page swap ----------
 * Lucent.transition(update) runs `update` inside a view transition: the old view
 * fades out, the new one fades up. With the App Router the new view exists only
 * once the router has committed, so `update` returns a promise that the runtime
 * resolves when the new pathname renders (routeSettled). */

let settle: (() => void) | null = null;

export function routeSettled(): void {
  const done = settle;
  settle = null;
  done?.();
}

/** Navigates with the Lucent page swap where the browser supports it, plainly otherwise. */
export function navigate(push: (href: string) => void, href: string): void {
  const L = window.Lucent;
  if (!L || typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
    push(href);
    return;
  }
  void L.transition(
    () =>
      new Promise<void>((resolve) => {
        settle = resolve;
        push(href);
        /* never hold the page hostage to a route that fails to commit */
        setTimeout(() => {
          if (settle === resolve) routeSettled();
        }, 1500);
      }),
  );
}

/** Scrolls to an in-page target the way the kit does: smooth, or instant under reduced motion. */
export function scrollToTarget(el: Element): void {
  if (window.Lucent) window.Lucent.scrollTo(el);
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}
