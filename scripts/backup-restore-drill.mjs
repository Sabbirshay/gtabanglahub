import { cp, mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../src/data/', import.meta.url));
const temporaryRoot = await mkdtemp(join(tmpdir(), 'gtabanglahub-restore-'));
const restored = join(temporaryRoot, 'data');

function digest(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

try {
  await cp(source, restored, { recursive: true, errorOnExist: true });
  const files = (await readdir(source)).filter((name) => name.endsWith('.json')).sort();
  for (const name of files) {
    const original = await readFile(join(source, name));
    const copy = await readFile(join(restored, name));
    JSON.parse(copy.toString('utf8'));
    if (digest(original) !== digest(copy)) throw new Error(`${name} failed the restore integrity check`);
  }
  console.log(`Backup/restore drill passed for ${files.length} structured content files with SHA-256 integrity checks.`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
