import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [headers, vercelText, workflow, assetPolicy, searchPage, communityPage, databasePage] = await Promise.all([
  read('../public/_headers'),
  read('../vercel.json'),
  read('../.github/workflows/ci.yml'),
  read('../docs/ASSET_POLICY.md'),
  read('../src/pages/search/index.astro'),
  read('../src/pages/community/index.astro'),
  read('../src/pages/database/index.astro'),
]);

test('deployment CSP permits bundled same-origin scripts without unsafe evaluation', () => {
  const vercel = JSON.parse(vercelText);
  const deployedCsp = vercel.headers[0].headers.find(({ key }) => key === 'Content-Security-Policy')?.value;
  const fileCsp = headers.match(/Content-Security-Policy: (.+)/)?.[1];
  assert.equal(deployedCsp, fileCsp);
  assert.match(deployedCsp, /script-src 'self'/);
  assert.doesNotMatch(deployedCsp, /unsafe-eval|script-src 'none'/);
});

test('interactive pages load explicit same-origin scripts', () => {
  assert.match(searchPage, /src="\/scripts\/search\.js"/);
  assert.match(communityPage, /src="\/scripts\/community\.js"/);
  assert.match(databasePage, /src="\/scripts\/database\.js"/);
  for (const page of [searchPage, communityPage, databasePage]) assert.doesNotMatch(page, /<script(?:>|\s(?![^>]*src=))/);
});

test('deployment preserves immutable build caching and legacy redirects', () => {
  const vercel = JSON.parse(vercelText);
  assert.match(headers, /\/_astro\/\*/);
  assert.match(headers, /immutable/);
  assert.ok(vercel.redirects.some(({ source, destination }) => source === '/articles/:slug' && destination === '/news/:slug/'));
  assert.ok(vercel.redirects.some(({ source, destination }) => source === '/guide/:slug' && destination === '/guides/:slug/'));
});

test('CI includes the registry audit and the repository has an explicit asset policy', () => {
  assert.match(workflow, /pnpm audit --audit-level high/);
  assert.match(assetPolicy, /does not bundle Rockstar Games/);
  assert.match(assetPolicy, /source, owner, licence or permission/);
});
