import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const articles = JSON.parse(await readFile(new URL('../src/data/articles.json', import.meta.url), 'utf8'));

test('article slugs and titles are unique', () => {
  assert.equal(new Set(articles.map((item) => item.slug)).size, articles.length);
  assert.equal(new Set(articles.map((item) => item.title)).size, articles.length);
});

test('every article includes required editorial metadata', () => {
  for (const item of articles) {
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(item.title.length >= 20);
    assert.ok(item.excerpt.length >= 50);
    assert.match(item.isoDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.source);
    assert.ok(item.sourceUrl);
    assert.equal(typeof item.verified, 'boolean');
  }
});

test('external sources use HTTPS', () => {
  for (const item of articles.filter((entry) => entry.sourceUrl.startsWith('http'))) {
    assert.match(item.sourceUrl, /^https:\/\//);
  }
});
