import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllDepartements, getDepartementByCode, getRadarsByDepartement } from '@/lib/radars';
import { RadarMap } from '@/components/RadarMap';
import { SpeedPenaltyCalculator } from '@/components/SpeedPenaltyCalculator';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';

interface Props {
  params: Promise<{ code: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const departements = getAllDepartements();
  return departements.map((d) => ({
    code: d.code,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const dept = getDepartementByCode(code);
  if (!dept) return {};

  const title = `Radars ${dept.name} (${dept.code}) 2026 : Carte et Emplacement des ${dept.radarCount} Radars | Ododex`;
  const description = `Découvrez la carte et l'emplacement précis des ${dept.radarCount} radars automatiques en ${dept.name} (${dept.code}), région ${dept.regionName}. Vitesses autorisées, routes contrôlées et simulateur d'amendes.`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/departement/${dept.code}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/departement/${dept.code}`),
    },
  };
}

export default async function DepartementPage({ params }: Props) {
  const { code } = await params;
  const dept = getDepartementByCode(code);
  if (!dept) notFound();

  const radars = getRadarsByDepartement(code);
  const allDepts = getAllDepartements();

  return (
    <div className="space-y-10">
      {/* Fil d'Ariane */}
      <Breadcrumbs
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Départements', url: '/#departements' },
          { name: `${dept.name} (${dept.code})`, url: `/departement/${dept.code}` },
        ]}
      />

      {/* En-tête du département */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
            Département {dept.code}
          </span>
          <span className="tag text-xs font-medium">
            Région {dept.regionName}
          </span>
          <span className="tag tag-accent text-xs font-bold">
            {dept.radarCount} radars automatiques
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-fg tracking-tight">
          Radars automatiques en {dept.name} ({dept.code})
        </h1>

        <p className="text-sm text-secondary leading-relaxed">
          Le département de <strong>{dept.name}</strong> compte actuellement <strong>{dept.radarCount} radars automatiques fixes</strong> répertoriés
          par la Sécurité Routière et le Ministère de l'Intérieur. Retrouvez leur emplacement précis sur la carte ci-dessous ainsi que la vitesse contrôlée.
        </p>
      </section>

      {/* Carte interactive des radars du département */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-fg">
          Carte des radars en {dept.name}
        </h2>
        {radars.length > 0 ? (
          <RadarMap radars={radars} departementName={dept.name} />
        ) : (
          <div className="card text-center py-8 text-secondary text-xs">
            Aucun radar fixe automatique recensé dans ce département.
          </div>
        )}
      </section>

      {/* Emplacement publicitaire */}
      <AdSlot className="my-8" />

      {/* Tableau détaillé des radars du département */}
      <section className="card space-y-4">
        <div>
          <h2 className="text-lg font-bold text-fg">
            Liste des équipements de contrôle en {dept.name}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Détail par axe routier, commune et sens de circulation.
          </p>
        </div>

        {radars.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface text-secondary font-semibold">
                  <th className="py-2.5 px-3">Route / Axe</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Commune / Lieu</th>
                  <th className="py-2.5 px-3 text-right">Vitesse autorisée</th>
                  <th className="py-2.5 px-3">Sens de circulation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {radars.map((radar, idx) => (
                  <tr key={`${radar.id}-${idx}`} className="hover:bg-elevated transition-colors">
                    <td className="py-2.5 px-3 font-bold text-fg font-mono">
                      {radar.route || 'Voie locale'}
                    </td>
                    <td className="py-2.5 px-3 text-secondary">
                      <span className="px-2 py-0.5 rounded bg-surface border border-line text-[11px]">
                        {radar.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-fg font-medium">
                      {radar.emplacement || 'Non précisé'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {radar.vitesse ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-bold font-mono border border-red-500/20 text-xs">
                          {radar.vitesse} km/h
                        </span>
                      ) : (
                        <span className="text-muted text-[11px]">Feu rouge / Non renseigné</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-muted text-[11px]">
                      {radar.direction || 'Double sens / Non précisé'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted">Aucune cabine répertoriée pour ce département.</p>
        )}
      </section>

      {/* Simulateur d'amendes embarqué */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-fg">
          Simuler une amende pour excès de vitesse
        </h2>
        <SpeedPenaltyCalculator />
      </section>

      {/* Autres départements voisins */}
      <section className="space-y-3 pt-6 border-t border-line">
        <h3 className="text-sm font-bold text-fg uppercase tracking-wider">
          Autres départements en {dept.regionName}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {allDepts
            .filter((d) => d.regionSlug === dept.regionSlug && d.code !== dept.code)
            .map((d) => (
              <Link
                key={d.code}
                href={`/departement/${d.code}`}
                className="p-2.5 rounded-lg border border-line bg-surface hover:border-accent text-xs font-medium text-secondary hover:text-fg transition-all text-center"
              >
                <span className="block truncate">
                  <strong className="text-fg mr-1">{d.code}</strong> {d.name}
                </span>
                <span className="text-[11px] text-muted">{d.radarCount} radars</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
