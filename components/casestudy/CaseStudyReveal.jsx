'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { easeBrandOut } from '@/lib/motion';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Small client wrapper so the (server-rendered) case-study page can still get
// scroll-reveal on individual blocks.
export default function CaseStudyReveal({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: easeBrandOut, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
