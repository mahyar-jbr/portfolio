import Link from 'next/link';
import { Slot, Lines, Chips, Btn, Media, SectionShell } from '@/components/wireframe/Box';
import Hero from '@/components/sections/Hero';

/* GREYBOX — structure only, no content. Lineup per design/SECTIONS.md §1, as
   amended in §0: no availability line, no grad date, skills reinstated,
   WealthTrack out / Tactical DNA in. */

const WORK = [
  { name: 'BowlWise', actions: ['Live ↗', 'Case study →'], note: null },
  { name: 'MoneyMind', actions: ['GitHub ↗', 'Case study →'], note: null },
  {
    name: 'Maridian',
    actions: ['Case study →'],
    note: 'Deployment is gone — nothing to click. Screenshots + diagrams have to carry this one.',
  },
  {
    name: 'Tactical DNA',
    actions: ['GitHub ↗', 'Case study →'],
    note: 'Research, not a product — no demo framing. Public repo makes it the most verifiable thing on the site.',
  },
];

const ROLES = [
  { org: 'Nova Ventures', role: 'SWE Intern · Summer 2025' },
  { org: 'Sepantech', role: 'App Dev & DB Intern · Summer 2024' },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* ─────────────── 01 WORK ─────────────── */}
      <SectionShell
        num="01"
        title="Work"
        id="work"
        note="ONE LINE per project — the non-negotiable condition attached to having case-study routes at all. Depth lives one click down, never in the scroll. Order locked by the content tab."
      >
        <div className="flex flex-col gap-10">
          {WORK.map((p) => (
            <Slot key={p.name} label={p.name} note={p.note ?? undefined}>
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
        </div>
      </SectionShell>

      {/* ─────────────── 02 EXPERIENCE ─────────────── */}
      <SectionShell
        num="02"
        title="Experience"
        id="experience"
        note="Exactly two rows. Pet Valu is NOT here — it is the About lede instead."
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
        note="Hard cap 4–5 sentences. Opens on the Pet Valu retail floor, not on code. Thesis: he builds things people actually use. Degree + school — NO grad date (§0)."
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <Slot label="Narrative — 4–5 sentences max">
            <Lines count={5} widths={['100%', '96%', '90%', '98%', '52%']} />
          </Slot>
          <Slot label="Portrait — optional" className="w-full md:w-52">
            <Media label="photo" ratio="aspect-square" />
          </Slot>
        </div>
      </SectionShell>

      {/* ─────────────── 04 SKILLS ─────────────── */}
      <SectionShell
        num="04"
        title="Skills"
        id="skills"
        note="Reinstated per §0. Grouped text lines only — no icons, no bars, no percentages. Everything here must be something he could be interviewed on. Source: content/site.ts."
      >
        <div className="flex flex-col gap-5">
          {['Languages', 'Frameworks', 'Data & AI', 'Tools'].map((group) => (
            <Slot key={group} label={group}>
              <Lines count={1} widths={['82%']} size="sm" />
            </Slot>
          ))}
        </div>
      </SectionShell>

      {/* ─────────────── 05 CONTACT ─────────────── */}
      <SectionShell
        num="05"
        title="Contact"
        id="contact"
        note="This section IS the footer band. Presence, not pitch — he is not hunting, so no ask and no availability. No form; click-to-copy email plus mailto, address in plain text so it survives a screenshot."
      >
        <div className="flex flex-col gap-6">
          <Slot label="One line">
            <Lines count={1} widths={['62%']} />
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
      <div className="border-t border-n-6 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <span className="font-mono text-[10px] tracking-widest text-n-9 uppercase">
            Routes (greybox nav — not shipped)
          </span>
          {[
            '/work/bowlwise',
            '/work/moneymind',
            '/work/maridian',
            '/work/tactical-dna',
            '/art',
          ].map((h) => (
            <Link
              key={h}
              href={h}
              className="font-mono text-[10px] text-n-9 underline underline-offset-4 hover:text-ink"
            >
              {h}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
