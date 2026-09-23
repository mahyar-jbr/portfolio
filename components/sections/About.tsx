import Image from 'next/image';
import type { CSSProperties } from 'react';
import StoryScroll from '@/components/about/StoryScroll';
import BrandIcon, { brandFor } from '@/components/lucent/BrandIcon';
import Glyph, { type GlyphName } from '@/components/lucent/Glyph';
import { aboutSection as about, type StoryPhoto } from '@/content/about';

/**
 * About — a short story: Travel, Play, Train, Build, then a coda with his
 * paragraph (order and why: content/about.ts). Built from the kit's page primitives; photo frames
 * are styled like the kit's shots.
 *
 * One set of markup, two layouts (styles/site.css "About"):
 * - Pinned (desktop, with scripts and motion): a frame on the left, the text on
 *   the right. The section holds while the page scrolls through it; each step's
 *   photo cross-fades into the frame as its line takes over, under the kit's
 *   Liquid Glass segmented control (Travel · Play · Train · Build), whose lens
 *   follows along and can be used to jump between steps (StoryScroll). Each
 *   photo carries a small glass caption, like Apple Photos Memories. The coda turns the frame
 *   into a contact sheet of every photo beside the paragraph.
 * - Resting (phones, reduced motion, no script): the same story as a plain
 *   sequence — photo, line; photo, line — then the paragraph.
 *
 * It arrives the way every section does: as it scrolls into view, each part
 * rises in (the kit's data-reveal).
 */
const CAPTION_GLYPH: Record<StoryPhoto['caption']['kind'], GlyphName> = {
  place: 'pin',
  sport: 'tennis-ball',
  training: 'dumbbell',
  event: 'flag',
};

export default function About() {
  const { chapters } = about;
  const coda = chapters.length;
  const every = chapters.flatMap((c) => c.photos);
  const step = (i: number) => ({ '--i': i }) as CSSProperties;

  return (
    <section className="lu-section about" id="about" aria-labelledby="about-title" data-story="">
      <div className="about-stage" style={{ '--steps': coda + 1 } as CSSProperties}>
        <div className="about-sticky">
          <div className="lu-page story">
            <div className="story-media" data-reveal="">
              {chapters.map((c, i) => (
                <figure
                  key={c.id}
                  className={c.photos.length > 1 ? 'story-fig is-pair' : 'story-fig'}
                  data-step={i}
                  data-reveal=""
                  style={step(i)}
                >
                  {c.photos.map((ph) => {
                    /* an event named for a brand (OpenAI) carries its real mark instead of the flag */
                    const brand = brandFor(ph.caption.text);
                    return (
                      <span className="story-ph" key={ph.src}>
                        <Image
                          src={ph.src}
                          alt={ph.alt}
                          fill
                          sizes="(max-width: 760px) 100vw, 480px"
                          priority={i === 0}
                          style={{ objectPosition: ph.position }}
                        />
                        {/* Liquid Glass over the photo: where, or what (kit: glass belongs over imagery) */}
                        <span className="story-cap lu-glass is-clear">
                          {brand ? <BrandIcon name={brand} /> : <Glyph name={CAPTION_GLYPH[ph.caption.kind]} />}
                          {ph.caption.text}
                        </span>
                      </span>
                    );
                  })}
                </figure>
              ))}
              {/* the coda: every photo at once, like a contact sheet */}
              <figure className="story-fig is-sheet" data-step={coda} style={step(coda)} aria-hidden="true">
                {every.map((ph) => (
                  <span className="story-ph" key={ph.src}>
                    <Image src={ph.src} alt="" fill sizes="240px" style={{ objectPosition: ph.position }} />
                  </span>
                ))}
              </figure>
            </div>

            <div className="story-texts">
              <div className="story-head" data-reveal="">
                <p className="lu-kicker">{about.kicker}</p>
                <h2 className="lu-title" id="about-title">
                  {about.title}
                </h2>
              </div>
              {/* the kit's Liquid Glass segmented control: its lens follows the story as
                  it scrolls, and choosing a step scrolls the story there (StoryScroll) */}
              <div className="lu-seg story-seg" role="radiogroup" aria-label="Story">
                {chapters.map((c, i) => (
                  <button key={c.id} type="button" className="lu-seg-item" role="radio" aria-checked={i === 0} data-value={i}>
                    {c.label}
                  </button>
                ))}
              </div>
              {chapters.map((c, i) => (
                <div key={c.id} className="story-text" data-step={i} data-reveal="" style={step(i)}>
                  <p className="lu-kicker">{c.label}</p>
                  <p className="story-line">{c.line}</p>
                </div>
              ))}
              <div className="story-text is-coda" data-step={coda} data-reveal="" style={step(coda)}>
                <p className="story-paragraph">{about.paragraph}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoryScroll />
    </section>
  );
}
