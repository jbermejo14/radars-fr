'use client';

import React, { useEffect, useRef } from 'react';
import type { RadarItem } from '@/lib/radars';

interface Props {
  radars: RadarItem[];
  departementName: string;
}

export function RadarMap({ radars, departementName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || radars.length === 0) return;

    // Chargement dynamique de Leaflet côté client
    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !containerRef.current) return;

      // Nettoyer si déjà instancié
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Calculer le centre moyen
      const sumLat = radars.reduce((acc, r) => acc + r.lat, 0);
      const sumLng = radars.reduce((acc, r) => acc + r.lng, 0);
      const centerLat = sumLat / radars.length;
      const centerLng = sumLng / radars.length;

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom: 9,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Ajouter des cercles marqueurs pour chaque radar
      const bounds = L.latLngBounds([]);

      for (const radar of radars) {
        const markerColor =
          radar.vitesse && radar.vitesse <= 50
            ? '#EF4444' // rouge (50 ou moins)
            : radar.vitesse && radar.vitesse <= 80
            ? '#F59E0B' // orange (70-80)
            : '#3B82F6'; // bleu (90-130)

        const circle = L.circleMarker([radar.lat, radar.lng], {
          radius: 7,
          fillColor: markerColor,
          color: '#FFFFFF',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 180px;">
            <div style="font-weight: bold; color: #111827; margin-bottom: 4px; border-bottom: 1px solid #E5E7EB; padding-bottom: 3px;">
              ${radar.type}
            </div>
            ${radar.route ? `<div><strong>Route :</strong> ${radar.route}</div>` : ''}
            ${radar.vitesse ? `<div><strong>Vitesse autorisée :</strong> <span style="display: inline-block; padding: 1px 6px; border-radius: 4px; background: #FEF2F2; color: #DC2626; font-weight: bold; border: 1px solid #FCA5A5;">${radar.vitesse} km/h</span></div>` : ''}
            ${radar.emplacement ? `<div><strong>Lieu :</strong> ${radar.emplacement}</div>` : ''}
            ${radar.direction ? `<div><strong>Direction :</strong> ${radar.direction}</div>` : ''}
          </div>
        `;

        circle.bindPopup(popupContent);
        circle.addTo(map);
        bounds.extend([radar.lat, radar.lng]);
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [25, 25] });
      }

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [radars]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="w-full h-80 sm:h-96 rounded-xl border border-line overflow-hidden bg-surface z-0"
        aria-label={`Carte des radars du département ${departementName}`}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted px-1">
        <span>© Contributeurs OpenStreetMap · Données Ministère de l'Intérieur</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> ≤ 50 km/h
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 70 - 80 km/h
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> 90 - 130 km/h
          </span>
        </div>
      </div>
    </div>
  );
}
