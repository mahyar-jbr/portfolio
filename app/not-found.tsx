import type { Metadata } from 'next';
import Button from '@/components/lucent/Button';
import Glyph from '@/components/lucent/Glyph';
import { identity } from '@/content/site';

/* The tab and history entry say the page was missing. */
export const metadata: Metadata = { title: `Page not found · ${identity.fullName}` };

/* The likeliest way here is a stale project link, so besides home it offers
   the work itself. site-404 lets the page centre the message and drop the
   footer's Back to top: the whole page fits one screen (styles/site.css). */
export default function NotFound() {
  return (
    <section className="case-hero lu-wall site-404">
      <div className="lu-page">
        <p className="lu-kicker">404</p>
        <div className="case-title">
          <h1>Nothing here</h1>
        </div>
        <p className="lu-lede">This page moved or never existed.</p>
        <div className="lu-hero-actions">
          <Button variant="filled" href="/">
            <Glyph name="arrow-left" />
            Go home
          </Button>
          <Button variant="glass" href="/#work">
            See the work
          </Button>
        </div>
      </div>
    </section>
  );
}
