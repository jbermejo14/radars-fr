export type TypeRadar = 'fixe' | 'mobile';
export type TypeVoie = 'agglo' | 'hors_agglo';

export interface CalculAmendeInput {
  vitesseMesuree: number;
  vitesseAutorisee: number;
  typeRadar?: TypeRadar;
  typeVoie?: TypeVoie;
}

export interface CalculAmendeResult {
  vitesseMesuree: number;
  vitesseAutorisee: number;
  typeRadar: TypeRadar;
  typeVoie: TypeVoie;
  margeTechnique: number;
  vitesseRetenue: number;
  excesVitesse: number;
  isInfraction: boolean;
  pointsRetires: number;
  classeContravention: 0 | 3 | 4 | 5;
  amendeMinoree: number;
  amendeForfaitaire: number;
  amendeMajoree: number;
  amendeMaximaleTribunal: number;
  sanctionsComplementaires: string[];
  delaiRecuperationPoints: string;
  reforme2024Appliquee: boolean;
}

/**
 * Calcule la marge technique d'erreur officielle selon l'Arrêté ministériel du 4 juin 2009.
 * - Radar fixe : 5 km/h jusqu'à 100 km/h, puis 5 % de la vitesse au-delà (arrondi à l'entier supérieur).
 * - Radar mobile en mouvement : 10 km/h jusqu'à 100 km/h, puis 10 % au-delà.
 */
export function calculateMargeTechnique(vitesseMesuree: number, typeRadar: TypeRadar = 'fixe'): number {
  if (vitesseMesuree <= 0) return 0;

  if (typeRadar === 'fixe') {
    if (vitesseMesuree < 100) {
      return 5;
    }
    return Math.ceil(vitesseMesuree * 0.05);
  } else {
    // Radar mobile (en mouvement)
    if (vitesseMesuree < 100) {
      return 10;
    }
    return Math.ceil(vitesseMesuree * 0.1);
  }
}

/**
 * Calcule la sanction complète pour excès de vitesse selon le Code de la route (Art. R413-14).
 * Prend en compte la réforme du 1er janvier 2024 (Décret n° 2023-1150 supprimant la perte d'un point
 * pour les excès inférieurs à 5 km/h).
 */
