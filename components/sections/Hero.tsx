import AgentTrace from '@/components/hero/AgentTrace';
import CopyEmail from '@/components/ui/CopyEmail';
import { identity, hero } from '@/content/site';

/* Hero per design/SECTIONS.md §1, as amended in §0.
   Eyebrow · name · ONE mechanism sentence · CTAs · signature.

   Deliberately absent: any availability line, any graduation date, any Résumé
   link. He is not job hunting, the grad date moved and is unknown, and
   public/resume.pdf is stale — see §0.

   The name is plain server-rendered DOM and is the LCP element. Its entrance is
   a CSS mask reveal rather than JS, so it paints on the first frame and never
   waits for hydration. */

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex max-w-6xl flex-col justify-center px-6 pt-10 pb-24 sm:px-10 sm:pt-16 lg:min-h-[86vh] lg:pb-32"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          {/* eyebrow */}
          <p
            className="rise font-mono text-[11px] tracking-[0.2em] text-n-9 uppercase"
            style={{ animationDelay: '60ms' }}
          >
            {hero.eyebrow}
          </p>

          {/* name — LCP */}
          <h1
            className="mt-5 font-semibold text-ink"
            style={{
              fontSize: 'clamp(3rem, 8.5vw, 6.25rem)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tracking-72)',
            }}
          >
            <span className="reveal">
              <span style={{ animationDelay: '120ms' }}>Mahyar</span>
            </span>
            <span className="reveal">
              <span style={{ animationDelay: '220ms' }}>Jaberi</span>
            </span>
          </h1>

          {/* the one argument */}
          <p
            className="rise mt-7 max-w-xl text-lg leading-relaxed text-n-10 sm:text-xl"
            style={{
              animationDelay: '360ms',
              letterSpacing: 'var(--tracking-20)',
            }}
          >
            {hero.tagline}
          </p>

          {/* Credential, not availability — it states a fact instead of making
              a request, and it is the only line above the fold that someone
              other than Mahyar can vouch for. */}
          <p
            className="rise mt-6 flex items-center gap-2.5 text-sm text-n-10"
            style={{ animationDelay: '460ms' }}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-olive" />
            <span>{hero.credential}</span>
          </p>

          {/* actions */}
          <div
            className="rise mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '560ms' }}
          >
            <a
              href="#work"
              className="btn-press sq inline-flex h-11 items-center gap-2 rounded-pill bg-a-9 px-5 text-[15px] font-medium text-white shadow-e1 hover:bg-a-10 hover:shadow-e2"
            >
              <span>View work</span>
              <span className="transition-transform group-hover:translate-x-1">
                <Arrow />
              </span>
            </a>

            <CopyEmail email={identity.email} />

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-n-6" />

            {identity.socials
              .filter((s) => s.label !== 'Email' && s.status === 'live')
              .map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-draw text-sm text-n-10 hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
          </div>
        </div>

        {/* signature */}
        <div className="rise lg:pl-4" style={{ animationDelay: '680ms' }}>
          <AgentTrace />
          <p className="mt-3 pl-1 font-mono text-[11px] leading-relaxed text-n-9">
            Real tool names from MoneyMind&rsquo;s agent. Results show shape, not a transcript.
          </p>
        </div>
      </div>
    </section>
  );
}
