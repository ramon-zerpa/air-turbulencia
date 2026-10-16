# WCAG evaluation workflow

Use this reference for a dedicated accessibility audit or release gate. The [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) supplies the current criterion list; [WCAG-EM 2.0](https://www.w3.org/TR/WCAG-EM/) supplies the structure for formal site evaluation. Adapt to the user's required version and scope.

## Define the evaluated scope

Record the standard/level, date, site version or commit, routes, languages, browser/viewport, authentication state, and assistive technology. Inventory common components, unique page templates, and full processes from entry through confirmation. Sample representative variants and all unique functionality; record exclusions and why they were excluded. For third-party embeds and linked documents, record whether they are in scope and what could actually be tested.

## Combine evidence

- **Automated:** Run available axe/Lighthouse or equivalent checks on rendered representative pages and error/open states. Keep raw findings with selectors and conditions. A passing scan covers only machine-detectable rules.
- **Keyboard:** Traverse each distinct journey in a logical order; activate controls; check traps, visible/unobscured focus, hover/focus disclosures, shortcuts, dragging alternatives, and target sizes where applicable.
- **Visual and responsive:** Check contrast from actual foreground/background colors (including images and overlays), 200% text resize, 400% zoom/reflow at a 320 CSS px equivalent width where applicable, text-spacing overrides, portrait/landscape, and reduced-motion behavior. Verify meaning is not conveyed only by color, shape, position, or sound.
- **Semantics and assistive technology:** Inspect names, roles, values, headings, landmarks, reading order, `lang` and changes of language; test representative journeys with a screen reader/browser pair when available. Check announced validation errors, status messages, dialogs, and focus return. Do not infer a screen reader pass solely from a DOM snapshot.
- **Content and media:** Review alt text in context, descriptive controls/links, captions/transcripts/audio description for actual media, form instructions, error recovery, and any cognitive/accessibility requirements in scope.

The W3C [evaluation tools guidance](https://www.w3.org/WAI/test-evaluate/tools/selecting/) explains why human review is necessary. If no screen reader or appropriate human reviewer is available, mark that verification pending instead of inventing a pass. Use real users with disabilities when the organization needs stronger usability evidence.

## Criterion record

For each applicable A/AA success criterion, record:

| Field | Meaning |
| --- | --- |
| Criterion | WCAG number and level, linked to the W3C text |
| Status | Pass / Fail / Pending / Not applicable |
| Scope | Route, template, state, language, viewport, complete process |
| Evidence | Repro steps, observed behavior, screenshot/log or tool result, test environment |
| Action | Source location, proposed/implemented fix, owner, retest result |

Do not convert an untested criterion to pass. Deduplicate findings from shared components, while listing all affected routes. Group work by user impact and reuse, then retest the original failure and nearby flows. An unresolved failure in a required complete process blocks an unqualified conformance statement for that process.

## Maintenance

For a new page or monthly article, test the new content, its shared template, localized version, media, navigation entry points, and relevant interactions. Recheck shared components after changes. A targeted maintenance check can cite an existing baseline, but should state which criteria and pages were actually retested.
