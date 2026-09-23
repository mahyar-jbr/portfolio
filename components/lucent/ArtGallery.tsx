import Image from 'next/image';

/**
 * ArtGallery — drawings hung on paper: each on a white mat at its own aspect
 * ratio (never cropped, tinted or put under glass), with a one-line caption.
 * Lucent.auto() packs the grid by each piece's height while keeping
 * left-to-right order, and wires the lightbox (grows out of the thumbnail;
 * arrows, swipe and Esc; focus returns to the thumbnail).
 *
 * Images go through next/image, so thumbnails are served as AVIF/WebP at the
 * size the grid needs, and the lightbox gets a ~2000px version (data-full).
 */
export interface Drawing {
  title: string;
  /** "Medium · Year" — the caption's right-hand side. */
  caption: string;
  /** Medium, year and one sentence — the lightbox note. */
  note: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const full = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=2048&q=85`;

export default function ArtGallery({ items }: { items: Drawing[] }) {
  return (
    <div className="lu-gallery">
      {items.map((d) => (
        <figure className="lu-art" key={d.src} data-title={d.title} data-note={d.note} data-full={full(d.src)}>
          <button type="button" className="lu-art-open" aria-label={`Open ${d.title}`}>
            <Image
              src={d.src}
              width={d.width}
              height={d.height}
              alt={d.alt}
              sizes="(max-width: 520px) 100vw, (max-width: 1152px) 34vw, 300px"
              loading="lazy"
            />
          </button>
          <figcaption>
            <b>{d.title}</b>
            <span>{d.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
