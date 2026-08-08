import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { caseStudies, caseStudySlugs } from '@/data/caseStudies';
import techIcons from '@/data/techIcons';
import { SITE } from '@/lib/seo';
import AgentTopology from '@/components/casestudy/AgentTopology';
import StreamingPipeline from '@/components/casestudy/StreamingPipeline';
import CaseStudyReveal from '@/components/casestudy/CaseStudyReveal';

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const cs = caseStudies[params.slug];
  if (!cs) return {};
  const title = `${cs.title} — Case Study · ${SITE.name}`;
  return {
    title,
    description: cs.oneLiner,
    openGraph: { title, description: cs.oneLiner },
  };
}

export default function CaseStudyPage({ params }) {
  const cs = caseStudies[params.slug];
  if (!cs) notFound();

  return (
    <main className="relative min-h-screen bg-ink text-paper">
      {/* sticky back nav */}
      <div className="sticky top-0 z-nav border-b border-zinc-900 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/#work"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to work
          </Link>
          <span className="font-mono text-xs text-zinc-600">{cs.title.toLowerCase()}</span>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        {/* HERO */}
        <header className="mb-16">
          <div className="mb-5 flex flex-wrap gap-2">
            {cs.badges.map((b) => (
              <span
                key={b}
                className="border border-zinc-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 sm:text-xs"
              >
                {b}
              </span>
            ))}
          </div>
          <h1 className="mb-4 font-display text-5xl font-black uppercase tracking-tightest text-paper sm:text-7xl">
            {cs.title}
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-zinc-300 sm:text-2xl">{cs.oneLiner}</p>

          <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
            {cs.stack.map((t) => {
              const Icon = techIcons[t];
              return (
                <span
                  key={t}
                  className="flex items-center gap-1.5 border border-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {t}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {cs.links.demo && (
              <CaseLink href={cs.links.demo} icon={ArrowUpRight}>
                Live Demo
              </CaseLink>
            )}
            {cs.links.code && (
              <CaseLink href={cs.links.code} icon={Github}>
                View Code
              </CaseLink>
            )}
          </div>
        </header>

        {/* AT A GLANCE */}
        <div className="mb-20 grid grid-cols-2 gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
          {Object.entries(cs.glance).map(([k, v]) => (
            <div key={k} className="bg-ink p-4">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {k}
              </div>
              <div className="text-sm font-bold text-paper">{v}</div>
            </div>
          ))}
        </div>

        {/* THE PROBLEM */}
        <Section num="01" label="The Problem">
          <p className="text-lg leading-relaxed text-zinc-300 sm:text-xl">{cs.problem}</p>
        </Section>

        {/* THE APPROACH + diagram */}
        <Section num="02" label="The Approach">
          <p className="mb-8 text-lg leading-relaxed text-zinc-300 sm:text-xl">{cs.approach}</p>
          {cs.diagram === 'agents' && <AgentTopology />}
          {cs.diagram === 'pipeline' && <StreamingPipeline />}
        </Section>

        {/* KEY DECISIONS */}
        <Section num="03" label="Key Decisions">
          <div className="space-y-8">
            {cs.decisions.map((d, i) => (
              <CaseStudyReveal key={i} delay={i * 0.05}>
                <div className="border-l-2 border-zinc-700 pl-6">
                  <h3 className="mb-2 text-lg font-bold text-paper sm:text-xl">{d.decision}</h3>
                  <p className="leading-relaxed text-zinc-400">
                    <span className="font-bold uppercase tracking-wider text-zinc-600">Why </span>
                    {d.why}
                  </p>
                </div>
              </CaseStudyReveal>
            ))}
          </div>
        </Section>

        {/* WAR STORY (if present) */}
        {cs.warStory && (
          <Section num="04" label="War Story">
            <div className="relative border-2 border-zinc-800 bg-ink/40 p-6 sm:p-8">
              <span className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-white/20" />
              <span className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-white/20" />
              <h3 className="mb-4 text-xl font-black text-paper sm:text-2xl">{cs.warStory.title}</h3>
              <p className="text-lg leading-relaxed text-zinc-300">{cs.warStory.body}</p>
            </div>
          </Section>
        )}

        {/* RESULT */}
        <Section num={cs.warStory ? '05' : '04'} label="Result">
          <p className="mb-8 text-lg leading-relaxed text-zinc-300 sm:text-xl">{cs.result}</p>
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
            {cs.resultMetrics.map((m) => (
              <div key={m.label} className="bg-ink p-6 text-center">
                <div className="mb-1 text-2xl font-black text-paper sm:text-3xl">{m.value}</div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">{m.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* NEXT PROJECT */}
        <Link
          href={`/work/${cs.next.slug}`}
          className="group mt-12 flex items-center justify-between border-2 border-zinc-800 p-6 transition-colors hover:border-white/40 sm:p-8"
        >
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-600">
              Next case study
            </div>
            <div className="text-2xl font-black text-paper sm:text-3xl">{cs.next.title}</div>
          </div>
          <ArrowRight className="h-6 w-6 text-zinc-500 transition-all group-hover:translate-x-2 group-hover:text-paper" />
        </Link>
      </article>
    </main>
  );
}

function Section({ num, label, children }) {
  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-sm text-zinc-600">{num}</span>
        <h2 className="text-sm font-bold uppercase tracking-brand text-zinc-300">{label}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-zinc-700 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function CaseLink({ href, icon: Icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 overflow-hidden border-2 border-paper bg-ink px-6 py-3 sm:gap-3 sm:px-8 sm:py-4"
    >
      <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-out group-hover:translate-x-0" />
      {Icon && (
        <Icon className="relative z-content h-4 w-4 text-paper transition-colors duration-500 group-hover:text-ink" />
      )}
      <span className="relative z-content text-xs font-bold uppercase tracking-wider text-paper transition-colors duration-500 group-hover:text-ink sm:text-sm">
        {children}
      </span>
    </a>
  );
}
