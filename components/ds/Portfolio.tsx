import { Label, Row } from './Kit';

/* The portfolio-specific components, rendered in the real system so the
   tokens get exercised by the things they actually have to carry. */

export default function Portfolio() {
  return (
    <div>
      <Row>
        <Label>Project row — one line, per SECTIONS.md</Label>
        <div className="group rounded-lg border border-n-6 bg-n-2 p-6 transition-shadow hover:shadow-e2">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3
              className="text-2xl font-semibold text-ink"
              style={{ letterSpacing: 'var(--tracking-24)' }}
            >
              BowlWise
            </h3>
            <span className="rounded-pill bg-a-3 px-3 py-1 font-mono text-[11px] font-medium text-a-12">
              Live · 2 stores
            </span>
          </div>
          <p className="mt-2 max-w-2xl leading-relaxed text-n-10">
            One line of copy goes here — owned by the content tab.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'FastAPI', 'MongoDB', 'Docker'].map((t) => (
              <span
                key={t}
                className="rounded-pill border border-n-6 px-2.5 py-1 font-mono text-[11px] text-n-10"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex h-10 items-center rounded-pill bg-a-9 px-5 text-sm font-medium text-white">
              Case study →
            </span>
            <span className="inline-flex h-10 items-center rounded-pill border border-n-6 px-5 text-sm font-medium text-n-11">
              Live ↗
            </span>
          </div>
        </div>
      </Row>

      <Row>
        <Label>Agent trace — the hero signature</Label>
        <div className="overflow-x-auto rounded-lg border border-n-6 bg-n-2 p-6">
          <ol className="min-w-[30rem] space-y-3 font-mono text-[13px]">
            {[
              ['INTAKE', 'ingest_defect()', 'DefectReport'],
              ['CLASSIFY', 'classify()', 'contract: DefectClass'],
              ['RECOMMEND', 'recommend_action()', ''],
              ['REVIEW', 'operator', 'approved'],
              ['DISPATCH', '', 'state persisted'],
            ].map(([stage, fn, out], i) => (
              <li key={stage} className="flex items-center gap-4">
                <span className="w-4 text-n-9">{i + 1}</span>
                <span className="w-24 font-medium text-a-11">{stage}</span>
                <span className="flex-1 text-n-11">{fn}</span>
                {out && (
                  <span className="rounded-sm bg-n-3 px-2 py-0.5 text-n-10">
                    {out}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-n-10">
          Rendered content, not decoration — it demonstrates what a typed agent
          contract looks like. No backend, nothing to break, ~0 KB of JS.
        </p>
      </Row>

      <Row>
        <Label>Key Decisions block — mandatory on every case study</Label>
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-md border-l-2 border-a-9 bg-n-2 py-4 pr-5 pl-5"
            >
              <p className="font-medium text-ink">
                The decision, stated as a claim
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-n-10">
                Then the reasoning. This is the block that serves the
                interviewer rather than the recruiter — and it&rsquo;s the best
                writing on the site.
              </p>
            </div>
          ))}
        </div>
      </Row>

      <Row>
        <Label>Art tile — accent drops to near-zero chroma on /art</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            ['Nightmare', 'Ink on paper · 2022', 'Aurora City Hall'],
            ['What Remains', 'Digital · 2025', '▶ timelapse'],
            ['Godfall', 'Marker on paper · 2022', '5-panel series'],
          ].map(([t, m, note]) => (
            <figure key={t} className="group">
              <div className="aspect-[4/5] rounded-md border border-n-6 bg-n-4" />
              <figcaption className="mt-2.5">
                <p className="text-sm font-medium text-ink">{t}</p>
                <p className="font-mono text-[11px] text-n-9">{m}</p>
                <p className="font-mono text-[11px] text-n-9">{note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-n-10">
          On <code className="font-mono">/art</code> the accent chroma drops
          from 0.115 to roughly 0.008, so the system stops competing with the
          work. A tightly-branded accent everywhere is exactly what clashes with
          original full-colour artwork.
        </p>
      </Row>
    </div>
  );
}
