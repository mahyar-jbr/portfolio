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
 * landscapes. On phones a row has room for two portraits at most: the first
 * two hang as a pair, Coronation hangs alone at their height (a portrait
 * beside a landscape would come out a stamp), and each landscape takes the
 * width.
 *
 * Godfall closes the wall as what it is: one work, a story in five panels, on
 * one sheet in reading order, numbered as it is read (the same numbers the
 * story reader counts in): in one row, in two on phones, and on the narrowest
 * phones as a comic page reads, two, two, then the last, so no panel comes out
 * narrower than about 90px. The whole sheet is a single entry that opens the
 * story at the panel you tapped (the first, from the keyboard).
 *
 * The markup is complete without scripts: every piece and every panel shows,
 * in order, with its caption. Room adds the opened view.
 */

/** Where the rows break: after these pieces on wide screens, and on phones. */
const BREAK_WIDE = [2];
const BREAK_PHONE = [1, 2, 3];
/** And the strip: its panels in one row, two on phones, three on the narrowest. */
const STRIP_BREAKS_PHONE = [1];
const STRIP_BREAKS_NARROW = [1, 3];
/** The widest phone and the widest narrow phone (site.css, Drawings), in px. */
const PHONE = 600;
const NARROW = 430;

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

/** An image's width in its row: `frac` of what the row has once its gaps and mats (`fixed`) are taken off. */
interface Share {
  frac: number;
  fixed: number;
  /** a portrait alone in its row: the most its mat may take, so it hangs at the height of the row above */
  cap?: string;
}

/**
 * How each image hangs, row by row: its share of a row is its aspect ratio
 * over the row's, so a row comes out one height. A portrait alone in its row
 * would fill the width and tower over the rest, so it takes the row above's
 * height instead, centred on the line.
 */
function hang(
  ars: number[],
  breaks: number[],
  gap: number,
  gutter: (gap: number, count: number) => number,
  mat: number,
) {
  const out: Share[] = [];
  let above: { sum: number; fixed: number } | null = null;
  for (const row of rowsOf(ars.length, breaks)) {
    const sum = row.reduce((a, i) => a + ars[i], 0);
    const fixed = gutter(gap, row.length);
    if (row.length === 1 && ars[row[0]] < 1 && above) {
      const frac = ars[row[0]] / above.sum;
      const cap = `calc((100% - ${above.fixed}px) * ${frac.toFixed(4)} + ${2 * mat}px)`;
      out[row[0]] = { frac, fixed: above.fixed, cap };
      continue;
    }
    for (const i of row) out[i] = { frac: ars[i] / sum, fixed };
    above = { sum, fixed };
  }
  return out;
}

/**
 * Each image's `sizes`, from the row it hangs in at each width, so the
 * browser fetches a thumbnail as wide as it is shown and no wider. `tiers`
 * run from the narrowest screens up, each to its max width; `wide` is how it
 * hangs above them.
 */
function sizesFor(tiers: { upTo: number; shares: Share[] }[], wide: Share[]) {
  /* below the widest column the page is 90vw wide (lu-page's 5vw gutters), phones too */
  const fluid = (x: Share) => `calc(${(x.frac * 90).toFixed(2)}vw - ${Math.floor(x.frac * x.fixed)}px)`;
  return wide.map((w, i) => {
    const px = Math.ceil(w.frac * (COLUMN - w.fixed));
    const below = tiers.map((t) => `(max-width: ${t.upTo}px) ${fluid(t.shares[i])}`);
    return [...below, `(max-width: 1280px) ${fluid(w)}`, `${px}px`].join(', ');
  });
}

export default function Wall({ pieces, series }: { pieces: ArtPiece[]; series: Series }) {
  const pieceArs = pieces.map((p) => ratio(p.width, p.height));
  const matted = (gap: number, n: number) => gap * (n - 1) + 2 * MAT * n;
  const piecePhone = hang(pieceArs, BREAK_PHONE, GAP_PHONE, matted, MAT);
  const pieceSizes = sizesFor([{ upTo: PHONE, shares: piecePhone }], hang(pieceArs, BREAK_WIDE, GAP_WIDE, matted, MAT));
  const panelArs = series.panels.map((p) => ratio(p.width, p.height));
  const onSheet = (gap: number, n: number) => gap * (n - 1) + 2 * STRIP_PAD;
  const panelSizes = sizesFor(
    [
      { upTo: NARROW, shares: hang(panelArs, STRIP_BREAKS_NARROW, STRIP_GAP, onSheet, 0) },
      { upTo: PHONE, shares: hang(panelArs, STRIP_BREAKS_PHONE, STRIP_GAP, onSheet, 0) },
    ],
    hang(panelArs, [], STRIP_GAP, onSheet, 0),
  );
  const n = series.panels.length;

  return (
    <div className="wall" id="drawings-wall">
      <div className="wall-line" role="list">
        {pieces.map((p, i) => (
          <Fragment key={p.image}>
            <figure
              className="wall-piece"
              role="listitem"
              style={{ '--ar': pieceArs[i].toFixed(4), '--cap': piecePhone[i].cap } as CSSProperties}
              data-cap={piecePhone[i].cap ? '' : undefined}
              data-reveal=""
            >
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
                {STRIP_BREAKS_PHONE.includes(k) ? (
                  <span className="strip-break" aria-hidden="true" />
                ) : (
                  STRIP_BREAKS_NARROW.includes(k) && <span className="strip-break is-narrow" aria-hidden="true" />
                )}
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
