import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Radars & Amendes 2026 : Simulateur d\'excès de vitesse et carte des radars | Ododex',
  description: 'Simulateur d\'amende et de retrait de points pour excès de vitesse (Code de la route 2026). Emplacement et carte des 3 350 radars automatiques en France par département.',
  metadataBase: new URL('https://ododex.com'),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: '/fr/radars/icon.svg',
  },
  openGraph: {
    title: 'Radars & Amendes 2026 : Simulateur d\'excès de vitesse et carte | Ododex',
    description: 'Calculez le montant de votre amende, vos points retirés et consultez l\'emplacement des 3 350 radars en France.',
    url: absoluteUrl('/'),
    siteName: 'Ododex',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ododex-theme');
                  var prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <AdSenseScript />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans antialiased">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
