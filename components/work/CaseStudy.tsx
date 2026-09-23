import Image from 'next/image';
import type { ReactNode } from 'react';
import BrandIcon, { brandFor, type BrandName } from '@/components/lucent/BrandIcon';
import Button from '@/components/lucent/Button';
import Glyph, { type GlyphName } from '@/components/lucent/Glyph';
import LinkOut from '@/components/lucent/LinkOut';
import ProjectCard from '@/components/lucent/ProjectCard';
import { ToolTag } from '@/components/lucent/Tag';
import CardArt, { cardArtClass } from '@/components/work/CardArt';
import { pagedProjects } from '@/content/projects';
import type { BriefProject, CaseStudyProject, ExternalLink, ProjectStatus, Shot } from '@/content/types';

/**
 * CaseStudy — the read layer behind a project card, built from the kit's layout
 * primitives. A summary block a skimmer reads in ten seconds (back link, the
 * product's mark, name, one sentence, a meta row), then the story in sections
 * whose labels stick to the left while you read, then the next project.
 *
 * Beats, in the kit's order: Problem, (My role), How it works, The product,
 * Decisions, Where it is now — never more than six, never the solution before
 * the problem.
 */

const STATUS_GLYPH: Record<ProjectStatus['kind'], GlyphName> = {
  live: 'store',
  stealth: 'lock',
  progress: 'flask',
  research: 'flask',
  hackathon: 'timer',
};

/** A glyph for each kind of summary fact, by its label. */
const FACT_GLYPH: Record<string, GlyphName> = {
  'In stores': 'pin',
  Launched: 'calendar',
  Event: 'flag',
  Team: 'team',
  Course: 'book',
  Lab: 'flask',
  Supervisor: 'person',
  Timeline: 'calendar',
};

const MAX_SECTIONS = 6;

/**
 * Some decisions carry a marker instead of a reason while the reasoning is being
 * confirmed. A decision with no confirmed reason never renders — a reconstructed
 * rationale is exactly what content/types.ts forbids.
 */
const hasReason = (why: string) => !/NOT IN REPO|TODO|Mahyar to supply/i.test(why);

interface MetaItem {
  glyph: GlyphName;
  /** A brand's own mark in place of the glyph, when the value names one (GitHub). */
  brand?: BrandName;
  label: string;
  value: ReactNode;
}

function linkFacts(links: ExternalLink[]): MetaItem[] {
  return links
    .filter((l) => l.status === 'live')
    .map((l) => {
      const code = /github/i.test(l.href);
      return {
        glyph: code ? 'code' : 'link',
        brand: brandFor(l.label),
        label: code ? 'Code' : 'Live',
        value: (
          <LinkOut className="lu-link" href={l.href}>
            {l.label}
          </LinkOut>
        ),
      } satisfies MetaItem;
    });
}

