'use client';

import { useState } from 'react';
import { Label, Row } from './Kit';

/* One button implementation, four variants. The press animation uses the
   generated jelly spring via CSS transition-timing-function, so it costs no
   JS on the interaction path. */

const base =
  'inline-flex items-center justify-center gap-2 font-medium select-none ' +
  'transition-[transform,background-color,border-color,box-shadow] ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40';

const sizes = {
  sm: 'h-9 px-4 text-sm rounded-pill',
  md: 'h-11 px-6 text-[15px] rounded-pill',
  lg: 'h-14 px-8 text-base rounded-pill',
};

const variants = {
  primary:
    'bg-a-9 text-white shadow-e1 hover:bg-a-10 hover:shadow-e2',
  secondary:
    'bg-n-2 text-ink border border-n-6 hover:bg-n-3 hover:border-n-7',
  ghost: 'text-n-11 hover:bg-n-3',
  danger: 'bg-olive-deep text-white hover:opacity-90',
};

export function Btn({
  variant = 'primary',
  size = 'md',
  children,
  ...rest
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]}`}
      style={{
        transitionTimingFunction: 'var(--spring-hover)',
        transitionDuration: 'var(--dur-hover)',
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function Buttons() {
  const [on, setOn] = useState(true);

  return (
    <div>
      <Row>
        <Label>Variants</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Btn variant="primary">View work</Btn>
          <Btn variant="secondary">Résumé</Btn>
          <Btn variant="ghost">Copy email</Btn>
          <Btn variant="danger">Olive tone</Btn>
        </div>
      </Row>

      <Row>
        <Label>Sizes</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Btn size="sm">Small</Btn>
          <Btn size="md">Medium</Btn>
          <Btn size="lg">Large</Btn>
        </div>
      </Row>

      <Row>
        <Label>States</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Btn>Default</Btn>
          <Btn className={`${base} ${sizes.md} ${variants.primary} bg-a-10`}>
            Hover
          </Btn>
          <Btn autoFocus={false} className={`${base} ${sizes.md} ${variants.primary}`}>
            Focus (tab to me)
          </Btn>
          <Btn disabled>Disabled</Btn>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-n-10">
          Focus rings use step <strong>8</strong>, never step 7. Step 7 measures
          1.89:1 and fails WCAG 1.4.11&rsquo;s 3:1 floor for non-text UI —
          despite Radix labelling that exact step &ldquo;UI element border and
          focus rings&rdquo;.
        </p>
      </Row>

      <Row>
        <Label>Form controls</Label>
        <div className="grid max-w-xl gap-4">
          <div>
            <label
              htmlFor="ds-input"
              className="mb-1.5 block text-sm text-n-10"
            >
              Text input
            </label>
            <input
              id="ds-input"
              placeholder="hello@example.com"
              className="h-12 w-full rounded-md border border-n-6 bg-n-2 px-4 text-ink transition-colors placeholder:text-n-9 hover:border-n-7 focus:border-a-8"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => setOn((v) => !v)}
              className="relative h-7 w-12 rounded-pill transition-colors"
              style={{
                backgroundColor: on ? 'var(--color-a-9)' : 'var(--color-n-7)',
                transitionDuration: 'var(--dur-hover)',
              }}
            >
              <span
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-e1"
                style={{
                  left: on ? 'calc(100% - 1.5rem)' : '0.25rem',
                  transition: `left var(--dur-press) var(--spring-press)`,
                }}
              />
            </button>
            <span className="text-sm text-n-10">
              Toggle — travels on the jelly spring
            </span>
          </div>
        </div>
      </Row>

      <Row>
        <Label>Chips</Label>
        <div className="flex flex-wrap gap-2">
          {['FastAPI', 'LangGraph', 'MongoDB Atlas', 'Next.js', 'Python'].map((t) => (
            <span
              key={t}
              className="rounded-pill border border-n-6 bg-n-2 px-3 py-1.5 text-sm text-n-11"
            >
              {t}
            </span>
          ))}
          <span className="rounded-pill bg-a-3 px-3 py-1.5 text-sm font-medium text-a-12">
            Live
          </span>
        </div>
      </Row>
    </div>
  );
}
