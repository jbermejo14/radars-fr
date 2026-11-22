import React from 'react';
import Link from 'next/link';
import { getAdSenseClient } from './AdSenseScript';

export function Footer() {
  const hasAdsense = !!getAdSenseClient();

  return (
    <footer className="border-t border-line bg-surface mt-16 py-10 text-xs text-secondary">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Bannière stage de récupération de points (Partenaire / Affiliation) */}
        <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
              Besoin de récupérer vos points ?
            </span>
            <p className="text-xs text-fg font-medium mt-0.5">
              Effectuez un stage agréé par votre préfecture : récupérez jusqu'à 4 points en seulement 2 jours.
            </p>
          </div>
          <a
            href="https://permisapoints.fr"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all text-center shrink-0"
          >
            Trouver un stage agréé →
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg">Ododex</span>
            <span>·</span>
            <span>Simulateur d'amendes et carte des radars automatiques de France</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/fr" className="hover:text-fg hover:underline">
              Accueil Ododex
            </a>
            <Link href="/mentions-legales" className="hover:text-fg hover:underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-fg hover:underline">
              Confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-fg hover:underline">
              Cookies
            </Link>
          </nav>
        </div>

        <p className="text-muted leading-relaxed">
          Données officielles de localisation issues de la plateforme publique transport.data.gouv.fr et du Ministère de l'Intérieur.
          Barème conforme au Code de la route en vigueur. Ce simulateur gratuit est un outil d'information indépendant non affilié à l'ANTAI ni aux services de police ou de gendarmerie.
        </p>

        {hasAdsense && (
          <p className="text-muted">
            Des annonces personnalisées peuvent être affichées conformément à notre politique de cookies et au consentement TCF v2.2.
          </p>
        )}
      </div>
    </footer>
  );
}
