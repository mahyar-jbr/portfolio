import Button from '@/components/lucent/Button';
import type { GlyphName } from '@/components/lucent/Glyph';
import LucentHero, { type HeroProperty } from '@/components/lucent/Hero';
import Tag from '@/components/lucent/Tag';
import TransitionLink from '@/components/lucent/TransitionLink';
import { hero } from '@/content/site';

/** Each property's glyph (kit: role, now, studying, based, also). */
const GLYPH: Record<(typeof hero.properties)[number]['id'], GlyphName> = {
  role: 'role',
  now: 'now',
  studying: 'studying',
  based: 'pin',
  also: 'pencil',
};

export default function Hero() {
  const properties: HeroProperty[] = hero.properties.map((p) => {
    let value: HeroProperty['value'] = p.value;
    if ('status' in p) {
      value = (
        <Tag tone="green" dot>
          {p.value}
        </Tag>
      );
    } else if ('timeZone' in p) {
      /* Lucent.liveTime keeps a quiet local clock; empty until the runtime fills it. */
      value = (
        <>
          {p.value} <time data-live="" data-tz={p.timeZone} />
        </>
      );
    } else if ('href' in p) {
      value = (
        <TransitionLink className="lu-link" href={p.href}>
          {p.value}
        </TransitionLink>
      );
    }
    return { label: p.label, glyph: GLYPH[p.id], value };
  });

  const [primary, secondary] = hero.ctas;

  return (
    <LucentHero
      name={hero.name}
      properties={properties}
      actions={
        <>
          <Button variant="filled" href={primary.href}>
            {primary.label}
          </Button>
          <Button variant="glass" href={secondary.href}>
            {secondary.label}
          </Button>
        </>
      }
    />
  );
}
