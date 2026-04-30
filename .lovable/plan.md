
# U.Psy — Full Prototype Audit & Improvement Roadmap

## 1. State of the Prototype (what's there)

**Scope.** ~293 TS/TSX files, 64 migrations, 92 public tables, 24 edge functions, ~3,780 i18n keys (EN/FR/AR with RTL), 4 dashboards (Patient, Specialist, Organization, Admin), and a homepage with intent-based dynamic sections.

**Solid / shipped areas**
- **Auth & security:** signup/login, password reset with confirmation + suggestion + Google linkage, MFA setup page, RLS everywhere, HIBP via Supabase, `user_roles` separation, audit_log table.
- **Booking & video:** end-to-end flow including proposed → confirmed → declined timeline (`SessionStatusTimeline`), Jitsi room with 15s timeout + retry banner, admin bulk accept/decline, decline reason persistence, response email via `notify-proposal-response`.
- **Specialist & patient dashboards:** profile, availability, pricing, leads, plans, support, sessions, notes, certificates, analytics, earnings, journal, boosts, gamification, anamnesis.
- **Organization dashboard:** overview, pulse, users, programs, psychologists, reports, analytics, billing, branding tabs (UI scaffolded).
- **Admin:** large 762-line dashboard, applications, accreditation manager, transactions, support inbox, translation manager, command palette.
- **Content & funnels:** 9 blog articles, founder page, MoroccanUmbrella, PSF sub-brand, Talent/Athlete/Organization funnels, AssessmentLab, Resources, Learn (MOOC index + course page), AIAssistant (Nour), GetMatched 6-stage funnel.
- **Edge functions:** AI assistant, find-matches, recommend, anamnesis reminder cron, session reminders cron, certificate generation, encrypt/decrypt notes, crisis screening, propose-session, send-meeting-link, generate-org-invoice, simulate-payment-webhook, verify-application, provision-psychologist, session-summary.

## 2. Gaps and weak spots (what we have *not* meaningfully worked on)

### A. Payments are still a simulation
- `create-booking-payment` resolves locally; `simulate-payment-webhook` is the only path to "paid". No real Stripe / Paddle / CMI gateway, no refunds, no payout reconciliation against `specialist_payouts`.
- `BookingModal.tsx` calls the function but there's no checkout UX, no receipt email, no failed-payment recovery.
- No coupon UI surface in checkout despite `coupons` / `coupon_redemptions` tables.

### B. PWA is incomplete
- `manifest.webmanifest` is registered, `Install.tsx` page exists, but **no service worker**, no offline shell, no install prompt logic beyond a button. Icons are a single `favicon.png` reused for 192/512 with `any maskable` (will look cropped on Android).

### C. Organization side is UI-only in places
- 9 tabs scaffolded but `org_pulse_responses`, `org_aggregate_reports`, `sector_reports` data flow needs verification — no clear flow to publish a pulse survey, collect anonymous responses, and surface aggregate K-anonymity (k≥5) reports.
- `OrgBrandingTab` exists but no co-branded program landing page for employees.
- B2B invoicing (`generate-org-invoice`) is wired but no admin override / credit notes / dunning.

### D. MOOC / Learn is shallow
- Course list + enrollment exist, but no quiz engine, no module completion tracking beyond `user_progress`, no certificate-on-completion hook into `certificates`, no instructor view, no video DRM/host abstraction.

### E. AI Assistant (Nour) — single surface only
- `/ai-assistant` works (SSE stream), but no in-dashboard "ask Nour about my last session" widget, no journal-aware context, no specialist-side AI summaries linked from `session-summary` function into the notes editor.

### F. Assessments
- `AssessmentLab` runs GAD-7/PHQ-9 etc., but premium reports table exists with no clear paywall/upsell UX, and results don't auto-route to a matching psychologist or pre-fill the anamnesis.

### G. Crisis safety net
- `crisis-screening` function and `CrisisModal` exist but the SOS Amitié Maroc protocol is not visibly tested across all entry points (journal, chat, mood entry low-score).

### H. Mobile UX & accessibility
- 796px viewport reveals tab bars relying on `hidden sm:inline` icon-only mode; some dashboards have ≥10 tabs which collapse to icon strips (poor a11y, no labels for SR users beyond `<TabsTrigger>` text).
- No documented focus-trap / skip-link; `LanguageSwitcher` and `MegaMenu` need keyboard testing.
- RTL Arabic: i18n keys exist but spot checks needed on numerics, date formatting, and admin tables.

### I. Observability & ops
- 17 raw `console.error` calls, no Sentry/PostHog wiring, no edge-function structured logging contract, no in-app error reporting page, no admin error feed.
- No rate limits surfaced beyond `edge_rate_limits` table — unclear if all public endpoints (contact form, AI chat, find-matches) use it.

### J. SEO & growth
- Sitemap referenced in robots.txt but **no sitemap.xml file in repo**; no per-locale alt links generation script, no JSON-LD on PsychologistProfile detail (review schema), no blog Article schema verification.
- `og-image.png` is single static — no dynamic OG per psychologist / blog.

