/**
 * Footer — the page's small print, on every page: who and when, where he is
 * based, and a way back to the top. Nothing else earns a place: the nav capsule
 * is always on screen, and the ways to reach him are the Contact tiles right
 * above (and one tap away, through the nav, from a case study).
 *
 * "Back to top" is a plain link to #top, so it holds with scripts blocked and
 * the browser moves focus along with the view: #top is the hero on the home
 * page, and on any other page, where nothing has that id, the browser takes it
 * to mean the top of the document. It jumps rather than scrolls: a smooth ride
 * back up would play the whole page past, the pinned About story included.
 */
export default function Footer({ name, year, location }: { name: string; year: number; location: string }) {
  return (
    <footer className="lu-footer site-footer">
      <div className="lu-page">
        <div className="site-footer-row">
          <p>
            © {year} {name} · {location}
          </p>
          <a className="site-footer-top" href="#top">
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