export function calculateAmendeVitesse(input: CalculAmendeInput): CalculAmendeResult {
  const {
    vitesseMesuree,
    vitesseAutorisee,
    typeRadar = 'fixe',
    typeVoie = vitesseAutorisee <= 50 ? 'agglo' : 'hors_agglo',
  } = input;

  const margeTechnique = calculateMargeTechnique(vitesseMesuree, typeRadar);
  const vitesseRetenue = Math.max(0, vitesseMesuree - margeTechnique);
  const excesVitesse = Math.max(0, vitesseRetenue - vitesseAutorisee);

  if (excesVitesse <= 0) {
    return {
      vitesseMesuree,
      vitesseAutorisee,
      typeRadar,
      typeVoie,
      margeTechnique,
      vitesseRetenue,
      excesVitesse: 0,
      isInfraction: false,
      pointsRetires: 0,
      classeContravention: 0,
      amendeMinoree: 0,
      amendeForfaitaire: 0,
      amendeMajoree: 0,
      amendeMaximaleTribunal: 0,
      sanctionsComplementaires: [],
      delaiRecuperationPoints: 'Aucune perte de points',
      reforme2024Appliquee: false,
    };
  }

  let pointsRetires = 0;
  let classeContravention: 0 | 3 | 4 | 5 = 4;
  let amendeMinoree = 90;
  let amendeForfaitaire = 135;
  let amendeMajoree = 375;
  let amendeMaximaleTribunal = 750;
  const sanctionsComplementaires: string[] = [];
  let delaiRecuperationPoints = '';
  let reforme2024Appliquee = false;

  if (excesVitesse < 20) {
    if (excesVitesse < 5) {
      // Réforme Décret n° 2023-1150 du 1er janvier 2024 : 0 point
      pointsRetires = 0;
      reforme2024Appliquee = true;
      delaiRecuperationPoints = 'Aucun point retiré (réforme 2024 pour les excès < 5 km/h)';
    } else {
      pointsRetires = 1;
      delaiRecuperationPoints = '6 mois sans nouvelle infraction (récupération automatique)';
    }

    if (vitesseAutorisee > 50 && typeVoie === 'hors_agglo') {
      // Contravention de 3e classe
      classeContravention = 3;
      amendeMinoree = 45;
      amendeForfaitaire = 68;
      amendeMajoree = 180;
      amendeMaximaleTribunal = 450;
    } else {
      // Contravention de 4e classe (en agglomération ou zone 50)
      classeContravention = 4;
      amendeMinoree = 90;
      amendeForfaitaire = 135;
      amendeMajoree = 375;
      amendeMaximaleTribunal = 750;
    }
  } else if (excesVitesse >= 20 && excesVitesse < 30) {
    pointsRetires = 2;
    classeContravention = 4;
    amendeMinoree = 90;
    amendeForfaitaire = 135;
    amendeMajoree = 375;
    amendeMaximaleTribunal = 750;
    delaiRecuperationPoints = '2 ans sans nouvelle infraction (ou 3 ans si autre infraction)';
  } else if (excesVitesse >= 30 && excesVitesse < 40) {
    pointsRetires = 3;
    classeContravention = 4;
    amendeMinoree = 90;
    amendeForfaitaire = 135;
    amendeMajoree = 375;
    amendeMaximaleTribunal = 750;
    sanctionsComplementaires.push('Suspension du permis de conduire jusqu\'à 3 ans');
    sanctionsComplementaires.push('Interdiction de conduire certains véhicules à moteur');
    sanctionsComplementaires.push('Obligation d\'accomplir un stage de sensibilisation à la sécurité routière');
    delaiRecuperationPoints = '3 ans sans nouvelle infraction';
  } else if (excesVitesse >= 40 && excesVitesse < 50) {
    pointsRetires = 4;
    classeContravention = 4;
    amendeMinoree = 90;
    amendeForfaitaire = 135;
    amendeMajoree = 375;
    amendeMaximaleTribunal = 750;
    sanctionsComplementaires.push('Rétention immédiate du permis par les forces de l\'ordre (72 heures)');
    sanctionsComplementaires.push('Suspension administrative puis judiciaire du permis jusqu\'à 3 ans');
    sanctionsComplementaires.push('Obligation d\'accomplir un stage de sensibilisation');
    sanctionsComplementaires.push('Confiscation possible du véhicule');
    delaiRecuperationPoints = '3 ans sans nouvelle infraction';
  } else {
    // Grand excès de vitesse >= 50 km/h (Contravention de 5e classe)
    pointsRetires = 6;
    classeContravention = 5;
    amendeMinoree = 0; // Pas d'amende forfaitaire minorée
    amendeForfaitaire = 0; // Passe directement devant le Tribunal de police
    amendeMajoree = 0;
    amendeMaximaleTribunal = 1500;
    sanctionsComplementaires.push('Rétention immédiate du permis de conduire (72h)');
    sanctionsComplementaires.push('Suspension du permis jusqu\'à 3 ans (sans aménagement professionnel)');
    sanctionsComplementaires.push('Confiscation du véhicule si le conducteur en est le propriétaire');
    sanctionsComplementaires.push('Interdiction de conduire certains véhicules terrestres à moteur pendant 3 ans au plus');
    sanctionsComplementaires.push('Obligation d\'effectuer un stage de sensibilisation');
    sanctionsComplementaires.push('En cas de récidive : délit puni de 3 750 € d\'amende et 3 mois de prison');
    delaiRecuperationPoints = '3 ans sans nouvelle infraction';
  }

  return {
    vitesseMesuree,
    vitesseAutorisee,
    typeRadar,
    typeVoie,
    margeTechnique,
    vitesseRetenue,
    excesVitesse,
    isInfraction: true,
    pointsRetires,
    classeContravention,
    amendeMinoree,
    amendeForfaitaire,
    amendeMajoree,
    amendeMaximaleTribunal,
    sanctionsComplementaires,
    delaiRecuperationPoints,
    reforme2024Appliquee,
  };
}
