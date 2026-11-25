import type { Metadata } from 'next';
import { getDepartementLocative } from './departement-articles';
import type { DepartementItem } from './radars';
import { SITE_NAME, absoluteUrl } from './site';

export const TITLE_MAX_LENGTH = 65;
export const TITLE_TARGET_LENGTH = 60;
export const DESCRIPTION_MIN_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 160;

export const OG_IMAGE_PATH = '/brand/ododex-og.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT = 'Ododex : radars et amendes en France';
const OG_LOCALE = 'fr_FR';

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

export interface PageSeo {
  title: string;
  description: string;
}

/** Ajoute la marque une seule fois à un titre. */
export function buildTitle(core: string): string {
  const bare = core.endsWith(BRAND_SUFFIX) ? core.slice(0, -BRAND_SUFFIX.length) : core;
  return `${bare}${BRAND_SUFFIX}`;
}

/** Choisit la première variante dont le titre complet tient dans l'objectif, sinon dans la limite. */
function seoPickTitle(cores: string[]): string {
  const titles = cores.map(buildTitle);
  const found =
    titles.find((title) => title.length <= TITLE_TARGET_LENGTH) ??
    titles.find((title) => title.length <= TITLE_MAX_LENGTH);
  if (found === undefined) {
    throw new Error(`Aucune variante de titre ne tient dans ${TITLE_MAX_LENGTH} caractères : ${titles[0]}`);
  }
  return found;
}

/** Choisit la première variante de description comprise entre les bornes de longueur. */
function seoPickDescription(candidates: string[]): string {
  const found = candidates.find(
    (text) => text.length >= DESCRIPTION_MIN_LENGTH && text.length <= DESCRIPTION_MAX_LENGTH
  );
  if (found === undefined) {
    throw new Error(
      `Aucune variante de description entre ${DESCRIPTION_MIN_LENGTH} et ${DESCRIPTION_MAX_LENGTH} caractères : ${candidates[0]}`
    );
  }
  return found;
}

/** Titre complet et description d'une page à partir de leurs variantes, de la préférée à la plus courte. */
export function buildPageSeo(titleCores: string[], descriptions: string[]): PageSeo {
  return { title: seoPickTitle(titleCores), description: seoPickDescription(descriptions) };
}

function seoRadarCountLabel(count: number): string {
  return count === 1 ? '1 radar' : `${count} radars`;
}

/** Titre et description d'une fiche départementale, avec l'article correct du département. */
export function buildDepartementSeo(dept: DepartementItem): PageSeo {
  const place = getDepartementLocative(dept.code);
  const head = `Radars ${place} (${dept.code})`;
  const hasRadars = dept.radarCount > 0;
  const count = seoRadarCountLabel(dept.radarCount);

  const titleCores = hasRadars
    ? [`${head} : carte des ${count}`, `${head} : carte et liste`, head]
    : [`${head} : carte et informations`, head];

  const intro = hasRadars
    ? `Carte des ${count} automatiques ${place} (${dept.code})`
    : `Aucun radar fixe automatique recensé ${place} (${dept.code})`;
  const tail = hasRadars ? 'routes contrôlées' : 'contrôles de vitesse';
  const descriptions = [
    `${intro}, région ${dept.regionName} : ${tail}, vitesses autorisées et simulateur d'amende pour excès de vitesse.`,
    `${intro} : ${tail}, vitesses autorisées et simulateur d'amende pour excès de vitesse.`,
    `${intro} : ${tail}, vitesses autorisées et simulateur d'amende et de points.`,
  ];

  return buildPageSeo(titleCores, descriptions);
}

export function buildOgImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}

/** Open Graph d'une page, image comprise : à utiliser partout où une page redéfinit `openGraph`. */
export function buildOpenGraph(page: PageSeo, path: string): NonNullable<Metadata['openGraph']> {
  return {
    title: page.title,
    description: page.description,
    url: absoluteUrl(path),
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    type: 'website',
    images: [{ url: buildOgImageUrl(), width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT }],
  };
}

/** Carte Twitter avec grande image. */
export function buildTwitter(): NonNullable<Metadata['twitter']> {
  return { card: 'summary_large_image', images: [buildOgImageUrl()] };
}

/** Métadonnées complètes d'une page : titre, description, canonique, Open Graph et Twitter. */
export function buildPageMetadata(page: PageSeo, path: string): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: buildOpenGraph(page, path),
    twitter: buildTwitter(),
  };
}

/** Titre et description de l'accueil. */
export function buildHomeSeo(): PageSeo {
  return buildPageSeo(
    ['Radars et amendes 2026 : simulateur et carte'],
    [
      "Simulateur d'amende et de retrait de points pour excès de vitesse (Code de la route 2026) et carte des 3 350 radars automatiques en France, par département.",
    ]
  );
}
