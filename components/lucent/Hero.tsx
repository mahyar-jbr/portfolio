import type { CSSProperties, ReactNode } from 'react';
import BrandMark from './BrandMark';
import Glyph, { type GlyphName } from './Glyph';

/**
 * Hero (page variant) — the opening reads like a well-kept doc page: a cover band
 * (the dot canvas with one hairline sigmoid), the brand mark as the page icon
 * overlapping it, the name, a short list of properties with glyphs, then two
 * actions. It answers who, what, where in one glance, in key/value form.
 *
 * Entrance: icon, name, properties and actions fade and rise 12px, 70ms apart
 * (data-enter). It is done in CSS rather than Lucent.enter() so it starts with
 * the first paint of the server-rendered page instead of after hydration, and so
 * the page is fully visible if scripts never run. The mark's sigma-to-M turn is
 * the brand reveal, once, where the brand is introduced.
 */
export interface HeroProperty {
  label: string;
  glyph: GlyphName;
  value: ReactNode;
}

const enter = (i: number) => ({ '--enter-i': i }) as CSSProperties;

export default function Hero({
  name,
  properties,
  actions,
}: {
  name: string;
  properties: HeroProperty[];
  actions: ReactNode;
}) {
  return (
    <section className="lu-hero is-page" id="top" aria-label="Introduction">
      <div className="lu-hero-cover lu-wall">
        <svg className="lu-hero-curve" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 214 C 420 214, 520 210, 600 130 S 780 46, 1200 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="lu-hero-inner">
        <div className="lu-hero-icon is-reveal" data-enter="" style={enter(0)}>
          <BrandMark size={46} />
        </div>
        <h1 data-enter="" style={enter(1)}>
          {name}
        </h1>
        <dl className="lu-props" data-enter="" style={enter(2)}>
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
        <div className="lu-hero-actions" data-enter="" style={enter(3)}>
          {actions}
        </div>
      </div>
    </section>
  );
}
