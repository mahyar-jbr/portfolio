import RoleList from '@/components/experience/RoleList';
import Button from '@/components/lucent/Button';
import Section from '@/components/lucent/Section';
import { roles } from '@/content/experience';
import { contact, sections } from '@/content/site';

const { experience } = sections;

/**
 * Experience — where he has worked, as one open roll led by each company's own
 * logo. The icons and titles down the left edge are the skim, and the read sits
 * right beside them; the entries rise in one after another as they arrive.
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
