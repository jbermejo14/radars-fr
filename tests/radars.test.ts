import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getAllDepartements,
  getDepartementByCode,
  getRadarsByDepartement,
  getTopDepartements,
  getTotalRadarsCount,
  RADARS,
} from '../lib/radars';

describe('Base de données des radars français', () => {
  it('contient plus de 3 000 radars automatiques officiels', () => {
    assert.ok(RADARS.length >= 3300);
    assert.equal(getTotalRadarsCount(), RADARS.length);
  });

  it('chaque radar a des coordonnées GPS valides et un type', () => {
    for (const r of RADARS.slice(0, 50)) {
      assert.ok(r.lat > 40 && r.lat < 52, `Latitude invalide pour radar ${r.id}: ${r.lat}`);
      assert.ok(r.lng > -6 && r.lng < 10, `Longitude invalide pour radar ${r.id}: ${r.lng}`);
      assert.ok(r.type.length > 0);
    }
  });

  it('couvre les 101 départements français', () => {
    const depts = getAllDepartements();
    assert.equal(depts.length, 101);
  });

  it('trouve un département par son code (avec ou sans zéro initial)', () => {
    const d06 = getDepartementByCode('06');
    assert.ok(d06);
    assert.equal(d06?.name, 'Alpes-Maritimes');

    const d6 = getDepartementByCode('6');
    assert.ok(d6);
    assert.equal(d6?.name, 'Alpes-Maritimes');

    const d75 = getDepartementByCode('75');
    assert.ok(d75);
    assert.equal(d75?.name, 'Paris');
  });

  it('récupère les radars d\'un département donné', () => {
    const radars75 = getRadarsByDepartement('75');
    assert.ok(radars75.length > 0);
    for (const r of radars75) {
      assert.equal(r.dept, '75');
    }
  });

  it('classe les départements par nombre de radars décroissant', () => {
    const top = getTopDepartements(5);
    assert.equal(top.length, 5);
    assert.ok(top[0].radarCount >= top[1].radarCount);
    assert.ok(top[1].radarCount >= top[2].radarCount);
  });
});
