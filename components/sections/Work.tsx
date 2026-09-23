import ProjectCard from '@/components/lucent/ProjectCard';
import Section from '@/components/lucent/Section';
import CardArt, { cardArtClass } from '@/components/work/CardArt';
import { projects } from '@/content/projects';
import { sections } from '@/content/site';
import type { StealthProject } from '@/content/types';

const { work } = sections;

/**
 * Projects — the skim layer: one featured card and the rest beside it, filterable
 * by kind. Each card is a real screenshot (or a diagram of the idea), a status
 * label with a glyph, the name and one line. The case study is one click away.
 *
 * Filter chips are a SkillChip filter group: cards filtered out fade and shrink
 * in dur-exit, the rest glide over dur-morph, returners fade in. With an odd
 * number left, the first spans both columns (data-feature-odd).
 */
export default function Work() {
  const filters = work.filters.filter((f) => f.value === 'all' || projects.some((p) => p.kind === f.value));
  const featureFirst = projects.length % 2 === 1;
  const stealth = projects.filter((p): p is StealthProject => p.page === 'none');

  return (
    <Section
      id={work.id}
      kicker={work.kicker}
      title={work.title}
      aside={
        <div className="site-filters" role="group" aria-label="Filter projects" data-filter-group="#work-grid">
          {filters.map((f) => (
            <button key={f.value} type="button" className="lu-chip" data-filter={f.value} aria-pressed={f.value === 'all'}>
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="lu-grid" id="work-grid" data-feature-odd="">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            href={p.page === 'none' ? `#${work.id}` : `/work/${p.slug}`}
            title={p.name}
            meta={p.cardLine}
            status={p.status}
            tags={p.kind}
            feature={featureFirst && i === 0}
            art={<CardArt project={p} priority={i === 0} />}
            artClassName={cardArtClass(p)}
            quickLook={p.page === 'none' ? { template: `quicklook-${p.slug}`, title: p.name } : undefined}
          />
        ))}
      </div>

      {/* The stealth cards' quick looks, read by Lucent.sheet() when a card opens. */}
      {stealth.map((p) => (
        <template
          key={p.slug}
          id={`quicklook-${p.slug}`}
          dangerouslySetInnerHTML={{
            __html: `<h2>${escape(p.name)}</h2>${p.quickLook.map((line) => `<p>${escape(line)}</p>`).join('')}`,
          }}
        />
      ))}
    </Section>
  );
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
