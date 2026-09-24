import Image from 'next/image';
import { Fragment, type CSSProperties } from 'react';
import type { ArtPiece } from '@/content/art';
import type { Series } from './shared';

/**
 * The wall: the drawings hung on the line, the way a gallery hangs a room.
 * Each piece sits on its paper mat at its own aspect ratio, never cropped, and
 * the pieces in a row share one height, so their tops and feet line up and
 * nothing is left over at the ends (each takes width in proportion to its
 * aspect ratio: site.css, Drawings). Portraits hang together, then the two
 * landscapes; on phones two to a row, and the last one on its own.
 *
 * Godfall closes the wall as what it is: one work, a story in five panels, on
 * one sheet in reading order, numbered as it is read (the same numbers the
 * story reader counts in). The whole sheet is a
 * single entry that opens the story at the panel you tapped (the first, from
 * the keyboard).
 *
 * The markup is complete without scripts: every piece and every panel shows,
 * in order, with its caption. Room adds the opened view.
 */

/** Where the rows break: after these pieces on wide screens, and on phones. */
const BREAK_WIDE = [2];
const BREAK_PHONE = [1, 3];
/** And the strip: its panels in one row, or two on phones. */
const STRIP_BREAK_PHONE = 1;

/** The page column (Lucent .lu-page) at its widest, and the wall's gaps and mats (site.css, Drawings), in px. */
const COLUMN = 1152;
const GAP_WIDE = 24;
const GAP_PHONE = 12;
const MAT = 10;
const STRIP_PAD = 12;
const STRIP_GAP = 8;

/* AVIF at 65 holds these line drawings as they hang on the wall (checked at 1.5x against 75: the
   hatching survives; at 55 it starts to smooth over) and weighs a fifth less. The room shows 85. */
const WALL_QUALITY = 65;

const ratio = (w: number, h: number) => w / h;

/** Splits indices into rows at the given breaks. */
function rowsOf(n: number, breaks: number[]): number[][] {
  const rows: number[][] = [[]];
  for (let i = 0; i < n; i++) {
    rows[rows.length - 1].push(i);
    if (breaks.includes(i) && i < n - 1) rows.push([]);
  }
  return rows;
}

/**
 * Each image's `sizes`, from the row it hangs in: its share of the row is its
 * aspect ratio over the row's, so the browser fetches a thumbnail as wide as
 * it is shown and no wider.
 */
function sizesFor(ars: number[], breaksWide: number[], breaksPhone: number[], gutter: (gap: number, count: number) => number) {
  const share = (breaks: number[], gap: number) => {
    const out: { frac: number; fixed: number }[] = [];
    for (const row of rowsOf(ars.length, breaks)) {
      const sum = row.reduce((a, i) => a + ars[i], 0);
      for (const i of row) out[i] = { frac: ars[i] / sum, fixed: gutter(gap, row.length) };
    }
    return out;
  };
  const wide = share(breaksWide, GAP_WIDE);
  const phone = share(breaksPhone, GAP_PHONE);
  return ars.map((_, i) => {
    const w = wide[i];
    const p = phone[i];
    const px = Math.ceil(w.frac * (COLUMN - w.fixed));
    /* below the widest column the page is 90vw wide (lu-page's 5vw gutters), phones too */
    const fluid = (x: { frac: number; fixed: number }) =>
      `calc(${(x.frac * 90).toFixed(2)}vw - ${Math.floor(x.frac * x.fixed)}px)`;
    return `(max-width: 600px) ${fluid(p)}, (max-width: 1280px) ${fluid(w)}, ${px}px`;
  });
}

export default function Wall({ pieces, series }: { pieces: ArtPiece[]; series: Series }) {
  const pieceArs = pieces.map((p) => ratio(p.width, p.height));
  const pieceSizes = sizesFor(pieceArs, BREAK_WIDE, BREAK_PHONE, (gap, n) => gap * (n - 1) + 2 * MAT * n);
  const panelArs = series.panels.map((p) => ratio(p.width, p.height));
  const panelSizes = sizesFor(panelArs, [], [STRIP_BREAK_PHONE], (_, n) => STRIP_GAP * (n - 1) + 2 * STRIP_PAD);
  const n = series.panels.length;

  return (
    <div className="wall" id="drawings-wall">
      <div className="wall-line" role="list">
        {pieces.map((p, i) => (
          <Fragment key={p.image}>
            <figure className="wall-piece" role="listitem" style={{ '--ar': pieceArs[i].toFixed(4) } as CSSProperties} data-reveal="">
              <button
                type="button"
                className="wall-open"
                data-open="piece"
                data-index={i}
                aria-haspopup="dialog"
                aria-label={`Open ${p.title}`}
              >
                <span className="wall-mat">
                  <Image
                    src={p.image}
                    width={p.width}
                    height={p.height}
                    alt={`${p.title}, ${p.medium.toLowerCase()}, ${p.year}`}
                    sizes={pieceSizes[i]}
                    quality={WALL_QUALITY}
                    loading="lazy"
                  />
                </span>
              </button>
              <figcaption>
                <b>{p.title}</b>
                <span>
                  <span className="wall-medium">{p.medium} · </span>
                  {p.year}
                </span>
              </figcaption>
            </figure>
            {BREAK_WIDE.includes(i) && <span className="wall-break is-wide" aria-hidden="true" />}
            {BREAK_PHONE.includes(i) && <span className="wall-break is-phone" aria-hidden="true" />}
          </Fragment>
        ))}
      </div>

      <figure className="wall-series" data-reveal="">
        <button
          type="button"
          className="wall-open"
          data-open="story"
          aria-haspopup="dialog"
          aria-label={`Read ${series.title}, a story in ${n} panels`}
        >
          <span className="wall-mat wall-strip">
            {series.panels.map((p, k) => (
              <Fragment key={p.image}>
                <span className="strip-panel" style={{ '--ar': panelArs[k].toFixed(4) } as CSSProperties} data-panel={k}>
                  <Image
                    src={p.image}
                    width={p.width}
                    height={p.height}
                    alt={`${series.title}, panel ${k + 1} of ${n}`}
                    sizes={panelSizes[k]}
                    quality={WALL_QUALITY}
                    loading="lazy"
                  />
                  <span className="strip-no" aria-hidden="true">
                    {k + 1}
                  </span>
                </span>
                {k === STRIP_BREAK_PHONE && <span className="strip-break" aria-hidden="true" />}
              </Fragment>
            ))}
          </span>
        </button>
        <figcaption>
          <b>{series.title}</b>
          <span>
            {n} panels<span className="wall-medium"> · {series.medium}</span> · {series.year}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
