import ProjectCard from '@/components/lucent/ProjectCard';
import Section from '@/components/lucent/Section';
import CardArt, { cardArtClass } from '@/components/work/CardArt';
import { projects } from '@/content/projects';
import { sections } from '@/content/site';

const { work } = sections;

/**
 * Projects — the skim layer: two cards of each kind, filterable by kind. A card
 * with a page is a real screenshot (or a diagram of the idea), a status label with
 * a glyph, the name and one line, and its case study is one click away. A project
 * with nothing to show yet is a "soon" card that opens nothing: its name, its
 * status, and a line only if it has one, over art that says nothing about it.
 *
 * Filter chips are a SkillChip filter group: cards filtered out fade and shrink
 * in dur-exit, the rest glide over dur-morph, returners fade in. With an odd
 * number left, the first spans both columns (data-feature-odd).
 */
export default function Work() {
  const filters = work.filters.filter((f) => f.value === 'all' || projects.some((p) => p.kind === f.value));
  const featureFirst = projects.length % 2 === 1;

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
            href={p.page === 'none' ? undefined : `/work/${p.slug}`}
            title={p.name}
            meta={p.cardLine}
            status={p.status}
            tags={p.kind}
            feature={featureFirst && i === 0}
            art={<CardArt project={p} priority={i === 0} />}
            artClassName={cardArtClass(p)}
          />
        ))}
      </div>
    </Section>
  );
}
