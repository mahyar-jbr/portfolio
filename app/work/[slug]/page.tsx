import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { completeProjects } from '@/content/projects';
import type { Project } from '@/content/types';

/* Case study route.

   Built only for projects the content tab has marked complete. Maridian is
   typed Partial<Project> — its data was never extracted, and the six-agent
   breakdown in the old data/caseStudies.js was invented — so it has no page
   rather than a page full of holes. It gets one automatically once promoted.

   The Key Decisions block is mandatory (SECTIONS.md §6.7): recruiters largely
   don't click through, interviewers do, and that block is the one written for
   them. All three research proposals cut it. */

function bySlug(slug: string): Project | undefined {
  return completeProjects.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return completeProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return { title: `${p.name} — Mahyar Jaberi`, description: p.oneLiner };
}

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

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();

  const live = p.links.filter((l) => l.status === 'live');
  const next = completeProjects
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => a.order - b.order)[0];

  let n = 3;
  const decisionsNum = p.decisions?.length ? String(n++).padStart(2, '0') : null;
  const warNum = p.warStory ? String(n++).padStart(2, '0') : null;
  const resultNum = String(n).padStart(2, '0');

  return (
    <article className="mx-auto max-w-3xl px-6 pt-6 pb-24 sm:px-10 sm:pt-10">
      <Link
        href="/#work"
        className="u-draw inline-block font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase hover:text-ink"
      >
        ← Work
      </Link>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-2">
          {p.badges.map((b) => (
            <span
              key={b}
              className="rounded-pill border border-n-6 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-n-10 uppercase"
            >
              {b}
            </span>
          ))}
        </div>

        <h1
          className="mt-6 text-[clamp(2.5rem,7vw,4rem)] leading-[1.04] font-semibold text-ink"
          style={{ letterSpacing: 'var(--tracking-48)' }}
        >
          {p.name}
        </h1>

        <p
          className="mt-5 text-xl leading-relaxed text-n-10"
          style={{ letterSpacing: 'var(--tracking-20)' }}
        >
          {p.oneLiner}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {live.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press sq inline-flex h-10 items-center gap-1.5 rounded-pill border border-n-6 bg-n-2 px-4 text-sm text-n-11 shadow-e1 hover:border-n-8 hover:text-ink hover:shadow-e2"
            >
              {l.label}
              <ArrowUpRight />
            </a>
          ))}
          {live.length === 0 && (
            <p className="font-mono text-[11px] text-n-9">
              No public link — the deploy is retired.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-1.5">
          {p.stack.map((t) => (
            <span
              key={t}
              className="rounded-pill border border-n-6 px-2.5 py-1 font-mono text-[11px] text-n-10"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {p.contribution && (
        <dl className="mt-12 grid gap-x-8 gap-y-5 rounded-lg border border-n-6 bg-n-2 p-6 sm:grid-cols-3">
          <Fact label="Role" value={p.contribution.role} />
          <Fact label="Team" value={`${p.contribution.teamSize} people`} />
          <Fact label="Owned" value={p.contribution.owned} span />
        </dl>
      )}

      <Block num="01" title={p.kind === 'research' ? 'Question' : 'Problem'}>
        {p.problem}
      </Block>

      <Block num="02" title={p.kind === 'research' ? 'Method' : 'Approach'}>
        {p.approach}
      </Block>

      {decisionsNum && p.decisions && (
        <section className="mt-16">
          <Heading num={decisionsNum} title="Key decisions" />
          <ol className="mt-8 space-y-8">
            {p.decisions.map((d) => (
              <li key={d.decision} className="border-l-2 border-a-9 pl-6">
                <h3 className="text-lg font-medium text-ink">{d.decision}</h3>
                <p className="mt-2.5 text-[16px] leading-relaxed text-n-10">{d.why}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {warNum && p.warStory && (
        <section className="mt-16">
          <Heading num={warNum} title="What went wrong" />
          <div className="mt-8 rounded-lg border border-n-6 bg-n-2 p-7">
            <h3 className="text-lg font-medium text-ink">{p.warStory.title}</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-n-10">
              {p.warStory.body}
            </p>
          </div>
        </section>
      )}

      <Block num={resultNum} title={p.kind === 'research' ? 'Findings' : 'Result'}>
        {p.result}
      </Block>

      {p.metrics && p.metrics.length > 0 && (
        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-n-6 bg-n-6 sm:grid-cols-2">
          {p.metrics.map((m) => (
            <li key={m.label} className="bg-n-2 p-5">
              <p
                className="text-2xl font-semibold text-ink tabular-nums"
                style={{ letterSpacing: 'var(--tracking-24)' }}
              >
                {m.value}
              </p>
              <p className="mt-1 text-[15px] text-n-11">{m.label}</p>
              {/* Every metric carries its provenance. A number with no source is
                  a rumour, and these are exactly the lines that get challenged
                  in an interview. */}
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-n-9">
                {m.source}
              </p>
            </li>
          ))}
        </ul>
      )}

      {next && (
        <nav className="mt-20 border-t border-n-5 pt-8">
          <Link
            href={`/work/${next.slug}`}
            className="group flex items-baseline justify-between gap-6"
          >
            <span>
              <span className="font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase">
                Next
              </span>
              <span
                className="mt-2 block text-2xl font-semibold text-ink"
                style={{ letterSpacing: 'var(--tracking-24)' }}
              >
                {next.name}
              </span>
            </span>
            <span
              className="inline-flex text-a-11 transition-transform group-hover:translate-x-1.5"
              style={{
                transitionDuration: 'var(--dur-press)',
                transitionTimingFunction: 'var(--spring-press)',
              }}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}

function Heading({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[11px] text-n-9 tabular-nums">{num}</span>
      <h2 className="font-mono text-[11px] tracking-[0.2em] text-n-10 uppercase">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-n-5" />
    </div>
  );
}

function Block({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <Heading num={num} title={title} />
      <p className="mt-7 text-[17px] leading-[1.75] text-n-11">{children}</p>
    </section>
  );
}

function Fact({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'sm:col-span-3' : ''}>
      <dt className="font-mono text-[10px] tracking-[0.16em] text-n-9 uppercase">
        {label}
      </dt>
      <dd className="m-0 mt-1.5 text-[15px] leading-relaxed text-n-11">{value}</dd>
    </div>
  );
}
