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
    assert.match(item.isoUpdatedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.author);
    assert.ok(item.editor);
    assert.ok(['নিরাপদ', 'হালকা', 'পূর্ণ'].includes(item.spoilerLevel));
    assert.ok(Array.isArray(item.sources) && item.sources.length > 0);
    assert.equal(typeof item.verified, 'boolean');
  }
});

test('external sources use HTTPS', () => {
  for (const item of articles) {
    for (const source of item.sources.filter((entry) => entry.url.startsWith('http'))) {
      assert.match(source.url, /^https:\/\//);
    }
  }
});

test('verified articles include a reviewer and checked sources', () => {
  for (const item of articles.filter((entry) => entry.verified)) {
    assert.ok(item.editor.length >= 4);
    for (const source of item.sources) {
      assert.ok(source.publisher);
      assert.ok(source.type);
      assert.ok(source.checked);
    }
  }
});
