import Image from 'next/image';
import ThroughTheM from '@/components/hero/ThroughTheM';
import { aboutSection as about } from '@/content/about';

/**
 * About — right after the hero: a portrait, his paragraph, what he's into, and
 * a strip of more photos. Built from the kit's page primitives (lu-section,
 * lu-page, lu-kicker, lu-title) with photo frames styled like the kit's shots.
 *
 * The portrait is where the opening lands: the hero's M fills with this photo,
 * grows until it covers the screen, and then settles into this frame as the
 * section scrolls in (ThroughTheM). Without that — no script, reduced motion —
 * the section simply scrolls in like any other.
 */
export default function About() {
  const [portrait, ...more] = about.photos;
  return (
    <section className="lu-section about" id="about" aria-labelledby="about-title">
      <div className="lu-page about-grid">
        <figure className="about-portrait" data-about-portrait="">
          <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 760px) 100vw, 460px" priority />
        </figure>
        <div className="about-text">
          <p className="lu-kicker">{about.kicker}</p>
          <h2 className="lu-title" id="about-title">
            {about.title}
          </h2>
          <p className="about-paragraph">{about.paragraph}</p>
          <p className="about-interests">
            <span className="lu-kicker">Also into</span>
            {about.interests.join(' · ')}
          </p>
          <ul className="about-strip" aria-label="More photos">
            {more.map((ph) => (
              <li key={ph.src}>
                <Image src={ph.src} alt={ph.alt} width={ph.width} height={ph.height} sizes="(max-width: 760px) 45vw, 160px" loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The opening's last act: the photo seen through the M, then the photo settling into the portrait. */}
      <div className="mwin" aria-hidden="true" data-mwin="">
        <svg className="mwin-svg" data-mwin-svg="">
          <defs>
            {/* A clipPath may hold text but not groups: the glyph carries the whole transform itself. */}
            <clipPath id="mwin-clip">
              <text data-mwin-glyph="" textAnchor="middle">
                {'∑'}
              </text>
            </clipPath>
          </defs>
          <image href={portrait.src} preserveAspectRatio="xMidYMid slice" clipPath="url(#mwin-clip)" data-mwin-image="" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed overlay that must match the SVG image pixel for pixel */}
        <img className="mwin-img" src={portrait.src} alt="" data-mwin-img="" />
      </div>
      <ThroughTheM />
    </section>
  );
}
