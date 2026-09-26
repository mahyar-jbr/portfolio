import BrandIcon, { brandFor } from './BrandIcon';
import CopyEmail from './CopyEmail';
import LinkOut from './LinkOut';

/**
 * ContactTiles — each way to reach him as a small tile with its own glyph instead
 * of a plain text link: Gmail's, GitHub's and LinkedIn's own marks, and a page
 * for the resume. The marks are the brands' official ones in their own colours
 * (BrandIcon), as the kit allows, never drawings of them; the page is line art
 * in currentColor.
 *
 * Email leads: the one ink tile (is-primary), twice as wide as the others where
 * there is room, so the address itself fits on it at a size you can read. It
 * shows Gmail's mark because the address is a Gmail one (Mahyar, 2026-09-23),
 * and any other address gets the kit's envelope back.
 *
 * The tile is not one button, as the kit's is, because it holds two ways in:
 * - the address, a mailto: link: it writes an email where a mail app is set up,
 *   it is there to read or type on another device, and its own context menu
 *   (right-click, a long press) offers to copy it. It works with scripts blocked.
 *   On a touch screen it reaches over the rest of the tile (styles/site.css).
 * - Copy, where the tile's arrow would be (CopyEmail): it copies the address,
 *   says "Copied" on itself and shows the kit's "Email copied" toast, or, if the
 *   clipboard is refused, shows the address itself. It needs the kit's runtime,
 *   so it only appears once Lucent.auto() has wired it: not with scripts
 *   blocked, nor if the bundle fails to load.
 *
 * The other tiles are LinkOuts: GitHub and LinkedIn open in a new tab and say so
 * to screen readers; the tile's own ↗ is the sighted cue, so LinkOut adds none.
 */
export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

function GlyphFor({ label }: { label: string }) {
  const brand = brandFor(label);
  if (brand) return <BrandIcon name={brand} />;
  /* Resume */
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 3h13l9 9v23a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M24 3v9h9" />
      <path d="M14 20h13M14 25h13M14 30h8" strokeOpacity=".5" />
    </svg>
  );
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
  email: { label: string; address: string };
  links: ContactLink[];
}) {
  const [user, domain] = email.address.split('@');
  return (
    <div className="lu-contact site-contact">
      <div className="lu-contact-tile is-primary contact-email">
        <span className="lu-contact-glyph">
          {/@gmail\.com$/i.test(email.address) ? (
            <BrandIcon name="gmail" />
          ) : (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="8" width="34" height="25" rx="5" />
              <path className="lu-glyph-flap" d="M5 11l15 11 15-11" />
            </svg>
          )}
        </span>
        <span className="lu-contact-label">{email.label}</span>
        <a className="contact-address" href={`mailto:${email.address}`}>
          {/* if it must wrap (large text), it wraps at the @, not mid-name */}
          {user}
          <wbr />@{domain}
        </a>
        {/* last in the source, drawn in the top corner (styles/site.css): a screen
            reader hears "Email", the address, then Copy, and Tab reaches the
            address, the way in that always works, before the extra */}
        <CopyEmail address={email.address} />
      </div>
      {links.map((l) => (
        <LinkOut
          className="lu-contact-tile"
          href={l.href}
          key={l.label}
          aria-label={`${l.label}: ${l.value}`}
          arrow={false}
        >
          <span className="lu-contact-glyph">
            <GlyphFor label={l.label} />
          </span>
          <Go />
          <span className="lu-contact-label">{l.label}</span>
          <span className="lu-contact-value">{l.value}</span>
        </LinkOut>
      ))}
    </div>
  );
}
