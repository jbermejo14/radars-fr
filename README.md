# Radars & Amendes France 2026 — Ododex (`/fr/radars`)

Carte interactive des 3 350 radars automatiques en France et simulateur de perte de points et du montant des amendes pour excès de vitesse (Code de la route 2026).

- **URL en production** : [https://ododex.com/fr/radars](https://ododex.com/fr/radars)
- **Worker Cloudflare** : `ododex-radars`
- **Portail parent** : [Ododex](https://ododex.com/fr/)

---

## 🎯 Fonctionnalités Clés

1. **Carte Interactive des 3 350 Radars** :
   - Radars fixes classiques, radars de tronçon (vitesse moyenne), radars autonomes (chantiers) et radars de franchissement de feu rouge.
   - Données officielles ouvertes du Ministère de l'Intérieur / Sécurité Routière.
2. **Simulateur d'Amendes & Points 2026** :
   - Vitesse retenue avec application de la marge technique légale (5 km/h ou 5% au-dessus de 100 km/h).
   - Intégration de la réforme 2024-2026 : **0 point retiré** pour les excès inférieurs à 5 km/h.
   - Calcul des tarifs minoré (45 € / 90 €), forfaitaire (68 € / 135 €) et majoré (180 € / 375 €).
3. **Pages par Département (101 départements)** :
   - Fiches départementales avec liste des axes contrôlés, emplacements et limitation de vitesse.
4. **Monétisation** :
   - AdSense sans Cumulative Layout Shift.
   - Recommandation d'équipements de sécurité, dashcams et assistants d'aide à la conduite conformes (Coyote, Waze).

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router) avec export statique (`output: 'export'`).
- **Cartographie** : Leaflet avec tuiles OpenStreetMap / Carto.
- **Styles** : Tailwind CSS v4 avec mode sombre/clair synchronisé.
- **SEO** : Schema.org `FAQPage` et métadonnées canoniques.

---

## 🚀 Développement Local & Tests

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Exécuter les tests unitaires
npm test

# Compiler l'export statique
npm run build
```
