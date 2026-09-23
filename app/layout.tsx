import type { Metadata, Viewport } from 'next';
import '@/design-system/lucent/bundle.css';
import '@/styles/tokens.css';
import '@/styles/site.css';
import NavBar from '@/components/lucent/NavBar';
import LucentRuntime from '@/components/lucent/Runtime';
import { identity, meta, sections } from '@/content/site';

/* Sourced from content/site.ts rather than hardcoded. These strings were previously
   duplicated here and had already drifted from the content tab's copy — the tab title,
   the search result and the link preview can disagree for months without anyone
   noticing, because nobody looks at all three at once.

   The favicon is app/icon.svg (the kit's app icon: the mark at 62% in an ink
   squircle); the Open Graph image is app/opengraph-image.tsx. */
export const metadata: Metadata = {
  metadataBase: new URL(`https://${identity.domain}`),
  title: meta.title,
  description: meta.description,
  authors: [{ name: identity.fullName }],
  openGraph: {
    type: 'website',
    title: meta.title,
    description: meta.description,
    url: `https://${identity.domain}`,
    siteName: identity.fullName,
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
  },
};

/* The browser chrome follows the page ground (Lucent `bg`) in both themes. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' },
  ],
};

/* Runs in <head>, before first paint, so the home page can lay out its pinned
   formula opening from the first frame instead of switching after hydration:
   - `js`: scripts run.
   - `sigma`: the pinned stage can run here (motion allowed, screen tall enough —
     the same query SigmaMorph and site.css use).
   - failsafe: if the page's scripts never bring the stage to life (blocked or
     failed bundle), `sigma` is withdrawn and the hero falls back to its resting
     stack, so the name and buttons can never stay invisible. */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');
if(!window.matchMedia||!matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 560px)').matches)return;
d.classList.add('sigma');
setTimeout(function(){var h=document.querySelector('[data-sigma-hero]');if(h&&!h.classList.contains('is-live'))d.classList.remove('sigma');},4000);})();`;

const navItems =[sections.work, sections.experience, sections.drawings, sections.contact].map((s) => ({
  id: s.id,
  label: s.nav,
}));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    /* See BOOT below: classes set before first paint. */
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className="lu-root">
        <a className="site-skip" href="#main">
          Skip to content
        </a>
        <NavBar brand={identity.fullName.split(' ')[0]} items={navItems} />
        <main id="main">{children}</main>
        <footer className="lu-footer">
          © {new Date().getFullYear()} {identity.fullName}
        </footer>
        <LucentRuntime />
      </body>
    </html>
  );
}
