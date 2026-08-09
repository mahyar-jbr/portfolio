import { Label, Row } from './Kit';

/* Tracking values come from Inter's Dynamic Metrics formula:
     tracking_em = -0.0223 + 0.185 * e^(-0.1745 * px)
   which crosses zero at 12.125px — so small text gets POSITIVE tracking. */
const SCALE = [
  { px: 72, w: 600, lh: 1.02, track: '-0.02230em', label: 'Display' },
  { px: 48, w: 600, lh: 1.06, track: '-0.02226em', label: 'H1' },
  { px: 32, w: 600, lh: 1.15, track: '-0.02160em', label: 'H2' },
  { px: 24, w: 600, lh: 1.25, track: '-0.01949em', label: 'H3' },
  { px: 20, w: 500, lh: 1.4, track: '-0.01666em', label: 'H4' },
  { px: 18, w: 400, lh: 1.6, track: '-0.01430em', label: 'Body large' },
  { px: 16, w: 400, lh: 1.6, track: '-0.01096em', label: 'Body' },
  { px: 14, w: 400, lh: 1.55, track: '-0.00622em', label: 'Small' },
  { px: 12, w: 500, lh: 1.45, track: '0.00049em', label: 'Caption' },
  { px: 11, w: 500, lh: 1.4, track: '0.00484em', label: 'Micro' },
];

export default function TypeRamp() {
  return (
    <div>
      <Row>
        <Label>Scale — Inter Variable (opsz 14–32)</Label>
        <div className="divide-y divide-n-5">
          {SCALE.map((s) => (
            <div
              key={s.px}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <div className="w-40 shrink-0 font-mono text-[11px] text-n-9">
                <div className="text-n-11">{s.label}</div>
                <div>
                  {s.px}px · {s.w} · {s.lh}
                </div>
                <div>{s.track}</div>
              </div>
              <p
                className="min-w-0 truncate text-ink"
                style={{
                  fontSize: `${s.px}px`,
                  fontWeight: s.w,
                  lineHeight: s.lh,
                  letterSpacing: s.track,
                }}
              >
                Ships to production
              </p>
            </div>
          ))}
        </div>
      </Row>

      <Row>
        <Label>Monospace — Geist Mono Variable</Label>
        <pre className="overflow-x-auto rounded-md border border-n-6 bg-n-2 p-5 font-mono text-sm leading-relaxed text-n-11">
{`1  INTAKE      ingest_defect()   -> DefectReport
2  CLASSIFY    classify()        -> contract: DefectClass
3  RECOMMEND   recommend_action()
4  REVIEW      operator: approved
5  DISPATCH    [ state persisted ]`}
        </pre>
      </Row>

      <Row>
        <Label>Weights — capped at 600</Label>
        <div className="flex flex-wrap items-baseline gap-6">
          {[400, 500, 600].map((w) => (
            <span
              key={w}
              className="text-2xl text-ink"
              style={{ fontWeight: w, letterSpacing: 'var(--tracking-24)' }}
            >
              {w}
            </span>
          ))}
          <span className="max-w-md text-sm text-n-10">
            Three weights, no more. Wealthsimple ships 400 and 500 for 96 of
            108 declarations; Stripe sets its headings at 300. Reaching for 700
            or 800 is what makes a light UI read as loud rather than expensive.
          </span>
        </div>
      </Row>
    </div>
  );
}
