import React from 'react';
import { LegalPage } from '@/components/LegalPage';
import { getAdSenseClient } from '@/components/AdSenseScript';
import { legalMetadata } from '@/lib/legal-text';
import { SITE_NAME } from '@/lib/site';

const PATH = '/cookies';
const URL_COOKIES_GOOGLE = 'https://policies.google.com/technologies/cookies?hl=fr';

export const metadata = legalMetadata(
  PATH,
  'Politique relative aux cookies',
  `Gestion des cookies et du stockage local sur ${SITE_NAME}.`
);

export default function CookiesPage() {
  const adsenseActive = getAdSenseClient() !== null;

  return (
    <LegalPage title="Politique relative aux cookies" path={PATH} breadcrumbLabel="Cookies">
      <h2 className="text-base font-bold text-fg">Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un fichier texte déposé sur votre terminal lors de la navigation. Son utilisation est régie par l&apos;article 82 de la loi Informatique et Libertés.
      </p>

      <h2 className="text-base font-bold text-fg">Traceurs utilisés sur ce site</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Préférence d&apos;affichage (<code>ododex-theme</code> dans <code>localStorage</code>) :</strong> mémorise votre préférence graphique clair/sombre. Strictement nécessaire et exempté de consentement.
        </li>
        {adsenseActive && (
          <li>
            <strong>Cookies publicitaires Google AdSense :</strong> déposés uniquement si vous y consentez via la bannière de consentement conforme au standard IAB TCF v2.2.
          </li>
        )}
      </ul>

      {adsenseActive && (
        <>
          <h2 className="text-base font-bold text-fg">Gestion du consentement</h2>
          <p>
            Vous pouvez à tout moment modifier ou retirer votre consentement publicitaire. Pour en savoir plus :{' '}
            <a href={URL_COOKIES_GOOGLE} target="_blank" rel="noopener noreferrer" className="text-accent underline">policies.google.com/technologies/cookies</a>.
          </p>
        </>
      )}
    </LegalPage>
  );
}
