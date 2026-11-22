import React from 'react';
import Link from 'next/link';
import { SpeedPenaltyCalculator } from '@/components/SpeedPenaltyCalculator';
import { AdSlot } from '@/components/AdSlot';
import { getAllDepartements, getTotalRadarsCount, getTopDepartements } from '@/lib/radars';
import { GUIDES } from '@/lib/guides';

const FAQ_ITEMS = [
  {
    q: "Perd-on encore un point pour un excès de vitesse de moins de 5 km/h ?",
    a: "Non ! Depuis le 1er janvier 2024 (Décret n° 2023-1150), les excès de vitesse de moins de 5 km/h par rapport à la vitesse autorisée n'entraînent plus aucun retrait de point sur votre permis de conduire. En revanche, l'amende forfaitaire reste exigible (68 € hors agglomération ou 135 € en agglomération).",
  },
  {
    q: "Comment fonctionne la marge technique d'erreur d'un radar ?",
    a: "Pour un radar fixe, la marge déduite de la vitesse mesurée est de 5 km/h jusqu'à 100 km/h, puis de 5 % au-delà (arrondie au km/h supérieur). Par exemple, sur autoroute limitée à 130 km/h, vous êtes flashé à 138 km/h : 5 % font 6,9 km/h (arrondi à 7 km/h), la vitesse retenue est donc de 131 km/h (excès de +1 km/h).",
  },
  {
    q: "Quel est le délai pour payer l'amende minorée ?",
    a: "Vous bénéficiez de 15 jours à compter de la date d'envoi de l'avis pour régler le montant minoré par courrier ou chèque, et d'un délai étendu à 30 jours si vous payez par télépaiement électronique sur le site officiel amendes.gouv.fr ou via l'application mobile Amendes.gouv.",
  },
  {
    q: "Combien de radars automatiques sont installés en France ?",
    a: "Le parc national compte environ 3 350 radars fixes automatiques gérés par le Ministère de l'Intérieur, comprenant des cabines fixes classiques, des radars discriminants poids-lourds/voitures, des radars de franchissement de feu rouge et des radars tourelles multifonctions.",
  },
  {
    q: "Comment contester un PV reçu sans perdre de points ?",
    a: "Si vous aviez prêté votre voiture ou si vous n'étiez pas le conducteur au moment du flash, vous pouvez désigner en ligne le véritable conducteur sur antai.gouv.fr sans payer l'amende ni verser de consignation. L'avis initial sera annulé et un nouveau PV sera expédié à la personne désignée.",
  },
];

export default function HomePage() {
  const departements = getAllDepartements();
  const topDepartements = getTopDepartements(12);
  const totalRadars = getTotalRadarsCount();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Titre et introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line text-xs font-semibold text-secondary">
          <span>🇫🇷 Données Sécurité Routière</span>
          <span>·</span>
          <span>{totalRadars} radars répertoriés</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight">
          Radars & Simulateur d'Amendes 2026
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          Calculez immédiatement le montant de votre amende, vos points retirés selon votre vitesse et la marge légale.
          Trouvez l'emplacement exact des radars automatiques par département.
        </p>
      </section>

      {/* Simulateur principal interactif */}
      <section>
        <SpeedPenaltyCalculator />
      </section>

      {/* Emplacement publicitaire après le simulateur (anti-CLS) */}
      <AdSlot className="my-8" />

      {/* Raccourci vers les départements avec le plus de radars */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-fg">Radars par département</h2>
            <p className="text-xs text-secondary mt-0.5">
              Consultez la carte interactive et l'emplacement précis des radars automatiques dans votre département.
            </p>
          </div>
          <span className="text-xs text-muted font-medium">101 départements</span>
        </div>

        {/* Top départements */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {topDepartements.map((dept) => (
            <Link
              key={dept.code}
              href={`/departement/${dept.code}`}
              className="p-3 rounded-xl border border-line bg-surface hover:border-accent hover:bg-elevated transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10">
                  {dept.code}
                </span>
                <span className="text-xs font-bold text-fg font-mono">
                  {dept.radarCount} radars
                </span>
              </div>
              <h3 className="font-bold text-xs text-fg mt-1.5 group-hover:text-accent truncate">
                {dept.name}
              </h3>
              <span className="text-[11px] text-muted truncate block">{dept.regionName}</span>
            </Link>
          ))}
        </div>

        {/* Accordéon avec tous les départements */}
        <details className="card text-xs">
          <summary className="font-bold text-fg cursor-pointer py-1 flex items-center justify-between list-none">
            <span>Afficher la liste intégrale des 101 départements français</span>
            <span className="text-accent">▼</span>
          </summary>
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border-t border-line mt-3">
            {departements.map((d) => (
              <Link
                key={d.code}
                href={`/departement/${d.code}`}
                className="p-2 rounded-lg hover:bg-elevated transition-colors flex items-center justify-between text-secondary hover:text-fg"
              >
                <span className="truncate">
                  <strong className="text-fg mr-1">{d.code}</strong> {d.name}
                </span>
                <span className="text-[11px] text-muted font-mono shrink-0 ml-1">
                  {d.radarCount}
                </span>
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* Guides pratiques */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-fg">Guides pratiques Code de la route & PV</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="card hover:border-accent transition-all group"
            >
              <h3 className="font-bold text-sm text-fg group-hover:text-accent">
                {guide.title} →
              </h3>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                {guide.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Foire aux questions (FAQ) */}
      <section className="card space-y-4">
        <h2 className="text-xl font-bold text-fg">Questions fréquentes sur les radars et amendes</h2>
        <div className="divide-y divide-line/60">
          {FAQ_ITEMS.map((item, idx) => (
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

      {/* Deuxième emplacement publicitaire en bas de page */}
      <AdSlot className="mt-8" />
    </div>
  );
}