function CaseHero({
  name,
  mark,
  lede,
  meta,
  stack,
}: {
  name: string;
  mark?: string;
  lede: string;
  meta: MetaItem[];
  /** The tools the project was built with. The site has no Skills section: skills are shown where they were used. */
  stack?: string[];
}) {
  return (
    <section className="case-hero lu-wall">
      <div className="lu-page">
        <Button variant="quiet" small href="/#work">
          <Glyph name="arrow-left" />
          All work
        </Button>
        <div className="case-title">
          {mark ? (
            <Image src={mark} alt="" width={52} height={52} priority />
          ) : (
            <span className="case-monogram" aria-hidden="true">
              {name.slice(0, 1)}
            </span>
          )}
          <h1>{name}</h1>
        </div>
        <p className="lu-lede">{lede}</p>
        <dl className="lu-meta">
          {meta.map((m) => (
            <div key={m.label}>
              {m.brand ? <BrandIcon name={m.brand} /> : <Glyph name={m.glyph} />}
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
          {stack && stack.length > 0 && (
            <div className="case-stack">
              <Glyph name="layers" />
              <dt>Stack</dt>
              <dd>
                {stack.map((s) => (
                  <ToolTag key={s} name={s} />
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

function Shots({ shots }: { shots: Shot[] }) {
  const [lead, ...rest] = shots;
  const pairs: Shot[][] = [];
  for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2));
  const figure = (s: Shot, sizes: string) => (
    <figure className="lu-shot" key={s.src}>
      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} loading="lazy" />
      <figcaption>{s.caption}</figcaption>
    </figure>
  );
  return (
    <div className="lu-shots">
      {figure(lead, '(max-width: 760px) 100vw, 880px')}
      {pairs.map((pair) =>
        pair.length === 2 ? (
          <div className="lu-shots is-two" key={pair[0].src}>
            {pair.map((s) => figure(s, '(max-width: 760px) 100vw, 440px'))}
          </div>
        ) : (
          figure(pair[0], '(max-width: 760px) 100vw, 880px')
        ),
      )}
    </div>
  );
}

function Points({ glyph, items }: { glyph: GlyphName; items: { title: string; body?: string }[] }) {
  return (
    <ul className="lu-points">
      {items.map((it) => (
        <li key={it.title}>
          <Glyph name={glyph} />
          <div>
            <b>{it.title}</b>
            {it.body && <span>{it.body}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function NextProject({ current }: { current: string }) {
  const i = pagedProjects.findIndex((p) => p.slug === current);
  const next = pagedProjects[(i + 1) % pagedProjects.length];
  if (!next || next.slug === current) return null;
  return (
    <div className="lu-page lu-section case-next">
      <p className="lu-kicker">Next project</p>
      <ProjectCard
        href={`/work/${next.slug}`}
        title={next.name}
        meta={next.cardLine}
        status={next.status}
        art={<CardArt project={next} />}
        artClassName={cardArtClass(next)}
      />
    </div>
  );
}

export function CaseStudy({ project: p }: { project: CaseStudyProject }) {
  const meta: MetaItem[] = [
    ...(p.contribution ? [{ glyph: 'person', label: 'Role', value: p.contribution.role } satisfies MetaItem] : []),
    { glyph: STATUS_GLYPH[p.status.kind], label: 'Status', value: p.status.label },
    ...(p.facts ?? []).map((f) => ({ glyph: FACT_GLYPH[f.label] ?? 'spark', label: f.label, value: f.value })),
    { glyph: 'calendar', label: 'Year', value: p.year },
    ...linkFacts(p.links),
  ];

  const decisions = (p.decisions ?? []).filter((d) => hasReason(d.why));

  const beats: { title: string; body: ReactNode }[] = [
    { title: 'Problem', body: <p>{p.problem}</p> },
  ];
  if (p.contribution && p.contribution.teamSize > 1) {
    beats.push({
      title: 'My role',
      body: (
        <p>
          <b>{p.contribution.role}</b> on a team of {p.contribution.teamSize}. {p.contribution.owned}
        </p>
      ),
    });
  }
  beats.push({
    title: 'How it works',
    body: (
      <>
        <p>{p.approach}</p>
        {p.steps && (
          <div className="lu-steps">
            {p.steps.map((s, i) => (
              <div className="lu-step" key={s.title}>
                <b>{i + 1}</b>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        )}
      </>
    ),
  });
  if (p.shots?.length) beats.push({ title: 'The product', body: <Shots shots={p.shots} /> });
  if (decisions.length) {
    beats.push({
      title: 'Decisions',
      body: <Points glyph="split" items={decisions.map((d) => ({ title: d.decision, body: d.why }))} />,
    });
  }
  beats.push({
    title: 'Where it is now',
    body: (
      <>
        <p>{p.result}</p>
        {p.metrics && <Points glyph="chart" items={p.metrics.map((m) => ({ title: m.value, body: m.label }))} />}
      </>
    ),
  });
  if (p.warStory) {
    beats.push({
      title: 'What broke',
      body: (
        <>
          <p>
            <b>{p.warStory.title}</b>
          </p>
          <p>{p.warStory.body}</p>
        </>
      ),
    });
  }

  return (
    <>
      <CaseHero name={p.name} mark={p.mark} lede={p.oneLiner} meta={meta} stack={p.stack} />
      <div className="lu-page lu-case">
        {beats.slice(0, MAX_SECTIONS).map((b) => (
          <section key={b.title} data-reveal="">
            <h2 className="lu-title-sm">{b.title}</h2>
            <div>{b.body}</div>
          </section>
        ))}
      </div>
      <NextProject current={p.slug} />
    </>
  );
}

/** Work underway: the summary block and what is being built. No results until there are some. */
export function BriefCase({ project: p }: { project: BriefProject }) {
  const meta: MetaItem[] = [
    { glyph: 'person', label: 'Role', value: p.role },
    { glyph: STATUS_GLYPH[p.status.kind], label: 'Status', value: p.status.label },
    ...p.facts.map((f) => ({ glyph: FACT_GLYPH[f.label] ?? 'spark', label: f.label, value: f.value })),
  ];
  return (
    <>
      <CaseHero name={p.name} lede={p.lede} meta={meta} />
      <div className="lu-page lu-case">
        <section>
          <h2 className="lu-title-sm">What I’m building</h2>
          <div>
            <Points glyph="flask" items={p.building.map((line) => ({ title: line }))} />
          </div>
        </section>
      </div>
      <NextProject current={p.slug} />
    </>
  );
}
