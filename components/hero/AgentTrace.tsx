'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { heroTrace } from '@/content/site';

/**
 * The hero signature: an agent call chain, rendered.
 *
 * Every tool name comes from content/site.ts and is real — taken from
 * MoneyMind's agent and verified three ways in its extraction doc. It
 * deliberately does NOT use the intake/classify/recommend/review pipeline
 * design/SECTIONS.md §3.2 proposed: those agent names were invented by an
 * earlier session and were never confirmed against Maridian's source.
 *
 * Framing matters here. The content tab is explicit that the result strings are
 * illustrative of SHAPE, not transcribed from a specific run — so this is
 * labelled an example call chain and never "output", "captured", or "a run".
 * Presenting synthesised results as a real trace is the one failure mode this
 * whole site is built to avoid.
 *
 * It animates because sequencing is the information: a call chain resolving in
 * order shows how an agent actually works. It runs once and rests — no loop,
 * because an idle tab burning frames on decoration argues against the craft
 * it's meant to demonstrate.
 */

const STEP_MS = [420, 560, 340, 620, 480];

export default function AgentTrace() {
  const steps = heroTrace.steps;
  const [active, setActive] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(() => {
    clear();
    setActive(0);
    let at = 0;
    steps.forEach((_, i) => {
      at += STEP_MS[i % STEP_MS.length];
      timers.current.push(setTimeout(() => setActive(i + 1), at));
    });
  }, [clear, steps]);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setActive(steps.length);
      return;
    }
    const kick = setTimeout(run, 640);
    return () => {
      clearTimeout(kick);
      clear();
    };
  }, [run, clear, steps.length]);

  const done = active >= steps.length;

  return (
    <figure className="sq m-0 rounded-lg border border-n-6 bg-n-2 shadow-e2">
      <figcaption className="flex items-center justify-between border-b border-n-5 px-5 py-3">
        <span className="font-mono text-[11px] tracking-[0.14em] text-n-9 uppercase">
          {heroTrace.caption}
        </span>
        <button
          type="button"
          onClick={run}
          className="btn-press sq rounded-pill px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-n-9 uppercase hover:bg-n-4 hover:text-ink"
        >
          replay
        </button>
      </figcaption>

      <ol className="px-5 py-4">
        {steps.map((s, i) => {
          const state = active > i ? 'done' : active === i ? 'running' : 'idle';
          return (
            <li key={s.call} className="relative flex items-start gap-3 py-2.5">
              {/* A real connector, so the calls read as one chain rather than
                  five unrelated rows. */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[1.55rem] left-[0.3rem] h-[calc(100%-0.55rem)] w-px origin-top bg-n-6 transition-transform"
                  style={{
                    transform: `scaleY(${active > i ? 1 : 0})`,
                    transitionDuration: 'var(--dur-enter)',
                    transitionTimingFunction: 'var(--spring-enter)',
                  }}
                />
              )}

              <Dot state={state} />

              <div
                className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 transition-[opacity,transform]"
                style={{
                  opacity: state === 'idle' ? 0.32 : 1,
                  transform:
                    state === 'idle' ? 'translate3d(0,2px,0)' : 'translate3d(0,0,0)',
                  transitionDuration: 'var(--dur-enter)',
                  transitionTimingFunction: 'var(--spring-enter)',
                }}
              >
                <code
                  className="font-mono text-[13px] transition-colors"
                  style={{
                    color:
                      state === 'idle'
                        ? 'var(--color-n-9)'
                        : state === 'running'
                          ? 'var(--color-a-11)'
                          : 'var(--color-ink)',
                    transitionDuration: 'var(--dur-hover)',
                  }}
                >
                  {s.call}
                </code>
                <span
                  className="font-mono text-[11px] text-n-9 transition-opacity"
                  style={{
                    opacity: state === 'done' ? 1 : 0,
                    transitionDuration: 'var(--dur-hover)',
                  }}
                >
                  {s.result}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* "Example" is doing real work — these results show the shape of a
          response, they are not a transcript. */}
      <div className="border-t border-n-5 px-5 py-3">
        <span
          className="font-mono text-[11px] transition-colors"
          style={{
            color: done ? 'var(--color-olive)' : 'var(--color-n-9)',
            transitionDuration: 'var(--dur-enter)',
          }}
        >
          {done ? 'example chain complete' : 'resolving…'}
        </span>
      </div>
    </figure>
  );
}

function Dot({ state }: { state: 'idle' | 'running' | 'done' }) {
  return (
    <span className="relative mt-[0.28rem] flex h-[0.65rem] w-[0.65rem] shrink-0 items-center justify-center">
      {state === 'running' && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--color-a-9)',
            animation: 'trace-ping 1s var(--spring-smooth) infinite',
          }}
        />
      )}
      <span
        className="relative h-[0.55rem] w-[0.55rem] rounded-full border transition-[background-color,border-color,transform]"
        style={{
          backgroundColor: state === 'idle' ? 'transparent' : 'var(--color-a-9)',
          borderColor: state === 'idle' ? 'var(--color-n-7)' : 'var(--color-a-9)',
          transform: state === 'running' ? 'scale(1.12)' : 'scale(1)',
          transitionDuration: 'var(--dur-press)',
          transitionTimingFunction: 'var(--spring-press)',
        }}
      />
    </span>
  );
}
