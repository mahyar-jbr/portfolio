import Image from 'next/image';
import type { Project } from '@/content/types';

/**
 * What fills a project card. The kit's rule: real screenshots where they exist,
 * cropped from the top (the kit's cover crop keeps the top of shots[0]);
 * otherwise a diagram of the idea rather than a stock picture. A soon card
 * (nothing to show yet) gets art that says nothing about the work: abstract
 * shapes under the frost, never a blurred real screenshot.
 *
 * Diagrams are monochrome line art in ink on the dot canvas, like the kit's
 * graph-research card. Only the research brief, which has nothing built to
 * show yet, still draws one.
 */

/** The art container's own classes: a diagram sits on the dot canvas, an unfrosted soon card on the plain raised ground. */
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
  if (project.page === 'none') return project.frost ? <Bars /> : null;
  return project.slug === 'graph-rag-fhir' ? <Graph /> : null;
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
