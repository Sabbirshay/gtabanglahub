import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length < 10) throw new Error(`Expected at least 10 HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const label = relative(root, file);
  for (const requirement of ['<html lang="bn-BD">', '<meta name="description"', '<link rel="canonical"', '<h1']) {
    if (!html.includes(requirement)) throw new Error(`${label} is missing ${requirement}`);
  }
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/.test(html)) throw new Error(`${label} has an unsafe external target`);
  if (/href="http:\/\//.test(html)) throw new Error(`${label} includes an insecure link`);
}

for (const required of ['robots.txt', 'sitemap.xml', '_headers', 'favicon.svg', 'og-default.svg']) {
  const info = await stat(join(root, required));
  if (!info.isFile() || info.size === 0) throw new Error(`${required} was not generated`);
}

console.log(`Verified ${htmlFiles.length} HTML pages and ${files.length} generated files.`);
