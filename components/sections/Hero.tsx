import type { CSSProperties } from 'react';
import NavHandoff from '@/components/hero/NavHandoff';
import Button from '@/components/lucent/Button';
import type { GlyphName } from '@/components/lucent/Glyph';
import { Properties, type HeroProperty } from '@/components/lucent/Hero';
import LiveClock from '@/components/lucent/LiveClock';
import { hero } from '@/content/site';

/** Each property's glyph. */
const GLYPH: Record<(typeof hero.properties)[number]['id'], GlyphName> = {
  builds: 'layers',
  now: 'now',
  studying: 'studying',
  based: 'pin',
};

/**
 * The opening: his name set huge in ink on two lines with its two actions
 * right under it, and the details as an iOS card: beside the name on laptops
 * and up, below the actions on narrower screens (styles/site.css). The markup
 * follows that reading order: name, actions, card.
 *
 * The name comes into focus: each line starts soft and faint, a descender's
 * depth high, and sharpens as it drops into place; the glass button
 * materializes, pill before label, and the card stands up on the name's
 * baseline. It plays in full once per tab session and briefly on a reload,
 * never on a return within the site (app/layout.tsx decides, before first
 * paint; styles/site.css, "Hero", plays it). Without scripts the page is
 * simply at rest.
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
  const [first, ...last] = hero.name.split(' ');

  return (
    <section className="lu-hero site-hero" id="top" aria-label="Introduction">
      <div className="lu-hero-inner hero-grid">
        <h1 className="hero-name">
          <span className="hero-line" style={{ '--line': 0 } as CSSProperties}>
            <span>{first}</span>
          </span>{' '}
          <span className="hero-line" style={{ '--line': 1 } as CSSProperties}>
            <span>{last.join(' ')}</span>
          </span>
        </h1>
        <div className="lu-hero-actions hero-actions">
          <Button variant="filled" href={primary.href}>
            {primary.label}
          </Button>
          <Button variant="glass" href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
        <div className="hero-card">
          <Properties items={properties} className="hero-props" tiles />
        </div>
      </div>
      <NavHandoff />
    </section>
  );
}
