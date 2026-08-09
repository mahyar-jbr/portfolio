'use client';

import { useState } from 'react';
import { Label, Row } from './Kit';

const ELEVATIONS = [
  { n: 'e1', v: 'var(--shadow-e1)', use: 'resting card' },
  { n: 'e2', v: 'var(--shadow-e2)', use: 'hover / glass' },
  { n: 'e3', v: 'var(--shadow-e3)', use: 'popover' },
  { n: 'e4', v: 'var(--shadow-e4)', use: 'modal' },
];

export default function Surfaces() {
  const [transparency, setTransparency] = useState(true);

  return (
    <div data-transparency={transparency ? 'on' : 'off'}>
      <Row>
        <Label>Elevation — layered, never a single blur</Label>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ELEVATIONS.map((e) => (
            <div
              key={e.n}
              className="rounded-lg bg-n-2 p-5"
              style={{ boxShadow: e.v }}
            >
              <p className="font-mono text-xs font-semibold text-ink">
                {e.n}
              </p>
              <p className="mt-1 font-mono text-[11px] text-n-9">{e.use}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          Each is two or three stacked shadows, tinted with the neutral&rsquo;s
          hue rather than pure black. A single blurry drop shadow is the fastest
          way to make a light interface look cheap — real light produces a tight
          contact shadow plus a wide ambient one.
        </p>
      </Row>

      <Row>
        <Label>Radii — 4 / 12 / 24 / 32 / pill</Label>
        <div className="flex flex-wrap items-end gap-4">
          {[
            ['sm', '4px'],
            ['md', '12px'],
            ['lg', '24px'],
            ['xl', '32px'],
            ['pill', '1000px'],
          ].map(([n, v]) => (
            <div key={n} className="text-center">
              <div
                className="h-20 w-20 border border-n-6 bg-n-3"
                style={{ borderRadius: v }}
              />
              <p className="mt-1.5 font-mono text-[10px] text-n-9">{n}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-md rounded-lg border border-n-6 bg-n-2 p-3">
          <div className="rounded-[calc(24px-12px)] border border-a-6 bg-a-2 p-3">
            <p className="font-mono text-[11px] text-a-12">
              inner = max(0px, outer − padding) → 24 − 12 = 12
            </p>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-n-10">
          Concentric radii. Getting this wrong — nesting a 12px box inside
          another 12px box — produces the pinched corner that reads as
          amateurish even when nobody can name why.
        </p>
      </Row>

      <Row>
        <Label>Glass — chrome only</Label>

        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={transparency}
            onClick={() => setTransparency((v) => !v)}
            className="relative h-7 w-12 rounded-pill transition-colors"
            style={{
              backgroundColor: transparency ? 'var(--color-a-9)' : 'var(--color-n-7)',
            }}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-e1"
              style={{
                left: transparency ? 'calc(100% - 1.5rem)' : '0.25rem',
                transition: 'left var(--dur-press) var(--spring-press)',
              }}
            />
          </button>
          <span className="text-sm text-n-10">
            Transparency — the manual escape hatch
          </span>
        </div>

        {/* A deliberately hostile backdrop: this is the worst case the scrim
            alpha was solved against. */}
        <div
          className="relative overflow-hidden rounded-lg p-8"
          style={{
            background:
              'linear-gradient(115deg,#000 0%,#D0021B 28%,#0000FF 52%,#00FF00 74%,#FF00FF 100%)',
          }}
        >
          <div className="glass glass-rim relative rounded-md p-6">
            <p
              className="text-lg font-semibold text-ink"
              style={{ letterSpacing: 'var(--tracking-18)' }}
            >
              Ink on glass, over the worst backdrop there is
            </p>
            <p className="mt-2 text-sm leading-relaxed text-n-11">
              7.88:1 over pure black · 9.33:1 over vivid red · 8.44:1 over pure
              blue. The 0.72 alpha floor was solved from worst-case compositing
              rather than picked because it looked nice over the hero — which is
              why it stays legible over the artwork on /art too.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-n-10 sm:grid-cols-3">
          {[
            [
              'Never nest it',
              'Chromium blocks a backdrop-filtered element’s children from having their own. It works in Safari while you build, then breaks for the Chrome majority.',
            ],
            [
              'Never var() the blur',
              'Safari 18 can’t resolve custom properties inside backdrop-filter — tokenising it yields no glass at all in Apple’s own browser.',
            ],
            [
              'Never filter an ancestor',
              'opacity<1, mask, clip-path, filter or will-change on any parent creates a backdrop root and silently flattens the effect.',
            ],
          ].map(([h, b]) => (
            <div
              key={h}
              className="rounded-md border border-n-6 bg-n-2 p-4"
            >
              <p className="mb-1 font-mono text-[11px] font-semibold text-ink">
                {h}
              </p>
              <p className="text-[13px] leading-relaxed">{b}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          Apple&rsquo;s HIG, verbatim: <em>&ldquo;Don&rsquo;t use Liquid Glass
          in the content layer&hellip; use standard materials for elements in the
          content layer, such as app backgrounds.&rdquo;</em> Glass belongs to
          nav and floating controls. That is also what makes its contrast
          provable — a translucent surface over arbitrary content can&rsquo;t be
          guaranteed, but over a known chrome position it can.
        </p>
      </Row>
    </div>
  );
}
