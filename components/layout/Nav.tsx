import Link from 'next/link';

/* Nav per design/SECTIONS.md §3.3 — 4 items + a visually distinct Résumé.
   No Contact item, no wordmark, no theme toggle, no scroll-progress bar.

   This is the ONE glass surface on the site. Apple's HIG puts Liquid Glass in
   the navigation layer and explicitly out of the content layer, and a fixed
   header is also the only position where the backdrop is predictable enough
   to guarantee text contrast. */

const ITEMS = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Art', href: '/art' },
];

export default function Nav() {
  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.2em] text-ink uppercase"
        >
          MJ
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-pill px-3 py-1.5 text-sm text-n-11 transition-colors hover:bg-n-3 hover:text-ink"
              style={{ transitionDuration: 'var(--dur-hover)' }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            className="ml-2 rounded-pill bg-a-9 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-a-10"
            style={{ transitionDuration: 'var(--dur-hover)' }}
          >
            Résumé
          </a>
        </div>
      </nav>
    </header>
  );
}
