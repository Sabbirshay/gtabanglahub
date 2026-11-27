import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [community, search, privacy, header] = await Promise.all([
  read('../src/pages/community/index.astro'),
  read('../src/pages/search/index.astro'),
  read('../src/pages/privacy/index.astro'),
  read('../src/components/Header.astro'),
]);

test('community intake has consent, validation, and no site write endpoint', () => {
  assert.match(community, /name="consent" required/);
  assert.match(community, /maxlength="2000"/);
  assert.match(community, /mailto:/);
  assert.doesNotMatch(community, /method="post"/i);
  assert.doesNotMatch(community, /type="file"/i);
});

test('moderation and privacy copy define safety and retention boundaries', () => {
  assert.match(community, /পাইরেটেড/);
  assert.match(community, /হয়রানি/);
  assert.match(community, /৩০ দিনের/);
  assert.match(community, /৯০ দিন/);
  assert.match(privacy, /কোনো নিউজলেটার signup/);
  assert.match(privacy, /search শব্দ আপনার ব্রাউজারেই/);
});

test('search remains readable without JavaScript and is globally discoverable', () => {
  assert.match(search, /data-search-input/);
  assert.match(search, /<noscript>/);
  assert.match(search, /data-search-item/);
  assert.match(header, /\/search\//);
});
