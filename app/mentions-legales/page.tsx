import React from 'react';
import { LegalPage } from '@/components/LegalPage';
import { getTitular, type Titular } from '@/lib/legal';
import { legalHolderValue, legalMetadata } from '@/lib/legal-text';
import { SITE_NAME } from '@/lib/site';

const PATH = '/mentions-legales';
const URL_CLOUDFLARE = 'https://www.cloudflare.com';
const URL_DATA_GOUV = 'https://www.data.gouv.fr/fr/datasets/radars-automatiques/';
const URL_ANTAI = 'https://antai.gouv.fr';

export const metadata = legalMetadata(
  PATH,
  'Mentions légales',
  `Mentions légales de ${SITE_NAME} : éditeur, hébergeur, sources des données des radars et limites de responsabilité.`
);

export default function MentionsLegalesPage() {
  const holder = getTitular();
  const field = (name: keyof Titular) => legalHolderValue(holder, name);

  return (
    <LegalPage title="Mentions légales" path={PATH}>
      <h2 className="text-base font-bold text-fg">Éditeur du site</h2>
      <p>
        Conformément à l&apos;article 6 III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), ce site est édité par :
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Nom : {field('nombre')}</li>
        <li>Numéro d&apos;identification fiscale (NIF, Espagne) : {field('nif')}</li>
        <li>Adresse : {field('domicilio')}</li>
        <li>Adresse e-mail de contact : {field('email')}</li>
        {holder.tipo === 'empresa' && <li>Immatriculation au registre du commerce : {field('registroMercantil')}</li>}
      </ul>

      <h2 className="text-base font-bold text-fg">Directeur de la publication</h2>
      <p>Le directeur de la publication est l&apos;éditeur du site : {field('nombre')}.</p>

      <h2 className="text-base font-bold text-fg">Hébergeur</h2>
      <p>
        Le site est hébergé par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (<a href={URL_CLOUDFLARE} target="_blank" rel="noopener noreferrer" className="text-accent underline">cloudflare.com</a>).
      </p>

      <h2 className="text-base font-bold text-fg">Objet du site et indépendance</h2>
      <p>
        {SITE_NAME} présente les radars automatiques fixes en France et fournit un outil gratuit de simulation des sanctions (amendes et points) encourues selon le Code de la route en vigueur.
      </p>
      <p>
        {SITE_NAME} est un site d&apos;information strictement <strong>indépendant</strong>. Il n&apos;est pas affilié, ni mandaté, ni associé à l&apos;Agence Nationale de Traitement Automatisé des Infractions (ANTAI), ni au Ministère de l&apos;Intérieur, ni à la Sécurité Routière, ni à aucun service de police ou de gendarmerie nationale.
      </p>

      <h2 className="text-base font-bold text-fg">Sources des données</h2>
      <p>
        Les données de localisation des radars proviennent de la base publique officielle du Ministère de l&apos;Intérieur publiée sur{' '}
        <a href={URL_DATA_GOUV} target="_blank" rel="noopener noreferrer" className="text-accent underline">data.gouv.fr</a> et sont réutilisées sous Licence Ouverte.
      </p>

      <h2 className="text-base font-bold text-fg">Caractère indicatif des calculs</h2>
      <p>
        Les résultats de simulation sont fournis à titre strictement indicatif d&apos;après le Code de la route. Seuls les procès-verbaux officiels émis par l&apos;ANTAI et les décisions de justice ont une valeur juridique contraignante.
      </p>
    </LegalPage>
  );
}
