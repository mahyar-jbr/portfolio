import type { ReactNode } from 'react';

/* Wireframe primitives. Deliberately unstyled-looking — dashed outlines and
   mono labels so nothing here reads as a design decision. Every slot is
   labelled with what it holds and the constraint from design/SECTIONS.md,
   which makes this double as the brief for the content tab. */

export function Slot({
  label,
  note,
  children,
  className = '',
}: {
  label: string;
  note?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-dashed border-neutral-700 px-4 pt-5 pb-4 ${className}`}
    >
      <span className="absolute -top-2 left-3 bg-ink px-1.5 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
        {label}
      </span>
      {note && (
        <p className="mb-3 font-mono text-[10px] leading-relaxed text-neutral-600">
          {note}
        </p>
      )}
      {children}
    </div>
  );
}

/** Grey bars standing in for copy. */
export function Lines({
  count = 1,
  widths,
  size = 'md',
}: {
  count?: number;
  widths?: string[];
  size?: 'sm' | 'md' | 'lg';
}) {
  const h = size === 'lg' ? 'h-4' : size === 'sm' ? 'h-2' : 'h-3';
  const fallback = ['100%', '92%', '78%', '85%', '60%'];
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${h} bg-neutral-800`}
          style={{ width: widths?.[i] ?? fallback[i % fallback.length] }}
        />
      ))}
    </div>
  );
}

export function Chip({ w = 64 }: { w?: number }) {
  return (
    <span
      className="inline-block h-6 border border-neutral-800 bg-neutral-900"
      style={{ width: w }}
    />
  );
}

export function Chips({ count = 6 }: { count?: number }) {
  const widths = [58, 72, 50, 66, 80, 54];
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Chip key={i} w={widths[i % widths.length]} />
      ))}
    </div>
  );
}

export function Btn({ label, ghost = false }: { label: string; ghost?: boolean }) {
  return (
    <span
      className={`inline-flex h-10 items-center px-4 font-mono text-[10px] tracking-widest uppercase ${
        ghost
          ? 'border border-neutral-700 text-neutral-500'
          : 'border-2 border-neutral-400 text-neutral-300'
      }`}
    >
      {label}
    </span>
  );
}

/** Image / media placeholder with a crossed box. */
export function Media({
  label,
  ratio = 'aspect-[3/2]',
  className = '',
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center border border-neutral-800 bg-neutral-900/60 ${ratio} ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full text-neutral-800"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <span className="relative font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
        {label}
      </span>
    </div>
  );
}

/** Section band: number + title + optional structural note. */
export function SectionShell({
  num,
  title,
  id,
  note,
  children,
}: {
  num?: string;
  title: string;
  id: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-neutral-900 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-baseline gap-4">
          {num && (
            <span className="font-mono text-xs tracking-widest text-neutral-600">
              {num}
            </span>
          )}
          <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase">
            {title}
          </h2>
          <span className="h-px flex-1 bg-neutral-900" />
        </div>
        {note && (
          <p className="mb-8 max-w-2xl font-mono text-[10px] leading-relaxed text-neutral-600">
            {note}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
