import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSV_URL = 'https://static.data.gouv.fr/resources/radars-automatiques/20181025-141231/radars.csv';
const REGIONS_PATH = '/Users/jaimebermejo/Desktop/carte-grise-fr/data/regions.json';

async function main() {
  console.log('Téléchargement du dataset officiel des radars...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} lors du téléchargement de radars.csv`);
  const csvText = await res.text();

  console.log('Chargement des départements...');
  const regions = JSON.parse(fs.readFileSync(REGIONS_PATH, 'utf8'));
  const deptMap = new Map();
  for (const reg of regions) {
    for (const d of reg.departements) {
      deptMap.set(d.code, {
        code: d.code,
        name: d.name,
        regionSlug: reg.slug,
        regionName: reg.name,
      });
    }
  }

  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  console.log(`Lignes CSV trouvées : ${lines.length}`);

  const radars = [];
  const deptCounts = new Map();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parser CSV simple respectant les virgules
    const cols = line.split(',');
    if (cols.length < 10) continue;

    // date_heure_dernier_changement,date_heure_creation,departement,latitude,longitude,id,direction,equipement,date_installation,type,emplacement,route,longueur_troncon_km,vitesse_poids_lourds_kmh,vitesse_vehicules_legers_kmh
    let dept = cols[2].trim();
    if (dept.length === 1) dept = `0${dept}`;

    const lat = parseFloat(cols[3]);
    const lng = parseFloat(cols[4]);
    const id = cols[5]?.trim() || `radar-${i}`;
    const direction = cols[6]?.trim() || '';
    const equipement = cols[7]?.trim() || '';
    const dateInstall = cols[8]?.trim() || '';
    const type = cols[9]?.trim() || 'Radar fixe';
    const emplacement = cols[10]?.trim() || '';
    const route = cols[11]?.trim() || '';
    const vitesse = cols[14] ? parseInt(cols[14].trim(), 10) : null;

    if (isNaN(lat) || isNaN(lng)) continue;

    radars.push({
      id,
      dept,
      lat: Math.round(lat * 100000) / 100000,
      lng: Math.round(lng * 100000) / 100000,
      type,
      route,
      direction,
      emplacement,
      vitesse: isNaN(vitesse) ? null : vitesse,
      dateInstall: dateInstall ? dateInstall.split('T')[0] : null,
    });

    deptCounts.set(dept, (deptCounts.get(dept) || 0) + 1);
  }

  console.log(`Radars valides extraits : ${radars.length}`);

  // Construire la liste des départements enrichie
  const departements = [];
  for (const [code, info] of deptMap.entries()) {
    const count = deptCounts.get(code) || 0;
    departements.push({
      code,
      name: info.name,
      regionSlug: info.regionSlug,
      regionName: info.regionName,
      radarCount: count,
    });
  }

  // Trier les départements par code
  departements.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

  const dataDir = path.join(DIR, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'radars.json'), JSON.stringify(radars));
  fs.writeFileSync(path.join(dataDir, 'departements.json'), JSON.stringify(departements, null, 2));

  console.log(`Données générées avec succès dans ${dataDir} :`);
  console.log(`- radars.json : ${radars.length} radars`);
  console.log(`- departements.json : ${departements.length} départements`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
