import React from 'react';
import { LegalPage } from '@/components/LegalPage';
import { getAdSenseClient } from '@/components/AdSenseScript';
import { getTitular, type Titular } from '@/lib/legal';
import { legalHolderValue, legalMetadata } from '@/lib/legal-text';
import { SITE_NAME } from '@/lib/site';

const PATH = '/confidentialite';
const URL_AEPD = 'https://www.aepd.es';
const URL_CNIL_PLAINTE = 'https://www.cnil.fr/fr/plaintes';

export const metadata = legalMetadata(
  PATH,
  'Politique de confidentialité',
  `Traitement des données personnelles sur ${SITE_NAME}, conformément au RGPD.`
);

export default function ConfidentialitePage() {
  const holder = getTitular();
  const field = (name: keyof Titular) => legalHolderValue(holder, name);
  const adsenseActive = getAdSenseClient() !== null;

  return (
    <LegalPage title="Politique de confidentialité" path={PATH} breadcrumbLabel="Confidentialité">
      <h2 className="text-base font-bold text-fg">Responsable du traitement</h2>
      <p>
        Le responsable du traitement est {field('nombre')} (NIF : {field('nif')}), domicilié à : {field('domicilio')}. Contact : {field('email')}.
      </p>

      <h2 className="text-base font-bold text-fg">Données traitées</h2>
      <p>
        Ce site ne requiert aucune création de compte et ne collecte aucune donnée nominative.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Simulateur d&apos;amendes :</strong> les vitesses saisies sont traitées exclusivement en local dans votre navigateur. Aucune donnée n&apos;est transmise à un serveur ni conservée.
        </li>
        <li>
          <strong>Carte interactive :</strong> les fonds cartographiques sont chargés depuis OpenStreetMap sous licence ODbL.
        </li>
      </ul>

      <h2 className="text-base font-bold text-fg">Destinataires techniques</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Cloudflare, Inc. : hébergement et CDN de distribution de contenu.</li>
        <li>OpenStreetMap : tuiles cartographiques.</li>
        {adsenseActive && (
          <li>Google AdSense : régie publicitaire sous réserve de votre consentement explicite via la CMP certifiée TCF v2.2.</li>
        )}
      </ul>

      <h2 className="text-base font-bold text-fg">Vos droits (RGPD)</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;opposition en écrivant à {field('email')}.
        Vous pouvez également saisir la CNIL (<a href={URL_CNIL_PLAINTE} target="_blank" rel="noopener noreferrer" className="text-accent underline">cnil.fr/fr/plaintes</a>) ou l&apos;AEPD (<a href={URL_AEPD} target="_blank" rel="noopener noreferrer" className="text-accent underline">aepd.es</a>).
      </p>
    </LegalPage>
  );
}
