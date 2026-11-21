import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const guides = JSON.parse(await readFile(new URL('../src/data/guides.json', import.meta.url), 'utf8'));

test('guide slugs and titles are unique', () => {
  assert.equal(new Set(guides.map((guide) => guide.slug)).size, guides.length);
  assert.equal(new Set(guides.map((guide) => guide.title)).size, guides.length);
});

test('guides contain complete discovery metadata', () => {
  for (const guide of guides) {
    assert.match(guide.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(guide.title.length >= 20);
    assert.ok(guide.excerpt.length >= 50);
    assert.ok(guide.category);
    assert.ok(guide.difficulty);
    assert.ok(['নিরাপদ', 'হালকা', 'পূর্ণ'].includes(guide.spoilerLevel));
    assert.match(guide.isoUpdatedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(guide.outcomes.length >= 3);
    assert.ok(guide.sources.length >= 1);
  }
});

test('guide source records are reviewable and secure', () => {
  for (const guide of guides) {
    for (const source of guide.sources) {
      assert.ok(source.name);
      assert.ok(source.publisher);
      assert.ok(source.checked);
      if (source.url.startsWith('http')) assert.match(source.url, /^https:\/\//);
    }
  }
});