### K. Notifications & email
- `notifications` + `notification_preferences` tables exist; in-app NotificationBell + page exist. But no per-channel preference UI (email vs in-app vs push), and **no web push** (no SW = no push).
- No transactional email branding audit across all 24 functions; some still send plain HTML.

### L. Testing
- Edge function `_tests/` folder exists. No unit/integration tests on the React side. No Playwright/Cypress smoke for the booking → video flow we just hardened.

### M. Data hygiene
- 92 tables, several legacy-looking pairs (`sessions` vs `bookings`, `ai_chat_history` vs `ai_messages`+`ai_conversations`, `leads` vs `growth_leads`). Worth a consolidation pass.

## 3. Improvement Plan — prioritized

### P0 — Trust & revenue (blocking real launch)
1. **Real payments**: pick provider (CMI for MA cards, Stripe for international, or both via abstraction). Implement `checkout-session` + `payment-webhook` edge functions, replace simulate flow, add receipt email, refund admin action, coupon redemption in checkout UI.
2. **Crisis safety end-to-end test pass**: ensure low-mood entries, AI chat, journal triggers all surface SOS Amitié Maroc + crisis modal, and that an audit row is written.
3. **Observability**: add Sentry (frontend) + structured edge logs (`requestId`, `userId`, `route`) shared via `_shared/logger.ts`. Replace raw `console.error` with the logger.

### P1 — Convert the platform from prototype to product
4. **PWA completion**: add Workbox-based service worker (offline shell, queue mood/journal writes), proper 192/512/maskable icons, beforeinstallprompt-driven `InstallAppButton`, web push subscription stored in new `push_subscriptions` table.
5. **Notifications preferences UI**: settings tab to toggle per-event channels (email/in-app/push), respected by `send-notification` and `notify-proposal-response`.
6. **Organization Pulse pipeline**: publish survey → anonymous responses → K-anon (k≥5) aggregate report job → CSV/PDF export. Add `OrgBrandingTab` co-branded landing for employees.
7. **MOOC depth**: quiz engine with `course_quiz_questions`/`attempts`, automatic certificate emission on course completion via existing `generate-certificate`, instructor dashboard, video host abstraction (Mux/Bunny/YouTube unlisted).

### P2 — Differentiation
8. **AI everywhere it helps**:
   - Specialist: "Summarize my notes for this client" using `session-summary` from inside `SessionNotesTab`.
   - Patient: contextual Nour widget on dashboard ("How was your week based on your mood + journal?").
   - Triage: AssessmentLab → recommended psychologists pre-filtered from results.
9. **Assessments paywall + routing**: free score teaser, paid premium report (writes to `assessment_premium_reports`), CTA to book matched specialist, anamnesis pre-fill.
10. **Accessibility & mobile pass**:
    - Add Skip-to-content link, audit focus traps, keyboard test mega-menu and language switcher.
    - Convert tab bars >6 items to a horizontal scroller with `aria-label`, or move overflow into a "More ▾" menu on <md.
    - RTL audit: numerals, date pickers, drawer slide direction.
11. **SEO**:
    - Generate `public/sitemap.xml` at build time with locale alternates.
    - Add JSON-LD: `Person`/`MedicalBusiness` per psychologist, `Course` per MOOC, `Article` per blog (verify), `BreadcrumbList` site-wide.
    - Edge function `og-image` for dynamic OG cards (psychologist + blog).

### P3 — Polish & maintenance
12. **Testing harness**: Vitest + React Testing Library for hooks/components, Playwright smoke for: signup → match → book → accept proposal → join video → leave note.
13. **Schema consolidation**: deprecation pass on `sessions` vs `bookings`, `ai_chat_history` vs new chat tables, `leads` vs `growth_leads` — write migration with views to keep older code working.
14. **Admin UX**: split the 762-line `admin/Dashboard.tsx` into route-based subpages for performance and code review.
15. **Edge rate-limit coverage**: ensure every public endpoint uses `edge_rate_limits` (contact, AI chat, find-matches, recommend, free-score).

## 4. Suggested execution order (next 4 sprints)

```text
Sprint 1 (P0)   Real payments scaffold + Sentry + crisis safety QA
Sprint 2 (P1)   PWA + service worker + push + notification prefs
Sprint 3 (P1)   Org Pulse pipeline + MOOC quiz/certificate loop
Sprint 4 (P2)   AI integrations + assessments paywall + a11y/SEO pass
```

## 5. Out of scope of this plan

- No new visual redesign — current premium clinical glassmorphism stands.
- No framework swap; remain on React 18 + Vite + Tailwind v3.
- No Supabase migration away from Lovable Cloud.

---

If you approve, I'll start with **Sprint 1 (P0)** and ask which payment provider you want first (CMI Maroc, Stripe, or both). I'll also bring up a short questions step to confirm Sentry vs PostHog and whether push notifications should ship with the PWA or as a follow-up.
