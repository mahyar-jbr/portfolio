import Room from '@/components/drawings/Room';
import Wall from '@/components/drawings/Wall';
import Section from '@/components/lucent/Section';
import { intro, pieces, series } from '@/content/art';
import { sections } from '@/content/site';

const { drawings } = sections;

/**
 * Drawings — the kit's ArtGallery, grown into a small exhibition. Artwork is
 * content, so it hangs on paper mats and never goes under glass. The wall
 * hangs the standalone pieces on the line and closes with Godfall, one story
 * in five panels (Wall); opening any of them leads into the paper room, where
 * each piece has its wall label and, where there is one, the recording of it
 * being drawn, and Godfall reads panel by panel (Room).
 */
export default function Drawings() {
  return (
    <Section id={drawings.id} kicker={drawings.kicker} title={drawings.title} lede={intro} reveal>
      <Wall pieces={pieces} series={series} />
      <Room pieces={pieces} series={series} wall="drawings-wall" />
    </Section>
  );
}
