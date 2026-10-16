---
name: Air Turbulencia
description: Calm & Established — approved desktop B implemented as a local Astro homepage for review.
colors:
  b-paper: "#FAFAF7"
  b-stone: "#EEEFEA"
  b-ink: "#182D38"
  b-ocean: "#155E75"
  b-amber: "#D97706"
  b-muted: "#52636A"
  b-ocean-hover: "#10495B"
  b-footer-rule: "#39505B"
  b-line: "#D9DFDB"
  b-light-copy: "#D7E2E5"
  b-white: "#FFFFFF"
typography:
  headline:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontWeight: 400
    fontSize: "52px"
    lineHeight: 1.15
    letterSpacing: "-0.7px"
  title:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontWeight: 400
    fontSize: "36px"
    lineHeight: 1.22
    letterSpacing: "-0.7px"
  body:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontWeight: 400
    fontSize: "16px"
    lineHeight: 1.6
  body-emphasis:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontWeight: 600
rounded:
  button: "4px"
components:
  button-primary:
    backgroundColor: "{colors.b-ocean}"
    textColor: "{colors.b-white}"
    rounded: "{rounded.button}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.b-ocean-hover}"
---

# Design System: Air Turbulencia

## Overview

**Creative North Star: "Calm & Established"**

Air Turbulencia's approved direction is calm, orderly, and established. Warm light surfaces, dark readable text, restrained ocean-blue actions, generous space, and clear typography support trust and informed service decisions. The original logo remains intact on white with space around it.

Visual authority is approved brand board B (`IYSqH`) and desktop homepage (`gcKwa`) in `pencil-design/airturbulencia.pen`, including the approved Archivo Black, amber details, dark top bar/Service Area, and FAQ image/padding refinements. Option A remains archived and rejected. This document records the actual local Astro homepage in `src/styles/global.css`, `src/components/SiteHeader.astro`, and `src/pages/index.astro`; see [implementation evidence and limits](docs/08-local-implementation.md). The homepage is ready for local review. The remaining pages and production migration are incomplete, interiors link to the published website, and preview retains `noindex, nofollow`. No separate mobile design was approved. The hero is static; an animation effect remains deferred.

**Key Characteristics:**

- Warm paper and stone surfaces with readable ink and muted text.
- Ocean-blue actions, fine rules, and Lucide line icons with restrained amber details.
- Archivo Black headlines paired with Open Sans body text and controls.
- An unchanged original logo with generous surrounding space.
- Restrained corners and broad photography without decorative excess.

## Colors

The palette combines warm neutral surfaces with deep ink and ocean-blue accents. The frontmatter is the normative source for values.

### Primary

- **Ocean (`b-ocean`):** primary buttons, links, navigation controls, and focus rings; primary buttons use white text.
- **Ocean hover (`b-ocean-hover`):** darker primary-button hover state.

### Tertiary

- **Amber (`b-amber`):** optional small decorative details. Its availability does not require placing it in every section.

### Neutral

- **Paper (`b-paper`):** main warm background.
- **Stone (`b-stone`):** secondary surfaces.
- **Ink (`b-ink`):** text, headings, top bar, company block, Service Area, and footer.
- **Muted (`b-muted`):** secondary text on light surfaces.
- **White (`b-white`):** logo/navigation surface, primary-button text, and headings on ink.
- **Line (`b-line`):** fine service, FAQ, and navigation separators.
- **Light copy (`b-light-copy`):** secondary text on ink.
- **Footer rule (`b-footer-rule`):** fine footer separator on ink.

**The Restrained Amber Rule.** Amber is optional, small, and decorative; do not use it for small text on light backgrounds.

Board contrast checks cover specific color pairs only. They are not evidence of website-wide accessibility conformance.

## Typography

**Display Font:** Archivo Black for headlines, nominal weight 400 (the face itself is black weight). This supersedes Poppins after the user approved the type trial.

**Body Font:** Open Sans for body text and controls, in regular and semibold weights (400/600).

Headlines use the nominal weight of the Archivo Black face without synthesizing a heavier weight. Base H1 and H2 tokens are in frontmatter; base H3 is 23px/1.22. Individual sections use deliberate heading overrides (for example company H2 42px and FAQ H2 34px). These are source-derived homepage sizes, not a required hierarchy for unfinished interiors.

