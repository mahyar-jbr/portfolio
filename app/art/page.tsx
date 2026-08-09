import Link from 'next/link';
import { Slot, Lines, Media, SectionShell } from '@/components/wireframe/Box';

/* GREYBOX — /art. Six units, not ten: five titled standalone pieces plus one
   five-panel series (design/SECTIONS.md §3.4). Reached from the nav, ordered
   last; appears nowhere in the homepage scroll (§4). */

const STANDALONE = [
  // Aurora CITY HALL — data/artwork.js says "Aurora Art Gallery" and is wrong.
  { title: 'Nightmare', credit: 'Aurora City Hall', timelapse: false },
  { title: 'What Remains', credit: null, timelapse: true },
  { title: 'Coronation', credit: null, timelapse: true },
  { title: 'The Pilgrim', credit: null, timelapse: true },
  { title: 'Fracture', credit: null, timelapse: true },
];

export default function Art() {
  return (
    <div className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-n-9 uppercase hover:text-ink"
        >
          ← Home
        </Link>

        <div className="mt-10 flex flex-col gap-6">
          <Slot label="H1">
            <Lines count={1} widths={['28%']} size="lg" />
          </Slot>
          <Slot
            label="Framing sentence — ONE"
            note="The page's whole job is to be self-evidently a practice, not a hobby. One line, then get out of the way."
          >
            <Lines count={1} widths={['72%']} />
          </Slot>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <SectionShell
          title="Pieces"
          id="pieces"
          note="Nightmare leads — institutional proof is the scarcer signal, and it is the only piece with an exhibition credit. The four timelapse pieces sit one row down so authorship proof is never more than one scroll away (§6.6)."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {STANDALONE.map((p) => (
              <Slot
                key={p.title}
                label={p.title}
                note={
                  p.credit
                    ? `credit: ${p.credit}`
                    : p.timelapse
                      ? 'has process video — surface the affordance'
                      : undefined
                }
              >
                <div className="flex flex-col gap-3">
                  <Media label="artwork" ratio="aspect-[4/5]" />
                  <div className="flex items-center justify-between">
                    <Lines count={1} widths={['54%']} size="sm" />
                    {p.timelapse && (
                      <span className="font-mono text-[9px] tracking-widest text-n-9 uppercase">
                        ▶ timelapse
                      </span>
                    )}
                  </div>
                </div>
              </Slot>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          title="Godfall — series"
          id="godfall"
          note="ONE unit with five panels, not five entries. Drop the 'Grade 12 CPT Project' credit currently in data/artwork.js:106 — keep the medium and year (§6.5)."
        >
          <Slot label="Godfall — 5 panels">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Media key={i} label={`${i + 1}`} ratio="aspect-[3/4]" />
              ))}
            </div>
          </Slot>
        </SectionShell>
      </div>
    </div>
  );
}
