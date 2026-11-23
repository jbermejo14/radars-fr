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

  it('Grand excès de vitesse >= 50 km/h : 6 points et délit', () => {
    const res = calculateAmendeVitesse({
      vitesseMesuree: 195,
      vitesseAutorisee: 130,
      typeRadar: 'fixe',
    });
    // 195 - 10 = 185 km/h -> excès de +55 km/h
    assert.equal(res.pointsRetires, 6);
    assert.equal(res.classeContravention, 'delit');
    assert.equal(res.amendeMaximaleTribunal, 3750);
    assert.ok(res.sanctionsComplementaires.some((s) => s.includes('Rétention')));
  });
});

describe('Grand excès de vitesse >= 50 km/h : délit depuis le 29/12/2025', () => {
  it('Applique l\'AFD 300/250/600, le plafond tribunal et les 6 points', () => {
    const res = calculateAmendeVitesse({ vitesseMesuree: 195, vitesseAutorisee: 130, typeRadar: 'fixe' });
    assert.equal(res.classeContravention, 'delit');
    assert.equal(res.pointsRetires, 6);
    assert.equal(res.amendeForfaitaire, 300);
    assert.equal(res.amendeMinoree, 250);
    assert.equal(res.amendeMajoree, 600);
    assert.equal(res.amendeMaximaleTribunal, 3750);
    assert.equal(res.emprisonnementMaxMois, 3);
    assert.ok(res.sanctionsComplementaires.some((s) => s.includes('Immobilisation')));
    assert.ok(res.sanctionsComplementaires.some((s) => s.includes('Confiscation')));
  });

  it('Borne : excès retenu 49 km/h reste une contravention, 50 km/h est un délit', () => {
    const limite49 = calculateAmendeVitesse({ vitesseMesuree: 105, vitesseAutorisee: 50, typeRadar: 'fixe' });
    assert.equal(limite49.excesVitesse, 49);
    assert.equal(limite49.classeContravention, 4);
    assert.equal(limite49.pointsRetires, 4);
    const limite50 = calculateAmendeVitesse({ vitesseMesuree: 106, vitesseAutorisee: 50, typeRadar: 'fixe' });
    assert.equal(limite50.excesVitesse, 50);
    assert.equal(limite50.classeContravention, 'delit');
    assert.equal(limite50.pointsRetires, 6);
  });

  it('Marge technique selon la vitesse mesurée : 99 -> 94, 100 -> 95, 137 -> 130', () => {
    const retenue = (mesuree: number) =>
      calculateAmendeVitesse({ vitesseMesuree: mesuree, vitesseAutorisee: 30, typeRadar: 'fixe' }).vitesseRetenue;
    assert.equal(retenue(99), 94);
    assert.equal(retenue(100), 95);
    assert.equal(retenue(137), 130);
  });
});