Fontsource serves local Latin font files: Archivo Black 400 and Open Sans 400/600. Arial Black and Arial provide fallbacks. No remote font CSS is loaded. The board's sample phrase demonstrates typography and is not production copy.

## Layout

The content container is `min(1264px, calc(100% - 176px))`, centered: at 1440px it has 88px side margins. At widths up to 1350px, side margins become 48px; up to 767px they become 24px. Default section padding is 80px vertically, including FAQ; compact layouts use 48px. Hero top padding is 58px, reduced to 36px on compact screens. Desktop hero columns use a flexible heading column plus 400px copy column and a 72px gap.

Source breakpoints are max-width 1350px, 1099px, 767px, and 380px. At 1099px navigation becomes a toggle menu and H1 becomes 44px. At 767px major paired grids stack, popular service links become two columns, H1 uses `clamp(32px, 8vw, 42px)`, and the footer becomes two columns. At 380px the footer becomes one column and localities use two columns. This is a tested fluid fallback, not an approved mobile artboard. Reported checks found no horizontal overflow at 320–1920px; screenshots do not establish Safari/iPhone behavior.

## Elevation & Depth

Depth comes mainly from paper, stone, ink, and fine rules. The desktop Services dropdown alone uses a subtle shadow (`0 12px 30px #182d381a`); at 1099px and below it becomes an unshadowed inline menu. No general card-shadow system is implemented.

## Shapes

Buttons have discreet corners using the button radius token. Fine rules and Lucide line icons support the restrained visual language. The button radius does not establish a universal radius for photos or containers; photographs do not need rounded corners.

## Components

### Buttons

Primary action links pair ocean blue with white, the button radius token, a transparent 1px border, 52px minimum height, and semibold 16px text. Default padding is in frontmatter; header actions use 14px 21px with 14px text. Hover uses the ocean-hover token with a 160ms ease background-color transition. Focus uses a 3px ocean outline offset by 5px, white on dark surfaces. Reduced-motion preference removes transitions and animations. No separate active, disabled, loading, or outlined-button implementation exists.

### Navigation and content rows

The desktop header is white, with a 211px logo and 117px minimum height. Services uses native `details`/`summary`; the open state colors its label ocean and rotates the chevron. Its two-column dropdown is at most 690px wide with 30px padding. The compact toggle synchronizes its label and `aria-expanded`; Escape closes Services first, then the compact menu, and restores focus. Outside clicks and menu links close the compact menu; Services also closes when focus leaves it. Navigation and text links underline on hover.

Service rows use a 28px icon column, 22px gap, 24px vertical padding, and fine top rules. FAQ articles use 22px vertical padding and fine rules; questions are static headings, not accordion controls. The FAQ equipment image uses containment in a 240px-high box. Hero photography is static, 430px high on desktop, 360px at 1099px, and 260px at 767px. Images use Astro-generated AVIF/WebP variants and fallback; the hero loads eagerly with high priority and lower images load lazily.

### Logo

Preserve the Air Turbulencia name and original logo without recoloring, redrawing, or cropping. Show the complete asset on white, including the frame and tones already contained within it.

### Icons and photography

Use Lucide line icons. Existing website photographs shown in the board are visual references; they do not establish company ownership, completed work, or identified customers. Verify rights, quality, and originals before production. Do not turn those images into unsupported business evidence.

## Do's and Don'ts

### Do:

- Do use the approved B palette and typography as the visual authority.
- Do preserve the complete original logo on white with space around it.
- Do use ocean blue for actions and reserve amber for small icons, checks, and rules.
- Do preserve readable contrast and visible keyboard focus in light and dark sections.
- Do use the latest approved desktop composition, including its subsequent type and accent refinements.

### Don't:

- Don't restore or extend the archived, rejected option A.
- Don't recolor, redraw, or crop the original logo.
- Don't use amber for small text on light backgrounds.
- Don't present board photography as verified company work or customer evidence.
- Don't present the local homepage as a completed full-site migration or as released production.
- Don't invent badges, metrics, credentials, or endorsements.
