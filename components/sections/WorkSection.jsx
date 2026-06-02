'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import techIcons from '@/data/techIcons';
import SectionHeader from '@/components/ui/SectionHeader';
import { easeBrandOut, easeBrandSnap } from '@/lib/motion';

export default function WorkSection() {
  return (
    <section id="work" className="relative bg-ink px-4 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="01"
          label="Selected Work"
          intro="Production systems — multi-agent AI, shipped and live."
        />

        <div className="space-y-16 sm:space-y-28">
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });
  const [hovered, setHovered] = useState(false);

  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: easeBrandOut }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <motion.div
        className="relative overflow-hidden border bg-ink/40 p-5 backdrop-blur-sm sm:p-10"
        animate={{
          borderColor: hovered ? 'rgba(255,255,255,0.4)' : 'rgb(24,24,27)',
        }}
        transition={{ duration: 0.4 }}
      >
        {/* corner brackets */}
        <span className="pointer-events-none absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-white/10" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-white/10" />

        {/* top row: number + badges */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <motion.span
            className="text-4xl font-black leading-none text-white/20 sm:text-7xl"
            animate={{
              color: hovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              textShadow: hovered ? '0 0 40px rgba(255,255,255,0.3)' : 'none',
            }}
            transition={{ duration: 0.4 }}
          >
            {num}
          </motion.span>
          <div className="flex flex-wrap justify-end gap-2">
            {project.badges.map((badge, bi) => (
              <span
                key={bi}
                className="flex items-center gap-1.5 border border-zinc-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 sm:text-xs"
              >
                {project.live && bi === 0 && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                )}
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* title */}
        <motion.h3
          className="mb-1 text-3xl font-black text-paper sm:text-5xl md:text-6xl"
          animate={{ x: hovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>
        <p className="mb-4 text-base text-zinc-400 sm:text-lg">{project.tagline}</p>

        {/* animated underline */}
        <motion.div
          className="mb-6 h-[3px] bg-gradient-to-r from-paper via-zinc-600 to-transparent"
          initial={{ scaleX: 0.2 }}
          animate={{ scaleX: hovered ? 1 : 0.2 }}
          transition={{ duration: 0.6, ease: easeBrandSnap }}
          style={{ transformOrigin: 'left' }}
        />

        {/* tech pills */}
        <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
          {project.tech.map((tech) => {
            const Icon = techIcons[tech];
            return (
              <span
                key={tech}
                className="flex items-center gap-1.5 border border-zinc-800 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 sm:px-4 sm:py-2"
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {tech}
              </span>
            );
          })}
        </div>

        {/* Problem / Approach / Result */}
        <div className="mb-8 grid gap-x-8 gap-y-4 md:grid-cols-[auto_1fr]">
          <PARRow label="Problem" text={project.problem} />
          <PARRow label="Approach" text={project.approach} />
          <PARRow label="Result" text={project.result} />
        </div>

        {/* screenshots */}
        {project.images?.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {project.images.map((img, ii) => (
              <div
                key={ii}
                className="relative aspect-[3/2] overflow-hidden border border-zinc-800 bg-zinc-900"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${ii + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {project.caseStudy && (
            <ActionLink href={`/work/${project.caseStudy}`} icon={ArrowRight} primary>
              View Case Study
            </ActionLink>
          )}
          {project.liveDemo && (
            <ActionLink href={project.liveDemo} icon={ArrowUpRight} external>
              Live Demo
            </ActionLink>
          )}
          {project.github && (
            <ActionLink href={project.github} icon={Github} external>
              View Code
            </ActionLink>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PARRow({ label, text }) {
  return (
    <>
      <div className="text-xs font-bold uppercase tracking-wider text-zinc-600 md:pt-0.5">
        {label}
      </div>
      <p className="mb-2 text-base leading-relaxed text-zinc-400 md:mb-0 sm:text-lg">
        {text}
      </p>
    </>
  );
}

// Shared action button: internal (Link) or external (a). White-slide hover.
function ActionLink({ href, icon: Icon, children, primary, external }) {
  const className =
    'group relative flex items-center gap-2 overflow-hidden border-2 border-paper bg-ink px-5 py-2.5 sm:gap-3 sm:px-8 sm:py-4';
  const inner = (
    <>
      <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-out group-hover:translate-x-0" />
      {Icon && (
        <Icon className="relative z-content h-4 w-4 text-paper transition-colors duration-500 group-hover:text-ink" />
      )}
      <span className="relative z-content text-xs font-bold uppercase tracking-wider text-paper transition-colors duration-500 group-hover:text-ink sm:text-sm">
        {children}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
