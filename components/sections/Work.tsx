import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { completeProjects } from '@/content/projects';
import type { Project, ExternalLink } from '@/content/types';

/* 01 Work per design/SECTIONS.md §1.

   ONE LINE per project — the non-negotiable condition attached to having
   case-study routes at all. Depth lives one click down, never in the scroll.

   Renders `completeProjects`, not `projects`. Maridian is still typed
   Partial<Project> because its data has not been extracted, so it is absent
   rather than half-rendered — and it will appear here automatically, in its
   own order slot, the moment the content tab promotes it to a full Project.
   That is the typed handoff doing its job instead of a broken card shipping. */

const MAX_CHIPS = 6;

const ArrowUpRight = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M5 11L11 5M11 5H6M11 5v5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Work() {
  const items = [...completeProjects].sort((a, b) => a.order - b.order);

  return (
    <Section id="work" num="01" title="Work">
      <ul className="-mx-4 sm:-mx-6">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 70}>
            <ProjectRow project={p} index={p.order} last={i === items.length - 1} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function ProjectRow({
  project,
  index,
  last,
}: {
  project: Project;
  index: number;
  last: boolean;
}) {
  const chips = project.stack.slice(0, MAX_CHIPS);
  const overflow = project.stack.length - chips.length;
  const live = project.links.filter((l) => l.status === 'live');

  return (
    <li className={last ? '' : 'border-b border-n-5'}>
      {/* The whole row is the case-study link. Nested interactive elements sit
          above it with their own z-index rather than inside it — an anchor
          inside an anchor is invalid and breaks keyboard order. */}
      <div className="group relative">
        <Link
          href={`/work/${project.slug}`}
          className="absolute inset-0 z-0 rounded-lg"
          aria-label={`${project.name} case study`}
        />

        {/* hover wash — inset so it reads as the row waking up, not a card
            appearing underneath it */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 inset-y-1 -z-10 rounded-lg bg-n-3 opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            transitionDuration: 'var(--dur-hover)',
            transitionTimingFunction: 'var(--spring-hover)',
          }}
        />

        <div className="relative px-4 py-9 sm:px-6 sm:py-11">
          <div className="flex items-start gap-5 sm:gap-8">
            <span className="mt-1.5 shrink-0 font-mono text-[11px] text-n-9 tabular-nums">
              {String(index).padStart(2, '0')}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h3
                  className="text-2xl font-semibold text-ink transition-transform sm:text-[1.75rem]"
                  style={{
                    letterSpacing: 'var(--tracking-32)',
                    transitionDuration: 'var(--dur-hover)',
                    transitionTimingFunction: 'var(--spring-hover)',
                  }}
                >
                  {project.name}
                </h3>

                {project.kind === 'research' && (
                  <span className="rounded-pill bg-n-3 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-n-10 uppercase">
                    research
                  </span>
                )}
                {project.badges.includes('Live in production') && (
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-[color-mix(in_srgb,var(--color-olive)_12%,transparent)] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-olive-deep uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                    live
                  </span>
                )}
              </div>

              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-n-10">
                {project.oneLiner}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {chips.map((t) => (
                  <span
                    key={t}
                    className="rounded-pill border border-n-6 px-2.5 py-1 font-mono text-[11px] text-n-10 transition-colors group-hover:border-n-7"
                    style={{ transitionDuration: 'var(--dur-hover)' }}
                  >
                    {t}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="px-1 font-mono text-[11px] text-n-9">
                    +{overflow}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-a-11">
                  Case study
                  <span
                    className="inline-flex transition-transform group-hover:translate-x-1"
                    style={{
                      transitionDuration: 'var(--dur-press)',
                      transitionTimingFunction: 'var(--spring-press)',
                    }}
                  >
                    <ArrowRight />
                  </span>
                </span>

                {live.map((l: ExternalLink) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-draw relative z-10 inline-flex items-center gap-1 text-sm text-n-10 hover:text-ink"
                  >
                    {l.label}
                    <ArrowUpRight />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
