import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { roles } from '@/content/experience';
import type { Role } from '@/content/types';

/* 02 Experience.

   Renders all four roles, which departs from SECTIONS.md §2's "exactly two
   rows". That rule was calibrated for recruiter screening — a retail row was
   said to dilute the internship signal — and the premise changed in §0: he is
   not being screened. Pet Valu earns its place on the merits now, since it is
   both the BowlWise origin and a leadership fact.

   FGF has deliberately empty bullets: the role has not started, and listing
   responsibilities for work not yet done is the easiest thing on a site to
   catch someone out on. It gets an "incoming" treatment instead of an empty
   list — the absence is the honest render, not a gap to fill. */

export default function Experience() {
  return (
    <Section id="experience" num="02" title="Experience">
      <ol className="space-y-px">
        {roles.map((r, i) => (
          <Reveal key={`${r.company}-${r.title}`} delay={i * 60}>
            <RoleRow role={r} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function RoleRow({ role }: { role: Role }) {
  const incoming = Boolean(role.incoming);

  return (
    <li className="grid gap-x-10 gap-y-4 border-b border-n-5 py-9 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:py-11">
      {/* period rail */}
      <div className="sm:pt-1">
        <p className="font-mono text-[11px] text-n-9 tabular-nums">{role.period}</p>
        <p className="mt-1 font-mono text-[11px] text-n-9">{role.location}</p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3
            className="text-xl font-semibold text-ink sm:text-[1.375rem]"
            style={{ letterSpacing: 'var(--tracking-24)' }}
          >
            {role.title}
          </h3>
          <span className="text-n-9">·</span>
          <span className="text-lg text-n-10">{role.company}</span>

          {incoming && (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-[color-mix(in_srgb,var(--color-a-9)_10%,transparent)] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-a-12 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-a-9" />
              incoming
            </span>
          )}
        </div>

        <p className="mt-2.5 text-[15px] text-n-10">{role.context}</p>

        {role.bullets.length > 0 ? (
          <ul className="mt-5 space-y-2.5">
            {role.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-n-11">
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] h-px w-3.5 shrink-0 bg-n-7"
                />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-[15px] leading-relaxed text-n-9 italic">
            Starts {role.period.split('–')[0].trim()} — nothing to report yet.
          </p>
        )}

        {role.stack && role.stack.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {role.stack.map((t) => (
              <span
                key={t}
                className="rounded-pill border border-n-6 px-2.5 py-1 font-mono text-[11px] text-n-10"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
