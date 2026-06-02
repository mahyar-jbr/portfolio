'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { easeBrandOut } from '@/lib/motion';

// The shared "01 / LABEL" section header: oversized number, tracked label,
// animated underline, optional intro line. Reused across every section.
export default function SectionHeader({ number, label, intro }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="mb-12 sm:mb-20">
      <div className="flex items-center gap-3 sm:gap-6">
        <motion.div
          className="text-5xl font-black text-white/20 sm:text-8xl"
          initial={{ x: -60, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeBrandOut }}
        >
          {number}
        </motion.div>
        <div className="flex-1">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-brand text-zinc-300">
            {label}
          </h2>
          <motion.div
            className="h-px bg-gradient-to-r from-paper to-transparent"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: easeBrandOut }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>
      {intro && (
        <motion.p
          className="mt-6 max-w-3xl text-lg text-zinc-400 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: easeBrandOut }}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
