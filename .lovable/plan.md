## Add "Why U.Psy" Differentiation Section + Page

A distinctive homepage section showcasing what sets U.Psy apart, plus a full dedicated page for deeper dive.

### Differentiators (auto-drafted from platform positioning)

Six pillars that genuinely distinguish U.Psy in the Moroccan market:

1. **Performance Psychology System** — Not a therapy directory. A full operational SaaS for measuring, training, and applying psychological skills.
2. **5-Tier Accreditation** — Every specialist verified through a multi-stage clinical accreditation, not self-declared credentials.
3. **Built for Morocco** — Trilingual (EN/FR/AR-RTL), Law 09-08 compliant, MAD pricing, local payment rails, Moroccan clinical culture.
4. **Clinical Rigor** — Validated instruments (GAD-7, PHQ-9), evidence-based protocols (CBT, Schema, EMDR), structured session notes.
5. **Integrated Ecosystem** — Marketplace + MOOC + B2B programs + AI tools (Nour) + crisis protocol — one platform, not patchwork.
6. **Privacy by Design** — Strict RLS, encrypted notes, HIBP password checks, mandatory email verification, zero data resale.

### 1. Homepage section: `WhyUsSection.tsx`

**Distinctive layout** — diverges from the standard glassmorphism card grids used elsewhere:

```text
┌───────────────────────────────────────────────────────────┐
│  Eyebrow: WHY U.PSY                                       │
│  H2: Six reasons we're not another therapy directory.     │
│                                                           │
│  ┌─────────┐                                              │
│  │ 01      │   Performance Psychology System              │
│  │ ●━━━━━━━│   Short body copy explaining differentiator. │
│  └─────────┘                                              │
│         ┌─────────┐                                       │
│         │ 02      │   5-Tier Accreditation                │
│         │ ●━━━━━━━│   Body copy.                          │
│         └─────────┘                                       │
│  ┌─────────┐                                              │
│  │ 03 ...  │   (alternating left/right zigzag)            │
│  └─────────┘                                              │
│                                                           │
│  [Read the full why →  /why-us]                           │
└───────────────────────────────────────────────────────────┘
```

- **Asymmetric zigzag** numbered list (01–06), alternating left/right alignment to break from grid sections.
- Large numerals in Outfit, gold accent line, soft maroon glow on hover.
- Each row reveals on scroll (Framer Motion, 400ms stagger).
- Subtle floating gold particles in background.
- Final CTA links to `/why-us`.
- Fully responsive: collapses to single column on mobile, sticky CTA preserved.

**Insert position:** between `pillars` and `programs` in `src/pages/Index.tsx` `sections` array, with intent priorities tuned so it surfaces high for SKEPTICAL and RESEARCHING intents.

### 2. Dedicated page: `/why-us`

Route: `src/pages/WhyUs.tsx`, registered in `src/App.tsx`.

Page structure:
1. **Hero** — Bold statement: "We don't list therapists. We run a performance psychology system." + subtitle + dual CTA (Get Matched / Talk to Founder).
2. **Comparison band** — Side-by-side "Typical therapy directory" vs "U.Psy" with 5-row checklist (verified credentials, structured outcomes, integrated tools, local compliance, ongoing measurement).
3. **Six differentiator pillars** — Expanded versions of the homepage section, each with icon, supporting proof points, and a deep-link to the relevant feature (e.g., `/assessment-lab`, `/founder`, `/psychologists`).
4. **Methodology proof** — Reuses existing `MethodsMetricsBand` component (CBT/Schema/EMDR transparency).
5. **Founder voice** — Short pull-quote from Mehdi Felji with link to `/founder`.
6. **Final CTA** — "Find your match" → `/get-matched` + "Read methodology" → `/founder`.

SEO: `SEOHead` with title "Why U.Psy — Performance Psychology System for Morocco", localized canonicals, FAQPage JSON-LD covering common "why us" questions.

### 3. Translations

Add keys under `whyUs.*` namespace in `src/lib/i18n/translations.ts` covering EN, FR, AR — eyebrow, headline, the six pillars (title + body), comparison rows, page hero, CTAs.

### 4. Navigation

Add "Why U.Psy" link to the existing MegaMenu under the "About" / company category in `src/components/MegaMenu.tsx`, plus a footer link in `src/components/Footer.tsx`.

### Files Touched

**New:**
- `src/components/home/WhyUsSection.tsx` — homepage zigzag section
- `src/pages/WhyUs.tsx` — dedicated page

**Modified:**
- `src/pages/Index.tsx` — register section in `sections` array with priorities
- `src/App.tsx` — add `/why-us` route
- `src/lib/i18n/translations.ts` — add `whyUs.*` keys (EN/FR/AR)
- `src/components/MegaMenu.tsx` — add nav entry
- `src/components/Footer.tsx` — add footer link

### Out of Scope

- No backend/database changes
- No new edge functions
- No new design tokens — reuses existing maroon/gold/beige + glassmorphism utilities
- No A/B testing infrastructure

### Technical Notes

- Animations stay within the project's motion language (Float/Pulse, 300–800ms, Framer Motion only).
- The homepage section follows the ±2 reorder clamp and won't disrupt narrative anchoring (Hero/Trust/Pathways/HowItWorks pinned positions stay intact).
- Memory rule respected: Mehdi Felji referenced as "Founder", never "Dr." or "Clinical Psychologist".
