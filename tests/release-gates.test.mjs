import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [headers, vercelText, workflow, assetPolicy, searchPage, communityPage, databasePage, homePage, artworkGallery, newsPage, articleCard] = await Promise.all([
  read('../public/_headers'),
  read('../vercel.json'),
  read('../.github/workflows/ci.yml'),
  read('../docs/ASSET_POLICY.md'),
  read('../src/pages/search/index.astro'),
  read('../src/pages/community/index.astro'),
  read('../src/pages/database/index.astro'),
  read('../src/pages/index.astro'),
  read('../src/components/OfficialArtworkGallery.astro'),
  read('../src/pages/news/index.astro'),
  read('../src/components/ArticleCard.astro'),
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

test('official artwork is narrowly allowlisted, attributed, remote, and not bundled', () => {
  assert.match(homePage, /OfficialArtworkGallery/);
  assert.equal((artworkGallery.match(/https:\/\/www\.rockstargames\.com\/VI\/_next\/static\/media\//g) ?? []).length, 3);
  assert.match(artworkGallery, /© Rockstar Games \/ Take-Two Interactive/);
  assert.match(artworkGallery, /loading="lazy"/);
  assert.match(headers, /img-src 'self' data: https:\/\/www\.rockstargames\.com/);
  assert.match(assetPolicy, /not copied into this repository/);
});

test('newsroom uses a featured editorial lead and credited official imagery', () => {
  assert.match(newsPage, /newsroom-grid/);
  assert.match(newsPage, /featured=\{index === 0\}/);
  assert.match(newsPage, /গুজব নয়/);
  assert.equal((articleCard.match(/https:\/\/www\.rockstargames\.com\/VI\/_next\/static\/media\//g) ?? []).length, 3);
  assert.match(articleCard, /© Rockstar Games \/ Take-Two/);
  assert.match(articleCard, /loading=\{featured \? 'eager' : 'lazy'\}/);
});
