'use client';

import type { ReactNode } from 'react';
import { usePointer } from '@/lib/use-pointer';

/**
 * An interactive glass surface.
 *
 * The only pointer-reactive thing here is the RIM: the specular gradient
 * rotates toward the cursor, the way a real bevel catches a moving light. That
 * is physically motivated, which is the bar — a glowing disc that chases the
 * cursor is the single most recognisable generated-portfolio effect and is
 * deliberately absent.
 *
 * One glass layer per stacking branch — never render a Glass inside a Glass.
 * Chromium refuses a backdrop-filtered element's children their own
 * backdrop-filter while Gecko and WebKit allow it, so nesting works while you
 * develop on Safari and silently flattens for the Chrome majority.
 */
export default function Glass({
  children,
  className = '',
  radius = 'rounded-lg',
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  interactive?: boolean;
}) {
  const p = usePointer<HTMLDivElement>();

  return (
    <div
      ref={p.ref}
      onPointerMove={interactive ? p.onPointerMove : undefined}
      onPointerEnter={interactive ? p.onPointerEnter : undefined}
      onPointerLeave={interactive ? p.onPointerLeave : undefined}
      style={{ ['--pa' as string]: 0 }}
      className={`glass glass-rim sq ${interactive ? 'lift' : ''} ${radius} ${className}`}
    >
      {children}
    </div>
  );
}
