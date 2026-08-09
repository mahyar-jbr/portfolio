import type { ReactNode } from 'react';

export function DSSection({
  num,
  title,
  note,
  children,
}: {
  num: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-n-6 py-16">
      <div className="mb-10">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-n-9">{num}</span>
          <h2
            className="text-3xl font-semibold text-ink"
            style={{ letterSpacing: 'var(--tracking-32)' }}
          >
            {title}
          </h2>
        </div>
        {note && <p className="mt-3 max-w-2xl leading-relaxed text-n-10">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-n-9 uppercase">
      {children}
    </p>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="mb-10 last:mb-0">{children}</div>;
}
