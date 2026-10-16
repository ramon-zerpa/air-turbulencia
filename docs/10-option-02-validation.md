# Comfort in Motion — local validation

Date: October 15, 2026, America/Caracas (evidence timestamps October 16 UTC).
Disposition: ready for local user comparison, not a production migration release.

## Recovery and previews

- Original: `main`, baseline `4586934`, `../air-turbulencia`, http://127.0.0.1:4321/.
- Alternative: `feat/homepage-02-airflow`, this worktree, http://127.0.0.1:4322/.
- Main is clean. Alternative changes are uncommitted. The private GitHub repository
  exists at https://github.com/ramon-zerpa/air-turbulencia; `git ls-remote origin`
  returns no refs. No push, merge, Cloudflare connection or deployment occurred.
- Both use the existing production canonical and deliberate `noindex, nofollow`.
  All 30 interior links continue to production. No URLs, redirects or sitemap
  endpoints changed; the full SEO migration gate remains required before launch.

## Implemented

Full-width architectural hero with left-hand HTML content and visible outlet at
upper right; three airflow paths (two on mobile), a separately deformed curtain,
pointer depth on desktop and bounded decorative scroll. New photographic service
panels, installation steps, dark expertise and coverage sections, heating and
commercial stories, attributed testimonials, native FAQ and final service CTA.

The original logo, brand palette, Archivo Black and Open Sans remain. Generated
interior imagery is explicitly conceptual. The static composition uses the same
clean room and transparent curtain as the animated scene; the separately generated
flattened poster is retained as a design source, not an extra runtime download.
This avoids a mismatch when the first valid canvas frame replaces the static layers.

One deferred WebGL2 module, one rendering loop, adaptive resolution/detail/frequency,
visibility suspension, context-loss fallback and resource cleanup. Session-persistent
pause also finishes pending entrance animations. Reduced motion and communicated
data saving skip the renderer; essential content remains in HTML. Native navigation
fallback and FAQ work without JavaScript.

## Functional and accessibility evidence

- `npm run check`: 0 errors, warnings or hints; `npm run build`: successful static build.
- `npm run test:ui`: **10 passed**, Chromium. Includes all inventory links and
  metadata, one H1, local fonts, no added third-party requests or browser errors,
  keyboard navigation, menu dismissal/focus, pause persistence, changing/frozen
  canvas frames, offscreen suspension, reduced-motion changes, unavailable GPU,
  context loss, no-JS operation and enlarged-text reflow.
- Widths: 320, 390, 768, 1024, 1280, 1440 and 1920 px. Additional 844×390 landscape,
  1280×650 short desktop and 125% text enlargement. No horizontal overflow found.
- Delaying deferred scripts by 800 ms reproduces the former mobile navigation
  timing problem. Header enhancement now binds synchronously; the new regression
  test confirms startup CLS below 0.1. Three subsequent Lighthouse runs confirm
  the correction under mobile throttling.
- Axe: zero detected A/AA violations. Eight hero contrast nodes require manual
  evaluation because they overlap photographic/canvas backgrounds; visual review
  found readable content, but no numeric contrast/conformance claim is made.
  Lighthouse accessibility 100 is an automated result, not WCAG certification.
- Firefox and WebKit installations could not launch because Windows runtime DLLs
  are missing. Their compatibility is **unverified**; no physical iPhone/Safari
  testing is claimed. See `evidence/option-02/runtime-report.json` for exact errors.

## Laboratory performance comparison

Lighthouse 13.5.0 against production builds on localhost. Isolated Chromium profiles,
default Lighthouse mobile configuration and its official desktop configuration;
three independent runs for each version/profile under the same host conditions.
Medians below; raw reports and timestamps: `evidence/option-02/lighthouse-accepted/`.

| Version | Profile | Performance | LCP | CLS | TBT | Measured transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Original | Mobile | 100 | 1.436 s | 0 | 0 ms | 130,481 B |
| Alternative | Mobile | 100 | 1.807 s | 0 | 8 ms | 174,786 B |
| Original | Desktop | 100 | 0.387 s | 0.000201 | 0 ms | 142,731 B |
| Alternative | Desktop | 100 | 0.469 s | 0.000300 | 0 ms | 209,944 B |

All accepted runs meet LCP ≤2.5 s, CLS ≤0.1 and TBT ≤200 ms. The alternative adds
approximately 44 KB mobile / 67 KB desktop to the measured load. These are lab
results, not CrUX, field INP, live traffic, rankings or a guarantee against SEO loss.
SEO scoring was omitted because this preview intentionally blocks indexing.

`lighthouse/` is an earlier diagnostic run whose desktop configuration was incorrect.
`lighthouse-final/` records the valid diagnostic run that exposed mobile CLS before
the navigation correction. Both are historical evidence, **not accepted results**.

Final build byte evidence: `evidence/option-02/budgets-final.json`.

| Asset group | Gzip bytes | Budget |
| --- | ---: | ---: |
| Initial JS, including inline navigation | 2,920 | 12 KB |
| Initial plus deferred renderer JS | 5,236 | 50 KB |
| CSS | 4,696 | 35 KB |

Room AVIF is approximately 54 KB at 1440 px / 65 KB at 1920 px; curtain WebP is
approximately 18 KB and shared with the static composition. Responsive AVIF/WebP
outputs are generated by Astro. No new third-party runtime requests were observed.

## Continuous motion and limits

Recorded animation and traces: `evidence/option-02/motion-demo.webm` and
`motion-trace.zip`. `runtime-report.json` captures the earlier recording run;
recording and tracing substantially reduced desktop frame rate. After restricting
shader work to the air/curtain regions and capping canvas resolution, a separate
unrecorded desktop sample measured **24 fps at adaptive quality 2**. Mobile measured
30 fps. The unrecorded result is in `fps-unrecorded.json`.

The test host reports ANGLE Vulkan **SwiftShader (software rendering)**. Desktop
60 fps on a hardware GPU is not verified. If sustained performance stays low, the
controller reduces resolution, stream count and frequency, then falls back to the
static scene. Content and controls remain available throughout. The existing video
demonstrates actual motion before the final drawing-area optimization, not a final
hardware frame-rate benchmark. Perceptual approval of the motion belongs to local
user review; loading scores do not prove continuous animation smoothness.

## Visual review and evidence

The required Impeccable finish reviewer returned **ship for local review**, without
material UI fixes: distinct composition, preserved identity, readable desktop/mobile
captures and usable reduced-motion state. It did not certify numeric contrast,
hardware performance, untested browsers or production readiness. The documenter
updated DESIGN.md, PRODUCT.md and the design state for this code-led variant.

- `evidence/option-02/desktop.png`: complete desktop page.
- `hero-desktop.png`, `hero-final.png`: hero and paused view.
- `mobile-fallback.png`, `mobile-viewport.png`: full page and first mobile viewport.
- `reduced-motion.png`: static alternative.
- `motion-demo.webm`: short actual-motion recording.
- Original comparison: `../air-turbulencia/docs/evidence/local-review/desktop.png`.
- `../design/airflow-source/provenance.md`: exact image prompts and source identifiers.

Before any production launch: finish legacy route migration, verify business claims
and inherited asset rights, obtain field/analytics baseline, review remaining manual
accessibility items and browser/device behavior, connect GitHub to Cloudflare, and
obtain explicit publication authorization.
