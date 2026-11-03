import Image from 'next/image';
import type { Project } from '@/content/types';
import LoopVideo from './LoopVideo';
import RecordLinks from './RecordLinks';

/**
 * What fills a project card. The kit's rule: real screenshots where they exist,
 * cropped from the top (the kit's cover crop keeps the top of shots[0]), or a
 * crop made for the card (`cover`): of the product, where the shots are whole
 * app windows that would read as nothing at card size, or of shots[0] itself;
 * otherwise a diagram of the idea rather than a stock picture. The one card with
 * nothing to show, MoneyMind, loops its face instead, the gator at his desk,
 * because Mahyar chose to show him (2026-09-23); its screenshots and details
 * stay off until launch.
 *
 * Diagrams are monochrome line art in ink on the dot canvas, like the kit's
 * graph-research card. Only the research teaser draws one, with nothing it
 * may show yet: the real link between health records that its agents have to
 * follow (RecordLinks), the same drawing as on its page.
 */

/** The art container's own classes: a diagram sits on the dot canvas, a banner loop in a box of its own. */
export function cardArtClass(project: Project): string | undefined {
  if (project.page === 'case-study' && (project.cover || project.shots?.length)) return undefined;
  if (project.page === 'none') return project.video ? 'art-video' : 'art-canvas';
  return 'art-canvas lu-wall';
}

export default function CardArt({ project, priority }: { project: Project; priority?: boolean }) {
  /* a crop made for the card when the project has one (BowlWise, Palimpsest), else its first
     shot; `cardFocus` moves the crop where the top would cut something (Landline) */
  const shot = project.page === 'case-study' ? (project.cover ?? project.shots?.[0]) : undefined;
  if (shot) {
    return (
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(max-width: 720px) 100vw, 1152px"
        priority={priority}
        style={shot.cardFocus ? { objectPosition: shot.cardFocus } : undefined}
      />
    );
  }
  if (project.page === 'none') return project.video ? <LoopVideo video={project.video} /> : null;
  return project.slug === 'graph-rag-fhir' ? <RecordLinks layout="row" className="art-diagram" /> : null;
}
