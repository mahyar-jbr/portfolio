import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BriefCase, CaseStudy } from '@/components/work/CaseStudy';
import { pagedProjects } from '@/content/projects';
import { identity } from '@/content/site';

/* /work/<slug> — one page per project that has one (Lucent Handoff: routes).
   A soon card (MoneyMind) has no page by design: its slug, like any unknown
   slug, 404s rather than render. */

export const dynamicParams = false;

export function generateStaticParams() {
  return pagedProjects.map((p) => ({ slug: p.slug }));
}

const bySlug = (slug: string) => pagedProjects.find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  const description = p.page === 'case-study' ? p.oneLiner : p.lede;
  return {
    title: `${p.name} · ${identity.fullName}`,
    description,
    openGraph: { title: p.name, description },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  return p.page === 'case-study' ? <CaseStudy project={p} /> : <BriefCase project={p} />;
}
