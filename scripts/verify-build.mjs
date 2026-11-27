import { access, readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const siteOrigin = 'https://gtabanglahub.com';
const maxBytes = { '.html': 150_000, '.css': 80_000, '.js': 30_000 };

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

function capture(html, pattern, label, field) {
  const value = html.match(pattern)?.[1]?.trim();
  if (!value) throw new Error(`${label} is missing ${field}`);
  return value;
}

async function assertInternalTarget(href, source) {
  if (!href.startsWith('/') || href.startsWith('//')) return;
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  if (!path || path === '/') return;
  const candidate = path.endsWith('/') ? join(root, path, 'index.html') : join(root, path);
  const fallbacks = [candidate, `${candidate}.html`, join(candidate, 'index.html')];
  const exists = await Promise.all(fallbacks.map(async (item) => access(item).then(() => true).catch(() => false)));
  if (!exists.some(Boolean)) throw new Error(`${source} links to missing internal target ${href}`);
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length < 20) throw new Error(`Expected at least 20 HTML pages, found ${htmlFiles.length}`);

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const titles = new Map();
const descriptions = new Map();
let indexablePages = 0;

for (const file of files) {
  const extension = extname(file);
  if (maxBytes[extension]) {
    const { size } = await stat(file);
    if (size > maxBytes[extension]) throw new Error(`${relative(root, file)} exceeds the ${maxBytes[extension]} byte budget (${size})`);
  }
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const label = relative(root, file).replaceAll('\\', '/');
  if (!html.includes('<html lang="bn-BD">')) throw new Error(`${label} has an incorrect document language`);
  if (!html.includes('class="skip-link"') || !html.includes('<main id="content">')) throw new Error(`${label} is missing the keyboard skip path`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) throw new Error(`${label} must have exactly one h1`);
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/.test(html)) throw new Error(`${label} has an unsafe external target`);
  if (/(?:href|src)="http:\/\//.test(html)) throw new Error(`${label} includes an insecure resource`);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) throw new Error(`${label} has an image without alt text`);
  if (/<button\b(?![^>]*\btype=)[^>]*>/i.test(html)) throw new Error(`${label} has a button without an explicit type`);
  if (/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>/i.test(html)) throw new Error(`${label} contains an inline executable script`);

  const title = capture(html, /<title>([^<]+)<\/title>/, label, 'title');
  const description = capture(html, /<meta name="description" content="([^"]+)"/, label, 'description');
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)"/, label, 'canonical URL');
  if (!canonical.startsWith(siteOrigin)) throw new Error(`${label} has a canonical URL outside ${siteOrigin}`);

  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (!noindex) {
    indexablePages += 1;
    if (titles.has(title)) throw new Error(`${label} duplicates the title from ${titles.get(title)}`);
    if (descriptions.has(description)) throw new Error(`${label} duplicates the description from ${descriptions.get(description)}`);
    titles.set(title, label);
    descriptions.set(description, label);
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) throw new Error(`${label} canonical is absent from sitemap.xml`);
  }

  for (const href of html.matchAll(/href="([^"]+)"/g)) await assertInternalTarget(href[1], label);
}

const notFound = await readFile(join(root, '404.html'), 'utf8');
if (!notFound.includes('noindex, follow')) throw new Error('404.html must be noindex');

for (const required of ['robots.txt', 'sitemap.xml', '_headers', 'favicon.svg', 'og-default.svg']) {
  const info = await stat(join(root, required));
  if (!info.isFile() || info.size === 0) throw new Error(`${required} was not generated`);
}

const headers = await readFile(join(root, '_headers'), 'utf8');
for (const requirement of ["script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", 'Strict-Transport-Security:', '/_astro/*', 'immutable']) {
  if (!headers.includes(requirement)) throw new Error(`_headers is missing ${requirement}`);
}
if (headers.includes("'unsafe-eval'")) throw new Error('_headers must not permit unsafe-eval');

console.log(`Verified ${htmlFiles.length} HTML pages (${indexablePages} indexable), ${files.length} generated files, internal links, metadata, accessibility basics, CSP, and size budgets.`);
