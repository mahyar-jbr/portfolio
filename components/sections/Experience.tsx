import Button from '@/components/lucent/Button';
import ExperienceList from '@/components/lucent/ExperienceList';
import Section from '@/components/lucent/Section';
import { roles } from '@/content/experience';
import { contact, sections } from '@/content/site';

const { experience } = sections;

/**
 * Experience — the list is the skim, each open row the read. A role with no
 * bullets yet (one that has just started) opens to its one line of context
 * rather than to invented responsibilities.
 */
export default function Experience() {
  const resume = contact.links.find((l) => l.label === 'Resume' && l.status === 'live');
  return (
    <Section
      id={experience.id}
      kicker={experience.kicker}
      title={experience.title}
      reveal
      aside={
        resume && (
          <Button variant="quiet" href={resume.href} external>
            Resume, PDF
          </Button>
        )
      }
    >
      <ExperienceList
        id="exp"
        rows={roles.map((r) => ({
          monogram: r.monogram,
          title: r.title,
          subline: r.subline ?? `${r.company} · ${r.location}`,
          when: r.period,
          now: r.current,
          lines: r.bullets.length ? r.bullets : [r.context],
          tags: r.stack ?? [],
        }))}
      />
    </Section>
  );
}
