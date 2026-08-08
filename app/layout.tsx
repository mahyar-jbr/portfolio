import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import './globals.css';
import Nav from '@/components/layout/Nav';

export const metadata: Metadata = {
  title: 'Mahyar Jaberi',
  description: 'AI Agent & Full-Stack Engineer',
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
