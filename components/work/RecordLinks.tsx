/**
 * RecordLinks: the link the graph-retrieval research turns on, drawn in ink.
 * A prescription (FHIR's MedicationRequest) points to the patient through its
 * `subject` field, and to its drug through `medicationReference`, a separate
 * Medication record: the one an agent has to follow the link to reach, so it
 * is the one filled in ink.
 *
 * Record types and field names are FHIR's own, as the project's brief draws
 * them in its card_teaser.png (content/sources/GraphRetrieval_PORTFOLIO_BRIEF.md).
 * Nothing else is drawn: no record contents, no results.
 *
 * Two arrangements of the same three records and two links. `stacked`, the
 * brief's own, is the figure on the project's page: the prescription beside
 * the patient, the drug under the prescription, legible down to a phone.
 * `row` is the card's art: the prescription and its drug in one row, read left
 * to right, the patient under the prescription, so on a narrow card, where a
 * long name's caption leaves only a strip of art, the link to the drug stays
 * in sight and the patient alone gives way (site.css "Research teaser").
 *
 * Lines and text take the theme's ink; the boxes are filled with the canvas
 * under them, so the dots stop at their edges. On a card it is aria-hidden
 * (the caption names the project); on the page `label` reads it out.
 */

type Anchor = 'start' | 'middle' | 'end';
interface Arrangement {
  viewBox: string;
  /** Each record's box: x, y, width (all 32 high), with its type's name centred in it. */
  patient: [number, number, number];
  request: [number, number, number];
  medication: [number, number, number];
  /** Each link: its line, its arrowhead, and where its field's name sits. */
  subject: { line: string; head: string; at: [number, number, Anchor] };
  reference: { line: string; head: string; at: [number, number, Anchor] };
}

const ARRANGEMENTS: Record<'stacked' | 'row', Arrangement> = {
  stacked: {
    viewBox: '0 8 300 144',
    patient: [4, 18, 80],
    request: [146, 18, 150],
    medication: [170, 112, 102],
    subject: { line: 'M146 34H93', head: 'M86 34l7-3.5v7z', at: [115, 25, 'middle'] },
    reference: { line: 'M221 50v53', head: 'M221 110l-3.5-7h7z', at: [213, 81, 'end'] },
  },
  row: {
    viewBox: '-4 8 392 128',
    patient: [35, 98, 80],
    request: [0, 18, 150],
    medication: [282, 18, 102],
    subject: { line: 'M75 50v39', head: 'M75 96l-3.5-7h7z', at: [83, 73, 'start'] },
    reference: { line: 'M150 34H273', head: 'M280 34l-7-3.5v7z', at: [215, 25, 'middle'] },
  },
};

const H = 32;

function RecordBox({ box: [x, y, w], name, target }: { box: [number, number, number]; name: string; target?: boolean }) {
  const cls = target ? ' is-target' : '';
  return (
    <>
      <rect className={`rl-box${cls}`} x={x} y={y} width={w} height={H} rx="8" />
      <text className={`rl-type${cls}`} x={x + w / 2} y={y + H / 2} textAnchor="middle" dominantBaseline="central">
        {name}
      </text>
    </>
  );
}

function Link({ line, head, at: [x, y, anchor], field }: Arrangement['subject'] & { field: string }) {
  return (
    <>
      <path className="rl-link" d={line} />
      <path className="rl-head" d={head} />
      <text className="rl-field" x={x} y={y} textAnchor={anchor} dominantBaseline="central">
        {field}
      </text>
    </>
  );
}

export default function RecordLinks({
  layout = 'stacked',
  label,
  className,
}: {
  layout?: 'stacked' | 'row';
  label?: string;
  className?: string;
}) {
  const a = ARRANGEMENTS[layout];
  return (
    <svg
      className={['rl', `rl-${layout}`, className].filter(Boolean).join(' ')}
      viewBox={a.viewBox}
      fill="none"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <Link {...a.reference} field="medicationReference" />
      <RecordBox box={a.request} name="MedicationRequest" />
      <RecordBox box={a.medication} name="Medication" target />
      {/* the patient's half: on a narrow card, the part that gives way */}
      <g className="rl-patient">
        <Link {...a.subject} field="subject" />
        <RecordBox box={a.patient} name="Patient" />
      </g>
    </svg>
  );
}
