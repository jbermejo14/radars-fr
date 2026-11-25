import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, findGuideBySlug } from '@/lib/guides';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';
import { buildPageMetadata, buildTitle } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDES.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuideBySlug(slug);
  if (!guide) return {};

  const seo = { title: buildTitle(guide.metaTitle), description: guide.metaDescription };
  return buildPageMetadata(seo, `/guide/${guide.slug}`);
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = findGuideBySlug(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedDate,
    dateModified: '2026-01-01',
    mainEntityOfPage: absoluteUrl(`/guide/${guide.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'Ododex',
      url: 'https://ododex.com',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Fil d'Ariane */}
      <Breadcrumbs
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/#guides' },
          { name: guide.title, url: `/guide/${guide.slug}` },
        ]}
      />

      {/* En-tête de l'article */}
      <header className="space-y-4">
        <span className="tag tag-accent font-semibold text-xs">Guide Code de la route</span>
        <h1 className="text-2xl sm:text-3xl font-black text-fg tracking-tight leading-tight">
          {guide.title}
        </h1>
        <p className="text-base text-secondary leading-relaxed bg-surface border border-line p-4 rounded-xl">
          {guide.summary}
        </p>
      </header>

      {/* CTA simulateur en haut d'article */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
        <div>
          <h2 className="font-bold text-sm text-fg">Simulez votre amende en direct</h2>
          <p className="text-xs text-secondary mt-0.5">
            Calculez vos points retirés et le montant minoré selon votre vitesse.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all shrink-0"
        >
          Ouvrir le simulateur →
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="space-y-6 text-sm leading-relaxed text-secondary">
        {guide.sections.map((section, idx) => (
          <section key={idx} className="card space-y-3">
            <h2 className="text-lg font-bold text-fg">{section.heading}</h2>
            {section.content.map((paragraph, pIdx) => (
              <p key={pIdx} className="whitespace-pre-line text-secondary">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {/* Emplacement publicitaire */}
      <AdSlot className="my-8" />

      {/* FAQ spécifique au guide */}
      {guide.faq.length > 0 && (
        <section className="card space-y-4">
          <h2 className="text-xl font-bold text-fg">Foire aux questions</h2>
          <div className="divide-y divide-line/60">
            {guide.faq.map((item, idx) => (
              <details key={idx} className="py-3.5 group">
                <summary className="font-semibold text-sm text-fg cursor-pointer list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-secondary leading-relaxed pl-1">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Autres guides */}
      <section className="space-y-3 pt-6 border-t border-line">
        <h3 className="text-sm font-bold text-fg uppercase tracking-wider">
          Autres guides pratiques à consulter
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="p-3 rounded-lg border border-line bg-surface hover:border-accent text-xs font-medium text-secondary hover:text-fg transition-all"
            >
              <h4 className="font-bold text-fg text-xs line-clamp-2">{g.title}</h4>
              <p className="text-muted text-[11px] mt-1 line-clamp-2">{g.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
