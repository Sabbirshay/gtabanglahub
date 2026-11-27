# GTA Bangla Hub launch and rollback runbook

This runbook is the Day 7 go/no-go record. A passing build or preview is necessary but does not authorize production launch by itself.

## Current platform audit — 22 November 2026

| Check | Verified state | Decision |
| --- | --- | --- |
| Development deployment | Vercel reports `READY`; GitHub Actions is green | Pass |
| Runtime errors | No errors reported in the preceding 24 hours | Pass for preview |
| Production deployment | Vercel project reports `live: false` | Blocked |
| Canonical domain | Only `gtabanglahub.vercel.app` is attached; `gtabanglahub.com` is absent | Blocked |
| Production environment | No project environment variables are configured | Blocked |
| Deployment protection | Vercel SSO protects non-custom domains | Retain for previews |
| Contact mailboxes | Site copy says they must be activated; delivery has not been verified | Blocked |
| Named owners | Launch, monitoring, and rollback owners are not yet recorded | Blocked |

Run `pnpm launch:check` with the non-secret controls from `.env.example`. Any missing value is a no-go result.

## Pre-launch sequence

1. Name the launch, monitoring, and rollback owners and confirm their Vercel/GitHub access uses least privilege and MFA.
2. Activate and test `community@`, `corrections@`, `privacy@`, and `copyright@gtabanglahub.com` in both directions.
3. Attach and verify `gtabanglahub.com`, configure HTTPS, then confirm the apex and preferred host resolve to Vercel. Do not announce DNS before mail and rollback checks pass.
4. Configure `SITE_URL=https://gtabanglahub.com` for Production and confirm canonical, Open Graph, robots, and sitemap URLs match it.
5. Freeze content at an immutable 40-character Git SHA. Complete the editorial/legal checklist in `CONTENT_FREEZE.md` and require the green `Verify` check.
6. Record the last known-good deployment URL, then run `pnpm verify`, `pnpm smoke`, and the production-origin smoke checks.
7. Merge only the reviewed freeze commit. Verify the resulting production deployment SHA before directing public traffic.

## Production smoke checks

- `/`, `/news/`, `/guides/`, `/map/`, `/database/`, `/search/`, `/community/`, `/health.json`, and a nonexistent route return their expected status and content.
- HTTPS is valid; HTTP redirects to HTTPS; canonical, `robots.txt`, and `sitemap.xml` use the production origin.
- CSP and security headers are present. Bengali search, database filtering, skip navigation, focus visibility, and required-field validation work in a real browser.
- No unexpected third-party requests, write endpoints, analytics trackers, uploads, or mailing-list calls appear.
- The four public mailboxes accept and receive test messages, with retention/deletion procedures available to the owners.

## Monitoring and thresholds

During the first seven days, the monitoring owner reviews availability, runtime errors, security events, broken internal links, and Core Web Vitals daily. Editorial/security review becomes weekly afterward.

Rollback immediately when any of these occurs:

- two consecutive external health-check failures or five minutes of unavailability;
- repeated 5xx responses, a broken primary route, or a CSP failure that disables search, filters, or community validation;
- incorrect canonical/robots behavior that exposes preview URLs to indexing;
- secret, personal-data, copyright, or unauthorized-content exposure;
- mail intake that cannot satisfy the published consent, retention, deletion, or takedown process.

Performance regression without functional failure pauses further releases and triggers investigation; security or privacy exposure also triggers credential review and incident documentation.

## Rollback procedure

1. The monitoring owner records the symptom, time, affected routes, deployment ID, and evidence without copying secrets or personal data.
2. The rollback owner restores the last production deployment that passed the same smoke checks using Vercel Instant Rollback. If no production rollback candidate exists, promote the recorded known-good deployment.
3. Re-run availability, headers, core routes, interactive behavior, and mail checks. Keep the incident open until service is confirmed restored.
4. Revert or fix the offending Git change in a new pull request; do not rewrite shared branch history.
5. Document cause, impact, timeline, recovery, and prevention before the next production promotion.

Vercel notes that rollback restores the earlier deployment configuration, including its environment-variable snapshot, so configuration drift must be checked after recovery.
