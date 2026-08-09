'use client';

import Link from 'next/link';
import { usePointer, useScrolled } from '@/lib/use-pointer';

/* Nav per design/SECTIONS.md §3.3 — 4 items.
   No Contact item, no wordmark lockup, no theme toggle, no scroll-progress bar.

   Résumé is REMOVED from the nav: public/resume.pdf is stale, and a prominent
   link to an out-of-date document is worse than no link. Restore it here when
   the PDF is refreshed — the other two entry points (Experience, Contact) are
   pointing at the same stale file and need the same call.

   A floating capsule island. This is the ONE glass surface on the site: Apple's
   HIG puts Liquid Glass in the navigation layer and explicitly out of the
   content layer.

   Because it floats, real page content passes underneath — so the backdrop is
   genuinely arbitrary and the 0.72 alpha floor is doing actual work. It was
   solved from worst-case compositing (7.88:1 over pure black), which is what
   lets this sit over the artwork on /art without going illegible.

   The inner pills deliberately do NOT get their own glass. Apple, verbatim:
   "When placing elements on top of Liquid Glass, avoid applying the material to
   both layers. Instead, use fills, transparency, and vibrancy for the top
   elements to make them feel like a thin overlay that is part of the material."
   Chromium also refuses nested backdrop-filters outright, so a glass pill on a
   glass island would look right in Safari and flatten for everyone else. */

const ITEMS = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Art', href: '/art' },
];

export default function Nav() {
  const scrolled = useScrolled(8);
  const p = usePointer<HTMLElement>();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <nav
        ref={(el) => {
          scrolled.current = el;
          p.ref.current = el;
        }}
        onPointerMove={p.onPointerMove}
        onPointerEnter={p.onPointerEnter}
        onPointerLeave={p.onPointerLeave}
        style={{ ['--pa' as string]: 0 }}
        className="glass-island glass-rim sq pointer-events-auto relative flex max-w-full
                   items-center gap-1 overflow-hidden rounded-pill px-2 py-1.5 sm:gap-1.5 sm:px-2.5"
      >
        <Link
          href="/"
          className="btn-press sq shrink-0 rounded-pill px-2.5 py-2 font-mono text-[11px] tracking-[0.18em] text-ink uppercase hover:bg-[color-mix(in_srgb,var(--color-n-12)_7%,transparent)] sm:px-3"
        >
          MJ
        </Link>

        <span className="h-4 w-px shrink-0 bg-[color-mix(in_srgb,var(--color-n-9)_35%,transparent)]" />

        <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              /* Translucent fill, not an opaque chip — so hover reads as part of
                 the material rather than a card sitting on top of it. */
              className="btn-press sq rounded-pill px-2.5 py-2 text-[13px] whitespace-nowrap text-n-11
                         hover:bg-[color-mix(in_srgb,var(--color-n-12)_7%,transparent)] hover:text-ink
                         sm:px-3.5 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

      </nav>
    </div>
  );
}
