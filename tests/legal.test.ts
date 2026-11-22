import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTitular, ficheroTitular } from '../lib/legal';
import { legalHolderValue, legalReviewDate, legalMetadata } from '../lib/legal-text';

describe('Textes légaux et titulaire', () => {
  it('trouve le fichier titular.example.json par défaut', () => {
    const fichero = ficheroTitular();
    assert.ok(fichero.includes('titular'));
  });

  it('charge la structure du titulaire sans erreur', () => {
    const holder = getTitular();
    assert.ok(holder.tipo === 'persona-fisica' || holder.tipo === 'empresa');
  });

  it('génère un placeholder clair si le champ est vide', () => {
    const holder = getTitular();
    const val = legalHolderValue(holder, 'nombre');
    assert.ok(val.length > 0);
  });

  it('formate la date de révision en français', () => {
    const dateStr = legalReviewDate('2026-11-22');
    assert.ok(dateStr.includes('2026'));
  });

  it('génère les métadonnées avec noindex pour les pages légales', () => {
    const meta = legalMetadata('/mentions-legales', 'Mentions', 'Desc');
    assert.equal(meta.title, 'Mentions');
    assert.deepEqual(meta.robots, { index: false, follow: true });
  });
});
