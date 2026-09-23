import ArtGallery, { type Drawing } from '@/components/lucent/ArtGallery';
import Section from '@/components/lucent/Section';
import { intro, pieces, series } from '@/content/art';
import { sections } from '@/content/site';

const { drawings } = sections;

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/**
 * Drawings — artwork is content, so it hangs on paper mats and never goes under
 * glass. Standalone pieces first, then the Godfall series panel by panel.
 */
export default function Drawings() {
  const items: Drawing[] = [
    ...pieces.map((p) => ({
      title: p.title,
      caption: `${p.medium} · ${p.year}`,
      note: [`${p.medium}, ${p.year}.`, p.note, p.exhibition && `${p.exhibition}.`].filter(Boolean).join(' '),
      src: p.image,
      width: p.width,
      height: p.height,
      alt: `${p.title}, ${p.medium.toLowerCase()}, ${p.year}`,
    })),
    ...series.panels.map((panel, i) => {
      const title = `${series.title}, ${ROMAN[i]}`;
      return {
        title,
        caption: `${series.medium} · ${series.year}`,
        note: `${series.medium}, ${series.year}. Panel ${i + 1} of ${series.panels.length} in the ${series.title} series. ${series.note}`,
        src: panel.image,
        width: panel.width,
        height: panel.height,
        alt: `${title}, ${series.medium.toLowerCase()}, ${series.year}`,
      };
    }),
  ];

  return (
    <Section id={drawings.id} kicker={drawings.kicker} title={drawings.title} lede={intro} reveal>
      <ArtGallery items={items} />
    </Section>
  );
}
