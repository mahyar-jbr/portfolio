/**
 * ContactTiles — each way to reach him as a small tile with its own glyph instead
 * of a plain text link: an envelope for email (its flap lifts on hover), a
 * contribution grid for GitHub, a profile card for LinkedIn, a page for the
 * resume. Glyphs are line art in currentColor, never hand-drawn company logos.
 *
 * The email tile is the one ink tile (is-primary): Lucent.auto() copies the
 * address and shows the "Email copied" toast, or shows the address itself if the
 * clipboard is refused.
 */
export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

const GRID_OPACITY = [
  0.18, 0.45, 1, 0.3, 0.7, 0.5, 0.18, 0.8, 1, 0.3, 1, 0.6, 0.3, 0.18, 0.9, 0.3, 0.9, 0.5, 0.7, 0.18, 0.7, 0.3, 1, 0.45, 0.6,
];

function GlyphFor({ label }: { label: string }) {
  const common = { viewBox: '0 0 40 40', 'aria-hidden': true } as const;
  switch (label) {
    case 'GitHub':
      return (
        <svg {...common}>
          {GRID_OPACITY.map((o, i) => (
            <rect key={i} x={1 + (i % 5) * 8} y={1 + Math.floor(i / 5) * 8} width="6" height="6" rx="1.6" fill="currentColor" fillOpacity={o} />
          ))}
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="7" width="34" height="26" rx="5" />
          <circle cx="13" cy="17" r="4" fill="currentColor" stroke="none" />
          <path d="M21 15h10M21 20h7" />
          <path d="M9 27h22" strokeOpacity=".4" />
        </svg>
      );
    default: /* Resume */
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 3h13l9 9v23a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M24 3v9h9" />
          <path d="M14 20h13M14 25h13M14 30h8" strokeOpacity=".5" />
        </svg>
      );
  }
}

function Go() {
  return (
    <svg className="lu-contact-go" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
  );
}

export default function ContactTiles({
  email,
  links,
}: {
  email: { label: string; value: string; address: string };
  links: ContactLink[];
}) {
  return (
    <div className="lu-contact">
      <button
        type="button"
        className="lu-contact-tile is-primary"
        data-copy={email.address}
        data-toast="Email copied"
        aria-label={`Copy email address ${email.address}`}
      >
        <span className="lu-contact-glyph">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="8" width="34" height="25" rx="5" />
            <path className="lu-glyph-flap" d="M5 11l15 11 15-11" />
          </svg>
        </span>
        <span className="lu-contact-label">{email.label}</span>
        <span className="lu-contact-value">{email.value}</span>
      </button>
      {links.map((l) => (
        <a className="lu-contact-tile" href={l.href} key={l.label} aria-label={`${l.label}: ${l.value}`}>
          <span className="lu-contact-glyph">
            <GlyphFor label={l.label} />
          </span>
          <Go />
          <span className="lu-contact-label">{l.label}</span>
          <span className="lu-contact-value">{l.value}</span>
        </a>
      ))}
    </div>
  );
}
