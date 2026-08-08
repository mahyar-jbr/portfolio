// Self-hosted Inter (variable, all weights) — local files, no build-time
// network fetch. Avoids next/font/google, which hangs in restricted networks.
import '@fontsource-variable/inter';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { metadata as siteMetadata, personJsonLd } from '@/lib/seo';

export const metadata = siteMetadata;

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
