---
name: Air Turbulencia — Comfort in Motion
description: Approved option 02 implemented as a local Astro homepage alternative.
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
  display:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(56px, 5.1vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(36px, 4vw, 58px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-emphasis:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontWeight: 600
  hero-body:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.65
    letterSpacing: "0.14em"
rounded:
  button: "4px"
spacing:
  section-desktop: "112px"
  section-tablet: "80px"
  section-mobile: "64px"
  panel-gap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.b-ocean}"
    textColor: "{colors.b-white}"
    rounded: "{rounded.button}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.b-ocean-hover}"
  button-light:
    backgroundColor: "{colors.b-paper}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.button}"
    padding: "16px 24px"
  button-light-hover:
    backgroundColor: "{colors.b-stone}"
  motion-toggle:
    backgroundColor: "{colors.b-paper}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.button}"
    padding: "8px 14px"
  service-panel:
    backgroundColor: "{colors.b-ink}"
    textColor: "{colors.b-white}"
    padding: "36px 40px 30px"
  service-panel-repair:
    backgroundColor: "{colors.b-stone}"
    textColor: "{colors.b-ink}"
    padding: "36px 40px 30px"
---

# Design System: Air Turbulencia

## Overview

**Creative North Star: "Comfort in Motion"**

The approved alternative brings the sensation of conditioned air into a luminous architectural room. Broad photography, confident headings and generous space establish comfort; ocean actions and readable service information make the next step immediate. The original logo remains intact on white.

This document records option 02 on `main` (`c0f54d5`), described in [the surface brief](docs/09-homepage-option-02.md). Its source authority is `src/styles/global.css`, the Astro components and the motion scripts. The user approved this code-led alternative with airflow, curtain motion and section entrances. The earlier Pencil-only composition and deferred-animation restrictions are superseded for this branch; the approved B brand identity remains binding. The first approved homepage remains on `homepage-01-approved` (`4586934`).

**Key Characteristics:**

- Paper and stone surfaces alternate with ink sections and ocean actions.
- Archivo Black headlines retain the original brand pairing with Open Sans.
- Architectural photography and restrained airflow create depth around readable content.
- Asymmetric service panels become a simple vertical sequence on small screens.
- Motion enhances visible content and respects pause, reduced motion and static fallbacks.

## Colors

Warm neutral surfaces support cool ocean actions and small amber details. Frontmatter owns the source values; sidecar tonal ramps are synthesized visualization aids, not additional shipping tokens.

### Primary

- **Ocean (`b-ocean`):** action backgrounds, heading accents, links, focus outlines and process numbers.
- **Ocean hover (`b-ocean-hover`):** primary action hover.

### Tertiary

- **Amber (`b-amber`):** service icons, decorative marks and small separators.

### Neutral

- **Paper (`b-paper`):** page, mobile hero copy, motion control and light action.
- **Stone (`b-stone`):** repair panel, process and testimonials.
- **Ink (`b-ink`):** primary text, top bar, installation panel, expertise, coverage and footer.
- **Muted (`b-muted`):** secondary copy on light surfaces.
- **Line (`b-line`):** light-surface separators and borders.
- **Light copy (`b-light-copy`):** secondary copy on dark surfaces.
- **Footer rule (`b-footer-rule`):** dark-panel, town and footer separators.
- **White (`b-white`):** logo/header surface and high-emphasis text on dark surfaces.

**The Restrained Amber Rule.** Amber supports small decorative details; do not use it for small text on light backgrounds.

The desktop hero adds a paper-opacity gradient over the photograph to protect readability. Image/canvas contrast requires manual review; palette checks alone do not establish conformance.

## Typography

**Display Font:** Archivo Black, with Arial Black and sans-serif fallbacks. Use nominal weight 400; the face itself supplies the black weight.

**Body Font:** Open Sans, with Arial and sans-serif fallbacks, regular and semibold (400/600). Fontsource serves local Latin files. Font synthesis is disabled; regular display/body WOFF2 files are preloaded.

The hierarchy is role-based and source-derived, not a single mathematical modular scale. Fluid display and section sizes coexist with fixed sizes tuned to content roles. The detector's font-ramp advisory is documented here rather than used to normalize the approved composition.

| Role | Desktop / base | Compact or mobile overrides |
| --- | --- | --- |
| Hero H1 | Frontmatter display ramp; max width 650px | 58px at ≤1099px; clamp(36px, 9.7vw, 46px), line-height 1.08 at ≤767px; 35px at ≤359px |
| Standard H2 | Frontmatter headline ramp | 37px at ≤767px |
| Final call H2 | clamp(38px, 4.3vw, 62px) | 38px at ≤767px |
| Coverage H2 | 48px | 36px at ≤767px |
| FAQ H2 | 43px | 36px at ≤1099px |
| Service panel H3 | 36px | 30px at ≤1099px; 32px at ≤767px |
| Heating/commercial H3 | 36px | 32px at ≤767px |
| Equipment H3 | 30px | 27px at ≤767px |
| Process H3 | 23px | 24px at ≤767px |
| Service extras H3 | 20px | 19px at ≤767px |
| Testimonial quote | 23px / 1.6, Open Sans 400 | 20px at ≤1099px |
| FAQ summary | 19px, Open Sans 600 | 17px at ≤767px |
| Main copy | Frontmatter body; selected secondary copy 15px | Hero and selected section copy 15px |
| Hero location | Frontmatter label | 9px at ≤767px; tracking 0.08em at ≤359px |
| Navigation/header action | 13px / 600 | Same type in compact navigation |
| Footer labels/links | Titles 16px Archivo Black; links 12px Open Sans | Same; footer bottom 10px |
| Decorative number/quote | Step number 43px; quote glyph 90px | 32px / 74px at ≤767px |

Headings balance lines; H3 tracking uses the title role. Hero body is limited to 420px (350px compact, 45ch mobile), service panel copy to 52ch, expertise/coverage prose to 48ch.

**The Brand Type Rule.** Preserve Archivo Black 400 and Open Sans 400/600; section-specific sizing does not authorize a new font family or synthetic weight.

## Layout

The centered container is `min(1280px, calc(100% - 112px))`, then `calc(100% - 64px)` at ≤1099px and `calc(100% - 40px)` at ≤767px. Section spacing follows the frontmatter desktop/tablet/mobile tokens. Header minimum height is 94px, then 84px compact and 76px mobile; logo width changes from 180px to 155px mobile.

The full-width hero is at least 740px high, 800px at ≥1700px and 690px at ≤1099px. Desktop copy sits left over the gradient; the AC outlet and curtain occupy the right. On mobile, copy precedes a separate 330px-high scene. Its 620px-wide surface sits at left 50% with -390px margin to retain the right-side subject. Desktop-only text breaks disappear.

Service panels use a 1.15:1 grid, 24px gap and a 54px lowered repair panel. Process steps use three columns; expertise, heating/commercial, reviews and FAQ use pairs. Coverage stacks at ≤1099px. At ≤767px major paired layouts and process steps stack, repair loses its offset, and quick services/towns use two columns. Footer changes from four columns to two, then one at ≤359px. Hero actions also become vertical at ≤359px.

Quick-service/footer tracks use `minmax(0, 1fr)` where needed and long links wrap. These are implemented responsive rules, not evidence of a separate mobile Pencil artboard or Safari/iPhone validation.

## Elevation & Depth

Depth comes from architecture, translucent airflow, fabric deformation and paper/stone/ink layering. Panels remain flat and square. The sole shadow (`0 12px 30px #182d381a`) belongs to the desktop Services dropdown and disappears in compact navigation. The hero gradient is a legibility layer.

## Shapes

Buttons and motion toggle use the discreet corner token. Service imagery and panels remain square. Fine borders divide routes, process steps, FAQs, towns and footer content. Lucide line icons supply arrows, service symbols and disclosure indicators.

## Components

### Actions and links

Primary actions use frontmatter tokens, a transparent 1px border, 56px minimum height, 22px icon gap and semibold text. Header actions use 48px minimum height and 12px 20px padding; mobile hero actions use 52px and 13px 18px. The final call uses the light variant. Background hover takes 180ms; action/text-link arrows move 2px right and 2px up over 180ms. Text links have at least 44px height and underline on hover.

Focus uses a 3px ocean outline with 5px offset, white in top bar, dark sections, footer and final call. There are no implemented loading, disabled or form-field variants.

### Navigation

Services uses native `details/summary`, an ocean open label and rotating chevron. Desktop dropdown is two columns, up to 690px wide, with 30px padding and the documented shadow. At ≤1099px it becomes inline and unshadowed; at ≤767px its groups stack.

Compact navigation is visible without JavaScript. Enhancement introduces the toggle and synchronizes label/`aria-expanded`. Escape closes Services first, then navigation, restoring focus. Outside clicks, followed links and desktop breakpoint changes close the compact menu; leaving Services with focus closes that disclosure.

### Service panels and supporting content

Installation uses ink/light copy; repair uses stone/muted copy. Images are 330px high desktop and 270px mobile. Panel padding changes from its frontmatter value to 30px compact and 28px mobile. Image hover scales to 1.035 over 650ms. Link rows have a fine top rule and 48px minimum height. Equipment uses a white inset with contained imagery. Attributed testimonials remain visible figures.

### Questions

FAQs use native `details/summary`, first answer initially open, with 24px vertical padding and fine dividers. The 44px-minimum summary has a plus icon rotating 45 degrees over 200ms when open. Answers remain usable without JavaScript.

### Architectural airflow and motion

The room plus transparent curtain form the initial static composition. Static and animated states share one optimized curtain texture at 80% scene height, avoiding a switch between separately generated photographs. Three desktop airflow paths reduce to two on mobile or lower quality. A pinned fabric mesh animates the curtain; scene strength fades in over 1.1 seconds.

WebGL2 loads dynamically after the room decodes when motion is allowed. It pauses offscreen/in hidden tabs, disposes resources on exit and reinitializes after back-forward cache restoration. Missing WebGL, shader failure, context loss or sustained low throughput returns the static composition. Resolution is limited by viewport, DPR and an 800,000-pixel budget; adaptive quality reduces resolution, lane count and eventually frame target before fallback. Frame targets are implementation settings, not measured smoothness guarantees.

Pause/resume affects scene and section entrances and persists in session storage. Reduced motion and Save-Data retain the static composition and hide the control. Reduced motion also disables CSS transitions/animations. Content remains visible without JavaScript.

Entrances occur once after intersection: text rises or shifts 22px over 540ms; images rise 20px with shallow clipping over 780ms. Delays cap at 300ms, using `cubic-bezier(.16,1,.3,1)`. Focus, hash navigation, rapid scrolling and pausing finish relevant entrances. Process rules draw over 850ms; the closing line enters over 1.1 seconds. Fine-pointer desktop parallax is bounded to ±6px horizontal, ±4px vertical and 24px scroll displacement; mobile has none.

### Logo and imagery

Preserve the complete original logo on white. The hero is a conceptual interior, not evidence of company work. [Raster provenance](design/airflow-source/provenance.md) records the generated room/backplate/curtain. Inherited service/equipment imagery has original source evidence in `docs/evidence/source-baseline`; company ownership and customer identity remain unverified.

Astro emits responsive AVIF/WebP images. Hero loads eagerly with high priority; lower images load lazily. Reduced-motion rendering requires no duplicate animation-only curtain texture.

## Do's and Don'ts

### Do:

- Do preserve the approved B brand colors, Archivo Black and Open Sans in this alternative.
- Do preserve the complete original logo on white with space around it.
- Do keep copy and service actions usable before motion enhancement loads.
- Do retain native navigation and FAQ behavior, visible focus and responsive stacking.
- Do keep conceptual and inherited image provenance with the assets.
- Do treat this branch as a local homepage alternative pending user review.

### Don't:

- Don't restore the rejected option A or impose the baseline composition on this approved alternative.
- Don't recolor, redraw or crop the original logo.
- Don't use amber for small text on light backgrounds.
- Don't present conceptual or inherited imagery as verified company work.
- Don't claim 60fps, all-browser compliance or numerical image-overlay contrast conformance without evidence.
- Don't present the local homepage as a completed full-site migration or released production.
- Don't invent badges, metrics, credentials or endorsements.
