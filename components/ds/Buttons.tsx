'use client';

import { useState } from 'react';
import { Label, Row } from './Kit';
import Button from '@/components/ui/Button';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Buttons() {
  const [on, setOn] = useState(true);

  return (
    <div>
      <Row>
        <Label>Variants — hover for the lift, hold for the press</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button icon={<Arrow />}>View work</Button>
          <Button variant="secondary">Résumé</Button>
          <Button variant="ghost">Copy email</Button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          On press the surface scales to 0.972 <em>and</em> its shadow collapses
          — an object pushed toward a surface casts a tighter shadow, so moving
          only one of the two reads as fake. Press is 90ms because real objects
          respond to force immediately; only the release oscillates, on the
          jelly spring.
        </p>
      </Row>

      <Row>
        <Label>Submit — the label crossfades, the button never resizes</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button onSubmit={() => wait(1400)} doneLabel="Copied">
            Copy email
          </Button>
          <Button
            variant="secondary"
            onSubmit={() => wait(1100)}
            doneLabel="Sent"
          >
            Send message
          </Button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          Idle and pending labels are stacked and swap by translating past each
          other, so the width is fixed by the wider of the two. A button that
          reflows mid-submit is one of the most common tells of an interface
          nobody sweated.
        </p>
      </Row>

      <Row>
        <Label>Sizes</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="secondary">Small</Button>
          <Button size="md" variant="secondary">Medium</Button>
          <Button size="lg" variant="secondary">Large</Button>
        </div>
      </Row>

      <Row>
        <Label>Form controls</Label>
        <div className="grid max-w-xl gap-5">
          <div>
            <label htmlFor="ds-input" className="mb-2 block text-sm text-n-10">
              Text input
            </label>
            <input
              id="ds-input"
              placeholder="hello@example.com"
              className="sq h-12 w-full rounded-pill border border-n-6 bg-n-2 px-5 text-ink transition-[border-color,background-color,box-shadow] placeholder:text-n-9 hover:border-n-8 focus:border-a-8 focus:bg-n-1"
              style={{
                transitionDuration: 'var(--dur-hover)',
                transitionTimingFunction: 'var(--spring-hover)',
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => setOn((v) => !v)}
              className="relative h-8 w-[3.25rem] rounded-pill transition-colors"
              style={{
                backgroundColor: on ? 'var(--color-a-9)' : 'var(--color-n-7)',
                transitionDuration: 'var(--dur-hover)',
              }}
            >
              {/* The knob stretches slightly in the direction of travel, then
                  settles — the one place a genuinely "jelly" cue belongs. */}
              <span
                className="absolute top-1 h-6 rounded-pill bg-white shadow-e1"
                style={{
                  left: on ? 'calc(100% - 1.75rem)' : '0.25rem',
                  width: '1.5rem',
                  transition: `left var(--dur-press) var(--spring-press)`,
                }}
              />
            </button>
            <span className="text-sm text-n-10">Toggle</span>
          </div>
        </div>
      </Row>

      <Row>
        <Label>Chips & links</Label>
        <div className="mb-5 flex flex-wrap gap-2">
          {['FastAPI', 'LangGraph', 'MongoDB Atlas', 'Next.js'].map((t) => (
            <span
              key={t}
              className="sq rounded-pill border border-n-6 bg-n-2 px-3.5 py-1.5 text-sm text-n-11"
            >
              {t}
            </span>
          ))}
          <span className="sq rounded-pill bg-a-3 px-3.5 py-1.5 text-sm font-medium text-a-12">
            Live
          </span>
        </div>
        <a
          href="#"
          className="u-draw text-a-11"
          onClick={(e) => e.preventDefault()}
        >
          An underline that travels
        </a>
        <p className="mt-3 max-w-2xl text-sm text-n-10">
          It scales in from the left and out to the <em>right</em> — so the line
          keeps travelling rather than rewinding itself.
        </p>
      </Row>
    </div>
  );
}
