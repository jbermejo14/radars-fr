import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateAmendeVitesse, calculateMargeTechnique } from '../lib/amendes';

describe('Marges techniques d\'erreur (Arrêté du 4 juin 2009)', () => {
  it('Radar fixe : déduit 5 km/h en dessous de 100 km/h', () => {
    assert.equal(calculateMargeTechnique(50, 'fixe'), 5);
    assert.equal(calculateMargeTechnique(80, 'fixe'), 5);
    assert.equal(calculateMargeTechnique(90, 'fixe'), 5);
  });

  it('Radar fixe : déduit 5 % au-delà de 100 km/h (arrondi supérieur)', () => {
    assert.equal(calculateMargeTechnique(100, 'fixe'), 5);
    // 138 * 0.05 = 6.9 -> 7 km/h
    assert.equal(calculateMargeTechnique(138, 'fixe'), 7);
    // 110 * 0.05 = 5.5 -> 6 km/h
    assert.equal(calculateMargeTechnique(110, 'fixe'), 6);
  });

  it('Radar mobile : déduit 10 km/h puis 10 %', () => {
    assert.equal(calculateMargeTechnique(80, 'mobile'), 10);
    assert.equal(calculateMargeTechnique(130, 'mobile'), 13);
  });
});

describe('Sanctions et barème du Code de la route', () => {
  it('Pas d\'infraction si vitesse retenue <= vitesse autorisée', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 135,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
    });
    // 135 - 7 = 128 km/h <= 130
    assert.equal(res.isInfraction, false);
    assert.equal(res.pointsRetires, 0);
    assert.equal(res.amendeForfaitaire, 0);
  });

  it('Réforme 2024 : 0 point pour excès < 5 km/h hors agglomération (amende 68 €)', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 138,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
      typeVoie: 'hors_agglo',
    });
    // 138 - 7 = 131 km/h -> excès de +1 km/h
    assert.equal(res.isInfraction, true);
    assert.equal(res.vitesseRetenue, 131);
    assert.equal(res.excesVitesse, 1);
    assert.equal(res.pointsRetires, 0);
    assert.equal(res.reforme2024Appliquee, true);
    assert.equal(res.classeContravention, 3);
    assert.equal(res.amendeMinoree, 45);
    assert.equal(res.amendeForfaitaire, 68);
    assert.equal(res.amendeMajoree, 180);
  });

  it('Excès de 5 à 19 km/h hors agglo : 1 point et 68 €', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 145,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
      typeVoie: 'hors_agglo',
    });
    // 145 - 8 = 137 km/h -> excès de +7 km/h
    assert.equal(res.isInfraction, true);
    assert.equal(res.pointsRetires, 1);
    assert.equal(res.reforme2024Appliquee, false);
    assert.equal(res.classeContravention, 3);
    assert.equal(res.amendeForfaitaire, 68);
  });

  it('Excès en ville (<= 50 km/h) : contravention 4e classe (135 € forfaitaire)', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 62,
      vitesseAutorisee: 50,
      typeRadar: 'fixe',
      typeVoie: 'agglo',
    });
    // 62 - 5 = 57 km/h -> excès de +7 km/h
    assert.equal(res.isInfraction, true);
    assert.equal(res.pointsRetires, 1);
    assert.equal(res.classeContravention, 4);
    assert.equal(res.amendeMinoree, 90);
    assert.equal(res.amendeForfaitaire, 135);
    assert.equal(res.amendeMajoree, 375);
  });

  it('Excès de 20 à 29 km/h : 2 points et 135 €', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 160,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
      typeVoie: 'hors_agglo',
    });
    // 160 - 8 = 152 km/h -> excès de +22 km/h
    assert.equal(res.pointsRetires, 2);
    assert.equal(res.classeContravention, 4);
    assert.equal(res.amendeForfaitaire, 135);
  });

  it('Excès de 30 à 39 km/h : 3 points et suspension possible', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 175,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
    });
    // 175 - 9 = 166 km/h -> excès de +36 km/h
    assert.equal(res.pointsRetires, 3);
    assert.ok(res.sanctionsComplementaires.some((s) => s.includes('Suspension')));
  });

  it('Grand excès de vitesse >= 50 km/h : 6 points et contravention de 5e classe', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 195,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
    });
    // 195 - 10 = 185 km/h -> excès de +55 km/h
    assert.equal(res.pointsRetires, 6);
    assert.equal(res.classeContravention, 5);
    assert.equal(res.amendeMaximaleTribunal, 1500);
    assert.ok(res.sanctionsComplementaires.some((s) => s.includes('Rétention')));
  });
});
