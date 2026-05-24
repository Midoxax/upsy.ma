# Translations + RTL Fix Plan

## What's actually broken

After auditing the codebase:

- **4 locales** are wired (en, fr, ar, ber) via `LocaleContext` + `src/lib/i18n/translations.ts`.
- **EN has ~1353 lines of keys, FR/AR ~1212 each, BER only 64.** That means FR/AR are missing ~140+ keys (silently fall back to the raw key string) and BER is essentially a stub.
- **Only 64 of 252 components actually call `t()`.** ~188 components ship hardcoded English — including the hero. In `HeroSection.tsx` everything visible is hardcoded: `wordPairs` (Burnout→Recovery…), `floatingKeywords` (CBT, EMDR, Schema…), all 4 `heroVariants` (`titlePrefix`, `subtitle`, both CTAs, all stats), and `previewCards`.
- **RTL** only flips `<html dir>` — there's no audit of asymmetric layouts, mirrored icons, `text-left`, `pl-*`/`ml-*`, or directional arrows for Arabic.
- **Berber** is so incomplete it shows mostly raw keys; we'll hide it from the language switcher until content lands.

This is a very large surface (≈190 components). Doing it all at once would be a giant unreviewable change, so I'll phase it.

## Scope decisions

- **Languages:** EN, FR, AR fully covered. BER hidden from the switcher (kept in the file, marked as work-in-progress).
- **Order of attack:** marketing/public surfaces first (highest visibility), then auth/booking/dashboards, then admin (admin stays EN-only — internal tool).
- **Strategy:** for each component touched I (1) extract literals into `translations.ts` under a stable key namespace, (2) call `t()` from the component, (3) add FR + AR values, (4) verify RTL.

## Phase 1 — Hero + homepage (this turn)

1. Add `home.hero.*` namespace to `translations.ts` for EN/FR/AR with:
   - 6 word pairs (problem/solution).
   - 8 floating keyword labels.
   - All 4 intent variants × {titlePrefix, subtitle, primaryCta, secondaryCta, 3 stats labels}.
   - Preview cards (3 × {title, description}).
2. Refactor `HeroSection.tsx` to read every visible string via `t()`. Keep the data shape, just swap the values to keys.
3. Sweep the rest of `src/components/home/*` (`Trust`, `Pathways`, `Founder`, `MethodsMetrics`, `SelfAssessment`, `FeaturedPsychologists`, `HowItWorks`, `FinalCTA`, `Testimonials`, `Programs`, `Community`, `Research`, `Pillars`, `Psf`, `Organizations`, `Learning`) — same treatment. New namespace `home.<section>.*`.
4. RTL pass for the homepage: replace any `text-left`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `flex-row` with logical equivalents (`text-start`, `ms-*`, `me-*`, `ps-*`, `pe-*`) where direction matters; add `rtl:rotate-180` to forward-pointing arrow icons inside CTAs.

## Phase 2 — Public pages

`Psychologists`, `PsychologistProfile`, `Services`, `ConsultingForOrganizations`, `GetMatched`, `MoroccanUmbrella`, `PsychologuesSansFrontieres`, `Founder`, `About`, `Contact`, `Resources`, `Learn`, `LearnCourse`, `AssessmentLab`, `Skool`, `TalentInnovationHub`, `MethodsMetricsBand`, `Footer`, `Header`/`MegaMenu`, `BookingModal`, `BookingWidget`, `MatchingFormModal`, `ProposalRequestModal`, blog index + 8 articles.

For each: extract literals → keys → EN/FR/AR values → RTL polish.

## Phase 3 — Auth + booking + client-facing dashboards

`Auth`, `ResetPassword`, `MfaSetup`, `Invite`, `Apply` + wizard, `IntakeForm`, `BookingResponse`, `VideoCall`, `MySpace`, `PatientDashboard`, `SpecialistDashboard`, `OrganizationDashboard`, `AthleteHub`, `Notifications`, `AIAssistant`, `Legal`, `Privacy`, `Terms`, `Install`, `NotFound`, dashboard cards/components.

## Phase 4 — RTL audit + cleanup

- Switchers, tabs, drawers, slide-over panels: ensure they slide from the correct edge in AR.
- `LanguageSwitcher`: hide `ber` until BER reaches parity, add a "(beta)" tag if we keep it visible.
- Add a small dev-only logger in `t()` that `console.warn`s missing keys per locale (DEV only) so future drift is caught.
- Add a CI-style script `scripts/i18n-check.ts` (run manually) that diffs EN vs FR vs AR and prints missing keys.

## Out of scope

- Admin pages (`src/pages/admin/*`, `src/components/admin/*`) stay EN-only.
- Email templates already have their own i18n in `supabase/functions/_shared/email-templates`.
- Dynamic DB content (psychologist bios, blog post bodies if stored in DB) — needs a separate data-translation strategy.

## Technical notes

- All new keys go in `src/lib/i18n/translations.ts` under nested namespaces (`home.hero.variants.exploring.titlePrefix`, etc.).
- `t()` already supports DB overrides via `translation_overrides` table — admins can still tweak copy without code changes.
- For Arabic numerals/dates we keep Western digits (matches existing pattern); only direction flips.
- I'll only run Phase 1 in this turn. After you review the hero + homepage in EN/FR/AR, I'll proceed to Phase 2, then 3, then 4 as separate turns so each is reviewable.

## Deliverable for Phase 1

- `src/lib/i18n/translations.ts` — new `home.*` keys for en/fr/ar.
- `src/components/home/HeroSection.tsx` + all sibling section files — refactored to use `t()`.
- RTL polish on homepage components.
- Brief screenshot check on `/`, `/fr`, `/ar` after the change.
