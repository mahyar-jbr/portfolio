'use client';

import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * The site button.
 *
 * What it does NOT do: no sheen sweep, no gradient border, no glow. Those read
 * as generated. The premium signal here is press physics that behave like an
 * object — on press the surface scales down AND its shadow collapses, because
 * a thing pushed toward a surface casts a tighter shadow. Releasing springs it
 * back on the jelly curve rather than easing linearly.
 *
 * The trailing icon travels on hover while the label holds still, so the
 * motion has a direction instead of just being movement.
 */

const sizes = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
};

const variants = {
  primary: 'bg-a-9 text-white hover:bg-a-10',
  secondary: 'bg-n-2 text-ink border border-n-6 hover:border-n-8 hover:bg-n-1',
  ghost: 'text-n-11 hover:bg-n-3 hover:text-ink',
};

type Props = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  icon?: ReactNode;
  children: ReactNode;
  /** Return a promise and the button runs its own pending -> done cycle. */
  onSubmit?: () => Promise<unknown>;
  doneLabel?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSubmit'>;

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  onSubmit,
  doneLabel = 'Done',
  ...rest
}: Props) {
  const [state, setState] = useState<'idle' | 'pending' | 'done'>('idle');

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    rest.onClick?.(e);
    if (!onSubmit || state !== 'idle') return;
    setState('pending');
    try {
      await onSubmit();
      setState('done');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      setState('idle');
    }
  }

  const shadow =
    variant === 'ghost'
      ? ''
      : 'shadow-e1 hover:shadow-e2 active:shadow-e1';

  return (
    <button
      {...rest}
      onClick={handleClick}
      data-state={state}
      className={`group btn-press sq relative inline-flex items-center justify-center overflow-hidden rounded-pill
        font-medium select-none disabled:pointer-events-none disabled:opacity-40
        ${sizes[size]} ${variants[variant]} ${shadow} ${className}`}
    >
      {/* Labels crossfade in place so the button never changes width mid-action —
          a button that resizes while you watch is what makes a form feel cheap. */}
      <span
        className="inline-flex items-center gap-2 transition-[opacity,transform]"
        style={{
          opacity: state === 'idle' ? 1 : 0,
          transform: state === 'idle' ? 'none' : 'translateY(-120%)',
          transitionDuration: 'var(--dur-hover)',
          transitionTimingFunction: 'var(--spring-hover)',
        }}
      >
        {children}
        {icon && (
          <span
            className="inline-flex transition-transform will-change-transform group-hover:translate-x-1"
            style={{
              transitionDuration: 'var(--dur-press)',
              transitionTimingFunction: 'var(--spring-press)',
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </span>

      {onSubmit && (
        <span
          className="absolute inset-0 inline-flex items-center justify-center gap-2 transition-[opacity,transform]"
          style={{
            opacity: state === 'idle' ? 0 : 1,
            transform: state === 'idle' ? 'translateY(120%)' : 'none',
            transitionDuration: 'var(--dur-hover)',
            transitionTimingFunction: 'var(--spring-hover)',
          }}
          aria-live="polite"
        >
          {state === 'pending' ? (
            <>
              <Spinner />
              <span>Sending</span>
            </>
          ) : (
            <>
              <Check />
              <span>{doneLabel}</span>
            </>
          )}
        </span>
      )}
    </button>
  );
}

/* A ring that rotates at a constant rate — no easing, because a loading
   indicator that accelerates implies progress it doesn't have. */
function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" className="animate-spin" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="2"
      />
      <path
        d="M8 1.5A6.5 6.5 0 0 1 14.5 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Drawn rather than filled, so it can stroke itself in on the spring. */
function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 0,
          animation: 'draw-check var(--dur-press) var(--spring-press) both',
        }}
      />
    </svg>
  );
}
