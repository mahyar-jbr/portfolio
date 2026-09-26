import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/design-system/lucent/bundle.css';
import '@/styles/tokens.css';
import '@/styles/site.css';
import NavBar from '@/components/lucent/NavBar';
import ThemeToggle from '@/components/lucent/ThemeToggle';
import Footer from '@/components/lucent/Footer';
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

/* Runs in <head>, before first paint, so the home page lays out in its final
   form from the first frame instead of switching after hydration:
   - `js`: scripts run.
   - `data-theme`: the light or dark theme the visitor chose with the toggle
     (components/lucent/ThemeToggle.tsx), so a remembered choice never flashes.
   - `name-in-view` (home only): the hero's name is on screen, so the nav
     capsule doesn't repeat it (components/hero/NavHandoff.tsx keeps it true).
   - `pin`: the About story can pin and step (motion allowed, screen tall
     enough — the same query components/about/StoryScroll.tsx uses).
   - failsafe: if the page's scripts never come alive (blocked or failed
     bundle), both are withdrawn, so the nav shows the name again and the story
     falls back to its plain sequence — nothing can stay hidden.
   - a refresh of the home page starts at the opening, not wherever the browser
     would restore to, and drops a leftover #section from in-site navigation.
     A first visit to a /#section link still goes straight to it.
   - `hero-intro` (home only): the hero's entrance (styles/site.css, "Hero"),
     in full on every load of the home page, a reload included: a once-per-tab
     intro read as no intro at all (Mahyar, 2026-09-26). Never on a /#section
     link or Back/Forward, and never when the hero remounts inside the site:
     the class goes once its sentinel animation (hero-end) ends, or 2.5s after
     it starts if it never finishes. A tab opened in the background waits
     until it is first shown. */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');
try{var t=localStorage.getItem('lucent:theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}
try{var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'&&location.pathname==='/'){history.scrollRestoration='manual';if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);addEventListener('load',function(){scrollTo(0,0);setTimeout(function(){history.scrollRestoration='auto';},0);});}}catch(e){}
if(location.pathname==='/')d.classList.add('name-in-view');
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 600px)').matches)d.classList.add('pin');
setTimeout(function(){if(!d.classList.contains('hero-wired'))d.classList.remove('name-in-view');var s=document.querySelector('[data-story]');if(s&&!s.classList.contains('is-live'))d.classList.remove('pin');},4000);
try{if(location.pathname==='/'&&!location.hash){var nv=performance.getEntriesByType('navigation')[0];if(!nv||nv.type!=='back_forward'){var c='hero-intro',tm,done=function(){clearTimeout(tm);d.classList.remove('hero-intro');},go=function(){d.classList.add(c);addEventListener('animationend',function f(e){if(e.animationName==='hero-end'){removeEventListener('animationend',f);done();}});addEventListener('animationstart',function g(e){if(e.animationName==='hero-end'){removeEventListener('animationstart',g);tm=setTimeout(done,2500);}});};if(document.visibilityState==='hidden'){document.addEventListener('visibilitychange',function v(){if(document.visibilityState==='visible'){document.removeEventListener('visibilitychange',v);go();}});}else go();}}}catch(e){}
})();`;

/* Inter stands in for Apple's system faces on every other device (styles/site.css,
   "Type on non-Apple devices"). Its opsz axis carries the Display cut. It is
   exposed as --font-inter on :root, where the kit's font tokens are defined. */
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], display: 'swap' });

const navItems = [sections.work, sections.experience, sections.drawings, sections.contact].map((s) => ({
  id: s.id,
  label: s.nav,
}));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    /* See BOOT below: classes set before first paint. */
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--font-inter:${inter.style.fontFamily}}` }} />
      </head>
      <body className="lu-root">
        <a className="site-skip" href="#main">
          Skip to content
        </a>
        <NavBar brand={identity.fullName.split(' ')[0]} items={navItems} />
        <ThemeToggle />
        <main id="main">{children}</main>
        <Footer name={identity.fullName} year={new Date().getFullYear()} location={identity.location} />
        <LucentRuntime />
      </body>
    </html>
  );
}
