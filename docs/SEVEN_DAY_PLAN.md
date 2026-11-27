# GTA Bangla Hub — seven-day delivery plan

This accelerated plan preserves the agreed feature, quality, security, SEO, and editorial scope. “Done” means reviewed and verified—not merely drafted.

## Day 1 — foundation and editorial shell

- Establish repository workflow, Astro/TypeScript baseline, responsive design system, navigation, core routes, CI, and preview deployment.
- Publish editorial, spoiler, corrections, privacy, copyright, and source-verification rules.
- Confirm canonical domain, mailboxes, analytics decision, ownership, and launch checklist.

## Day 2 — newsroom and publishing workflow

- Implement reusable news/article templates, categories, author/source fields, timestamps, correction notes, and spoiler labels.
- Prepare launch coverage with primary-source links and human editorial review.
- Validate Bangla typography, mobile reading, keyboard navigation, and social cards.

**Status: implemented on 21 November 2026.** Reusable byline, breadcrumb, spoiler, correction, and source components are active; five newsroom entries carry structured editorial metadata and two new launch features link to Rockstar Games primary sources. Automated checks cover reviewer, source, date, and HTTPS requirements.

## Day 3 — guides and structured content

- Build guide taxonomy, difficulty/spoiler metadata, related content, breadcrumbs, and search-ready content schema.
- Publish beginner, settings, accessibility, progress, and responsible-sharing guides.
- Run factual, language, copyright, and broken-link review.

**Status: implemented on 21 November 2026.** Four complete guides now use structured category, difficulty, spoiler, outcome, date, author, and source records. Guide pages include breadcrumbs, related reading, semantic HowTo microdata, responsive metadata, and primary-source accessibility references. Automated checks enforce discovery and source-review fields.

## Day 4 — map and database

- Add map region/location model and database schemas for vehicles, weapons, characters, and locations.
- Import only verified records with source and last-reviewed fields; distinguish unknown from unavailable.
- Add filtering progressively without blocking the no-JavaScript reading experience.

**Status: implemented on 21 November 2026.** Six officially named Leonida regions now feed a transparent, non-geographic schematic and a shared location model. The reference database combines locations with verified character, vehicle, and weapon records, labels unknown and unpublished facts separately, links every record to an official source, and adds accessible client-side filtering while preserving the complete no-JavaScript reading experience.

## Day 5 — community and discovery

- Add moderated submissions, report/correction flow, on-site search, related content, and newsletter only after consent and retention rules are approved.
- Define moderation, age-safety, harassment, piracy, leak, and takedown procedures before enabling user content.
- Add rate limits, bot protection, validation, and audit logging to every write endpoint.

**Status: implemented on 21 November 2026.** Client-side search now covers news, guides, locations, characters, vehicles, and weapons without sending queries to a server, and news pages surface related reading. The Community Desk generates validated email drafts without a site write endpoint or file upload, so no submission data is stored by the website. Moderation gates, prohibited content, consent, attribution, 30/90-day retention limits, privacy requests, and the inactive-newsletter rule are published before live intake. Any future write endpoint remains blocked until rate limiting, bot protection, validation, audit logging, and deletion operations are implemented.

## Day 6 — quality, SEO, security, and performance

- Complete metadata, canonical URLs, robots, sitemap, structured data, redirects, 404s, image policy, and internal linking.
- Run accessibility checks, responsive/browser review, performance budgets, dependency audit, secret scan, CSP/header verification, and backup/restore drill.
- Verify no copyrighted Rockstar assets are redistributed without a documented right or applicable exception.

**Status: implemented on 22 November 2026.** The release gate now crawls internal links and checks unique metadata, canonicals, sitemap coverage, one-H1 semantics, keyboard skip paths, image/button basics, secure external links, CSP compatibility, immutable build assets, and strict HTML/CSS/JavaScript size budgets. Deployment policies allow only bundled same-origin scripts, add hardened browser headers and legacy redirects, and remain synchronized across supported hosts. CI includes a high-severity dependency audit; local verification adds a high-confidence secret scan and a temporary backup/restore drill with JSON parsing and SHA-256 integrity checks. News uses `NewsArticle` microdata, the 404 remains noindex, and the asset policy records that no Rockstar media is bundled without documented rights review.

## Day 7 — launch and operations

- Freeze content, complete final editorial/legal review, validate production environment and DNS, and perform end-to-end smoke tests.
- Launch with monitoring for availability, errors, Core Web Vitals, security events, and broken links.
- Record rollback owner and thresholds; schedule daily launch-week editorial/security checks and weekly dependency/content review.

**Status: launch readiness implemented on 22 November 2026; production remains NO-GO.** The repository now has an executable ownership/domain/mailbox/freeze/rollback gate, an end-to-end HTTP smoke test under production-style headers, a static health contract, a human content-freeze checklist, and a launch/incident/rollback runbook with explicit thresholds. The live platform audit found a healthy protected preview and no recent runtime errors, but the Vercel project is not live, `gtabanglahub.com` is not attached, production environment variables and named operational owners are absent, and the published mailboxes are not verified. Day 7 is complete only after those blockers are resolved, the checklist is signed against an immutable commit, production is promoted, and post-launch smoke checks pass.

## Non-negotiable acceptance gates

- Every factual news claim links to a primary or clearly identified secondary source.
- Rumors and leaks never appear as confirmed facts; unlawful/private leaked material is not hosted.
- Spoiler level is visible before affected content, with spoiler-free headlines and previews.
- Human editorial review covers facts, Bangla language, copyright, safety, and AI-assisted material.
- Production has HTTPS, least-privilege access, protected secrets, dependency locking, CSP/security headers, validation, rate limits for writes, backups, monitoring, and a tested rollback.
- Every indexable page has a unique title/description, canonical URL, semantic heading, accessible navigation, and crawl path.
