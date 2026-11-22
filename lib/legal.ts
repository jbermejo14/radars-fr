import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type TipoTitular = 'persona-fisica' | 'empresa';

export interface Titular {
  tipo: TipoTitular;
  nombre: string;
  nif: string;
  domicilio: string;
  email: string;
  registroMercantil: string;
}

/** Date de la dernière révision des textes légaux, ISO. */
export const FECHA_TEXTOS_LEGALES = '2026-11-22';

const TIPOS_TITULAR: readonly TipoTitular[] = ['persona-fisica', 'empresa'];
const CAMPOS_TEXTO = ['nombre', 'nif', 'domicilio', 'email', 'registroMercantil'] as const;

const FICHERO_TITULAR = join('config', 'titular.json');
const FICHERO_TITULAR_EJEMPLO = join('config', 'titular.example.json');

export function ficheroTitular(directorioBase: string = process.cwd()): string {
  return existsSync(join(directorioBase, FICHERO_TITULAR)) ? FICHERO_TITULAR : FICHERO_TITULAR_EJEMPLO;
}

export function getTitular(directorioBase: string = process.cwd()): Titular {
  const fichero = ficheroTitular(directorioBase);
  const datos = JSON.parse(readFileSync(join(directorioBase, fichero), 'utf8')) as Record<string, unknown>;
  const tipo = datos.tipo;
  if (typeof tipo !== 'string' || !TIPOS_TITULAR.includes(tipo as TipoTitular)) {
    throw new Error(
      `${fichero}: le champ "tipo" doit être "persona-fisica" ou "empresa" (valeur actuelle: ${JSON.stringify(tipo)}).`
    );
  }
  for (const campo of CAMPOS_TEXTO) {
    if (typeof datos[campo] !== 'string') {
      throw new Error(`${fichero}: champ "${campo}" manquant ou invalide.`);
    }
  }
  return {
    tipo: tipo as TipoTitular,
    nombre: datos.nombre as string,
    nif: datos.nif as string,
    domicilio: datos.domicilio as string,
    email: datos.email as string,
    registroMercantil: datos.registroMercantil as string
  };
}
