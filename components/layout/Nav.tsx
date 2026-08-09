'use client';

import Link from 'next/link';
import { useScrolled } from '@/lib/use-pointer';

/* Nav per design/SECTIONS.md §3.3 — 4 items + a visually distinct Résumé.
   No Contact item, no wordmark, no theme toggle, no scroll-progress bar.

   This is the ONE glass surface on the site. Apple's HIG puts Liquid Glass in
   the navigation layer and explicitly out of the content layer, and a fixed
   header is also the only position where the backdrop is predictable enough to
   guarantee text contrast.

   It thickens on scroll — 12px blur and no border at rest, 24px and a hairline
   once content is passing beneath. The blur is swapped as a whole declaration
   rather than tweened, because animating a backdrop-filter re-runs the blur
   convolution every frame. */

const ITEMS = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Art', href: '/art' },
];

export default function Nav() {
  const ref = useScrolled(8);

  return (
    <header ref={ref} className="glass-nav sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-10">
        <Link
          href="/"
          className="rounded-pill px-1 font-mono text-xs tracking-[0.2em] text-ink uppercase"
        >
          MJ
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="btn-press sq rounded-pill px-3.5 py-2 text-sm text-n-11 hover:bg-n-3 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            className="btn-press sq ml-2 rounded-pill bg-a-9 px-4 py-2 text-sm font-medium text-white shadow-e1 hover:bg-a-10 hover:shadow-e2"
          >
            Résumé
          </a>
        </div>
      </nav>
    </header>
  );
}
