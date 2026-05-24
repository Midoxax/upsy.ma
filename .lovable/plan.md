## Audit Fixes — Implementation Plan

Applying 4 of the 6 audit fixes. Skipping Fix 6 (PostHog) — already wired via `src/lib/analytics/posthog.ts`. Auth fix preserves existing `AuthContext` features (idle timeout, Sentry/PostHog identify, OAuth post-redirect) instead of the verbatim rewrite.

---

### Fix 1 — Auth redirect (minimal, preserve features)
**File:** `src/pages/Auth.tsx`
- Update `handleLogin` to call `signIn` then explicitly `navigate(redirect || "/my-space", { replace: true })` on success, matching uploaded `FIX_1b`.
- Update `handleSignup` similarly (respect existing email-verification flow — if signup returns no session because verification is required, show the existing "check your email" toast instead of navigating).
- Keep the existing `useEffect`-based redirect as a fallback (covers OAuth round-trips).
- **Do not touch** `src/contexts/AuthContext.tsx` — its idle-timeout, Sentry/PostHog identify, and `upsy:post-oauth-redirect` logic stay intact.

### Fix 2 — `/pricing` page
**New:** `src/pages/Pricing.tsx`
- Build from uploaded `FIX_2_Pricing_Page.tsx` but rewrite to use semantic design tokens (`bg-primary`, `text-foreground`, `border-border`, gradient-maroon utilities) — no raw Tailwind colors.
- Sections: Individual pricing, packs, B2B/Organizations, FAQ accordion. Includes `SEOHead`.
- CTAs link to `/auth?redirect=/get-matched` (individuals) and `/services` proposal modal (B2B).
- `i18n` via `t()` with English fallbacks (consistent with existing pages).

**Route + nav:**
- `src/App.tsx` — add `const Pricing = lazy(() => import("./pages/Pricing"))` and `<Route path="/pricing" element={<Pricing />} />`.
- `src/components/MegaMenu.tsx` — add "Pricing" link under an appropriate category (Services or Resources).
- `src/components/Footer.tsx` — add Pricing link to footer.

### Fix 3 — Light-theme contrast (WCAG AA)
**File:** `src/index.css`
- In light `:root`: tighten `--muted-foreground` to `0 0% 32%`, `--border` to `30 15% 85%`, `--input` to `30 15% 90%`.
- Add the placeholder/disabled/label utility rules from `FIX_3_CSS_Contrast.css`, scoped so they don't override dark theme (verify dark `.dark { ... }` block remains untouched).
- Skip the `!important` overrides on `.text-muted-foreground` and `nav a.text-foreground/70` — those are too aggressive and will break dark mode. The token change is enough.

### Fix 4 — Mobile menu overflow
**File:** `src/components/Header.tsx`
- Replace the mobile nav block with the version from uploaded `FIX_4_Mobile_Menu.tsx`: `max-h-[calc(100vh-4rem)] overflow-y-auto`, fixed dropdown toggle, `e.stopPropagation()` on inner Link clicks, reset `openDropdown` on close.
- Verify the currently-used nav structure (`navigation`, `addLocalePrefix`, `isActive`) matches the uploaded snippet before splicing.

### Fix 5 — `package.json` polish
**File:** `package.json`
- Rename to `"upsy-platform"`, bump version to `"1.0.0"`.

---

### Out of scope
- Fix 6 PostHog (already wired).
- AuthContext rewrite.
- Any backend / RLS / migration changes.
- New translations file edits — reuse `t() || "fallback"` pattern.

### Files touched
- **New:** `src/pages/Pricing.tsx`
- **Modified:** `src/pages/Auth.tsx`, `src/App.tsx`, `src/components/MegaMenu.tsx`, `src/components/Footer.tsx`, `src/index.css`, `src/components/Header.tsx`, `package.json`

### Verification
- After build: visit `/pricing`, `/auth` (sign in → lands on `/my-space` immediately), check light-mode muted text contrast, open mobile menu at <768px and confirm scroll + dropdown behavior.
