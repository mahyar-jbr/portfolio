import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { skills } from '@/content/site';

/* 04 Skills.

   Text only. No icons, no proficiency bars, no percentages — a grid asserts
   breadth, a list you can be interviewed on demonstrates depth at the same
   pixel cost. data/techIcons.js is dead as a result.

   The research cut this section entirely; §0 reinstated it because that verdict
   was calibrated for recruiter scanning and he is not being screened. */

export default function Skills() {
  return (
    <Section id="skills" num="04" title="Skills">
      <dl className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
        {skills.map((g, i) => (
          <Reveal key={g.label} delay={i * 50}>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,7.5rem)_1fr] sm:gap-6">
              <dt className="font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase sm:pt-1">
                {g.label}
              </dt>
              <dd className="m-0 text-[15px] leading-relaxed text-n-11">
                {g.items.join(' · ')}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
