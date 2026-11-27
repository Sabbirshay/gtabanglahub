import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const records = JSON.parse(await readFile(new URL('../src/data/database.json', import.meta.url), 'utf8'));
const regions = JSON.parse(await readFile(new URL('../src/data/map-regions.json', import.meta.url), 'utf8'));

test('map regions have unique slugs, valid schematic positions, and secure sources', () => {
  assert.equal(new Set(regions.map((item) => item.slug)).size, regions.length);
  for (const region of regions) {
    assert.match(region.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(region.position.x >= 0 && region.position.x <= 100);
    assert.ok(region.position.y >= 0 && region.position.y <= 100);
    assert.match(region.lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(region.source.url, /^https:\/\//);
  }
});

test('database covers every planned record type', () => {
  const types = new Set(records.map((item) => item.type));
  assert.deepEqual(types, new Set(['character', 'vehicle', 'weapon']));
  assert.ok(regions.length > 0, 'locations are provided by the region model');
});

test('records distinguish confirmed, unknown, and unavailable facts', () => {
  const states = new Set();
  for (const record of records) {
    assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(record.status, 'confirmed');
    assert.match(record.lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(record.source.url, /^https:\/\//);
    assert.ok(record.facts.length >= 3);
    for (const fact of record.facts) {
      assert.ok(['confirmed', 'unknown', 'unavailable'].includes(fact.state));
      states.add(fact.state);
    }
  }
  assert.deepEqual(states, new Set(['confirmed', 'unknown', 'unavailable']));
});
