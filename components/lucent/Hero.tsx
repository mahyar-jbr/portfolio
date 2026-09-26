import type { CSSProperties, ReactNode } from 'react';
import Glyph, { type GlyphName } from './Glyph';

/**
 * Hero (page variant) — the opening reads like a well-kept doc page: an optional
 * cover and page icon, the name, a short list of properties with glyphs, then two
 * actions. It answers who, what, where in one glance, in key/value form.
 *
 * The home page lays out its own opening and its own entrance
 * (components/sections/Hero.tsx) and takes only Properties from here.
 *
 * Entrance: the parts fade and rise 12px, 70ms apart (data-enter). It is done in
 * CSS rather than Lucent.enter() so it starts with the first paint of the
 * server-rendered page instead of after hydration, and so the page is fully
 * visible if scripts never run.
 */
export interface HeroProperty {
  label: string;
  glyph: GlyphName;
  value: ReactNode;
}

export const enterStyle = (i: number) => ({ '--enter-i': i }) as CSSProperties;

/**
 * The property list on its own (dl.lu-props), for heroes that lay out their own
 * opening. With `tiles`, each glyph sits in a small tile — the look of an iOS
 * inset grouped list (styled by the page, styles/site.css).
 */
export function Properties({
  items,
  className,
  style,
  tiles,
}: {
  items: HeroProperty[];
  className?: string;
  style?: CSSProperties;
  tiles?: boolean;
}) {
  return (
    <dl className={className ? `lu-props ${className}` : 'lu-props'} style={style}>
      {items.map((p) => (
        <div key={p.label}>
          <dt>
            {tiles ? (
              <span className="prop-tile">
                <Glyph name={p.glyph} />
              </span>
            ) : (
              <Glyph name={p.glyph} />
            )}
            {p.label}
          </dt>
          <dd>{p.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Hero({
  cover,
  icon,
  title,
  properties,
  actions,
  className,
  enterFrom = 0,
  children,
  ...data
}: {
  cover?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  properties: HeroProperty[];
  actions: ReactNode;
  className?: string;
  /** Entrance index of the first part here, when the cover has entrances of its own. */
  enterFrom?: number;
  /** Rendered last inside the section (e.g. an overlay). */
  children?: ReactNode;
  [dataAttr: `data-${string}`]: string | undefined;
}) {
  let i = enterFrom;
  return (
    <section className={`lu-hero is-page${className ? ` ${className}` : ''}`} id="top" aria-label="Introduction" {...data}>
      {cover}
      <div className="lu-hero-inner">
        {icon && (
          <div className="lu-hero-icon" data-enter="" style={enterStyle(i++)}>
            {icon}
          </div>
        )}
        <h1 data-enter="" style={enterStyle(i++)}>
          {title}
        </h1>
        <dl className="lu-props" data-enter="" style={enterStyle(i++)}>
          {properties.map((p) => (
            <div key={p.label}>
              <dt>
                <Glyph name={p.glyph} />
                {p.label}
              </dt>
              <dd>{p.value}</dd>
            </div>
          ))}
        </dl>
        <div className="lu-hero-actions" data-enter="" style={enterStyle(i++)}>
          {actions}
        </div>
      </div>
      {children}
    </section>
  );
}
