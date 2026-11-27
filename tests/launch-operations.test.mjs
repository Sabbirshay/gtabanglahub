import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [runbook, freeze, readiness, health, packageText] = await Promise.all([
  read('../docs/LAUNCH_RUNBOOK.md'),
  read('../docs/CONTENT_FREEZE.md'),
  read('../scripts/launch-readiness.mjs'),
  read('../public/health.json'),
  read('../package.json'),
]);

test('launch runbook records blockers, monitoring signals, and rollback thresholds', () => {
  assert.match(runbook, /production remains|Production deployment/i);
  assert.match(runbook, /two consecutive external health-check failures/);
  assert.match(runbook, /Vercel Instant Rollback/);
  assert.match(runbook, /Core Web Vitals/);
});

test('content freeze requires human editorial, rights, ownership, and immutable revision review', () => {
  assert.match(freeze, /human reviewer/i);
  assert.match(freeze, /Freeze commit SHA/);
  assert.match(freeze, /Legal\/rights reviewer/);
  assert.match(freeze, /NO-GO/);
});

test('executable launch gate requires canonical origin, owners, mailboxes, freeze, and rollback target', () => {
  for (const variable of ['PRODUCTION_ORIGIN', 'LAUNCH_OWNER', 'ROLLBACK_OWNER', 'MONITORING_OWNER', 'MAILBOXES_VERIFIED', 'CONTENT_FREEZE_SHA', 'LAST_KNOWN_GOOD_DEPLOYMENT']) {
    assert.match(readiness, new RegExp(variable));
  }
  assert.match(readiness, /https:\/\/gtabanglahub\.com/);
});

test('health contract is static and write-free, and smoke testing is part of verification', () => {
  const payload = JSON.parse(health);
  const pkg = JSON.parse(packageText);
  assert.equal(payload.status, 'ok');
  assert.equal(payload.mode, 'static');
  assert.equal(payload.writes, 'disabled');
  assert.match(pkg.scripts.verify, /pnpm smoke/);
});
