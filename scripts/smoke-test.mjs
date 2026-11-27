import { spawn } from 'node:child_process';

const port = 4387;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitUntilReady() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${origin}/health.json`);
      if (response.ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Secure preview did not become ready');
}

try {
  await waitUntilReady();
  const routes = ['/', '/news/', '/guides/', '/map/', '/database/', '/search/', '/community/'];
  for (const route of routes) {
    const response = await fetch(`${origin}${route}`);
    const body = await response.text();
    if (response.status !== 200) throw new Error(`${route} returned ${response.status}`);
    if (!response.headers.get('content-security-policy')?.includes("script-src 'self'")) throw new Error(`${route} is missing the production-style CSP`);
    if (!body.includes('<html lang="bn-BD">') || !body.includes('<link rel="canonical"')) throw new Error(`${route} failed the document smoke check`);
  }

  const health = await fetch(`${origin}/health.json`);
  const payload = await health.json();
  if (payload.status !== 'ok' || payload.writes !== 'disabled') throw new Error('health.json has an unexpected contract');

  for (const script of ['/scripts/search.js', '/scripts/database.js', '/scripts/community.js']) {
    const response = await fetch(`${origin}${script}`);
    if (!response.ok || !(await response.text()).includes('document.querySelector')) throw new Error(`${script} failed the asset smoke check`);
  }

  const missing = await fetch(`${origin}/definitely-not-a-real-page/`);
  if (missing.status !== 404 || !(await missing.text()).includes('noindex, follow')) throw new Error('404 behavior failed the smoke check');
  console.log(`End-to-end smoke test passed for ${routes.length} routes, health, three interactive assets, CSP, and 404 handling.`);
} finally {
  server.kill('SIGTERM');
}
