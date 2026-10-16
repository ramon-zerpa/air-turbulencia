# Air Turbulencia — Comfort in Motion

Second homepage option: responsive architectural hero, animated airflow and
curtain, section entrances, pause control and static alternatives. Original logo,
Archivo Black, Open Sans and the approved palette remain authoritative.

Baseline `4586934` is preserved on `main` in `../air-turbulencia`, preview
http://127.0.0.1:4321/. This checkout is `feat/homepage-02-airflow`, preview
http://127.0.0.1:4322/. Alternative changes remain uncommitted for review.
The private repository https://github.com/ramon-zerpa/air-turbulencia was created;
no commits have been pushed. Git identity is configured locally only.

```powershell
npm ci
npm run check
npm run build
npm run preview -- --port 4322
npm run test:ui
```

Use `npm run dev -- --port 4322` for editing after stopping that preview.
Tests use an isolated Playwright Chromium headless
runtime (`npx playwright install chromium --only-shell` on first setup), avoiding
requests injected by extensions in the system Chrome installation.

## Current scope

- Homepage only, English, with responsive layouts tested from 320 to 1920 px.
- Interior links intentionally point to the existing public website. The original
  contact form remains there; no replacement form backend is implemented.
- Local Fontsource WOFF2 fonts, Astro-generated responsive AVIF/WebP imagery,
  server-rendered Lucide icons, native navigation and a deferred WebGL2 module.
- Pause/resume persists for the session. Reduced motion, unavailable WebGL and
  context loss retain the static scene. Navigation and FAQ work without JavaScript.
- The generated room is conceptual, not a company installation. See
  `design/airflow-source/provenance.md` for source records.
- See `docs/09-homepage-option-02.md` for content mapping and
  `docs/10-option-02-validation.md` for comparison, evidence and limitations.

With both production previews running, `node tools/measure-homepages.mjs` records
three Lighthouse runs per device profile and version. Set `LIGHTHOUSE_OUTPUT`
to a new evidence directory for fresh measurements; existing reports are resumed.
Accepted results are under `docs/evidence/option-02/lighthouse-accepted`.

## Release boundary

This build is **not deployable as a production replacement** yet. It deliberately
has `noindex, nofollow` during homepage review. No new sitemap is generated while
the remaining 30 pages are absent. Preserve and implement all legacy routes and
the sitemap endpoints before release, then remove preview indexing controls only
after the migration gate in `docs/03-seo-migration-plan.md` passes. No Cloudflare
project is connected and no push/deploy has been performed.

Production integration must use GitHub → Cloudflare autodeploy with explicit
publication authorization. Never use a direct deployment as the normal flow.

The original public HTML/sitemap inventory remains in `docs/evidence/`. Historical
claims, imagery rights and Search Console/analytics baseline remain release
checks, not facts inferred from the visual prototype.
