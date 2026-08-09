import type { ReactNode } from 'react';

/**
 * The shared section band.
 *
 * The number and title sit on one hairline baseline, which is the whole
 * ornament budget for a section header — the rhythm comes from the vertical
 * space around it, not from decoration.
 */
export default function Section({
  id,
  num,
  title,
  intro,
  children,
}: {
  id: string;
  num: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <header className="mb-12 sm:mb-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-n-9 tabular-nums">{num}</span>
          <h2
            className="font-mono text-[11px] tracking-[0.2em] text-n-10 uppercase"
          >
            {title}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-n-5" />
        </div>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-n-10">{intro}</p>
        )}
      </header>
      {children}
    </section>
  );
}
