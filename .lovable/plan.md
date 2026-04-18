# UPSY.ma — Refonte Complète V2 — Plan Maître

**Status**: Planning document. No code changes yet. Phase-by-phase approval required.

**Permanent constraints**: HSL design tokens only, no hardcoded colors, Outfit + Inter, calm tone, i18n EN/FR/AR for every new string, RLS on every new table, no clear mental-health data in localStorage.

---

## Phase 1 — Critical Fixes & Role-Based Routing (P0)

### 1.1 Role Router
- **New** `src/components/RoleRouter.tsx`: reads `useUserRole()`, redirects `/dashboard` → role-specific route (`client → /dashboard/client`, `psychologist → /dashboard/specialist`, `organization → /dashboard/organization`, `admin → /dashboard/admin`). Unauthenticated → `/auth`.

### 1.2 Routes in `src/App.tsx`
- Add `/dashboard/client` (PatientDashboard), `/dashboard/specialist` (new SpecialistDashboard), `/dashboard/organization` (OrganizationDashboard), `/dashboard` (RoleRouter). Keep `/my-space` as alias.

### 1.3 New `src/pages/SpecialistDashboard.tsx`
- Assemble existing tabs only: Profile, Sessions, SessionNotes, Availability, Pricing, Leads, Earnings, Analytics, Billing, Journal, Certificates, Documents.
- Top "Today's Sessions" card, horizontal tabs, floating AI assistant button on xl+, wrapped in ErrorBoundary.

### 1.4 ProtectedRoute role guard
- New prop `role?: AppRole | AppRole[]`. Wrong role → redirect `/dashboard` + toast.

### 1.5 Provider tree fix
- Move `<SEOHead />` inside `<LocaleProvider>`. New `DashboardErrorFallback` component. Wrap each dashboard route in ErrorBoundary.

**Acceptance**: build passes, each role lands correctly, wrong-role URLs blocked, no tab regressions.

---

## Phase 2 — Security Hardening (P0, NON-NEGOTIABLE)

### 2.1 RLS audit migration
Single migration `phase2_rls_hardening.sql` covering: `mood_entries`, `ai_conversations`, `ai_messages`, `assessment_results`, `sessions`, `session_notes`, `psychologist_applications`, `client_matching_requests`, `athlete_training_sessions`. Pattern: owner OR assigned psychologist OR admin. No anon access (except matching form INSERT with WITH CHECK lock).

### 2.2 Audit log
- Table `audit_log` (user_id, action, resource_type, resource_id, ip, user_agent, metadata, created_at). Admin-only SELECT. Triggers on `mood_entries`, `assessment_results`, `session_notes`, `bookings`.

### 2.3 Rate limiting
- Table `rate_limits` + helper `check_rate_limit()`. Applied in `ai-assistant` (30/min), `find-matches` (10/min), `crisis-screening`/`summarize-session`/`recommend` (20/min). Returns 429 with Retry-After.

### 2.4 Encrypted clinical notes (full pgsodium + per-psy keys)
- Enable pgsodium. Table `psychologist_encryption_keys` (psy_id PK, key_id). Auto-create key on psychologist role assignment.
- Add `session_notes.encrypted_content bytea`.
- Edge functions `encrypt-note` and `decrypt-note` (psy-only, JWT verified; admin break-glass with audit log).
- Backfill existing rows via one-time batch.
- `SessionNotesTab` refactor for encrypted I/O.

### 2.5 Security headers — `vercel.json`
CSP (self + supabase + Lovable AI Gateway), HSTS preload, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera=(self) microphone=(self) geolocation=().

### 2.6 VideoCall auth gate
- `src/pages/VideoCall.tsx` pre-render check: user must be patient or psychologist of booking, status confirmed, time within window (-10min / +duration+5min). Else redirect with toast.

### 2.7 Zod validation
- `src/lib/validation/schemas.ts` for contact, apply, auth, get-matched, mood, journal, booking. Reject HTML tags. Wire into all forms.

**Acceptance**: linter clean, cross-user reads denied, rate limits enforced, encrypted round-trip, VideoCall blocks unauthorized.

---

## Phase 3 — Client Dashboard Redesign (P1)

### 3.1 PatientDashboard → 4 modules
- **A. TodaysStateCard**: glassmorphism, 5-emoji 1-click mood POST, streak counter, adaptive message from last 3 days.
- **B. MentalPerformanceScore**: server-side RPC `compute_mps()` with weighted formula, Recharts radial gauge, 5-dimension breakdown, week-over-week delta, pedagogical tooltip.
- **C. SessionsTimeline**: next session card (Join enabled T-10min), last 3 sessions with AI summaries only (never raw notes), Book / Request review actions.
- **D. RecommendationsRail**: edge function `recommend` returns 3 items (exercise/article/course) based on assessment + mood + goals. 3 horizontal cards.

