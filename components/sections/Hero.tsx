import NavHandoff from '@/components/hero/NavHandoff';
import Button from '@/components/lucent/Button';
import type { GlyphName } from '@/components/lucent/Glyph';
import { enterStyle, Properties, type HeroProperty } from '@/components/lucent/Hero';
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
 * The opening: his name set huge in ink on two lines, then the details as an
 * iOS card and the two actions. They rise in once with the kit's entrance;
 * everything else is quiet. The page reads the same without scripts.
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
        <h1 className="hero-name" data-enter="" style={enterStyle(0)}>
          <span>{first}</span> <span>{last.join(' ')}</span>
        </h1>
        <div className="hero-card" data-enter="" style={enterStyle(1)}>
          <Properties items={properties} className="hero-props" tiles />
        </div>
        <div className="lu-hero-actions hero-actions" data-enter="" style={enterStyle(2)}>
          <Button variant="filled" href={primary.href}>
            {primary.label}
          </Button>
          <Button variant="glass" href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
      </div>
      <NavHandoff />
    </section>
  );
}
