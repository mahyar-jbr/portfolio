import { coop } from '@/content/coop';
import TransitionLink from './TransitionLink';

/**
 * Footer — the page's small print, on every page: who, his email, when the site
 * was last updated, and a way back to the top (the email and the date since
 * 2026-11-02, for the COOP 2100 ePortfolio). The email is plain selectable text,
 * as on the Contact tile. The date is content/site.ts's `lastUpdated`, read as a
 * calendar day (UTC), so no time zone moves it to the day before.
 *
 * Each fact stays whole on a narrow screen (styles/site.css, "Footer"), so a
 * line breaks between them and never inside the address or the date.
 *
 * Beside Back to top, in its style, is the one link to the Co-op ePortfolio
 * (/coop, his COOP 2100 ePortfolio, 2026-11-05). The two keep together: at the
 * right on a wide screen, under the facts where they stack (styles/site.css,
 * "Co-op ePortfolio").
 *
 * "Back to top" is a plain link to #main, the page's <main> (app/layout.tsx), so
 * it holds with scripts blocked and keyboard users go up with the view: landing
 * on an element that exists moves the browser's Tab starting point there, and
 * the next Tab reaches the first control of the page. Not #top: only the home
 * page's hero has that id, and elsewhere the browser scrolls to the top for it
 * but leaves Tab where it was, at the bottom. It jumps rather than scrolls: a
 * smooth ride back up would play the whole page past, the pinned About story
 * included.
 */
const UPDATED = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });

export default function Footer({
  name,
  year,
  email,
  updated,
}: {
  name: string;
  year: number;
  email: string;
  /** YYYY-MM-DD */
  updated: string;
}) {
  return (
    <footer className="lu-footer site-footer">
      <div className="lu-page">
        <div className="site-footer-row">
          <p className="site-footer-facts">
            <span>
              © {year} {name} ·
            </span>{' '}
            <span>{email} ·</span>{' '}
            <span>
              Last updated <time dateTime={updated}>{UPDATED.format(new Date(`${updated}T00:00:00Z`))}</time>
            </span>
          </p>
          <div className="site-footer-links">
            <TransitionLink className="site-footer-top site-footer-coop" href={coop.href}>
              {coop.title}
            </TransitionLink>
            <a className="site-footer-top" href="#main">
              Back to top
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
