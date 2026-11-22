import React from 'react';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { legalReviewDate } from '@/lib/legal-text';

interface LegalPageProps {
  title: string;
  path: string;
  breadcrumbLabel?: string;
  children: ReactNode;
}

export function LegalPage({ title, path, breadcrumbLabel, children }: LegalPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { name: 'Accueil', url: '/' },
          { name: breadcrumbLabel ?? title, url: path }
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fg">{title}</h1>
      <div className="card space-y-4 text-sm leading-relaxed text-secondary">
        {children}
        <p className="text-xs text-muted pt-4 border-t border-line">Dernière mise à jour : {legalReviewDate()}</p>
      </div>
    </div>
  );
}
