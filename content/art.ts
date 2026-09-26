/**
 * Gallery content.
 *
 * Migrated out of the v1 data/artwork.js, with two corrections the content tab
 * flagged:
 *   1. Nightmare was exhibited at AURORA CITY HALL, not "Aurora Art Gallery".
 *      Confirmed by Mahyar 2026-08-08. It is the only exhibited piece.
 *   2. Godfall's credit line read "Grade 12 CPT Project". Dropped entirely —
 *      shipping "Grade 12" anywhere on this site lowers the read. The work
 *      keeps its medium and year, which is all it needed.
 *
 * Seven units, not eleven: six titled standalone pieces plus Godfall, which is
 * one five-panel series rather than five separate entries.
 */

/**
 * A recording of the piece being drawn. `src` is the web copy in
 * public/artwork/web/, re-encoded (2026-09-24, AVFoundation) from Mahyar's
 * original exports (art-N-timelaps.mp4, kept out of the repo since 2026-09-25):
 * H.264 High at constant quality 0.6 (0.58 for The Pilgrim), at
 * the original's own size, no sound, fast start, a keyframe every 2s, under
 * 3 MB each. Coronation's two lone blank frames near the end, an export
 * glitch, hold the frame before instead. `width`, `height` and `duration`
 * (seconds) are the web copy's own.
 */
export interface Timelapse {
  src: string;
  width: number;
  height: number;
  duration: number;
}

export interface ArtPiece {
  title: string;
  medium: string;
  year: string;
  image: string;
  /** Intrinsic pixel size, so the gallery reserves the right space before load. */
  width: number;
  height: number;
  timelapse?: Timelapse;
  exhibition?: string;
  note?: string;
}

export const intro =
  'Ink and digital work, mostly made between 2022 and 2025. There is less time for it now. Most of that energy goes into what I build instead.';

/**
 * In the order they hang (Wall), which the room pages through: for the wall's
 * rhythm, not by year. Two rows of three, each two portraits and a landscape,
 * the second mirroring the first, so the rows come out one height. Nightmare,
 * the exhibited piece, opens the wall and the newest hangs beside it, in the
 * first row seen; the two heavy-inked cloaked figures on the same A4 canvas,
 * Unspoken and What Remains, hang in different rows, and pale Coronation sits
 * between the two dark pieces of the second.
 */
export const pieces: ArtPiece[] = [
  {
    title: 'Nightmare',
    medium: 'Ink on paper',
    year: '2022',
    image: '/artwork/art-1.jpg',
    width: 2391,
    height: 3664,
    exhibition: 'Exhibited at Aurora City Hall',
    note: 'The monsters we’re taught to fear wear the same clothes we do.',
  },
  {
    // Added 2026-09-25 from Mahyar's own export, full size: drawn in greys only, so a greyscale PNG holds it
    // pixel for pixel, with the file's metadata stripped. The year is the file's own date, 4 August 2026.
    title: 'Unspoken',
    medium: 'Digital',
    year: '2026',
    image: '/artwork/art-11.png',
    width: 2480,
    height: 3508,
    note: 'The mask kept him silent. His eyes never learned how.',
  },
  {
    title: 'The Pilgrim',
    medium: 'Digital',
    year: '2024',
    image: '/artwork/art-4.jpg',
    width: 2388,
    height: 1668,
    timelapse: { src: '/artwork/web/art-4-timelapse.mp4', width: 1552, height: 1084, duration: 29.6 },
    note: 'Some paths only open when you stop looking back.',
  },
  {
    title: 'Fracture',
    medium: 'Digital',
    year: '2025',
    image: '/artwork/art-10.png',
    width: 1478,
    height: 1150,
    timelapse: { src: '/artwork/web/art-10-timelapse.mp4', width: 1392, height: 1082, duration: 30.73 },
    note: 'Half of him wanted to be saved. The other half already won.',
  },
  {
    title: 'Coronation',
    medium: 'Digital',
    year: '2023',
    image: '/artwork/art-3.jpg',
    width: 1577,
    height: 1955,
    timelapse: { src: '/artwork/web/art-3-timelapse.mp4', width: 612, height: 780, duration: 29.93 },
    note: 'They forged him a crown. He forged himself into a weapon.',
  },
  {
    title: 'What Remains',
    medium: 'Digital',
    year: '2025',
    image: '/artwork/art-2.png',
    width: 2480,
    height: 3508,
    timelapse: { src: '/artwork/web/art-2-timelapse.mp4', width: 680, height: 960, duration: 29.83 },
    note: 'Power doesn’t corrupt. It empties.',
  },
];

export const series = {
  title: 'Godfall',
  medium: 'Marker on paper',
  year: '2022',
  note: 'He didn’t defeat them. He became what they feared.',
  panels: [
    { image: '/artwork/art-5.png', width: 1246, height: 934 },
    { image: '/artwork/art-6.png', width: 1096, height: 832 },
    { image: '/artwork/art-7.png', width: 469, height: 654 },
    { image: '/artwork/art-8.png', width: 1220, height: 1688 },
    { image: '/artwork/art-9.png', width: 495, height: 368 },
  ],
};
