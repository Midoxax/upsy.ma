

## Rewrite /services Page — Performance Psychology System Voice

### Problem
Current copy uses soft, generic language ("Personalized Guidance", "help you thrive", "Every journey is unique"). This contradicts the brand voice system: short, direct, clinical/operational terms. The page should read like a diagnostic protocol menu, not a wellness brochure.

### Changes

**File: `src/lib/i18n/translations.ts`** — Rewrite all 3 locale blocks for `services`:

#### English (lines 478–504)
- **Title**: "Personalized Guidance that blends..." → "Protocols. Not Packages."
- **Subtitle**: "Every journey is unique..." → "Each intervention is structured around your diagnostic profile. Measure first. Then train."
- **Service items** — reframe as clinical protocols:
  1. "Initial Diagnostic" → "Diagnostic Assessment" / "90-min structured intake. Baseline metrics. Identify what is breaking. Build your protocol."
  2. "Performance & Resilience Pack" → "Performance Protocol" / "6×60-min sessions. Visualization. Pre-event routines. Stress inoculation. Measured outcomes."
  3. "Therapy & Recovery Pack" → "Clinical Recovery Protocol" / "10×60-min CBT/Schema sessions. Anxiety. Trauma. Addiction. Tracked progress."
  4. "Personality & Serenity Tests" → "Psychometric Profiling" / "Validated instruments + 2×60-min debrief sessions. Know your operating system."
  5. "Express Online Follow-up" → "Recalibration Session" / "30-min targeted tune-up. Returning clients only. Adjust what needs adjusting."
- **Expectations title**: "What to Expect" → "The Process"
- **Expectations list** — rewrite as operational statements:
  1. "Structured protocols with measurable KPIs"
  2. "Evidence-based methods. No guesswork."
  3. "Sessions in English, French, or Arabic"
  4. "Full confidentiality. Clinical-grade ethics."
  5. "Online or in-clinic. Your call."
- **CTA**: "Get Started" → "Run Your Diagnostic"
- **Transition title**: → "Individual protocols solve individual problems. Systemic dysfunction requires systemic intervention."
- **Transition button**: → "View Institutional Protocols"

#### French (lines 1567–1587)
Mirror the same voice shift in French — clinical, direct, operational tone.

#### Arabic (lines 2650–2670)
Mirror the same voice shift in Arabic — maintaining RTL-appropriate phrasing with the same clinical authority.

**File: `src/pages/Services.tsx`** — Update the CTA button to navigate to `/get-matched` instead of `/contact` (aligns with the "Run Your Diagnostic" directive).

### No structural/layout changes needed. Pure copy rewrite across translations + one navigation target change.

