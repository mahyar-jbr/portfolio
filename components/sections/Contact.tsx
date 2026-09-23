import ContactTiles from '@/components/lucent/ContactTiles';
import Section from '@/components/lucent/Section';
import { contact, sections } from '@/content/site';

const { contact: head } = sections;

/** Contact — the tiles are the whole section: one line of copy, then the ways to reach him. */
export default function Contact() {
  return (
    <Section id={head.id} kicker={head.kicker} title={contact.heading} lede={contact.body} reveal>
      <ContactTiles email={contact.email} links={contact.links.filter((l) => l.status === 'live')} />
    </Section>
  );
}
