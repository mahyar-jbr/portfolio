import Image from 'next/image';
import type { Project } from '@/content/types';

/**
 * What fills a project card. The kit's rule: real screenshots where they exist,
 * cropped from the top; otherwise a diagram of the idea rather than a stock
 * picture. A soon card (nothing to show yet) gets art that says nothing about
 * the work: abstract shapes under the frost (never a blurred real screenshot),
 * or, unfrosted, just its own name, large and faint.
 *
 * Diagrams are monochrome line art in ink on the dot canvas, like the kit's
 * graph-research card.
 */

/** The art container's own classes: diagrams sit on the dot canvas, a soon card's name on the plain raised ground. */
export function cardArtClass(project: Project): string | undefined {
  if (project.page === 'case-study' && project.shots?.length) return undefined;
  // frosted: the kit's .is-stealth card gives the art its raised ground
  if (project.page === 'none') return project.frost ? undefined : 'art-canvas';
  return 'art-canvas lu-wall';
}

export default function CardArt({ project, priority }: { project: Project; priority?: boolean }) {
  if (project.page === 'case-study' && project.shots?.length) {
    const shot = project.shots[0];
    return <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 720px) 100vw, 1152px" priority={priority} />;
  }
  if (project.page === 'none') return project.frost ? <Bars /> : <NameArt name={project.name} />;
  switch (project.slug) {
    case 'graph-rag-fhir':
      return <Graph />;
    case 'maridian':
      return <Pipeline />;
    case 'tactical-dna':
      return <PassingNetwork />;
    default:
      return null;
  }
}

/** Frosted soon card: a rising bar chart, abstract enough to say "money" and nothing else (kit). */
function Bars() {
  return (
    <div className="art-bars" aria-hidden="true">
      {[48, 44, 56, 64, 74, 88].map((h, i) => (
        <i key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/**
 * Unfrosted soon card: the name set large and faint in the hero's type, so the
 * art claims nothing about a project whose details haven't arrived. Decorative:
 * the caption already says the name.
 */
function NameArt({ name }: { name: string }) {
  return (
    <div className="art-name" aria-hidden="true">
      <span>{name}</span>
    </div>
  );
}

/** Graph retrieval: a small node graph (kit). */
function Graph() {
  return (
    <svg className="art-diagram" viewBox="0 0 300 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5">
        <path d="M40 110L110 50L190 80L260 36M110 50L150 130L190 80M40 110L150 130M190 80L240 128" />
      </g>
      <g fill="currentColor">
        <circle cx="40" cy="110" r="7" fillOpacity=".5" />
        <circle cx="110" cy="50" r="9" />
        <circle cx="190" cy="80" r="11" />
        <circle cx="260" cy="36" r="6" fillOpacity=".5" />
        <circle cx="150" cy="130" r="7" fillOpacity=".7" />
        <circle cx="240" cy="128" r="5" fillOpacity=".4" />
      </g>
    </svg>
  );
}

/**
 * Maridian: six agents in a fixed sequence. Five run every time; the sixth
 * (Recovery Planner) branches off only when the batch breaches its SLA.
 */
function Pipeline() {
  const xs = [30, 88, 146, 204, 262];
  return (
    <svg className="art-diagram" viewBox="0 0 300 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5">
        <path d="M30 70H262" />
        <path d="M262 70C262 104 262 104 262 126" strokeDasharray="3 5" />
      </g>
      <g fill="currentColor">
        {xs.map((x, i) => (
          <circle key={x} cx={x} cy="70" r={i === 3 ? 11 : 8} fillOpacity={i === 3 ? 1 : 0.35 + i * 0.12} />
        ))}
        <circle cx="262" cy="128" r="6" fillOpacity=".4" />
      </g>
    </svg>
  );
}

/** Tactical DNA: one passing network — eleven starters, edge weight as line weight. */
function PassingNetwork() {
  const n: [number, number, number][] = [
    [34, 80, 5],
    [92, 28, 6], [88, 64, 8], [88, 98, 8], [92, 132, 6],
    [158, 40, 9], [150, 80, 11], [158, 120, 9],
    [222, 34, 6], [230, 80, 7], [222, 126, 6],
  ];
  const e: [number, number, number][] = [
    [0, 2, 1.2], [0, 3, 1.2], [1, 2, 1.5], [2, 3, 2.2], [3, 4, 1.5], [1, 5, 1.8], [2, 6, 2.6], [3, 6, 2.4],
    [4, 7, 1.8], [5, 6, 2.2], [6, 7, 2.2], [5, 8, 1.6], [6, 9, 2], [7, 10, 1.6], [8, 9, 1.2], [9, 10, 1.2],
  ];
  return (
    <svg className="art-diagram" viewBox="0 0 264 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeOpacity=".3">
        {e.map(([a, b, w], i) => (
          <line key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} strokeWidth={w} />
        ))}
      </g>
      <g fill="currentColor">
        {n.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fillOpacity={r >= 9 ? 1 : r >= 7 ? 0.7 : 0.45} />
        ))}
      </g>
    </svg>
  );
}
