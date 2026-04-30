# Creative Monetization Plan — U.Psy

You already have: 3-tier specialist plans, mock checkout, invoices, support, courses, resources, organizations, assessments, gamification, certificates, AI (Nour), referrals. The plan below is **new revenue layers** that reuse this infra — not rebuilds.

Ranked by **speed-to-cash × strategic fit**. Pick the ones you want and I'll build them.

---

## Tier A — Ship in days, immediate revenue

### 1. "Boost" placement marketplace (specialist side)
Pay-as-you-go promotion on top of the Free/Pro/Elite plans. Specialists buy short bursts of visibility:
- **Homepage Spotlight** — 7 days on the Featured rail — 299 MAD
- **Search Boost** — pinned top of `/psychologists` for a chosen specialty — 49 MAD/day
- **Profile Highlight Badge** — gold ring + "Verified Active" pill — 99 MAD/week

Why it works: monetizes Free-tier specialists who won't commit to Pro yet, and Pro tier who want extra reach. Reuses `getFeaturedPsychologists` ranking — just add a `boosted_until` column and weight it above tier.

### 2. Paid assessments / Premium reports (client side)
You already have GAD-7/PHQ-9 and `assessment_results`. Add:
- **Free**: 3-line summary + risk band
- **Premium PDF report** (49 MAD, one-off) — full breakdown, narrative interpretation, personalized 14-day micro-protocol, downloadable PDF (jsPDF infra exists)
- **Re-test pack** — 4 quarterly retests + progress chart — 149 MAD

Reuses your jsPDF + Resend pipeline (used for certificates).

### 3. Course paywall + bundles
`courses` and `course_enrollments` exist. Wire monetization:
- Per-course price
- **3-course bundle** at -25%
- **All-access pass** (199 MAD/month) → unlocks every course, every premium resource, every premium assessment report
- **Founder cohort** — Mehdi-led live cohort, capped seats, 1990 MAD — high-margin signature product

### 4. Session credit packs (client side)
Instead of one-by-one bookings, sell prepaid packs with built-in commitment savings:
- 4-session pack (-8%) / 8-session (-12%) / 12-session (-15%)
- Non-refundable but transferable inside the same family/team
- Stored as `session_credits` balance, consumed on booking

Increases LTV, locks revenue upfront, reduces no-shows. Plug into existing `bookings` table.

---

## Tier B — Ship in 1–2 weeks, recurring revenue

### 5. B2B "Workplace Wellness" subscription
You already have `organization_*` tables and `org_pulse_surveys`. Productize three SKUs:
- **Starter** (2 990 MAD/mo, ≤25 employees): pulse surveys + content library + 5 sessions/mo
- **Growth** (7 990 MAD/mo, ≤100): + analytics dashboard, dedicated specialist pool, monthly leadership report
- **Enterprise** (custom): + on-site workshops, crisis line, white-label portal

Sales path: `/proposal-request` already collects leads. Add a self-serve checkout for Starter so SMBs convert without sales calls.

### 6. White-label / Affiliate program for partner clinics
Let independent clinics list on U.Psy under their own micro-brand subdomain:
- Setup fee 4 990 MAD + 15% rev-share on bookings
- They get a branded landing page, your booking engine, your certs
- Reuses `organization_profiles` schema

Low cost to you, predictable revenue per onboarded partner.

### 7. AI Nour — usage tiers (client side)
Right now Nour is gated by role. Add metered tiers:
- Free: 5 messages/day
- Plus (39 MAD/mo): 100 msgs/day + voice
- Pro (99 MAD/mo): unlimited + journaling AI insights + personalized weekly summary email

Reuses Lovable AI Gateway — no extra API key cost to user.

### 8. Certificate marketplace
`certificates` table exists. Productize:
- Free: completion certificate
- **Verified certificate** (199 MAD): signed PDF + public verifiable URL `/verify/<id>` + LinkedIn-ready badge
- **CPD/CME credits pack** for licensed pros (course + verified cert) — 499 MAD

---

## Tier C — Strategic bets, ship in 2–4 weeks

### 9. Performance Psychology subscriptions for athletes/teams
You already have `athlete_profiles` and `athlete_training_sessions`. Bundle:
- **Athlete+** (149 MAD/mo): training sessions library, mental score tracking, weekly check-in with AI coach
- **Team plan** (per-seat, min 10): coach dashboard with team mental load heatmap, anonymized

Differentiator: this is the "Performance Psychology System" positioning monetized directly.

### 10. Data & insights products
Anonymized, aggregated wellbeing benchmarks sold as quarterly reports:
- **Morocco Mental Health Index** — free PDF with email gate (lead magnet)
- **Sector benchmark** (Tech / Banking / Healthcare) — paid B2B report, 4 990 MAD/year subscription
- Powered by `org_aggregate_reports` + assessments at scale

High margin, builds authority, feeds press coverage.

---

## Cross-cutting upsells (cheap to add, compound everything above)

- **Referral cash credits**: `referrals` table exists — give 50 MAD credit on first booking of referred user, both sides. Compounds every product above.
- **Cart abandonment email** on `subscription_invoices.status = pending` >24h via Resend
- **Annual toggle on every plan**: -2 months when paying yearly. Lifts ARPU 30–40%.
- **Coupon / promo code system**: one new table `coupons`, applied at checkout — enables campaigns, partnerships, recoveries.
- **Founder's office hours** — paid live group Q&A monthly, 99 MAD seat. Mehdi as the product.

---

## Technical anchor (where each idea plugs in)

```text
existing infra              new revenue layer
──────────────────────────────────────────────
specialist_plans       →    + boosts table (7 day TTL ranking weight)
assessment_results     →    + premium_report_purchases + jsPDF generator
courses                →    + course_prices + all_access_pass plan
bookings               →    + session_credits ledger
organizations          →    + org_subscription_plans (Starter/Growth/Ent)
ai_messages            →    + usage_meter + nour_plan column on profiles
certificates           →    + verified flag + /verify/[id] public route
referrals              →    + credit_ledger
subscription_invoices  →    + coupons + abandonment job
```

All payments stay on the existing **mock checkout** until you flip the switch — then we wire one Stripe (or Paddle) integration and every layer above goes live at once.

---

## What I need from you

Pick any combination. My recommendation if you want **the highest revenue impact this week**:

> **#1 Boosts + #2 Premium reports + #3 Course paywall + cross-cutting Coupons + Annual toggle.**

Five touchpoints, all reuse existing tables, all create money paths for users who are already on the site.

Reply with the numbers you want and I'll start building.
