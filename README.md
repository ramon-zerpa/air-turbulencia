# Air Turbulencia — local redesign

Astro implementation of the approved desktop homepage B. Archivo Black headings,
Open Sans body, original logo, Amber details, dark top bar and service area, and
the approved FAQ layout are authoritative.

```powershell
npm ci
npm run check
npm run build
npm run preview -- --port 4321
npm run test:ui
```

Preview: http://127.0.0.1:4321/. Use `npm run dev -- --port 4322` for editing when
4321 is already occupied. Tests use an isolated Playwright Chromium headless
runtime (`npx playwright install chromium --only-shell` on first setup), avoiding
requests injected by extensions in the system Chrome installation.

## Current scope

- Homepage only. A fluid fallback prevents overflow on narrower screens; it is
  not a newly approved mobile design.
- Interior links intentionally point to the existing public website. The original
  contact form remains there; no replacement form backend is implemented.
- Local Fontsource WOFF2 fonts, Astro-generated responsive AVIF/WebP imagery,
  server-rendered Lucide icons, and a small native navigation script.
- The hero is static. Animated background ideas are deferred to a later local
  iteration, with reduced-motion, readability and performance requirements.

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
