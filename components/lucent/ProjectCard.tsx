import type { ReactNode } from 'react';
import Glyph, { type GlyphName } from './Glyph';
import TransitionLink from './TransitionLink';
import type { ProjectStatus } from '@/content/types';

/**
 * ProjectCard — full-bleed project art with a glass caption floating on its
 * bottom edge. Hover rises 4px, deepens the shadow, drifts the art in 3% and
 * nudges the arrow; pressing dips it. Nothing tilts or glows (all CSS, kit).
 *
 * Stealth: the art is abstract shapes under a frost, the caption carries a
 * working description instead of the product name, and there is no page — the
 * card opens a quick-look Sheet instead. Never a real screenshot under the frost:
 * blur can be undone by eye.
 */

/** Which glyph carries each kind of status (kit: store, lock, flask). */
const STATUS_GLYPH: Record<ProjectStatus['kind'], GlyphName> = {
  live: 'store',
  stealth: 'lock',
  progress: 'flask',
  research: 'flask',
  hackathon: 'timer',
};

interface Props {
  href: string;
  title: string;
  meta: string;
  status: ProjectStatus;
  art: ReactNode;
  /** Extra classes for the art container (e.g. the dot canvas behind a diagram). */
  artClassName?: string;
  /** Space-separated filter tags (SkillChip filter groups). */
  tags?: string;
  feature?: boolean;
  /** Stealth: the id of the <template> holding its quick look. */
  quickLook?: { template: string; title: string };
  className?: string;
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
  quickLook,
  className,
}: Props) {
  const cls = ['lu-card', feature && 'is-feature', quickLook && 'is-stealth', className].filter(Boolean).join(' ');
  const body = (
    <>
      <div className={artClassName ? `lu-card-art ${artClassName}` : 'lu-card-art'}>{art}</div>
      {quickLook && <div className="lu-card-frost" />}
      <span className="lu-card-label has-icon">
        <Glyph name={STATUS_GLYPH[status.kind]} />
        {status.label}
      </span>
      <div className="lu-card-caption lu-glass">
        <div>
          <h3 className="lu-card-title">{title}</h3>
          <p className="lu-card-meta">{meta}</p>
        </div>
        <span className="lu-card-go" aria-hidden="true">
          <Glyph name="arrow-right" />
        </span>
      </div>
    </>
  );

  if (quickLook) {
    /* Lucent.auto() turns data-sheet into a Sheet that grows out of this card. */
    return (
      <a
        className={cls}
        href={href}
        data-tags={tags}
        data-sheet={`#${quickLook.template}`}
        data-sheet-title={quickLook.title}
        aria-haspopup="dialog"
      >
        {body}
      </a>
    );
  }
  return (
    <TransitionLink className={cls} href={href} data-tags={tags}>
      {body}
    </TransitionLink>
  );
}
