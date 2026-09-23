import type { CSSProperties } from 'react';
import Formula, { SIGMA } from '@/components/hero/Formula';
import SigmaMorph from '@/components/hero/SigmaMorph';
import Button from '@/components/lucent/Button';
import type { GlyphName } from '@/components/lucent/Glyph';
import { Properties, type HeroProperty } from '@/components/lucent/Hero';
import LiveClock from '@/components/lucent/LiveClock';
import { hero } from '@/content/site';

/** Each property's glyph (kit: role, now, studying, based). */
const GLYPH: Record<(typeof hero.properties)[number]['id'], GlyphName> = {
  role: 'role',
  now: 'now',
  studying: 'studying',
  based: 'pin',
};

/**
 * The opening. The landing screen is the formula and nothing else, pinned while
 * the page scrolls through it: the other terms leave, the Σ slides along the
 * line and turns a quarter clockwise into the M, the rest of the name writes
 * itself after it — in the formula's own place — and the kit's properties and
 * actions rise in beneath. Then the pin releases and the page carries on.
 * (SigmaMorph drives it; the CSS in styles/site.css "Hero" lays out both the
 * live and the resting form.)
 *
 * The M is the formula's own Σ — the same TeX glyph, turned. At rest (no
 * script, reduced motion) the formula sits above the finished name.
 */
export default function Hero() {
  const properties: HeroProperty[] = hero.properties.map((p) => {
    let value: HeroProperty['value'] = p.value;
    if ('timeZone' in p) {
      /* a quiet local clock whose digits roll when the minute changes */
      value = (
        <>
          {p.value} <LiveClock timeZone={p.timeZone} />
        </>
      );
    }
    return { label: p.label, glyph: GLYPH[p.id], value };
  });

  const [primary, secondary] = hero.ctas;
  const rest = hero.name.slice(1);

  return (
    <section className="lu-hero is-formula" id="top" aria-label="Introduction" data-sigma-hero="">
      <div className="hero-stage">
        <div className="hero-sticky">
          <div className="hero-line">
            <Formula spoken={hero.formula.spoken} />
            <h1 className="hero-title">
              <span className="sr-only">{hero.name}</span>
              <span className="hero-name" aria-hidden="true">
                <span className="hero-m" data-sigma-to="">
                  <span className="sigma-glyph">{SIGMA}</span>
                </span>
                {[...rest].map((ch, i) =>
                  ch === ' ' ? (
                    ' '
                  ) : (
                    <span key={i} className="hero-l" style={{ '--i': i } as CSSProperties}>
                      {ch}
                    </span>
                  ),
                )}
              </span>
            </h1>
            {/* The Σ in flight: the same glyph as the M's, drawn over the page while live. */}
            <span className="hero-fly" aria-hidden="true" data-sigma-fly="">
              <span className="sigma-glyph">{SIGMA}</span>
            </span>
            <div className="hero-below">
              <Properties items={properties} className="hero-props" tiles />
              <div className="lu-hero-actions hero-actions">
                <Button variant="filled" href={primary.href}>
                  {primary.label}
                </Button>
                <Button variant="glass" href={secondary.href}>
                  {secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SigmaMorph />
    </section>
  );
}
