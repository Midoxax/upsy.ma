
# Implementation Plan

## 1. Accessibility Audit and Fixes

**Hero & Decorative SVGs:**
- Add `aria-hidden="true"` and `role="presentation"` to all decorative SVGs in `HeroSection.tsx`, `FloatingDecorations.tsx`, `SectionDivider.tsx`
- Add `prefers-reduced-motion` media query support to all Framer Motion animations (already partially done in HeroSection; extend to FloatingDecorations, ScrollGuide)
- Ensure ScrollGuide speech bubbles are not keyboard-focusable traps

**Semantic Landmarks across all homepage sections:**
- Wrap homepage in `<main>`, header in `<header>`, footer in `<footer>` (verify existing)
- Add `<section aria-labelledby="...">` with heading IDs to each homepage section component
- Add descriptive `alt` text to all `<img>` tags; use `alt=""` for purely decorative images
- Verify all interactive elements (buttons, links) have visible focus rings (already using `focus:ring-2` in many places; audit gaps)

**Files:** `HeroSection.tsx`, `FloatingDecorations.tsx`, `SectionDivider.tsx`, `ScrollGuide.tsx`, all homepage section components, `Header.tsx`, `Footer.tsx`

---

## 2. Route Pages with Placeholder Content

Create or verify the following pages exist with proper placeholder content, SEOHead, and translation-ready structure:

| Route | File | Status |
|-------|------|--------|
| `/about` | `About.tsx` | Exists -- verify content |
| `/services` | `Services.tsx` | Exists -- verify sub-routes |
| `/services/*` | `services/` dir | Exists -- verify |
| `/resources` | `Resources.tsx` | Exists |
| `/book-a-call` | `BookRedirect.tsx` | Exists -- rename/alias |
| `/contact` | `Contact.tsx` | Exists |
| `/legal` | `Legal.tsx` | Exists |
| `/talent-innovation-hub` | `TalentInnovationHub.tsx` | Exists |
| `*` (404) | `NotFound.tsx` | Exists |

Most pages already exist. Will audit each for proper semantic HTML, SEOHead usage, and translation key coverage. Add any missing sub-service routes.

---

## 3. Hero Section Rebuild

Polish the existing `HeroSection.tsx` (561 lines):
- Ensure dark gradient background with brand blobs is the primary visual above the fold
- Add a prominent "Book a Call" CTA button that links to `/book-a-call` or scrolls to booking section
- Accessible focus states on all CTAs
- Keep the rotating word pairs and intent-driven content
- Verify mobile layout (vertical stacking, proper blob sizing)

---

## 4. Global Footer Enhancement

Update `Footer.tsx` to include:
- Social icons (YouTube, LinkedIn, Instagram -- already present)
- Contact info (WhatsApp, email from memory)
- Language toggle (already has `LanguageSwitcher`, will add Amazigh button)
- Crisis/SOS note: "If you are in crisis, contact SOS Amitie Maroc: 0522-200-200"
- Proper `<footer>` landmark with `aria-label`

---

## 5. Global Sticky Header with Mobile Menu

Update `Header.tsx`:
- Make header sticky (`sticky top-0 z-50`) with glassmorphism backdrop
- Verify all nav links route correctly to their pages
- Audit mobile hamburger menu for proper `aria-expanded`, focus management, and scroll lock
- Add smooth scroll behavior for same-page anchor links

---

## 6. Translation Fixes + Amazigh (Tamazight) Language

**Add Amazigh as 4th language:**
- Update `Locale` type from `'en' | 'fr' | 'ar'` to `'en' | 'fr' | 'ar' | 'ber'`
- Add Amazigh button to `LanguageSwitcher.tsx` with label "ⵜⵎⵣ" or "AMZ"
- Add `ber` translation block in `translations.ts` with Tifinagh script content
- Update `LocaleContext.tsx` to handle `'ber'` locale
- Update `i18n/utils.ts` for `/ber` path prefix

**Translation audit:**
- Review all 3779 lines in `translations.ts` for missing keys across EN/FR/AR
- Fix scientific/clinical terminology accuracy (CBT, EMDR, Schema Therapy, GAD-7, PHQ-9)
- Ensure proper RTL support for AR and appropriate direction for Tifinagh
- Add translation keys for any new placeholder page content

### Technical Details

- Locale type change propagates to: `LocaleContext.tsx`, `LanguageSwitcher.tsx`, `i18n/utils.ts`, any component using `handleSwitch` or locale checks
- Amazigh/Tifinagh is written left-to-right, so no RTL handling needed for `ber`
- The `translation_overrides` table in the database already supports any locale string, so no migration needed

---

## Execution Order

1. Accessibility audit (all decorative elements, landmarks, focus states)
2. Hero section polish with "Book a Call" CTA
3. Sticky header + mobile menu fixes
4. Footer enhancement with crisis note and contact info
5. Route pages audit and placeholder content
6. Amazigh language support + translation fixes across all pages
