---
name: accessibility
description: Evaluate and improve web accessibility against an agreed WCAG version and level. Use for a dedicated accessibility audit, WCAG requirement, assistive technology problem, or accessibility release gate; use project scope and report evidence rather than a score as conformance.
---

# Accessibility

Use this project skill when accessibility itself is the task or an explicit acceptance requirement. For a broad site quality review, `web-quality-audit` owns the combined gate and may route the accessibility portion here. Ordinary component styling can use `ui-styling`; do not run a full WCAG audit for every small edit.

## Target and scope

- Confirm the organization's required WCAG version, level, jurisdictional or contractual rules, and release scope. If none is specified, work toward **WCAG 2.2 Level AA** as a provisional technical target; do not present it as a legal determination.
- Include complete user journeys and representative page types, templates, states, and viewport sizes. For bilingual sites, inspect both languages and language switching; inspect shared components once, then their localized content and behavior. Include forms, validation, menus, dialogs, media, authentication, embeds, and third-party widgets when present.
- Identify pages, content, and states that cannot be accessed or tested. Do not extrapolate a sampled result into an unqualified site-wide conformance claim.

## Evaluate

Read [evaluation workflow](references/evaluation.md) for a dedicated audit or release gate. Use the [current WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) as the criterion checklist, including all applicable A and AA criteria, rather than relying on this skill's examples as a complete list. Check the normative [WCAG 2.2 recommendation](https://www.w3.org/TR/WCAG22/) when a criterion is disputed. If a different version or level is required, use that exact W3C standard.

1. Inventory the in-scope pages and complete processes. Select representative templates and interaction states; record what was sampled.
2. Run available automated checks on rendered pages and relevant states (for example, axe and Lighthouse). Record tool/version, URL, state, viewport, and failing nodes. Use source inspection to locate the cause, not as proof that an interaction works.
3. Manually exercise keyboard operation, focus order and visibility, reflow and zoom, text spacing, contrast, language and structure, forms and errors, media alternatives, dynamic announcements, and screen reader use with an available browser/assistive-technology pair. Mark tests that require a human or unavailable device as **pending**.
4. Map each finding to the applicable WCAG success criterion and evidence. Fix within the authorized scope, preserving approved content and design intent where possible. Recheck the exact affected interaction and representative sibling pages.
5. Report each applicable criterion as pass, fail, pending, or not applicable for the evaluated scope; include evidence and exclusions. An automated score of 100 or zero detected violations does not establish WCAG conformance.

## Implementation boundaries

- Prefer native HTML semantics and controls; add ARIA only where it supplies missing meaning or state. Verify the accessible name, role, state, keyboard behavior, and announcement in the rendered UI.
- Text alternatives must convey purpose in context; decorative images use empty `alt`. Check captions, transcripts, and audio descriptions against the actual media and applicable criteria.
- Verify text contrast against the actual rendered background: AA requires **4.5:1** for ordinary text and **3:1** for large text (at least **18 pt**, roughly **24 CSS px**, or **14 pt bold**, roughly **18.7 CSS px**). Non-text UI contrast has its own criterion and exceptions. Do not assume `currentColor` makes a focus indicator sufficiently visible.
- Check WCAG 2.2 additions that apply to the interface, especially focus not obscured, dragging alternatives, target size, consistent help, redundant entry, and accessible authentication. Apply criterion-specific exceptions from W3C, rather than universal CSS shortcuts.
- Avoid global package installation just to audit a project. Prefer existing project tools or temporary, project-scoped execution. Do not add dependencies or change project code during an audit-only request.

## Evidence and handoff

Deliver the target standard, evaluated scope, environment, criterion results, issue locations and impact, fixes and retests, and unresolved or untested items. State whether the evidence supports a limited evaluated-scope assessment or whether a broader formal evaluation is still needed. Use [WCAG-EM 2.0](https://www.w3.org/TR/WCAG-EM/) to structure a formal site evaluation. Do not claim certification or legal compliance from automated tools or a sampled review.
