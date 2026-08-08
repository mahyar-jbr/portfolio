import Link from 'next/link';
import { Slot, Lines, Chips, Btn, Media, SectionShell } from '@/components/wireframe/Box';

/* GREYBOX — structure only, no content. Lineup per design/SECTIONS.md §1.
   Hero · 01 Work · 02 Experience · 03 About · 04 Contact. */

const WORK = [
  { name: 'BowlWise', actions: ['Live ↗', 'Case study →'] },
  { name: 'Maridian', actions: ['Live demo ↗', 'Case study →'] },
  { name: 'MoneyMind', actions: ['GitHub ↗', 'Case study →'] },
];

const ROLES = [
  { org: 'Nova Ventures', role: 'SWE Intern · Summer 2025' },
  { org: 'Sepantech', role: 'App Dev & DB Intern · Summer 2024' },
];

export default function Home() {
  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section
        id="hero"
        className="flex min-h-[88vh] items-center px-6 py-20 sm:px-10"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <Slot label="Eyebrow — role">
              <Lines count={1} widths={['58%']} size="sm" />
            </Slot>

            <Slot label="H1 — name" note="LCP element. Plain DOM text, two lines.">
              <Lines count={2} widths={['70%', '55%']} size="lg" />
            </Slot>

            <Slot
              label="Mechanism sentence"
              note="ONE sentence. Leads with the deployment, not the stack."
            >
              <Lines count={2} widths={['100%', '64%']} />
            </Slot>

            <Slot
              label="Availability line"
              note="Driven by ONE constant in lib/. The only date-bearing copy on the site besides the résumé."
            >
              <Lines count={1} widths={['86%']} size="sm" />
            </Slot>

            <Slot label="CTAs + socials">
              <div className="flex flex-wrap items-center gap-3">
                <Btn label="View work" />
                <Btn label="Résumé" ghost />
                <Btn label="Email — copy" ghost />
                <span className="font-mono text-[10px] text-neutral-600">
                  · GitHub · LinkedIn
                </span>
              </div>
            </Slot>
          </div>

          <Slot
            label="Signature — static agent trace"
            note="Rendered content, not animation. ~0 KB JS. 5 numbered stages with real function names + contract state."
          >
            <div className="flex flex-col gap-3 pt-1">
              {['INTAKE', 'CLASSIFY', 'RECOMMEND', 'REVIEW', 'DISPATCH'].map((stage, i) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-4 font-mono text-[10px] text-neutral-700">
                    {i + 1}
                  </span>
                  <span className="w-24 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                    {stage}
                  </span>
                  <span className="h-2.5 flex-1 bg-neutral-800" />
                </div>
              ))}
            </div>
          </Slot>
        </div>
      </section>

      {/* ─────────────── 01 WORK ─────────────── */}
      <SectionShell
        num="01"
        title="Work"
        id="work"
        note="ONE LINE per project — this is the non-negotiable condition attached to having case-study routes at all. Depth lives one click down, never in the scroll. Order is by verifiability decay: real users → live demo → readable code → repo only."
      >
        <div className="flex flex-col gap-10">
          {WORK.map((p) => (
            <Slot key={p.name} label={p.name}>
              <div className="flex flex-col gap-4">
                <Lines count={1} widths={['88%']} />
                <Chips count={6} />
                <div className="flex flex-wrap gap-3">
                  {p.actions.map((a) => (
                    <Btn key={a} label={a} ghost />
                  ))}
                </div>
              </div>
            </Slot>
          ))}

          <Slot
            label="WealthTrack"
            note="One trailing sentence. No card shell — four cards where three are strong reads as padding."
          >
            <div className="flex flex-col gap-3">
              <Lines count={1} widths={['72%']} />
              <div className="flex gap-3">
                <Btn label="GitHub ↗" ghost />
              </div>
            </div>
          </Slot>
        </div>
      </SectionShell>

      {/* ─────────────── 02 EXPERIENCE ─────────────── */}
      <SectionShell
        num="02"
        title="Experience"
        id="experience"
        note="Exactly two rows. Pet Valu is NOT here — a retail row beside two engineering internships dilutes the strongest measured signal on the page."
      >
        <div className="flex flex-col gap-8">
          {ROLES.map((r) => (
            <Slot key={r.org} label={`${r.org} — ${r.role}`}>
              <div className="flex flex-col gap-4">
                <Lines count={2} widths={['94%', '80%']} />
                <Chips count={4} />
              </div>
            </Slot>
          ))}
          <div>
            <Btn label="View full résumé (PDF) ↗" ghost />
          </div>
        </div>
      </SectionShell>

      {/* ─────────────── 03 ABOUT ─────────────── */}
      <SectionShell
        num="03"
        title="About"
        id="about"
        note="Hard cap 4–5 sentences. Must carry: the Pet Valu → BowlWise origin, and the degree / school / expected-grad-date clause. No GPA."
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex flex-col gap-6">
            <Slot label="Narrative — 4–5 sentences max">
              <Lines count={5} widths={['100%', '96%', '90%', '98%', '52%']} />
            </Slot>

            <Slot
              label="Stack vocabulary — 4 grouped text lines"
              note="Text only. No icons, no bars, no percentages. Everything here must be something he could be interviewed on."
            >
              <Lines count={4} widths={['84%', '78%', '70%', '62%']} size="sm" />
            </Slot>
          </div>

          <Slot label="Portrait — optional" className="w-full md:w-52">
            <Media label="photo" ratio="aspect-square" />
          </Slot>
        </div>
      </SectionShell>

      {/* ─────────────── 04 CONTACT ─────────────── */}
      <SectionShell
        num="04"
        title="Contact"
        id="contact"
        note="This section IS the footer band. No form — click-to-copy email plus a mailto, with the address in plain text so it survives a screenshot."
      >
        <div className="flex flex-col gap-6">
          <Slot label="Positioning line — names the exact ask">
            <Lines count={1} widths={['76%']} />
          </Slot>
          <Slot label="Links">
            <div className="flex flex-wrap gap-3">
              <Btn label="email — copy" />
              <Btn label="LinkedIn" ghost />
              <Btn label="GitHub" ghost />
              <Btn label="Résumé" ghost />
            </div>
          </Slot>
        </div>
      </SectionShell>

      {/* route index — greybox only, not shipped */}
      <div className="border-t border-neutral-900 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <span className="font-mono text-[10px] tracking-widest text-neutral-700 uppercase">
            Routes (greybox nav — not shipped)
          </span>
          {['/work/bowlwise', '/work/maridian', '/work/moneymind', '/art'].map((h) => (
            <Link
              key={h}
              href={h}
              className="font-mono text-[10px] text-neutral-500 underline underline-offset-4 hover:text-neutral-200"
            >
              {h}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
