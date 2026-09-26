import type { ReactNode } from 'react';
import Glyph, { type GlyphName } from './Glyph';
import TransitionLink from './TransitionLink';
import type { ProjectStatus } from '@/content/types';

/**
 * ProjectCard — full-bleed project art with a glass caption floating on its
 * bottom edge. Hover rises 4px, deepens the shadow, drifts the art in 3% and
 * nudges the arrow; pressing dips it. Nothing tilts or glows (all CSS, kit).
 *
 * Soon: a card with no href has nowhere to go yet, so it is a plain block rather
 * than a link — no arrow, no hover lift, no press dip (site.css .is-soon) — and
 * must not look clickable. One that holds something to tap (its `children`: a
 * cameo, components/work/Cameo.tsx) gets the hover and the press back once
 * that is there, but never the arrow: it still goes nowhere.
 */

/** Which glyph carries each kind of status (kit: store, flask, timer; spark for a soon card). */
const STATUS_GLYPH: Record<ProjectStatus['kind'], GlyphName> = {
  live: 'store',
  soon: 'spark',
  progress: 'flask',
  research: 'flask',
  hackathon: 'timer',
};

/**
 * A name longer than this runs to three or four lines on a card under 400px wide
 * and buries the art, so its card sets it smaller there (site.css .is-long-title).
 */
const LONG_TITLE = 24;

interface Props {
  /** The project's page. Absent on a soon card, which opens nothing. */
  href?: string;
  title: string;
  /** The one line under the title. Absent when there is nothing true to say yet. */
  meta?: string;
  status: ProjectStatus;
  art: ReactNode;
  /** Extra classes for the art container (e.g. the dot canvas behind a diagram). */
  artClassName?: string;
  /** Space-separated filter tags (SkillChip filter groups). */
  tags?: string;
  feature?: boolean;
  className?: string;
  /**
   * What a soon card holds besides its art and caption: a cameo. A link card
   * leaves it out, since nothing inside a link may answer a tap of its own.
   */
  children?: ReactNode;
}

export default function ProjectCard({
  href,
  title,
  meta,
  status,
  art,
  artClassName,
  tags,
  feature,
  className,
  children,
}: Props) {
  const soon = !href;
  const cls = [
    'lu-card',
    feature && 'is-feature',
    soon && 'is-soon',
    title.length > LONG_TITLE && 'is-long-title',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const body = (
    <>
      <div className={artClassName ? `lu-card-art ${artClassName}` : 'lu-card-art'}>{art}</div>
      <span className="lu-card-label has-icon">
        <Glyph name={STATUS_GLYPH[status.kind]} />
        {status.label}
      </span>
      <div className="lu-card-caption lu-glass">
        <div>
          <h3 className="lu-card-title">{title}</h3>
          {meta && <p className="lu-card-meta">{meta}</p>}
        </div>
        {!soon && (
          <span className="lu-card-go" aria-hidden="true">
            <Glyph name="arrow-right" />
          </span>
        )}
      </div>
    </>
  );

  /* data-tags stays on either element: the kit's filter group reads it. */
  if (soon) {
    return (
      <div className={cls} data-tags={tags}>
        {body}
        {children}
      </div>
    );
  }
  return (
    <TransitionLink className={cls} href={href} data-tags={tags}>
      {body}
    </TransitionLink>
  );
}
