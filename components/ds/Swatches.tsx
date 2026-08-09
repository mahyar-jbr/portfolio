import { Label, Row } from './Kit';

/* Ratios are measured against the page canvas #FCFCFA, computed with the WCAG
   2.x relative-luminance formula. They are not rounded up. */
type Step = { n: number; hex: string; ratio: number; apca: number; use?: string };

const NEUTRAL: Step[] = [
  { n: 1, hex: '#fcfcfa', ratio: 1.0, apca: 0, use: 'page canvas' },
  { n: 2, hex: '#f8f9f6', ratio: 1.03, apca: 0, use: 'raised surface' },
  { n: 3, hex: '#f3f3ef', ratio: 1.08, apca: 0, use: 'hover fill' },
  { n: 4, hex: '#edede8', ratio: 1.14, apca: 6.5, use: 'active fill' },
  { n: 5, hex: '#e4e5de', ratio: 1.23, apca: 11.4, use: 'hairline' },
  { n: 6, hex: '#d5d6ce', ratio: 1.43, apca: 20.2, use: 'border' },
  { n: 7, hex: '#babbb2', ratio: 1.89, apca: 35.3, use: 'decorative only' },
  { n: 8, hex: '#92928b', ratio: 3.05, apca: 56.5, use: 'focus ring' },
  { n: 9, hex: '#73736d', ratio: 4.64, apca: 71.3, use: 'non-body text' },
  { n: 10, hex: '#63645d', ratio: 5.82, apca: 78.0, use: 'secondary text' },
  { n: 11, hex: '#565751', ratio: 7.1, apca: 83.5, use: 'body text' },
  { n: 12, hex: '#20201c', ratio: 15.91, apca: 101.4, use: 'ink' },
];

const NAVY: Step[] = [
  { n: 1, hex: '#f9fbfe', ratio: 1.01, apca: 0 },
  { n: 2, hex: '#f2f7fe', ratio: 1.05, apca: 0, use: 'tint' },
  { n: 3, hex: '#e8f0fe', ratio: 1.12, apca: 4.9, use: 'hover tint' },
  { n: 4, hex: '#dbe8fd', ratio: 1.2, apca: 9.9, use: 'selection' },
  { n: 5, hex: '#cddefb', ratio: 1.32, apca: 15.8 },
  { n: 6, hex: '#bbd1f8', ratio: 1.5, apca: 23.2 },
  { n: 7, hex: '#9dbaee', ratio: 1.91, apca: 35.9, use: 'decorative only' },
  { n: 8, hex: '#6d92d4', ratio: 3.05, apca: 56.3, use: 'focus ring' },
  { n: 9, hex: '#284a8b', ratio: 8.37, apca: 87.4, use: 'solid fill' },
  { n: 10, hex: '#1e3e7b', ratio: 10.07, apca: 91.8, use: 'fill hover' },
  { n: 11, hex: '#3f63a6', ratio: 5.76, apca: 77.5, use: 'accent text' },
  { n: 12, hex: '#102245', ratio: 15.29, apca: 100.6, use: 'accent ink' },
];

function Ramp({ steps, name }: { steps: Step[]; name: string }) {
  return (
    <Row>
      <Label>{name}</Label>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-n-6 bg-n-6 sm:grid-cols-3 lg:grid-cols-4">
        {steps.map((s) => {
          // Flip the label to white once the swatch is dark enough to need it.
          const onDark = s.ratio > 4.5;
          return (
            <div
              key={s.n}
              className="flex flex-col justify-between p-3"
              style={{ backgroundColor: s.hex, minHeight: 92 }}
            >
              <div
                className="flex items-baseline justify-between font-mono text-[11px]"
                style={{ color: onDark ? '#ffffff' : '#20201c' }}
              >
                <span className="font-semibold">{s.n}</span>
                <span className="opacity-70">{s.hex}</span>
              </div>
              <div
                className="font-mono text-[10px] leading-snug"
                style={{ color: onDark ? '#ffffff' : '#20201c', opacity: 0.75 }}
              >
                <div>
                  {s.ratio.toFixed(2)}:1 · Lc {s.apca}
                </div>
                {s.use && <div className="mt-0.5">{s.use}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Row>
  );
}

export default function Swatches() {
  return (
    <div>
      <Ramp steps={NEUTRAL} name="Neutral — hue 110 (this is the olive)" />
      <Ramp steps={NAVY} name="Accent — navy, hue 262" />

      <Row>
        <Label>Olive — one tone, not a ramp</Label>
        <div className="flex flex-wrap gap-4">
          {[
            { hex: '#486635', r: 6.33, lc: 80.3, label: 'olive' },
            { hex: '#3e5d2a', r: 7.29, lc: 84.0, label: 'olive-deep' },
          ].map((o) => (
            <div
              key={o.hex}
              className="flex min-w-40 flex-col gap-1 rounded-md p-4"
              style={{ backgroundColor: o.hex, color: '#fff' }}
            >
              <span className="font-mono text-xs font-semibold">{o.label}</span>
              <span className="font-mono text-[11px] opacity-80">{o.hex}</span>
              <span className="font-mono text-[11px] opacity-80">
                {o.r}:1 · Lc {o.lc}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          Olive can&rsquo;t carry a full accent ramp. At L 0.30 it holds only
          0.066 chroma against navy&rsquo;s 0.139 — a 2.12&times; gap — and
          clipped dark olive renders as muddy khaki. Radix ships Olive as a{' '}
          <em>gray</em>, never as an accent. But at one specific lightness it
          works as text, and Wealthsimple ships exactly this colour in
          production as their success tone. So olive stays, in the two places
          the maths allows: the neutral&rsquo;s hue, and this tone.
        </p>
      </Row>

      <Row>
        <Label>The generic-blue no-go zone</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { n: 'Bootstrap', hex: '#0D6EFD' },
            { n: 'Apple', hex: '#007AFF' },
            { n: 'TW blue-600', hex: '#2563EB' },
            { n: 'Facebook', hex: '#1877F2' },
            { n: 'LinkedIn', hex: '#0A66C2' },
          ].map((b) => (
            <div key={b.n} className="text-center">
              <div
                className="h-14 w-24 rounded-sm border border-n-6"
                style={{ backgroundColor: b.hex }}
              />
              <p className="mt-1 font-mono text-[10px] text-n-9">{b.n}</p>
            </div>
          ))}
          <div className="text-center">
            <div
              className="h-14 w-24 rounded-sm ring-2 ring-a-9"
              style={{ backgroundColor: '#284a8b' }}
            />
            <p className="mt-1 font-mono text-[10px] font-semibold text-a-11">
              ours
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-n-10">
          Those five cluster tightly around L 0.566 / C 0.205 in OKLCH. Land
          there and the site reads as untouched framework defaults. Our navy
          sits ΔL 0.146 and ΔC 0.090 outside it — dark enough to be ink-like,
          saturated enough to be deliberate.
        </p>
      </Row>
    </div>
  );
}
