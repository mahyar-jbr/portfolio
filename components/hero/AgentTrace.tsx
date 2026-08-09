'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The hero signature: a real agent pipeline executing.
 *
 * Every line is MoneyMind's ACTUAL stack, verified from its README and commit
 * history — voyage-3 at 1024 dimensions, Atlas vector search, a LangGraph ReAct
 * loop over 18 tools plus MCP, and chunked plain-text streaming out of Gemini
 * 2.5 Flash. A previous session invented a plausible six-agent breakdown for a
 * different project and it read perfectly and was fiction; nothing here is
 * reconstructed, so every line survives being asked about in an interview.
 *
 * It animates because a pipeline executing IS the content — the sequencing
 * carries meaning. That's the bar it has to clear to earn motion at all: it
 * isn't a typewriter effect delaying text you wanted to read.
 *
 * Runs once, then rests. No infinite loop — an idle tab burning frames on
 * decoration is the opposite of the premium it's arguing for.
 */

type Step = {
  call: string;
  detail: string;
  /** Milliseconds this stage appears to take. Uneven on purpose — real traces are. */
  ms: number;
};

const STEPS: Step[] = [
  { call: 'memory.embed()', detail: 'voyage-3 · 1024-d', ms: 420 },
  { call: 'atlas.vector_search()', detail: 'by meaning, not keyword', ms: 560 },
  { call: 'langgraph.react()', detail: '18 tools + MCP', ms: 340 },
  { call: 'tools.invoke()', detail: 'analyze_spending', ms: 620 },
  { call: 'gemini.stream()', detail: 'chunked, not SSE', ms: 480 },
];

export default function AgentTrace() {
  // -1 = not started, i = stage i running, STEPS.length = finished
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
    STEPS.forEach((s, i) => {
      at += s.ms;
      timers.current.push(setTimeout(() => setActive(i + 1), at));
    });
  }, [clear]);

  useEffect(() => {
    // Reduced motion gets the finished state immediately — the information is
    // the point, the sequencing is the flourish.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setActive(STEPS.length);
      return;
    }
    const kick = setTimeout(run, 620);
    return () => {
      clearTimeout(kick);
      clear();
    };
  }, [run, clear]);

  const done = active >= STEPS.length;

  return (
    <div className="sq relative rounded-lg border border-n-6 bg-n-2 shadow-e2">
      {/* header */}
      <div className="flex items-center justify-between border-b border-n-5 px-5 py-3">
        <span className="font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase">
          MoneyMind · agent run
        </span>
        <button
          type="button"
          onClick={run}
          className="btn-press sq rounded-pill px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-n-9 uppercase hover:bg-n-4 hover:text-ink"
        >
          replay
        </button>
      </div>

      <ol className="px-5 py-4">
        {STEPS.map((s, i) => {
          const state = active > i ? 'done' : active === i ? 'running' : 'idle';
          return (
            <li key={s.call} className="relative flex items-start gap-3 py-2.5">
              {/* rail — a real connector, so the stages read as one pipeline
                  rather than five unrelated rows */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[1.6rem] left-[0.3rem] h-[calc(100%-0.6rem)] w-px origin-top bg-n-6 transition-transform"
                  style={{
                    transform: `scaleY(${active > i ? 1 : 0})`,
                    transitionDuration: 'var(--dur-enter)',
                    transitionTimingFunction: 'var(--spring-enter)',
                  }}
                />
              )}

              <Dot state={state} />

              <div className="min-w-0 flex-1">
                <div
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 transition-[opacity,transform]"
                  style={{
                    opacity: state === 'idle' ? 0.34 : 1,
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
                  <span className="font-mono text-[11px] text-n-9">{s.detail}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center justify-between border-t border-n-5 px-5 py-3">
        <span
          className="font-mono text-[11px] transition-colors"
          style={{
            color: done ? 'var(--color-olive)' : 'var(--color-n-9)',
            transitionDuration: 'var(--dur-enter)',
          }}
        >
          {done ? 'response streaming' : 'running…'}
        </span>
        <span className="font-mono text-[11px] text-n-9">
          grounded in the user&rsquo;s own data
        </span>
      </div>
    </div>
  );
}

/* Idle = hollow, running = accent with a live ring, done = filled.
   The ring only animates while a stage is genuinely in flight, so motion on
   this page always means something is happening. */
function Dot({ state }: { state: 'idle' | 'running' | 'done' }) {
  return (
    <span className="relative mt-[0.3rem] flex h-[0.65rem] w-[0.65rem] shrink-0 items-center justify-center">
      {state === 'running' && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--color-a-9)',
            opacity: 0.22,
            animation: 'trace-ping 1s var(--spring-smooth) infinite',
          }}
        />
      )}
      <span
        className="relative h-[0.55rem] w-[0.55rem] rounded-full border transition-[background-color,border-color,transform]"
        style={{
          backgroundColor:
            state === 'idle'
              ? 'transparent'
              : state === 'running'
                ? 'var(--color-a-9)'
                : 'var(--color-a-9)',
          borderColor: state === 'idle' ? 'var(--color-n-7)' : 'var(--color-a-9)',
          transform: state === 'running' ? 'scale(1.12)' : 'scale(1)',
          transitionDuration: 'var(--dur-press)',
          transitionTimingFunction: 'var(--spring-press)',
        }}
      />
    </span>
  );
}
