# Plan — Polish + Content Campaign

Four independent workstreams, ordered for fastest perceived value.

## 1. Header transparency fix
**File:** `src/components/Header.tsx` (line 62)

Current: `bg-background/80 backdrop-blur-xl` — too see-through over busy hero sections (visuals bleed through, logo + nav lose contrast).

Change to a scroll-aware header:
- Default (top of page): `bg-background/60 backdrop-blur-md` — light glass over hero
- After scroll (>20px): `bg-background/95 backdrop-blur-xl border-b border-border` — solid, readable
- Add `useEffect` + `scroll` listener tracking `window.scrollY`, toggling a `scrolled` state class
- Strengthen border (`border-border/80`) and add subtle shadow only when scrolled

Same treatment for `MegaMenu` panel (already at `/98` opacity — fine, just verify drop shadow contrast in light theme).

## 2. Panels opening at the wrong scroll position
**Cause:** modals/drawers/tabs that mount mid-page rely on the existing scroll position; users see them rendered far below the viewport.

Sweep these candidates and add a `scrollIntoView({ block: 'start', behavior: 'smooth' })` (or `window.scrollTo(0,0)`) on open:
- `src/components/psychologists/BookingModal.tsx`
- `src/components/psychologists/PsychologistFilters.tsx` (mobile slide-up)
- `src/components/psychologists/PoliciesDrawer.tsx`
- `src/components/anamnesis/AnamnesisDrawer.tsx`
- `src/components/matching/MatchingFormModal.tsx`
- `src/components/services/ProposalRequestModal.tsx`
- Any `<Tabs onValueChange>` in `MySpace.tsx` / dashboards that swap large content

Strategy: small helper hook `useScrollIntoViewOnOpen(ref, open)` in `src/hooks/`, then apply to each panel's root container.

## 3. Smart post-login redirect
Goal: after sign-in (or after email-verified signup), return user to the exact page they were on before `/auth`. Fallback `/my-space`.

**Files & changes:**
1. `src/components/ProtectedRoute.tsx` — when redirecting unauth users, pass current location:
   `<Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />`
2. `src/components/Header.tsx` and any "Sign in" links — append `?redirect=<current path>` when current path isn't `/auth`.
3. `src/pages/Auth.tsx` — already reads `?redirect=` query (lines 132, 180). Verify it also:
   - Passes `redirect` into `emailRedirectTo` so post-verification lands on the right page
   - Handles OAuth callback redirect (currently `lovable.auth.signInWithOAuth` — pass `redirectTo`)
4. `src/contexts/AuthContext.tsx` `signUp` — accept optional `redirectAfter` and inline it into the `emailRedirectTo` URL as `/auth?verified=1&redirect=<path>`.
5. Sanity: never redirect to `/auth` or `/reset-password` (loop guard).

## 4. Content creation campaign
Three parallel content sub-tracks, each delivered as a single PR-style commit.

### 4a. Nour AI chatbot content (`src/pages/AIAssistant.tsx` + `supabase/functions/ai-assistant/index.ts`)
- **System prompt refresh:** Performance Psychology voice, FR/EN/AR aware, crisis protocol (SOS Amitié Maroc 0801000180), boundaries ("I'm not a therapist substitute"), refer-out to psychologists.
- **Empty-state:** 4 suggested prompt chips localized (Stress check-in, Sleep struggles, Pre-competition nerves, Talk to a human → /psychologists).
- **Greeting variants:** time-of-day + first-name interpolation (`Bonjour Mehdi 👋` already shipped — add evening/morning variants in i18n).
- **Streaming loading state:** typing indicator using `<Pulse>` triplet.
- **Disclaimer footer** under input: "Nour is an AI guide. For emergencies, call 0801000180."

### 4b. Blog audit & fill
9 articles exist. Audit each for:
- SEOHead metadata (title, meta description, canonical, JSON-LD Article schema)
- Hero image alt text
- ~800–1200 word body, H2/H3 hierarchy, internal links to /psychologists or /get-matched
- Author block (Mehdi Felji — Founder, no Dr. title — per memory)
- CTA card at end (book a call / get matched)
- Related-articles strip

Output: 9 small per-file patches, plus a shared `<BlogLayout>` component if duplication is high.

### 4c. Thin homepage / page components
Audit-flagged thin files to flesh out:
- `CommunitySection.tsx` (37 lines) — add member testimonials grid, join CTA
- `OrganizationsSection.tsx` (57 lines) — add 3 use-cases + logos placeholder
- `ResearchSection.tsx` (61 lines) — add publication list + methodology snippet
- `SectionDivider.tsx` — already a divider, leave
- `FounderSection.tsx` (76) — verify matches Founder block layout memory (1100px, 40/60 split, 3 proof cards)

Also scan and fill any blog pages or service pages flagged with TODO / "Coming soon" / empty arrays.

## Execution order (build mode)
1. **Quick wins first:** Header (1) + login redirect (3) — small, immediate UX win.
2. **Panel scroll fix (2)** — single shared hook, then apply across ~6 components.
3. **Content campaign (4)** — biggest scope; tackle 4a (AI), 4b (blog), 4c (thin sections) as 3 successive commits so you can review each.

## Out of scope (flag for later)
- WhatsApp Business API integration (memory mentions goal — separate effort)
- Apple OAuth backend config (manual step per memory)
- New blog articles beyond the existing 9 (ask before generating)

## Open assumptions
- "Banner transparency" = top sticky Header. If you meant the hero banner or a specific page banner, tell me and I'll re-scope.
- "Panels open at end of page" = modals/drawers mounted mid-page. If you meant a specific one, point me to it.
- Content campaign = polish/fill existing content, not net-new article series.
