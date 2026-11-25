import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { Metadata } from 'next';
import { metadata as rootMetadata } from '../app/layout';
import { metadata as confidentialiteMetadata } from '../app/confidentialite/page';
import { metadata as cookiesMetadata } from '../app/cookies/page';
import { metadata as mentionsMetadata } from '../app/mentions-legales/page';
import { generateMetadata as departementMetadata, generateStaticParams as departementParams } from '../app/departement/[code]/page';
import { generateMetadata as guideMetadata, generateStaticParams as guideParams } from '../app/guide/[slug]/page';
import { DEPARTEMENTS } from '../lib/radars';
import { DEPARTEMENT_LOCATIVES } from '../lib/departement-articles';
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  TITLE_MAX_LENGTH,
  buildOgImageUrl,
  buildTitle,
} from '../lib/seo';
import { SITE_ORIGIN } from '../lib/site';

const BRAND = '| Ododex';
const PUBLIC_DIRECTORY = join(import.meta.dirname, '..', 'public');
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;

interface PageEntry {
  label: string;
  metadata: Metadata;
}

function titleOf(metadata: Metadata): string {
  assert.equal(typeof metadata.title, 'string');
  return metadata.title as string;
}

async function collectPages(): Promise<PageEntry[]> {
  const pages: PageEntry[] = [
    { label: 'accueil', metadata: rootMetadata },
    { label: 'confidentialité', metadata: confidentialiteMetadata },
    { label: 'cookies', metadata: cookiesMetadata },
    { label: 'mentions légales', metadata: mentionsMetadata },
  ];
  for (const { code } of await departementParams()) {
    pages.push({ label: `département ${code}`, metadata: await departementMetadata({ params: Promise.resolve({ code }) }) });
  }
  for (const { slug } of await guideParams()) {
    pages.push({ label: `guide ${slug}`, metadata: await guideMetadata({ params: Promise.resolve({ slug }) }) });
  }
  return pages;
}

async function departementTitle(code: string): Promise<string> {
  return titleOf(await departementMetadata({ params: Promise.resolve({ code }) }));
}

describe('Titres et descriptions', () => {
  it('couvre les 101 départements, les guides, l\'accueil et les pages légales', async () => {
    const pages = await collectPages();
    assert.equal(DEPARTEMENTS.length, 101);
    assert.ok(pages.length >= 101 + 4 + 4);
  });

  it('chaque titre complet fait 65 caractères au plus, avec la marque une seule fois', async () => {
    for (const { label, metadata } of await collectPages()) {
      const title = titleOf(metadata);
      assert.ok(title.length <= TITLE_MAX_LENGTH, `${label} : ${title.length} caractères : ${title}`);
      assert.ok(title.endsWith(` ${BRAND}`), `${label} : marque absente : ${title}`);
      assert.equal(title.split(BRAND).length - 1, 1, `${label} : marque répétée : ${title}`);
    }
  });

  it('chaque description fait entre 120 et 160 caractères', async () => {
    for (const { label, metadata } of await collectPages()) {
      const description = metadata.description ?? '';
      assert.ok(
        description.length >= DESCRIPTION_MIN_LENGTH && description.length <= DESCRIPTION_MAX_LENGTH,
        `${label} : ${description.length} caractères : ${description}`
      );
    }
  });

  it('titres et descriptions sont uniques', async () => {
    const pages = await collectPages();
    assert.equal(new Set(pages.map((p) => titleOf(p.metadata))).size, pages.length);
    assert.equal(new Set(pages.map((p) => p.metadata.description)).size, pages.length);
  });

  it('aucun titre, description ni titre Open Graph ne qualifie le site d\'officiel', async () => {
    for (const { label, metadata } of await collectPages()) {
      const texts = [titleOf(metadata), metadata.description ?? '', String((metadata.openGraph as { title?: unknown }).title ?? '')];
      for (const text of texts) {
        assert.ok(!/officiel/i.test(text), `${label} : ${text}`);
      }
    }
  });

  it('buildTitle n\'ajoute pas la marque deux fois', () => {
    assert.equal(buildTitle('Test'), 'Test | Ododex');
    assert.equal(buildTitle('Test | Ododex'), 'Test | Ododex');
  });
});

describe('Articles des départements', () => {
  const expected: Record<string, string> = {
    '01': "Radars dans l'Ain (01)",
    '69': 'Radars dans le Rhône (69)',
    '13': 'Radars dans les Bouches-du-Rhône (13)',
    '75': 'Radars à Paris (75)',
    '2A': 'Radars en Corse-du-Sud (2A)',
    '92': 'Radars dans les Hauts-de-Seine (92)',
  };

  for (const [code, start] of Object.entries(expected)) {
    it(`le titre du département ${code} commence par « ${start} »`, async () => {
      const title = await departementTitle(code);
      assert.ok(title.startsWith(start), title);
    });
  }

  it('la table des locutions couvre exactement les départements', () => {
    assert.deepEqual(Object.keys(DEPARTEMENT_LOCATIVES).sort(), DEPARTEMENTS.map((d) => d.code).sort());
  });

  it('aucun titre n\'emploie « en » devant un nom à article (ex. « en Ain »)', async () => {
    for (const dept of DEPARTEMENTS) {
      assert.ok(!(await departementTitle(dept.code)).includes('en Ain'));
    }
  });
});

describe('Image Open Graph', () => {
  it('le fichier existe et fait 1200x630', () => {
    const file = join(PUBLIC_DIRECTORY, OG_IMAGE_PATH);
    assert.ok(existsSync(file), file);
    const png = readFileSync(file);
    assert.equal(png.readUInt32BE(PNG_WIDTH_OFFSET), OG_IMAGE_WIDTH);
    assert.equal(png.readUInt32BE(PNG_HEIGHT_OFFSET), OG_IMAGE_HEIGHT);
  });

  it('chaque page déclare l\'image dans openGraph et la carte Twitter large', async () => {
    const expectedUrl = `${SITE_ORIGIN}/fr/radars${OG_IMAGE_PATH}`;
    assert.equal(buildOgImageUrl(), expectedUrl);
    for (const { label, metadata } of await collectPages()) {
      const images = (metadata.openGraph as { images?: { url: string; width: number; height: number }[] }).images;
      assert.ok(images && images.length === 1, `${label} : image Open Graph absente`);
      assert.deepEqual([images[0].url, images[0].width, images[0].height], [expectedUrl, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT], label);
      const twitter = metadata.twitter as { card?: string; images?: string[] };
      assert.equal(twitter.card, 'summary_large_image', label);
      assert.deepEqual(twitter.images, [expectedUrl], label);
    }
  });
});
