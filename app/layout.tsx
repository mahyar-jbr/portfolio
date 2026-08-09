import type { Metadata, Viewport } from 'next';
// The opsz entrypoint, NOT the bare package — the default export is the
// wght-only cut (one axis), so headings would render Inter's 14px-optimised
// outlines at display sizes. This carries opsz 14-32 for +24.7 KB.
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/geist-mono';
import './globals.css';
import Providers from './providers';
import Nav from '@/components/layout/Nav';

export const metadata: Metadata = {
  title: 'Mahyar Jaberi',
  description: 'AI Agent & Full-Stack Engineer',
};

export const viewport: Viewport = {
  themeColor: '#fcfcfa',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
