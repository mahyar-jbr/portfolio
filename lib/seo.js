// Central site constants + SEO metadata. Single source of truth for URLs/identity.

export const SITE = {
  name: 'Mahyar Jaberi',
  role: 'AI Agent & Full-Stack Engineer',
  tagline:
    'I design and ship production multi-agent AI systems — live in stores, not just on GitHub.',
  url: 'https://mahyar-portfolio.dev',
  email: 'jaberi.mahyar@gmail.com',
  github: 'https://github.com/mahyar-jbr',
  linkedin: 'https://www.linkedin.com/in/mahyar-jaberi/',
  location: 'Aurora, ON, Canada',
};

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.role}`,
  description: SITE.tagline,
  keywords: [
    'AI Agent Engineer',
    'Full-Stack Developer',
    'Software Engineer',
    'LangGraph',
    'Anthropic Claude API',
    'Next.js',
    'React',
    'FastAPI',
    'Portfolio',
    'Toronto',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.tagline,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.tagline,
  },
};

// JSON-LD Person schema for richer search results.
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.role,
    email: `mailto:${SITE.email}`,
    sameAs: [SITE.github, SITE.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Aurora',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
  };
}
