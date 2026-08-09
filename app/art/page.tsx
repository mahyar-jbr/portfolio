import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import { intro, pieces, series } from '@/content/art';

export const metadata: Metadata = {
  title: 'Art — Mahyar Jaberi',
  description: 'Ink and digital work, 2022–2025.',
};

/* /art — a sibling page, reached from the nav, ordered last.
   It appears NOWHERE in the homepage scroll: of 18 acclaimed engineer sites
   fetched during research, not one puts a non-code creative practice in the
   main scroll, and the three that showcase one all chose a sibling page.

   The accent drops to near-zero chroma on this page (see globals.css). A
   tightly-branded accent is exactly what clashes with original full-colour
   work, so the system gets out of the way here. */

export default function Art() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 pb-28 sm:px-10 sm:pt-10" data-surface="art">
      <Link
        href="/"
        className="u-draw inline-block font-mono text-[11px] tracking-[0.16em] text-n-9 uppercase hover:text-ink"
      >
        ← Home
      </Link>

      <header className="mt-10 mb-16 sm:mb-20">
        <h1
          className="text-[clamp(2.5rem,7vw,4rem)] leading-[1.04] font-semibold text-ink"
          style={{ letterSpacing: 'var(--tracking-48)' }}
        >
          Art
        </h1>
        <p
          className="mt-5 max-w-2xl text-lg leading-relaxed text-n-10"
          style={{ letterSpacing: 'var(--tracking-18)' }}
        >
          {intro}
        </p>
      </header>

      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
        {pieces.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 70}>
            <figure className="m-0">
              <div
                className="sq relative overflow-hidden rounded-lg border border-n-6 bg-n-3"
                style={{ aspectRatio: String(p.aspect) }}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 92vw, 46vw"
                  className="object-cover"
                  /* Only the first two are above the fold on any realistic
                     viewport; the rest stay lazy so a 40MB gallery doesn't
                     block the page. */
                  priority={i < 2}
                />
              </div>

              <figcaption className="mt-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-lg font-medium text-ink">{p.title}</h2>
                  <span className="font-mono text-[11px] text-n-9">
                    {p.medium} · {p.year}
                  </span>
                  {p.timelapse && (
                    <a
                      href={p.timelapse}
                      target="_blank"
                      rel="noopener noreferrer"
                      /* Process video is the authorship proof for digital work.
                         Linked rather than embedded — the four timelapses total
                         ~30MB and none of them should load unasked. */
                      className="u-draw font-mono text-[11px] text-a-11"
                    >
                      ▶ process
                    </a>
                  )}
                </div>
                {p.exhibition && (
                  <p className="mt-1.5 font-mono text-[11px] text-olive">
                    {p.exhibition}
                  </p>
                )}
                {p.note && (
                  <p className="mt-2 text-[15px] leading-relaxed text-n-10 italic">
                    {p.note}
                  </p>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* One unit with five panels, not five entries. */}
      <Reveal>
        <section className="mt-20 border-t border-n-5 pt-14">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-medium text-ink">{series.title}</h2>
            <span className="font-mono text-[11px] text-n-9">
              {series.medium} · {series.year} · five-panel series
            </span>
          </div>
          {series.note && (
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-n-10 italic">
              {series.note}
            </p>
          )}

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {series.panels.map((src, i) => (
              <div
                key={src}
                className="sq relative aspect-[3/4] overflow-hidden rounded-md border border-n-6 bg-n-3"
              >
                <Image
                  src={src}
                  alt={`${series.title}, panel ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, 19vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
