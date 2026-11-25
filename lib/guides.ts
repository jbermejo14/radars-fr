export interface GuideItem {
  slug: string;
  title: string;
  /** Titre sans la marque : `buildTitle` ajoute « | Ododex ». */
  metaTitle: string;
  metaDescription: string;
  summary: string;
  publishedDate: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const GUIDES: GuideItem[] = [
  {
    slug: 'bareme-amende-exces-de-vitesse',
    title: 'Barème des amendes et perte de points pour excès de vitesse (2026)',
    metaTitle: 'Amendes excès de vitesse 2026 : barème et points',
    metaDescription: 'Barème des amendes pour excès de vitesse selon le Code de la route : montants minoré, forfaitaire et majoré, et points retirés selon votre vitesse.',
    summary: 'Le barème des sanctions pour excès de vitesse dépend de la vitesse retenue après déduction de la marge technique et de la limitation de vitesse autorisée (supérieure à 50 km/h, ou de 50 km/h ou moins).',
    publishedDate: '2026-01-01',
    sections: [
      {
        heading: 'La réforme du 1er janvier 2024 (Décret n° 2023-1150)',
        content: [
          'Depuis le 1er janvier 2024, une réforme majeure s\'applique sur les routes françaises : les excès de vitesse inférieurs à 5 km/h (après déduction de la marge d\'erreur technique) n\'entraînent plus aucun retrait de point sur votre permis de conduire.',
          'Attention : l\'amende financière reste en revanche intégralement due (68 € si la limitation est supérieure à 50 km/h, 135 € si elle est de 50 km/h ou moins). Dès que l\'excès atteint ou dépasse 5 km/h (entre 5 et 19 km/h), le retrait d\'un point continue de s\'appliquer.'
        ]
      },
      {
        heading: 'Différence entre amende minorée, forfaitaire et majorée',
        content: [
          'En France, le montant de l\'amende varie selon le délai dans lequel vous effectuez votre télépaiement :',
          '• Amende minorée (45 € ou 90 €) : Si vous réglez dans les 15 jours par courrier, ou dans les 30 jours par télépaiement en ligne sur amendes.gouv.fr.\n• Amende forfaitaire (68 € ou 135 €) : Si vous réglez entre 30 et 60 jours après la date de l\'avis de contravention.\n• Amende majorée (180 € ou 375 €) : Si vous ne réglez pas dans les 60 jours. L\'amende est transmise au Trésor Public pour recouvrement forcé (avec saisie sur compte bancaire).'
        ]
      },
      {
        heading: 'Grand excès de vitesse (supérieur ou égal à 50 km/h)',
        content: [
          'Depuis le 29 décembre 2025 (loi n° 2025-622 du 9 juillet 2025 et décret n° 2025-1269 du 22 décembre 2025), rouler à 50 km/h ou plus au-dessus de la vitesse maximale autorisée est un délit dès la première fois, et non plus une simple contravention.',
          'Si le conducteur est identifié, une amende forfaitaire délictuelle (AFD) peut être appliquée : 300 € (250 € minorée, 600 € majorée). Sinon, ou si le dossier est porté devant le tribunal correctionnel, les peines encourues sont de 3 750 € d\'amende et 3 mois d\'emprisonnement.',
          'Les autres conséquences sont lourdes : retrait de 6 points, suspension du permis jusqu\'à 3 ans, immobilisation du véhicule et confiscation possible du véhicule.'
        ]
      }
    ],
    faq: [
      {
        q: 'Quel est le montant de l\'amende pour un excès de vitesse de moins de 20 km/h ?',
        a: 'L\'amende est de 68 € (minorée à 45 €) si la route est limitée à plus de 50 km/h. Elle est de 135 € (minorée à 90 €) si la vitesse autorisée est inférieure ou égale à 50 km/h.'
      },
      {
        q: 'Quand le retrait de points devient-il effectif sur le permis ?',
        a: 'Le retrait de points intervient uniquement après le paiement de l\'amende forfaitaire, l\'émission du titre exécutoire de l\'amende majorée ou une condamnation définitive par le tribunal.'
      }
    ]
  },
  {
    slug: 'recuperation-points-permis-delais',
    title: 'Délais de récupération automatique des points et stages de sensibilisation',
    metaTitle: 'Récupération de points de permis : délais et stages',
    metaDescription: 'Comment récupérer vos points de permis : délais automatiques de 6 mois, 2 ans, 3 ans ou 10 ans sans infraction, et stage de sensibilisation (+4 points).',
    summary: 'La reconstitution de votre capital de points de permis peut se faire automatiquement avec le temps ou rapidement grâce à un stage agréé de récupération de points.',
    publishedDate: '2026-01-01',
    sections: [
      {
        heading: 'Délais de récupération automatique de plein droit',
        content: [
          'Le Code de la route prévoit plusieurs délais stricts sans commettre de nouvelle infraction pour récupérer automatiquement des points :',
          '• Délai de 6 mois : Pour la perte d\'un seul point (excès de 5 à 19 km/h, chevauchement de ligne continue). Le point est restitué au bout de 6 mois sans aucune autre infraction.\n• Délai de 2 ans : Si vous avez commis des contraventions de 2e ou 3e classe (ex : changement de direction sans clignotant). Votre capital remonte à 12 points après 2 ans sans infraction.\n• Délai de 3 ans : Si vous avez commis une contravention de classe 4 ou 5 (téléphone en main, feu rouge, excès >= 20 km/h). Il faut 3 ans sans infraction pour retrouver 12 points.\n• Règle des 10 ans : Les points perdus pour des contraventions sont automatiquement réattribués 10 ans après l\'infraction, même si vous en avez commis d\'autres entre-temps.'
        ]
      },
      {
        heading: 'Faire un stage de récupération de points (+4 points)',
        content: [
          'Si votre solde de points devient critique (inférieur à 6 points), vous pouvez participer volontairement à un stage de sensibilisation à la sécurité routière d\'une durée de 2 jours consécutifs.',
          'Ce stage permet de récupérer jusqu\'à 4 points (dans la limite du plafond légal de 12 points). Vous pouvez effectuer au maximum un stage par an (délai d\'un an et un jour entre deux stages).'
        ]
      }
    ],
    faq: [
      {
        q: 'Comment consulter mon solde de points officiel ?',
        a: 'Vous pouvez consulter gratuitement et en temps réel votre solde de points sur le portail officiel du Ministère de l\'Intérieur : MesPointsPermis (mespointspermis.interieur.gouv.fr) avec votre compte FranceConnect.'
      },
      {
        q: 'Un stage peut-il annuler une amende ?',
        a: 'Non, le stage permet uniquement de recréditer des points sur votre dossier administratif. Le paiement de l\'amende reste obligatoire.'
      }
    ]
  },
  {
    slug: 'contester-pv-radar-antai',
    title: 'Comment contester un PV de radar automatique en ligne sur l\'ANTAI',
    metaTitle: 'Contester un PV de radar sur l\'ANTAI : démarche',
    metaDescription: 'Guide pour contester une amende de radar automatique sur antai.gouv.fr : délai de 45 jours, consignation préalable et désignation du conducteur réel.',
    summary: 'Si vous n\'étiez pas au volant de votre voiture au moment du flash ou si votre véhicule a été vendu ou usurpé, vous pouvez contester l\'amende en ligne sans avance de frais.',
    publishedDate: '2026-01-01',
    sections: [
      {
        heading: 'Les 3 motifs légaux de contestation',
        content: [
          'Le portail officiel de l\'Agence Nationale de Traitement Automatisé des Infractions (antai.gouv.fr) prévoit 3 cas de contestation :',
          '• Cas n° 1 : Véhicule volé, détruit ou plaques d\'immatriculation usurpées (joindre le récépissé de dépôt de plainte).\n• Cas n° 2 : Véhicule prêté, loué ou cédé avant la date de l\'infraction. Vous désignez l\'identité et l\'adresse du conducteur réel (aucune consignation financière exigée).\n• Cas n° 3 : Autre motif (contestation de l\'infraction, photo floue, signalisation absente). Une consignation préalable égale au montant de l\'amende forfaitaire (135 € ou 68 €) est obligatoire.'
        ]
      },
      {
        heading: 'Règle d\'or : Ne pas payer l\'amende si vous contestez',
        content: [
          'Attention : payer une amende équivaut légalement à reconnaître l\'infraction ! Si vous réglez l\'amende, le retrait de points devient automatique et irréversible, et toute contestation ultérieure sera déclarée irrecevable par l\'officier du ministère public.',
          'Si vous devez consigner (cas n° 3), assurez-vous de bien sélectionner la modalité « Consignation » sur amendes.gouv.fr et non « Paiement ».'
        ]
      }
    ],
    faq: [
      {
        q: 'Quel est le délai légal pour contester un PV ?',
        a: 'Vous disposez d\'un délai légal strict de 45 jours à compter de la date figurant sur l\'avis de contravention (30 jours pour une amende forfaitaire majorée).'
      },
      {
        q: 'Puis-je demander la photo prise par le radar ?',
        a: 'Oui, vous pouvez demander le cliché de l\'infraction gratuitement sur le site de l\'ANTAI ou par courrier avant de contester. La demande de photo n\'interrompt cependant pas le délai de 45 jours.'
      }
    ]
  },
  {
    slug: 'marge-technique-radar-erreur',
    title: 'Marge technique des radars : Comment est calculée la vitesse retenue ?',
    metaTitle: 'Marge technique des radars : 5 km/h ou 5 %',
    metaDescription: 'La marge technique d\'erreur des radars automatiques fixes et mobiles : tableau des tolérances et formule de calcul de la vitesse retenue.',
    summary: 'Les radars ne retiennent jamais la vitesse brute mesurée : une marge d\'erreur réglementaire est obligatoirement déduite en faveur de l\'automobiliste.',
    publishedDate: '2026-01-01',
    sections: [
      {
        heading: 'Pourquoi existe-t-il une marge d\'erreur technique ?',
        content: [
          'Aucun appareil de mesure cinémométrique n\'est parfait à 100 %. L\'Arrêté ministériel du 4 juin 2009 relatif aux cinémomètres de contrôle routier impose donc une déduction systématique pour couvrir les éventuelles imprécisions du capteur, de l\'angle de tir ou de la météo.',
          'C\'est la vitesse retenue après déduction de cette marge qui fait juridiquement foi pour déterminer si une infraction a été commise et calculer le barème des sanctions.'
        ]
      },
      {
        heading: 'Le tableau des marges techniques applicables selon le type de radar',
        content: [
          '• Radars fixes (cabines, tourelles, chantiers, tronçons) :\n  - Jusqu\'à 100 km/h : déduction fixe de 5 km/h.\n  - Au-delà de 100 km/h : déduction de 5 % de la vitesse mesurée (arrondie au km/h supérieur).\n  - Exemple : Flashé à 138 km/h sur autoroute ➔ 5 % de 138 = 6,9 km/h arrondi à 7 km/h ➔ Vitesse retenue = 131 km/h.',
          '• Radars mobiles en mouvement (voitures radars banalisées) :\n  - Jusqu\'à 100 km/h : déduction fixe de 10 km/h.\n  - Au-delà de 100 km/h : déduction de 10 % de la vitesse mesurée.\n  - Exemple : Flashé à 140 km/h ➔ Marge de 14 km/h ➔ Vitesse retenue = 126 km/h (pas d\'infraction à 130 km/h !).'
        ]
      }
    ],
    faq: [
      {
        q: 'À quelle vitesse se déclenche un radar fixe à 80 km/h ?',
        a: 'Avec la marge technique de 5 km/h, un radar sur une route limitée à 80 km/h flashe à partir d\'une vitesse mesurée de 86 km/h (vitesse retenue = 81 km/h).'
      },
      {
        q: 'Mon compteur de voiture affiche-t-il la même vitesse que le radar ?',
        a: 'Non, les compteurs de voiture surestiment presque toujours la vitesse réelle de 2 à 5 km/h par obligation d\'homologation européenne (un compteur n\'a jamais le droit d\'indiquer une vitesse inférieure à la réalité).'
      }
    ]
  }
];

export function findGuideBySlug(slug: string): GuideItem | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
