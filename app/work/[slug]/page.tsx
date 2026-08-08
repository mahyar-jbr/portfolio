import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Slot, Lines, Chips, Btn, Media, SectionShell } from '@/components/wireframe/Box';

/* GREYBOX — case-study route. One shape for all three; per-project slots are
   toggled by the flags below. Structure per design/SECTIONS.md §1 + §6.7. */

/* Order and framing locked by the content tab. Every live demo is dead except
   BowlWise — Maridian's deployment is gone, so its case study has nothing
   clickable and the screenshots + diagrams have to carry it. */
const STUDIES = {
  bowlwise: {
    title: 'BowlWise',
    kind: 'product',
    diagram: 'Architecture diagram',
    warStory: false,
    video: true, // §3.5 — the only video on the site
    screenshots: 4, // already in public/projects
    repoNote: 'Repo is private — needs an explicit explanation line (§6.3)',
    next: { slug: 'moneymind', title: 'MoneyMind' },
  },
  moneymind: {
    title: 'MoneyMind',
    kind: 'product',
    diagram: 'Streaming pipeline diagram',
    warStory: false,
    video: false,
    screenshots: 0,
    repoNote: null, // public repo exists
    next: { slug: 'maridian', title: 'Maridian' },
  },
  maridian: {
    title: 'Maridian',
    kind: 'product',
    diagram: 'Agent topology diagram',
    warStory: true, // the production outage
    video: false,
    screenshots: 0,
    repoNote:
      'No live demo and no public repo — the ONLY case study with nothing clickable. Screenshots + diagrams must carry it entirely.',
    next: { slug: 'tactical-dna', title: 'Tactical DNA' },
  },
  'tactical-dna': {
    title: 'Tactical DNA',
    kind: 'research',
    diagram: 'Method / feature-space diagram',
    warStory: false,
    video: false,
    screenshots: 0,
    repoNote: null, // public repo — the most verifiable thing on the site
    next: { slug: 'bowlwise', title: 'BowlWise' },
  },
} as const;

type Slug = keyof typeof STUDIES;

export function generateStaticParams() {
  return Object.keys(STUDIES).map((slug) => ({ slug }));
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in STUDIES)) notFound();
  const study = STUDIES[slug as Slug];

  // Research reads as an investigation, not a product launch. Same shape,
  // different framing — Question/Method/Findings rather than Problem/Approach/Result.
  const isResearch = study.kind === 'research';
  const L = isResearch
    ? { one: 'Question', two: 'Method', four: 'Findings' }
    : { one: 'Problem', two: 'Approach', four: 'Result' };

  return (
    <article className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#work"
          className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase hover:text-neutral-200"
        >
          ← Work
        </Link>

        <div className="mt-10 flex flex-col gap-6">
          <Slot label={`H1 — ${study.title}`}>
            <Lines count={1} widths={['46%']} size="lg" />
          </Slot>

          <Slot label="One-liner + badges">
            <div className="flex flex-col gap-3">
              <Lines count={1} widths={['80%']} />
              <Chips count={3} />
            </div>
          </Slot>

          <Slot
            label="At a glance"
            note="Role · Team · Context · Owned. Makes individual contribution explicit on team work."
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {['Role', 'Team', 'Context', 'Owned'].map((k) => (
                <div key={k} className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
                    {k}
                  </span>
                  <div className="h-3 w-full bg-neutral-800" />
                </div>
              ))}
            </div>
          </Slot>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
        <SectionShell num="01" title={L.one} id="problem">
          <Slot label={`${L.one} — stated first, before any solution`}>
            <Lines count={3} />
          </Slot>
        </SectionShell>

        <SectionShell num="02" title={L.two} id="approach">
          <div className="flex flex-col gap-6">
            <Slot label={L.two}>
              <Lines count={4} />
            </Slot>
            <Slot
              label={study.diagram}
              note="Hand-authored, monochrome, annotated. Inline SVG — no image payload."
            >
              <Media label="diagram" ratio="aspect-[16/9]" />
            </Slot>
          </div>
        </SectionShell>

        <SectionShell
          num="03"
          title="Key Decisions"
          id="decisions"
          note="MANDATORY on every case study (§6.7). Recruiters largely don't click through — interviewers do, and this is the block that serves them. All three research proposals cut it; it is restored."
        >
          <div className="flex flex-col gap-5">
            {[0, 1, 2].map((i) => (
              <Slot key={i} label={`Decision ${i + 1} — what, then WHY`}>
                <div className="flex flex-col gap-2">
                  <Lines count={1} widths={['64%']} />
                  <Lines count={2} widths={['100%', '88%']} size="sm" />
                </div>
              </Slot>
            ))}
          </div>
        </SectionShell>

        {study.warStory && (
          <SectionShell
            num="04"
            title="War story"
            id="war-story"
            note="Maridian only — the production outage. Diagnosis under pressure, owned end to end."
          >
            <Slot label="Incident narrative">
              <Lines count={4} />
            </Slot>
          </SectionShell>
        )}

        <SectionShell num={study.warStory ? '05' : '04'} title={L.four} id="result">
          <div className="flex flex-col gap-6">
            <Slot label={L.four}>
              <Lines count={2} />
            </Slot>
            <Slot label="Metrics — inside sentences, never a counter row">
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-5 w-2/3 bg-neutral-800" />
                    <div className="h-2 w-full bg-neutral-900" />
                  </div>
                ))}
              </div>
            </Slot>
          </div>
        </SectionShell>

        {(study.video || study.screenshots > 0) && (
          <SectionShell
            num={study.warStory ? '06' : '05'}
            title="Proof"
            id="proof"
            note={
              study.video
                ? 'PetValu will never yield a public URL, so without a recording "live in 2 stores" is an unbacked assertion. Lead with a PHOTO of the tablet in the aisle (§6.4) — a screen recording could be localhost.'
                : undefined
            }
          >
            <div className="flex flex-col gap-6">
              {study.video && (
                <>
                  <Slot label="Photo — BowlWise on the in-store tablet">
                    <Media label="in-aisle photo" ratio="aspect-[4/3]" />
                  </Slot>
                  <Slot label="Recording — in-store tablet flow">
                    <Media label="video · poster + preload=none" ratio="aspect-video" />
                  </Slot>
                </>
              )}
              {study.screenshots > 0 && (
                <Slot label={`Screenshots (${study.screenshots} exist)`}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Array.from({ length: study.screenshots }).map((_, i) => (
                      <Media key={i} label={`${i + 1}`} />
                    ))}
                  </div>
                </Slot>
              )}
            </div>
          </SectionShell>
        )}

        {study.repoNote && (
          <div className="border-t border-neutral-900 px-0 py-8">
            <Slot label="Repo availability" note={study.repoNote}>
              <Lines count={1} widths={['70%']} size="sm" />
            </Slot>
          </div>
        )}

        <div className="border-t border-neutral-900 py-10">
          <Slot label={`Next → ${study.next.title}`}>
            <div className="flex gap-3">
              <Btn label={`${study.next.title} →`} ghost />
            </div>
          </Slot>
        </div>
      </div>
    </article>
  );
}
