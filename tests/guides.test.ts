import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GUIDES, findGuideBySlug } from '../lib/guides';

describe('Guides pratiques pour les radars et amendes', () => {
  it('contient les 4 guides thématiques', () => {
    assert.equal(GUIDES.length, 4);
    const slugs = GUIDES.map((g) => g.slug);
    assert.ok(slugs.includes('bareme-amende-exces-de-vitesse'));
    assert.ok(slugs.includes('recuperation-points-permis-delais'));
    assert.ok(slugs.includes('contester-pv-radar-antai'));
    assert.ok(slugs.includes('marge-technique-radar-erreur'));
  });

  it('chaque guide a un titre, des sections et une FAQ', () => {
    for (const guide of GUIDES) {
      assert.ok(guide.title.length > 10, `${guide.slug} title`);
      assert.ok(guide.metaTitle.length > 10, `${guide.slug} metaTitle`);
      assert.ok(guide.metaDescription.length > 20, `${guide.slug} metaDescription`);
      assert.ok(guide.sections.length >= 2, `${guide.slug} sections`);
      assert.ok(guide.faq.length >= 1, `${guide.slug} faq`);
    }
  });

  it('trouve un guide par son slug', () => {
    const g = findGuideBySlug('contester-pv-radar-antai');
    assert.ok(g);
    assert.equal(g?.slug, 'contester-pv-radar-antai');
    assert.equal(findGuideBySlug('inexistant'), undefined);
  });
});
