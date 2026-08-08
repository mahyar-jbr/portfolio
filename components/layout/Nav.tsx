import Link from 'next/link';

/* Nav per design/SECTIONS.md §3.3 — 4 items + a visually distinct Résumé.
   No Contact item, no wordmark, no theme toggle, no scroll-progress bar. */

const ITEMS = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Art', href: '/art' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-ink/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase"
        >
          MJ
        </Link>
        <div className="flex items-center gap-6">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            className="border border-neutral-600 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-neutral-200 uppercase hover:border-neutral-300"
          >
            Résumé →
          </a>
        </div>
      </nav>
    </header>
  );
}
