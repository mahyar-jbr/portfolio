import type { ReactNode } from 'react';
import BrandIcon, { brandFor } from './BrandIcon';

/**
 * Tag — a soft label background with ink text. Tags group; they never signal
 * state. The one exception the kit makes is the green status tag, which always
 * carries its words (and, for a live status, the success dot).
 */
export default function Tag({
  tone,
  dot,
  children,
}: {
  tone?: 'green' | 'blue' | 'orange' | 'purple';
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={tone ? `lu-tag is-${tone}` : 'lu-tag'}>
      {dot && <span className="lu-dot" />}
      {children}
    </span>
  );
}

/**
 * A tool as a tag: its name, led by the brand's real mark when it has one
 * (Python, React, Claude…). Generic terms (Graphs, RAG, SSE) stay words.
 */
export function ToolTag({ name }: { name: string }) {
  const brand = brandFor(name);
  return (
    <Tag>
      {brand && <BrandIcon name={brand} />}
      {name}
    </Tag>
  );
}
