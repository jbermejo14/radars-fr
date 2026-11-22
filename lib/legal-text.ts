import type { Metadata } from 'next';
import { FECHA_TEXTOS_LEGALES } from './legal';
import type { Titular } from './legal';
import { absoluteUrl } from './site';

export const LEGAL_ROBOTS = { index: false, follow: true } as const;

export const HOLDER_FIELD_LABELS: Record<keyof Titular, string> = {
  tipo: 'type',
  nombre: 'nom',
  nif: "numéro d'identification fiscale (NIF)",
  domicilio: 'adresse',
  email: 'e-mail',
  registroMercantil: 'immatriculation au registre du commerce'
};

export function legalHolderValue(holder: Titular, field: keyof Titular): string {
  const value = holder[field];
  return value.trim() === '' ? `[à compléter : ${HOLDER_FIELD_LABELS[field]}]` : value;
}

export function legalReviewDate(isoDate: string = FECHA_TEXTOS_LEGALES): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(isoDate));
}

export function legalMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: LEGAL_ROBOTS,
    alternates: { canonical: absoluteUrl(path) }
  };
}
