# GTA Bangla Hub

A Bangla-first, independent GTA VI editorial hub for verified news, spoiler-controlled guides, map data, and reference content.

## Local development

Requires Node.js 22.23.4+ and pnpm 12+.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run the full verification gate before opening or merging a pull request:

```sh
pnpm verify
```

## Configuration

Copy `.env.example` to `.env` and set `SITE_URL` to the deployed canonical origin. The current production default is `https://gtabanglahub.com`; change it before launch if the final domain differs, including `public/robots.txt` and `public/sitemap.xml`.

## Publishing rules

- Link factual news to the primary source whenever available.
- Mark unconfirmed reporting explicitly; do not host unlawful/private leaks.
- Keep titles and summaries spoiler-free. Assign the spoiler level before review.
- Record published/updated dates and visible correction notes.
- Human-review all AI-assisted research, copy, translations, and artwork.
- Use original/licensed visuals and document the right to publish third-party assets.

See [docs/SEVEN_DAY_PLAN.md](docs/SEVEN_DAY_PLAN.md) and the public [editorial policy](src/pages/editorial-policy/index.astro).

## Deployment and security

The site is statically generated and ships without third-party browser scripts. Security headers are included for both Vercel (`vercel.json`) and hosts supporting `_headers`. Keep the lockfile in version control, enable dependency alerts and secret scanning, protect `main`, and require a green verification check.

Contact mailboxes shown on the site are launch requirements and must be provisioned before production DNS is announced.
