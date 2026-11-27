import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['.git', '.astro', 'dist', 'node_modules']);
const textExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.mjs', '.svg', '.txt', '.ts', '.yaml', '.yml']);
const secretPatterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(?:ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ['OpenAI key', /\bsk-[A-Za-z0-9]{32,}\b/],
];

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else if (textExtensions.has(extname(entry.name)) || entry.name.startsWith('.env')) paths.push(path);
  }
  return paths;
}

for (const file of await walk(root)) {
  const contents = await readFile(file, 'utf8');
  for (const [name, pattern] of secretPatterns) {
    if (pattern.test(contents)) throw new Error(`${relative(root, file)} appears to contain a ${name}`);
  }
}

const headers = await readFile(join(root, 'public/_headers'), 'utf8');
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const deployedCsp = vercel.headers[0].headers.find(({ key }) => key === 'Content-Security-Policy')?.value;
const fileCsp = headers.match(/Content-Security-Policy: (.+)/)?.[1];
if (!deployedCsp || deployedCsp !== fileCsp) throw new Error('CSP differs between public/_headers and vercel.json');
for (const directive of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'"]) {
  if (!deployedCsp.includes(directive)) throw new Error(`CSP is missing ${directive}`);
}
if (deployedCsp.includes("'unsafe-eval'")) throw new Error('CSP must not permit unsafe-eval');

console.log('Security audit passed: no high-confidence secrets found and deployment security policies match.');
