import CopyEmail from '@/components/ui/CopyEmail';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { contact, identity } from '@/content/site';

/* 05 Contact — presence, not a pitch.

   No form: 1 of 22 acclaimed engineer sites ships one, and a form adds a
   dependency, a spam surface and a silent-failure mode in exchange for making
   the reader do MORE work than clicking a mailto. The Formspree endpoint from
   v1 is retired.

   Deliberately absent, per content/site.ts: availability status, "hire me",
   "open to work", response-time promises. He is not hunting.

   This section IS the footer band — the scroll terminus, not a separate strip
   of links underneath it. */

export default function Contact() {
  const socials = identity.socials.filter((s) => s.status === 'live');

  return (
    <Section id="contact" num="05" title="Contact">
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div>
            <h3
              className="text-3xl font-semibold text-ink sm:text-4xl"
              style={{ letterSpacing: 'var(--tracking-32)' }}
            >
              {contact.heading}
            </h3>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-n-10">
              {contact.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyEmail email={identity.email} />
            </div>
          </div>

          <ul className="flex flex-col gap-3 lg:items-end">
            {socials
              .filter((s) => s.label !== 'Email')
              .map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-draw text-[15px] text-n-10 hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            <li className="pt-1 font-mono text-[11px] text-n-9">{identity.location}</li>
          </ul>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-n-5 pt-8">
          <p className="font-mono text-[11px] text-n-9">
            © {new Date().getFullYear()} {identity.fullName}
          </p>
          <p className="font-mono text-[11px] text-n-9">{identity.domain}</p>
        </div>
      </Reveal>
    </Section>
  );
}
