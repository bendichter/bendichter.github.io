---
name: bendichter.com
description: Personal site of Ben Dichter, quiet scholarly pages banded by one six-step spectrum
colors:
  scholar-blue: "#3355cc"
  scholar-blue-soft: "#e8edfd"
  ink: "#16181d"
  muted: "#565e70"
  faint: "#69707c"
  rule: "#e3e6ee"
  paper: "#fcfcfd"
  panel: "#f3f5f9"
  spectrum-1: "#3355cc"
  spectrum-2: "#1a68a6"
  spectrum-3: "#0b7077"
  spectrum-4: "#307336"
  spectrum-5: "#8a5c14"
  spectrum-6: "#ab442c"
typography:
  headline:
    fontFamily: "ui-serif, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "clamp(1.85rem, 1.4rem + 1.6vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.012em"
  title:
    fontFamily: "ui-serif, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.012em"
  subtitle:
    fontFamily: "ui-serif, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.012em"
  lede:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Inter, Helvetica, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Inter, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.68
  label:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Inter, Helvetica, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.11em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "9px"
  lg: "10px"
  pill: "999px"
components:
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "1.15rem 1.25rem 1.1rem"
  chip-tag:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0.18rem 0.65rem"
  chip-tag-hover:
    backgroundColor: "{colors.scholar-blue-soft}"
    textColor: "{colors.scholar-blue}"
    rounded: "{rounded.pill}"
  nav-link:
    textColor: "{colors.muted}"
  nav-link-active:
    textColor: "{colors.ink}"
---

# Design System: bendichter.com

## Overview

**Creative North Star: "The Spectrum Hairline"**

The entire palette is declared once, at full strength, as a 3px hairline gradient across the top of every page. Everywhere else those six colors reappear only in dilute form: a 7% wash behind a software row, an 11% tint inside a language chip, a small dot beside a year heading. The signature move is that single loud statement followed by systematic restraint, so color always feels like it comes from somewhere rather than being applied ad hoc.

Around that one gesture the pages are quiet and scholarly, but warm and personal rather than institutional: this is one person's record, written in the first person. Serif headings over sans body text on near-white paper, hairline rules dividing sections, and system font stacks throughout (the site ships no webfonts; content loads as fast as the reader arrives). Both light and dark schemes are first-class: every color token has a dark counterpart, lifted in lightness and dropped in saturation so it holds without vibrating.

**Key Characteristics:**
- One six-step spectrum, stated at full strength once, diluted everywhere else
- Spectrum order chosen so adjacent steps survive red-green color vision deficiency
- Serif display over sans body, all system stacks, zero webfonts shipped
- One shared content width (58rem) across every page; prose narrows to 42rem inside articles
- Flat at rest; motion and shadow appear only as gentle hover responses
- Automatic light and dark schemes via `prefers-color-scheme`, with `color-scheme` declared

## Colors

A near-white page with an ink text ramp, one working accent, and a six-step spectrum used for banding and identity rather than emphasis.

### Primary
- **Scholar Blue** (#3355cc; dark scheme #7d9dfa): the one working accent. Links, the active-nav underline, blockquote rule, focus outlines, and the hover state of the talk play badge. It doubles as step 1 of the Spectrum.
- **Scholar Blue Soft** (#e8edfd; dark #1b2436): dilute companion used for hovered tag-chip backgrounds.

### Secondary
The Spectrum, a six-step ramp that gives repeating sections (years in an archive, projects in a grid, chips) their own identity by cycling `nth-child(6n + k)`:
- **Spectrum 1** (#3355cc; dark #7d9dfa): identical to Scholar Blue.
- **Spectrum 2** (#1a68a6; dark #57aae8): blue.
- **Spectrum 3** (#0b7077; dark #35bcc0): teal.
- **Spectrum 4** (#307336; dark #63bd68): green.
- **Spectrum 5** (#8a5c14; dark #dcae5c): amber.
- **Spectrum 6** (#ab442c; dark #e8836a): red-orange.

### Neutral
- **Ink** (#16181d; dark #e9ebef): primary text and hover-darkened nav links.
- **Muted** (#565e70; dark #a7aebc): secondary text, bios, blurbs, the lede.
- **Faint** (#69707c; dark #7d8593): metadata, dates, stars, footer text.
- **Rule** (#e3e6ee; dark #2b3039): every hairline border and divider.
- **Paper** (#fcfcfd; dark #111318): the page background.
- **Panel** (#f3f5f9; dark #191c23): code blocks, chips, and thumbnail placeholders.

### Named Rules
**The One Full-Strength Statement Rule.** The Spectrum appears saturated and adjacent only in the masthead hairline. Everywhere else a step appears alone and diluted: `color-mix()` washes of 7–16%, small dots, thin borders, chip tints. Never use a full-strength spectrum step as a large fill.

**The Spectrum Order Rule.** The ramp runs blue → blue → teal → green → amber → red-orange specifically so adjacent steps stay distinguishable under red-green color vision deficiency. Never reorder, skip, or substitute steps, and always assign them by position (`6n + k`), not by meaning.

**The Two Schemes Rule.** Every color introduced must be defined for both light and dark schemes in `:root` and the `prefers-color-scheme: dark` block. Dark variants are lifted in lightness and dropped in saturation, never simple inversions.

## Typography

**Display Font:** ui-serif (Iowan Old Style, with Palatino → Georgia fallbacks)
**Body Font:** ui-sans-serif (-apple-system, with Segoe UI → Helvetica fallbacks)
**Mono Font:** ui-monospace (SF Mono, with Menlo fallback)

**Character:** A bookish serif for headings and the author's name over a plain, highly legible system sans for everything else: the voice of a well-set academic page that loads instantly. No webfonts are shipped; Inter exists in the repo only to render build-time social card images.

### Hierarchy
- **Headline** (600, clamp(1.85rem, 1.4rem + 1.6vw, 2.4rem), 1.22): page titles. Serif, tight -0.012em tracking, `text-wrap: balance`.
- **Title** (600, 1.4rem, 1.22): section headings (h2), serif, 3rem top margin to band sections.
- **Subtitle** (600, 1.15rem, 1.22): sub-sections (h3), serif.
- **Lede** (400, 1.2rem, 1.55): the homepage's opening paragraph, set in Muted to give the page an editorial opening.
- **Body** (400, 1.0625rem, 1.68): running text, `text-wrap: pretty`. Inside articles it is held to the 42rem prose measure (roughly 70 characters).
- **Label** (650, 0.72rem, 0.11em tracking, UPPERCASE): year headings in archives, paired with a spectrum dot.

### Named Rules
**The Intermediate Weight Rule.** Emphasis inside body-size text uses in-between weights the variable system fonts support: 550 for entry titles, nav's active link, and chip text; 650 for labels. Full bold (700) is reserved for markdown strong text.

**The Serif Marks Identity Rule.** The serif appears where the site speaks as itself: page headlines, section headings, the masthead name, the profile name. UI text, metadata, and body copy stay sans.

## Layout

One content width for every page: `--measure` (58rem), centered inside a 62rem shell with 1.35rem side padding. The homepage is a two-track grid (14rem profile column + 40.5rem main + 3.5rem gap) whose tracks deliberately sum to the same 58rem, so moving between homepage and inner pages produces no width shift. Pages without the profile column use a single centered track.

Inside articles, running prose narrows further to `--prose` (42rem), while images and code may break out to the full measure. Vertical rhythm comes from generous section spacing (3rem above h2, 2.75rem above year labels) and hairline rules rather than boxes.

Grids are content-driven: `repeat(auto-fill, minmax(17rem, 1fr))` for project cards, 16rem minimum for talk thumbnails, 9.5rem for the drone reel. The single breakpoint is 48rem, below which the profile column reflows into a horizontal header band and grids collapse naturally.

The masthead is sticky, translucent (`color-mix` at 85% over the page), and backdrop-blurred, with the spectrum hairline as its top edge.

**The One Measure Rule.** Every page shares the 58rem measure. New layouts must compose inside it (or sum to it, as the homepage grid does), never widen past it.

## Elevation & Depth

The system is flat at rest. Depth is conveyed by hairline Rule borders, Panel tints one step off Paper, and the translucent blurred masthead, not by resting shadows. Shadow exists today only as a hover response on project cards. Deeper elevation may be layered in deliberately in future work, but it should arrive as a considered decision, not as a default on new surfaces.

### Shadow Vocabulary
- **Card hover lift** (`box-shadow: 0 6px 20px -12px color-mix(in srgb, var(--step) 70%, transparent)`, with `transform: translateY(-2px)`): the only shadow in the system. Tinted by the card's own spectrum step, so even elevation carries the banding.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest; shadow and lift appear only as a response to hover, and always tinted, never neutral gray.

## Shapes

Small, quiet radii on containers: 4px on inline code, 8–9px on thumbnails and prose images, 10px on code blocks and cards' bottom corners. Project cards are subtly asymmetric (`border-radius: 4px 4px 10px 10px`) beneath a 3px spectrum-colored top border, echoing the masthead hairline at component scale. Chips and tags are full pills (999px). Circles are the recurring accent geometry: the avatar, the drawn play badge, the spectrum dots beside years and card facts. Borders are always 1px Rule hairlines; the only thick edges are the 3px spectrum statements (masthead top, card top, software row left).

## Components

The component philosophy is refined and restrained: hairline borders, dilute tints, and gentle color shifts on interaction. This is a content site; there are no buttons, forms, or inputs to document, and none should be invented ad hoc.

### Cards / Containers (project cards)
- **Corner Style:** 4px top / 10px bottom (`4px 4px 10px 10px`)
- **Background:** Paper, with a 1px Rule border and a 3px top border in the card's spectrum step
- **Shadow Strategy:** flat at rest; on hover the border warms toward the step, the card lifts 2px, and the tinted shadow appears (see Elevation)
- **Internal Padding:** 1.15rem 1.25rem 1.1rem
- **Behavior:** the title link stretches over the whole card; secondary links stay independently clickable above it. The title takes the step color on hover.

### Chips
- **Tag chips** (article tags): Panel background, Muted text, 1px Rule border, pill radius, 0.79rem. Hover: Scholar Blue text on Scholar Blue Soft.
- **Language chips** (on cards and software rows): the row's spectrum step at 11–12% `color-mix` for the background, step color for the uppercase 550-weight text, pill radius.

### List rows (software list)
- **Style:** 3px left border in the row's spectrum step, a left-to-right gradient wash of the step at 7% fading to transparent by 65%, radius 0 9px 9px 0
- **Hover:** the wash deepens to 16% and extends to 80%; project name links take the step color

### Entry rows (archive listings)
- **Style:** typographic only: 550-weight Ink title over Faint 0.86rem metadata, no container. Grouped under uppercase Label year headings with a spectrum dot, cycling `6n + k`.

### Media thumbnails (talks, drone reel)
- **Style:** 16:9, 9px radius (8px on the smaller reel), 1px Rule border, Panel placeholder
- **Play badge:** drawn in CSS: a 55% black blurred circle with a white triangle; turns Scholar Blue on hover
- **Hover:** image scales 1.035 (1.05 on the reel) over 0.25s; disabled under `prefers-reduced-motion`

### Navigation (masthead)
- **Style:** sticky translucent bar under the spectrum hairline; serif site name at 1.1rem/600, sans links at 0.94rem Muted
- **States:** hover darkens to Ink; the current page is Ink at weight 550 with a 2px Scholar Blue underline sitting on the masthead's bottom rule

### The Spectrum Hairline (signature)
A 3px `linear-gradient(90deg, …)` through all six spectrum steps, drawn as the masthead's top edge on every page. It is the palette's declaration; component-scale echoes (card top borders, software row left borders) always use a single step, never the full gradient.

## Do's and Don'ts

### Do:
- **Do** assign spectrum steps positionally with `nth-child(6n + k)` cycles, and dilute them with `color-mix(in srgb, var(--step) 7–16%, transparent)` for fills.
- **Do** define both light and dark values for any new color token, and declare hover motion (lifts, zooms) alongside a `prefers-reduced-motion: reduce` opt-out.
- **Do** keep text on the three-step neutral ramp: Ink for primary, Muted for secondary, Faint for metadata.
- **Do** hold every page to the 58rem measure and article prose to 42rem.
- **Do** keep transitions short and eased: 0.12–0.14s for color shifts, 0.2–0.25s for transforms.
- **Do** use `:focus-visible` outlines in Scholar Blue (2px, 3px offset) on anything interactive.

### Don't:
- **Don't** ship webfonts; the system stacks are a deliberate performance and character choice.
- **Don't** use a full-strength spectrum step as a large fill, or the full gradient anywhere except the masthead hairline.
- **Don't** reorder or substitute spectrum steps; the sequence is a color-blindness accommodation.
- **Don't** add resting shadows or heavy borders; depth belongs to hover states, hairlines, and Panel tints unless a future decision deliberately expands elevation.
- **Don't** invent buttons, badges, or a second accent color; Scholar Blue is the only color with semantic meaning.
- **Don't** widen the page past the measure or center-align running text.
