'use client';

import React, { useMemo, useState } from 'react';
import { calculateAmendeVitesse, TypeRadar } from '@/lib/amendes';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

const COMMON_LIMITS = [30, 50, 70, 80, 90, 110, 130];

export function SpeedPenaltyCalculator() {
  const [vitesseMesuree, setVitesseMesuree] = useState<number>(138);
  const [vitesseAutorisee, setVitesseAutorisee] = useState<number>(130);
  const [typeRadar, setTypeRadar] = useState<TypeRadar>('fixe');

  const result = useMemo(() => {
    return calculateAmendeVitesse({
      vitesseMesuree,
      vitesseAutorisee,
      typeRadar,
    });
  }, [vitesseMesuree, vitesseAutorisee, typeRadar]);

  return (
    <div className="card space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-fg">Simulateur d'amende et retrait de points 2026</h2>
        <p className="text-xs text-secondary mt-1">
          Barème des amendes selon le Code de la route avec calcul automatique de la marge technique légale (réforme 2024 incluse).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne Paramètres */}
        <div className="space-y-5">
          {/* Vitesse mesurée */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="vitesseMesuree" className="text-xs font-bold text-fg">
                Vitesse mesurée par le radar
              </label>
              <span className="font-mono text-sm font-extrabold text-accent">
                {vitesseMesuree} km/h
              </span>
            </div>
            <input
              id="vitesseMesuree"
              type="range"
              min="30"
              max="250"
              step="1"
              value={vitesseMesuree}
              onChange={(e) => setVitesseMesuree(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted">Saisie directe :</span>
              <input
                type="number"
                min="1"
                max="350"
                value={vitesseMesuree}
                onChange={(e) => setVitesseMesuree(Math.max(1, Number(e.target.value)))}
                className="w-24 px-2.5 py-1 text-xs font-mono font-bold bg-surface border border-line rounded-lg text-fg focus:outline-none focus:border-accent"
              />
              <span className="text-xs text-secondary">km/h</span>
            </div>
          </div>

          {/* Vitesse maximale autorisée */}
          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Vitesse maximale autorisée (VMA)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_LIMITS.map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => setVitesseAutorisee(limit)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    vitesseAutorisee === limit
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-surface border border-line text-secondary hover:text-fg hover:border-accent'
                  }`}
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>

          {/* Type de radar */}
          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Type de radar
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTypeRadar('fixe')}
                className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  typeRadar === 'fixe'
                    ? 'border-2 border-accent bg-accent/5 text-fg'
                    : 'border border-line bg-surface text-secondary hover:text-fg'
                }`}
              >
                <span className="block font-bold">Radar fixe</span>
                <span className="text-[11px] text-muted">Cabine, tourelle, tronçon (-5 km/h ou -5%)</span>
              </button>
              <button
                type="button"
                onClick={() => setTypeRadar('mobile')}
                className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  typeRadar === 'mobile'
                    ? 'border-2 border-accent bg-accent/5 text-fg'
                    : 'border border-line bg-surface text-secondary hover:text-fg'
                }`}
              >
                <span className="block font-bold">Radar mobile</span>
                <span className="text-[11px] text-muted">Voiture radar en mouvement (-10 km/h ou -10%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Résultats */}
        <div className="bg-elevated/40 border border-line rounded-xl p-5 space-y-4 flex flex-col justify-between">
          {!result.isInfraction ? (
            <div className="py-8 text-center space-y-3 my-auto">
              <div className="inline-flex p-3 rounded-full bg-positive/10 text-positive">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-positive">Aucune infraction constatée</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Après application de la marge technique légale de -{result.margeTechnique} km/h,
                votre vitesse retenue est de <strong>{result.vitesseRetenue} km/h</strong> pour une vitesse autorisée de {result.vitesseAutorisee} km/h.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* En-tête des résultats */}
              <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
                <div>
                  <span className="text-xs font-medium text-muted">Excès de vitesse retenu :</span>
                  <div className="text-2xl font-black text-fg font-mono">
                    +{result.excesVitesse} km/h
                  </div>
                  <span className="text-[11px] text-secondary">
                    Mesurée : {result.vitesseMesuree} km/h — Marge : -{result.margeTechnique} km/h = <strong>{result.vitesseRetenue} km/h retenue</strong>
                  </span>
                </div>

                {/* Badge des points retirés */}
                <div className={`p-3 rounded-xl text-center shrink-0 min-w-24 ${
                  result.pointsRetires === 0
                    ? 'bg-positive/10 border border-positive/20 text-positive'
                    : result.pointsRetires <= 2
                    ? 'bg-warning/10 border border-warning/20 text-warning'
                    : 'bg-negative/10 border border-negative/20 text-negative'
                }`}>
                  <span className="block text-2xl font-black font-mono leading-none">
                    {result.pointsRetires === 0 ? '0' : `-${result.pointsRetires}`}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mt-1">
                    {result.pointsRetires <= 1 ? 'Point' : 'Points'}
                  </span>
                </div>
              </div>

              {/* Mention Réforme 2024 si excès < 5 km/h */}
              {result.reforme2024Appliquee && (
                <div className="p-2.5 rounded-lg bg-positive/10 border border-positive/20 text-positive text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span><strong>Réforme 1er janvier 2024 :</strong> Aucun point retiré pour les excès de moins de 5 km/h ! Seule l'amende reste due.</span>
                </div>
              )}

              {/* Détail financier des amendes */}
              {result.classeContravention !== 'delit' ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-fg block">
                    Montant de l'amende forfaitaire (Contravention de {result.classeContravention}e classe) :
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface border border-line text-center">
                      <span className="text-[10px] font-semibold text-positive uppercase block">Minorée (15/30j)</span>
                      <span className="font-mono text-base font-extrabold text-fg">{result.amendeMinoree} €</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border-2 border-accent text-center">
                      <span className="text-[10px] font-bold text-accent uppercase block">Forfaitaire</span>
                      <span className="font-mono text-base font-black text-accent">{result.amendeForfaitaire} €</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line text-center">
                      <span className="text-[10px] font-semibold text-negative uppercase block">Majorée (+60j)</span>
                      <span className="font-mono text-base font-extrabold text-fg">{result.amendeMajoree} €</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-negative/10 border border-negative/20 text-negative text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Grand excès de vitesse (délit)</span>
                  </div>
                  <p>
                    Délit depuis le 29/12/2025. Amende forfaitaire délictuelle (si le conducteur est identifié) :{' '}
                    <strong>{result.amendeForfaitaire} €</strong> ({result.amendeMinoree} € minorée, {result.amendeMajoree} € majorée).
                  </p>
                  <p>
                    Sinon, ou devant le tribunal correctionnel : jusqu'à <strong>{result.amendeMaximaleTribunal} €</strong> d'amende
                    et <strong>{result.emprisonnementMaxMois} mois</strong> d'emprisonnement.
                  </p>
                </div>
              )}

              {/* Sanctions complémentaires éventuelles */}
              {result.sanctionsComplementaires.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-line">
                  <span className="text-xs font-bold text-fg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                    Sanctions complémentaires encourues :
                  </span>
                  <ul className="text-xs text-secondary space-y-1 pl-4 list-disc">
                    {result.sanctionsComplementaires.map((sanction, idx) => (
                      <li key={idx}>{sanction}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Délai de récupération des points */}
              <div className="pt-2 border-t border-line text-xs text-secondary flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                <span>
                  <strong>Récupération des points :</strong> {result.delaiRecuperationPoints}.
                </span>
              </div>
            </div>
          )}

          {/* Lien utile sous les résultats */}
          <div className="pt-2 text-[11px] text-muted text-center border-t border-line">
            Paiement officiel sécurisé sur <a href="https://amendes.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold">amendes.gouv.fr</a> ou contestation sur <a href="https://antai.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold">antai.gouv.fr</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
