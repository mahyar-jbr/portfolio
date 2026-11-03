import type { AnchorHTMLAttributes } from 'react';
import Glyph from './Glyph';

/**
 * LinkOut — a plain <a> for a link the site's router doesn't take: another site
 * (GitHub, LinkedIn, a project's live site or repo) or a file (the resume PDF).
 *
 * Links to other sites open in a new tab (Mahyar, 2026-09-23), so a visitor who
 * checks his GitHub still has the portfolio open behind it. rel="noopener
 * noreferrer" keeps the new tab from reaching back into this one through
 * window.opener, and from being told which page sent it. It is plain HTML, so
 * it holds with scripts blocked too. The change of tab is announced: screen
 * readers hear "(opens in a new tab)" after the name, and sighted visitors see
 * the arrow out after the label.
 *
 * A file on this site that is there to keep, the resume, comes with `download`
 * (the name it saves as): it downloads, and where a browser won't download
 * (some in-app browsers), it opens in a new tab rather than in place of the
 * portfolio (Mahyar, 2026-11-02). Screen readers hear "(downloads)" unless the
 * link's own label already says so.
 *
 * Everything else (mailto:) stays a plain link in the same tab. TransitionLink
 * hands any off-site href here, so every link on the site follows these rules.
 */

const NEW_TAB_NOTE = '(opens in a new tab)';

/**
 * True when href leaves the site: an absolute web address. The site links to its
 * own pages by path (/work/…, #contact), so any http(s) or protocol-relative URL
 * is somewhere else. Decided from the string alone, so the server and the
 * browser always agree.
 */
export function isOffsite(href: string): boolean {
  return /^(?:https?:)?\/\//i.test(href.trim());
}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  /** Draws the arrow out after the label. Off where the design has its own (a contact tile's ↗). */
  arrow?: boolean;
};

export default function LinkOut({ href, arrow = true, children, 'aria-label': label, ...rest }: Props) {
  if (!isOffsite(href)) {
    const file = rest.download !== undefined;
    return (
      <a href={href} aria-label={label} {...rest} {...(file && { target: '_blank', rel: 'noopener' })}>
        {children}
        {file && !label && <span className="sr-only"> (downloads)</span>}
      </a>
    );
  }
  return (
    <a
      href={href}
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      /* an aria-label replaces the content, so the note joins the label instead */
      aria-label={label ? `${label} ${NEW_TAB_NOTE}` : undefined}
    >
      {children}
      {arrow && <Glyph name="arrow-up-right" className="site-out" />}
      {!label && <span className="sr-only">{` ${NEW_TAB_NOTE}`}</span>}
    </a>
  );
}
