'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// MoneyMind's request flow, animated: a packet travels through the stages, then
// tokens stream back token-by-token (echoing the real UX). Monochrome.
const STAGES = [
  { id: 'next', label: 'Next.js', sub: 'client' },
  { id: 'fastapi', label: 'FastAPI', sub: 'agent service' },
  { id: 'langgraph', label: 'LangGraph', sub: 'agent' },
  { id: 'atlas', label: 'Atlas', sub: 'vector search' },
  { id: 'gemini', label: 'Gemini', sub: 'LLM' },
];

const RESPONSE = ['You', 'spent', '$312', 'on', 'groceries', 'this', 'month.'];

export default function StreamingPipeline() {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    let stage = 0;
    let tok = 0;
    let timer;

    const tick = () => {
      if (stage < STAGES.length) {
        setActive(stage);
        stage += 1;
        timer = setTimeout(tick, 520);
      } else if (tok <= RESPONSE.length) {
        setActive(STAGES.length); // all lit
        setTokens(tok);
        tok += 1;
        timer = setTimeout(tick, 280);
      } else {
        // reset after a pause
        timer = setTimeout(() => {
          stage = 0;
          tok = 0;
          setActive(-1);
          setTokens(0);
          timer = setTimeout(tick, 600);
        }, 1600);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="w-full overflow-x-auto py-6">
      <div className="mx-auto min-w-[680px] max-w-4xl">
        {/* request flow */}
        <div className="flex items-stretch justify-between gap-2">
          {STAGES.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <Stage stage={s} lit={reduced || active >= i} />
              {i < STAGES.length - 1 && (
                <Arrow lit={reduced || active > i} />
              )}
            </div>
          ))}
        </div>

        {/* return: streamed tokens */}
        <div className="mt-8 border-2 border-zinc-800 bg-ink/50 p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            ← response · streamed token by token
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-sm text-paper sm:text-base">
            {RESPONSE.map((word, i) => (
              <span
                key={i}
                className={
                  reduced || i < tokens
                    ? 'opacity-100 transition-opacity'
                    : 'opacity-0'
                }
              >
                {word}
              </span>
            ))}
            {!reduced && (
              <span className="inline-block h-4 w-2 animate-pulse bg-paper align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({ stage, lit }) {
  return (
    <motion.div
      className="relative flex flex-1 flex-col items-center justify-center border-2 px-2 py-3 text-center"
      animate={{
        borderColor: lit ? 'rgba(255,255,255,0.7)' : 'rgb(39,39,42)',
        backgroundColor: lit ? 'rgba(255,255,255,0.05)' : 'transparent',
      }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xs font-bold text-paper sm:text-sm">{stage.label}</span>
      <span className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-500">
        {stage.sub}
      </span>
    </motion.div>
  );
}

function Arrow({ lit }) {
  return (
    <motion.div
      className="px-1 text-lg"
      animate={{ color: lit ? '#fff' : 'rgb(63,63,70)' }}
      transition={{ duration: 0.3 }}
    >
      →
    </motion.div>
  );
}
