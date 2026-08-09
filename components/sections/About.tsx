import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { about } from '@/content/about';
import { education, credentials } from '@/content/experience';

/* 03 About.

   Education is a clause here, never its own section, and carries NO graduation
   date — it moved and is currently unknown, and a stale date on the one page
   people cross-check against LinkedIn is worse than no date. Nobody reads a
   missing date as odd.

   Credentials live here rather than in a Certifications section: SECTIONS.md
   cut that section outright, and "in progress" beside a live production
   deployment lowers the average. As a quiet line under Education they cost
   nothing. */

export default function About() {
  return (
    <Section id="about" num="03" title="About">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <Reveal>
          <div className="space-y-6">
            {about.story.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-xl leading-relaxed text-ink sm:text-[1.375rem]'
                    : 'text-[17px] leading-relaxed text-n-10'
                }
                style={i === 0 ? { letterSpacing: 'var(--tracking-20)' } : undefined}
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="space-y-8">
            <ul className="space-y-6">
              {about.highlights.map((h) => (
                <li key={h.label}>
                  <p className="text-[15px] font-medium text-ink">{h.label}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-n-10">
                    {h.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-n-5 pt-8">
              <p className="font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase">
                Education
              </p>
              <p className="mt-3 text-[15px] text-ink">{education.credential}</p>
              <p className="text-[15px] text-n-10">
                {education.institution} · {education.location}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-n-9">
                Since {education.started}
              </p>

              <ul className="mt-6 space-y-2.5">
                {credentials.map((c) => (
                  <li key={c.name} className="text-[14px] leading-relaxed">
                    <span className="text-n-11">{c.name}</span>
                    <span className="text-n-9"> — {c.issuer}</span>
                    {c.inProgress ? (
                      <span className="ml-2 rounded-pill bg-n-3 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-n-10 uppercase">
                        in progress
                      </span>
                    ) : (
                      c.earned && (
                        <span className="ml-2 font-mono text-[11px] text-n-9">
                          {c.earned}
                        </span>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
