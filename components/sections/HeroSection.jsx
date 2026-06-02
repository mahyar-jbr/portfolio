'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Github } from 'lucide-react';
import { SITE } from '@/lib/seo';
import { riseIn, letterIn, fadeIn, easeBrandOut } from '@/lib/motion';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Canvas-based agent swarm — code-split, client-only. Lightweight (no WebGL).
const AgentSwarm = dynamic(() => import('@/components/hero/AgentSwarm'), {
  ssr: false,
});

const NAME_LINES = ['MAHYAR', 'JABERI'];

export default function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-ink px-4 sm:px-6"
    >
      {/* Signature: chaotic agent "swarm of parallel thoughts". Skipped under
          reduced-motion. Weighted to the right; bleeds behind the name. */}
      {!reduced && (
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-3/5">
          <AgentSwarm />
          {/* fade the swarm's left edge into black so the name stays legible */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30" />
        </div>
      )}

      <div className="relative z-content mx-auto w-full max-w-7xl">
        {/* Eyebrow: role */}
        <motion.div
          className="mb-5 flex items-center gap-4"
          variants={reduced ? fadeIn : riseIn}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          <span className="h-px w-10 bg-gradient-to-r from-paper to-transparent" />
          <p className="text-xs font-bold uppercase tracking-brand text-zinc-400 sm:text-sm">
            {SITE.role}
          </p>
        </motion.div>

        {/* Name — the LCP element, pure DOM. Two explicit lines so it never
            breaks mid-word; size tuned to fit without overflow. */}
        <h1
          className="font-display font-black uppercase leading-[0.88] tracking-tightest text-paper"
          style={{ fontSize: 'clamp(2.5rem, 8.5vw, 9rem)' }}
        >
          {reduced ? (
            <motion.span variants={fadeIn} initial="hidden" animate="show">
              <span className="block whitespace-nowrap">Mahyar</span>
              <span className="block whitespace-nowrap">Jaberi</span>
            </motion.span>
          ) : (
            <span style={{ perspective: '800px' }}>
              {NAME_LINES.map((word, lineIdx) => (
                <span key={lineIdx} className="block whitespace-nowrap">
                  {word.split('').map((ch, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      style={{ transformStyle: 'preserve-3d' }}
                      variants={letterIn}
                      initial="hidden"
                      animate="show"
                      custom={lineIdx * 6 + i}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          )}
        </h1>

        {/* Tagline */}
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl md:text-2xl"
          variants={reduced ? fadeIn : riseIn}
          initial="hidden"
          animate="show"
          custom={reduced ? 0.2 : 0.9}
        >
          {SITE.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap gap-3 sm:gap-4"
          variants={reduced ? fadeIn : riseIn}
          initial="hidden"
          animate="show"
          custom={reduced ? 0.3 : 1.15}
        >
          <HeroButton as="a" href="#work" icon={ArrowRight}>
            View Work
          </HeroButton>
          <HeroButton as="a" href="/resume.pdf" icon={FileText} download>
            Résumé
          </HeroButton>
          <HeroButton
            as="a"
            href={SITE.github}
            icon={Github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </HeroButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0.4 : 1.6, duration: 0.8, ease: easeBrandOut }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] font-bold uppercase tracking-brand">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// The canonical button: white slide-in on hover, corner brackets. Reused site-wide.
function HeroButton({ as = 'button', icon: Icon, children, ...props }) {
  const Comp = motion[as] || motion.button;
  return (
    <Comp
      className="group relative flex items-center gap-2 overflow-hidden border-2 border-paper bg-ink px-6 py-3 sm:gap-3 sm:px-9 sm:py-4"
      whileTap={{ scale: 0.98 }}
      whileHover={{ boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
      {...props}
    >
      <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-out group-hover:translate-x-0" />
      {Icon && (
        <Icon className="relative z-content h-4 w-4 text-paper transition-colors duration-500 group-hover:text-ink" />
      )}
      <span className="relative z-content text-xs font-bold uppercase tracking-wider text-paper transition-colors duration-500 group-hover:text-ink sm:text-sm">
        {children}
      </span>
      {/* corner brackets */}
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-paper opacity-0 transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-paper opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
    </Comp>
  );
}
