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

const navItems = [sections.work, sections.experience, sections.drawings, sections.contact].map((s) => ({
  id: s.id,
  label: s.nav,
}));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