### 3.2 Behavioral Nudges
- `src/lib/nudges/nudgeEngine.ts` + `useNudges()` hook. Triggers: low mood 3 days, no check-in 4+ days, 7-day streak (confetti + badge). All dismissible, never guilt-inducing. Sonner toasts. Dismissal flags only in localStorage.

### 3.3 Crisis Detection (ETHICALLY CRITICAL)
- Edge function `crisis-screening` using CSSRS short-form keywords + Lovable AI classifier. Returns risk_level.
- `CrisisModal` non-blocking with Morocco numbers (SOS Amitié 0801 000 180, Stop Silence, SAMU 141). Explicit "does NOT replace a professional" disclaimer. CTA to GetMatched with crisis flag.

**Acceptance**: 4 modules render, nudges fire on mocked data, crisis modal shows with correct numbers, no PHI in localStorage.

---

## Phase 4 — Specialist Dashboard AI-Powered (P1)

### 4.1 AI Session Summary
- Edge function `summarize-session` (Lovable AI `google/gemini-2.5-pro`). Output structured Markdown (objectives / progress / hypotheses / interventions / flags). Stored encrypted in `session_notes.ai_summary`. UI button in SessionNotesTab with diff preview.

### 4.2 Burnout Gauge
- `BurnoutGauge.tsx` + RPC `compute_psy_workload()`. Thresholds green <25h / yellow 25-35h / red >35h. Micro-recommendations (i18n).

### 4.3 Smart Scheduling Optimizer
- `SmartScheduler.tsx` in AvailabilityTab. RPC `analyze_slot_performance()` highlights low-performing slots, suggests blocking. Recommends new slots from anonymized demand.

### 4.4 Client At-Risk Alerts
- Top panel. RPC `at_risk_clients()`: clients with mood <2 last week OR no session in 21+ days. Quick actions: send check-in, propose slot. RLS-scoped.

**Acceptance**: AI summary <10s and encrypted, gauge live-updates, at-risk panel matches test data.

---

## Phase 5 — Organization Dashboard (P1)

### 5.1 Routes & roles
- `app_role` already includes `organization`. Wire route (done in 1.2).

### 5.2 Anonymized analytics (k-anonymity ≥ 5)
- Security-invoker views: `org_population_mood_trend`, `org_engagement_metrics`, `org_session_completion`, `org_top_stressors`, `org_nps`. All filter `HAVING count(distinct user_id) >= 5`. RLS: owner-only.
- Refactor OrgAnalyticsTab and OrgReportsTab.

### 5.3 PDF export
- OrgReportsTab "Export PDF" using jspdf + jspdf-autotable. Logo + KPIs + monthly summary.

**Acceptance**: org isolation verified, KPIs hidden when n<5, PDF branded.

---

## Phase 6 — Growth & Conversion (P2)

### 6.1 Three landing funnels
- `/for-athletes`, `/for-individuals` (alias `/`), `/for-organizations`. Dedicated SEO/JSON-LD/hreflang per locale.

### 6.2 Lead magnet — Free Mental Performance Score
- Route `/free-score`, 10-question 2-min assessment. **Email required** before result → `leads` with `source='free_score'`. Edge function `send-nurture-email` (Resend) for D+1, D+3, D+7 sequence. Rate-limit by IP+email.

### 6.3 Referral system
- Table `referrals` (referrer_id, referee_email, code, status, reward_granted_at). UI in MySpace. Route `/invite/:code` pre-fills signup. Trigger grants reward on first session.

### 6.4 Analytics — PostHog (self-hosted EU)
- User provides `POSTHOG_KEY` + `POSTHOG_HOST` secrets. `src/lib/analytics/posthog.ts` initializer (only if key present). PII-scrubbing wrapper. Cookie-less + IP anonymization for Law 09-08 compliance. Update privacy notice.
- Events: signup_started/completed, assessment_started/completed, psy_viewed, booking_initiated/confirmed, mood_checkin, crisis_modal_shown.

**Acceptance**: 3 funnels live with SEO, free score captures lead + triggers emails, referral round-trip, PostHog events without PII.

---

## Cross-cutting deliverables (every phase)
- Update `project_map.md`, `masterplan.md`, `implementation-plan.md`.
- i18n keys added to EN/FR/AR.
- `npm run build` passes.
- `supabase--linter` clean.
- No console errors.

## Open risks
- **Encryption backfill**: existing plaintext notes need one-time admin batch; document procedure.
- **Crisis false positives**: tune CSSRS thresholds with clinical advisor before production.
- **PostHog**: must be EU-hosted or BAA-equivalent for health data.
- **PDF size**: paginate large org reports to avoid serverless memory limits.

---

**Next step**: Approve Phase 1 to begin execution. Each subsequent phase ships only after the prior phase's acceptance criteria and `npm run build` are green.
