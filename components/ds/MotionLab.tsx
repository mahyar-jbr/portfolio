'use client';

import { useState } from 'react';
import { Label, Row } from './Kit';

/* Each row replays the real generated curve. These are CSS linear() tokens,
   so they run off the main thread and cost no JS on the interaction path —
   and they degrade automatically under prefers-reduced-motion. */
const SPRINGS = [
  { n: 'hover', v: '--spring-hover', d: '--dur-hover', ms: 332, over: '1.15%', use: 'hover, small state change' },
  { n: 'press', v: '--spring-press', d: '--dur-press', ms: 419, over: '3.61%', use: 'press, toggle travel — the "jelly"' },
  { n: 'enter', v: '--spring-enter', d: '--dur-enter', ms: 519, over: '0.15%', use: 'element enter' },
  { n: 'layout', v: '--spring-layout', d: '--dur-layout', ms: 715, over: '0.04%', use: 'layout shift' },
  { n: 'smooth', v: '--spring-smooth', d: '--dur-smooth', ms: 883, over: '0.00%', use: 'Apple default — bounce 0' },
  { n: 'bouncy', v: '--spring-bouncy', d: '--dur-smooth', ms: 806, over: '4.42%', use: 'use sparingly' },
];

export default function MotionLab() {
  const [tick, setTick] = useState(0);

  return (
    <div>
      <Row>
        <button
          type="button"
          onClick={() => setTick((t) => t + 1)}
          className="mb-6 h-11 rounded-pill bg-a-9 px-6 text-[15px] font-medium text-white transition-colors hover:bg-a-10"
        >
          Replay all
        </button>

        <div className="divide-y divide-n-5">
          {SPRINGS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="w-52 shrink-0 font-mono text-[11px] text-n-9">
                <div className="text-n-11">{s.n}</div>
                <div>
                  {s.ms}ms · overshoot {s.over}
                </div>
                <div>{s.use}</div>
              </div>
              <div className="relative h-9 flex-1 rounded-pill bg-n-3">
                <div
                  key={`${s.n}-${tick}`}
                  className="absolute top-1.5 h-6 w-6 rounded-full bg-a-9"
                  style={{
                    animation: `ds-travel var(${s.d}) var(${s.v}) forwards`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Row>
        <Label>Why this matters</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-n-6 bg-n-2 p-5">
            <p className="mb-2 font-mono text-[11px] font-semibold text-ink">
              Motion&rsquo;s defaults are not Apple&rsquo;s
            </p>
            <p className="text-sm leading-relaxed text-n-10">
              Framer Motion animates transforms at stiffness 500 / damping 25 —
              a bounce of <strong>0.44</strong>. Apple&rsquo;s declared default
              is <strong>0.0</strong>. That single number is most of the
              distance between &ldquo;premium&rdquo; and &ldquo;cartoonish&rdquo;,
              and it is why untuned Framer Motion never quite feels right.
            </p>
          </div>
          <div className="rounded-md border border-n-6 bg-n-2 p-5">
            <p className="mb-2 font-mono text-[11px] font-semibold text-ink">
              Reduced motion is opt-in
            </p>
            <p className="text-sm leading-relaxed text-n-10">
              Motion ships <code className="font-mono">reducedMotion: &lsquo;never&rsquo;</code>{' '}
              by default, so the OS setting is ignored until you say otherwise.
              It&rsquo;s now set to <code className="font-mono">&lsquo;user&rsquo;</code> at
              the root. Note it only disables transform and layout — opacity and
              colour still animate, and filters need their own branch.
            </p>
          </div>
        </div>
      </Row>

      <style>{`
        @keyframes ds-travel {
          from { left: 0.375rem; }
          to   { left: calc(100% - 1.875rem); }
        }
      `}</style>
    </div>
  );
}
