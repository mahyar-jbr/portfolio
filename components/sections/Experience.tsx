import RoleList from '@/components/experience/RoleList';
import Button from '@/components/lucent/Button';
import Section from '@/components/lucent/Section';
import { roles } from '@/content/experience';
import { contact, sections } from '@/content/site';

const { experience } = sections;

/**
 * Experience — where he has worked, as an iOS inset grouped list led by each
 * company's own logo. The list is the skim, each open row the read; the rows
 * rise in one after another as the section arrives.
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
      <RoleList id="exp" roles={roles} />
    </Section>
  );
}
