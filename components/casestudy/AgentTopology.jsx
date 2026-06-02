'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { easeBrandOut } from '@/lib/motion';

// Maridian's six-agent topology: an orchestrator coordinating specialist agents,
// feeding the operator portal. Monochrome, brutalist boxes + connectors.
// VERIFY: agent names are illustrative — correct to match the real system.
const AGENTS = ['Intake', 'Classify', 'Recommend', 'Review', 'Notify'];

export default function AgentTopology() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="w-full overflow-x-auto py-6">
      <div className="mx-auto flex min-w-[640px] max-w-3xl flex-col items-center gap-8">
        {/* Orchestrator */}
        <Node label="Orchestrator" big inView={inView} reduced={reduced} delay={0} />

        {/* connector down */}
        <Connector vertical inView={inView} reduced={reduced} />

        {/* specialist agents row */}
        <div className="grid w-full grid-cols-5 gap-3">
          {AGENTS.map((a, i) => (
            <Node
              key={a}
              label={a}
              tag={`agent_${i + 1}`}
              inView={inView}
              reduced={reduced}
              delay={0.15 + i * 0.08}
            />
          ))}
        </div>

        <Connector vertical inView={inView} reduced={reduced} />

        {/* operator portal */}
        <Node
          label="Operator Portal"
          sub="human approves →"
          big
          inView={inView}
          reduced={reduced}
          delay={0.7}
        />
      </div>
    </div>
  );
}

function Node({ label, sub, tag, big, inView, reduced, delay }) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: easeBrandOut, delay: reduced ? 0 : delay }}
      className={`relative flex flex-col items-center justify-center border-2 border-zinc-700 bg-ink text-center ${
        big ? 'px-6 py-4' : 'px-2 py-3'
      }`}
    >
      <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-white/30" />
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-white/30" />
      {tag && (
        <span className="mb-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
          {tag}
        </span>
      )}
      <span className={`font-bold text-paper ${big ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
        {label}
      </span>
      {sub && <span className="mt-1 text-[10px] text-zinc-500">{sub}</span>}
    </motion.div>
  );
}

function Connector({ inView, reduced }) {
  return (
    <motion.div
      className="h-8 w-px bg-zinc-700"
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 0.4, ease: easeBrandOut, delay: reduced ? 0 : 0.1 }}
      style={{ transformOrigin: 'top' }}
    />
  );
}
