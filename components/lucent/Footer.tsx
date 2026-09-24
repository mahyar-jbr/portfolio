/**
 * Footer — the page's small print, on every page: who and when, where he is
 * based, and a way back to the top. Nothing else earns a place: the nav capsule
 * is always on screen, and the ways to reach him are the Contact tiles right
 * above (and one tap away, through the nav, from a case study).
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
export default function Footer({ name, year, location }: { name: string; year: number; location: string }) {
  return (
    <footer className="lu-footer site-footer">
      <div className="lu-page">
        <div className="site-footer-row">
          <p>
            © {year} {name} · {location}
          </p>
          <a className="site-footer-top" href="#main">
            Back to top
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
