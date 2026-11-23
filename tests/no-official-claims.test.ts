import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const SCANNED_DIRECTORIES = ['app', 'components', 'lib'];
const SCANNED_EXTENSIONS = ['.ts', '.tsx'];
const FORBIDDEN_EXPRESSIONS = ['simulateur officiel', 'simulation officielle', '1 500 €', '5e classe'];

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return collectSourceFiles(path);
    return SCANNED_EXTENSIONS.some((extension) => path.endsWith(extension)) ? [path] : [];
  });
}

describe('Textes interdits', () => {
  it('Aucun fichier de app/, components/ ou lib/ ne contient les expressions interdites', () => {
    const files = SCANNED_DIRECTORIES.flatMap(collectSourceFiles);
    assert.ok(files.length > 0);
    for (const file of files) {
      const content = readFileSync(file, 'utf8').toLowerCase();
      for (const expression of FORBIDDEN_EXPRESSIONS) {
        assert.ok(!content.includes(expression.toLowerCase()), `${file} contient « ${expression} »`);
      }
    }
  });
});
