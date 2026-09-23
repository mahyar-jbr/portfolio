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
 * Six units, not ten: five titled standalone pieces plus Godfall, which is one
 * five-panel series rather than five separate entries.
 */

export interface ArtPiece {
  title: string;
  medium: string;
  year: string;
  image: string;
  /** Intrinsic pixel size, so the gallery reserves the right space before load. */
  width: number;
  height: number;
  timelapse?: string;
  exhibition?: string;
  note?: string;
}

export const intro =
  'Ink and digital work, mostly made between 2022 and 2025. There is less time for it now — most of that energy goes into what I build instead.';

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
    title: 'What Remains',
    medium: 'Digital',
    year: '2025',
    image: '/artwork/art-2.png',
    width: 2480,
    height: 3508,
    timelapse: '/artwork/art-2-timelaps.mp4',
    note: 'Power doesn’t corrupt. It empties.',
  },
  {
    title: 'Coronation',
    medium: 'Digital',
    year: '2023',
    image: '/artwork/art-3.jpg',
    width: 1577,
    height: 1955,
    timelapse: '/artwork/art-3-timelaps.mp4',
    note: 'They forged him a crown. He forged himself into a weapon.',
  },
  {
    title: 'The Pilgrim',
    medium: 'Digital',
    year: '2024',
    image: '/artwork/art-4.jpg',
    width: 2388,
    height: 1668,
    timelapse: '/artwork/art-4-timelaps.mp4',
    note: 'Some paths only open when you stop looking back.',
  },
  {
    title: 'Fracture',
    medium: 'Digital',
    year: '2025',
    image: '/artwork/art-10.png',
    width: 1478,
    height: 1150,
    timelapse: '/artwork/art-10-timelaps.mp4',
    note: 'Half of him wanted to be saved. The other half already won.',
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
