export const SITE_NAME = 'Ododex';
export const SECTION_NAME = 'Radars & Amendes';
export const BASE_PATH = '/fr/radars';

export const SITE_ORIGIN =
  (process.env.SITE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://ododex.com').replace(/\/+$/, '');

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/' || clean === '') {
    return `${SITE_ORIGIN}${BASE_PATH}`;
  }
  return `${SITE_ORIGIN}${BASE_PATH}${clean}`;
}
