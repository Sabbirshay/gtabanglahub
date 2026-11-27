const requirements = [
  ['PRODUCTION_ORIGIN', (value) => /^https:\/\/[^/]+$/.test(value), 'the final HTTPS origin without a trailing slash'],
  ['LAUNCH_OWNER', (value) => value.trim().length >= 3, 'the person accountable for the go/no-go decision'],
  ['ROLLBACK_OWNER', (value) => value.trim().length >= 3, 'the person authorized to restore the last known-good deployment'],
  ['MONITORING_OWNER', (value) => value.trim().length >= 3, 'the person watching launch health and alerts'],
  ['MAILBOXES_VERIFIED', (value) => value === 'true', 'true after community, corrections, privacy, and copyright mailboxes are tested'],
  ['CONTENT_FREEZE_SHA', (value) => /^[a-f0-9]{40}$/.test(value), 'the immutable reviewed Git commit'],
  ['LAST_KNOWN_GOOD_DEPLOYMENT', (value) => /^https:\/\/.+\.vercel\.app$/.test(value), 'a verified Vercel deployment URL available for rollback'],
];

const blockers = [];
for (const [name, validate, description] of requirements) {
  const value = process.env[name] ?? '';
  if (!validate(value)) blockers.push(`${name}: set ${description}`);
}

if (process.env.PRODUCTION_ORIGIN && process.env.PRODUCTION_ORIGIN !== 'https://gtabanglahub.com') {
  blockers.push('PRODUCTION_ORIGIN: must match the canonical, robots.txt, and sitemap origin https://gtabanglahub.com');
}

if (blockers.length > 0) {
  console.error('Launch is NO-GO. Resolve these blockers:');
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
  process.exitCode = 2;
} else {
  console.log('Launch is GO: ownership, mailboxes, canonical origin, freeze SHA, monitoring, and rollback target are recorded.');
}
