import Button from '@/components/lucent/Button';
import Glyph from '@/components/lucent/Glyph';

export default function NotFound() {
  return (
    <section className="case-hero lu-wall">
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
        </div>
      </div>
    </section>
  );
}
