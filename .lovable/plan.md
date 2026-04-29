# Plan: Specialist plans, support system, polish

Three deliverables in one pass. Real billing stays mocked (admin manually upgrades) — the plumbing for Stripe later is left clean.

## Part A — Specialist subscription plans (Free / Pro / Elite)

### Plans & pricing (MAD/month)

```
                        FREE          PRO (199)        ELITE (499)
─────────────────────────────────────────────────────────────────
Search ranking          last          mid              top + featured rail
Profile depth           basic bio     gallery, video,  + custom slug,
                        + 1 photo     branded invoice  branded landing
Analytics               earnings only profile views,   + cohort analysis,
                                      conversion       client demographics
AI tools                —             AI session       + Nour clinical
                                      summary           assistant, smart
                                                        scheduling
Commission per session  20%           12%              8%
Priority support        —             standard         priority SLA
```

### Database

Extend the existing `subscriptions` table (already has `free/basic/premium` — we'll widen to `free/pro/elite`):

```sql
-- widen plan_type CHECK
ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_plan_type_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('free','pro','elite'));

-- new reference table for plan definitions (admin-editable)
CREATE TABLE specialist_plans (
  id text PRIMARY KEY,           -- 'free' | 'pro' | 'elite'
  name text NOT NULL,
  monthly_price_mad numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL,    -- 0.20 / 0.12 / 0.08
  features jsonb NOT NULL DEFAULT '{}',  -- { search_boost, gallery, ai_summary, ... }
  sort_order int NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

-- subscription invoices (recurring billing record, mock for now)
CREATE TABLE subscription_invoices (
  id uuid PK,
  subscription_id uuid REFERENCES subscriptions,
  psychologist_id uuid,
  plan_type text,
  amount_mad numeric,
  status text,            -- 'pending' | 'paid' | 'failed' | 'comp'
  paid_at timestamptz,
  period_start date,
  period_end date,
  invoice_number text,    -- UPSY-SUB-YYYY-NNNNN
  created_at timestamptz default now()
);
```

RPC `has_plan_feature(_user uuid, _feature text)` → boolean. Used everywhere we gate.

### Feature gating

Single hook `useSpecialistPlan()` returns `{ plan, features, commissionRate }`. Components consume it:

- `psychologistsService.ts` — sort by `plan_rank DESC, created_at DESC` so Pro/Elite surface first
- `FeaturedPsychologistsSection.tsx` — Elite-only rail
- `ProfileTab.tsx` — gallery uploader / video field disabled for Free with upsell card
- `AnalyticsTab.tsx` — Free sees teaser → "Upgrade to Pro for funnel data"
- `AISummaryButton.tsx` + smart scheduling — disabled on Free with lock icon
- `EarningsTab.tsx` — uses `commission_rate` from plan, not the global config
- `simulate-payment-webhook` — applies plan commission rate when computing `net_to_psychologist_mad`

### Specialist-facing UI

**`/my-space` → Plans tab** (rename current `BillingTab`):
- 3-card pricing grid with current plan highlighted
- "Upgrade to Pro" / "Upgrade to Elite" → `SimulateCheckoutDialog` (reuse existing component, generates a `subscription_invoices` row marked paid + flips `subscriptions.plan_type`)
- "Downgrade" → confirms loss of features, scheduled for end of period
- Invoice history list with PDF download (reuses invoice generator)
- Test-mode banner: *"Subscriptions are in test mode — admin can also upgrade you manually."*

### Admin UI

`SubscriptionsOverview.tsx` already exists — extend it:
- Per-specialist plan dropdown (Free/Pro/Elite) with manual override
- "Mark invoice paid" / "Comp this month" actions
- Plan editor (`specialist_plans` rows) — adjust pricing, commission, features without code change

### Public-facing

New page **`/pricing-specialists`** — 3-column comparison, FAQ, "Apply now" CTA → existing `/apply` flow. Linked from Footer + Founder page.

---

## Part B — Support & ticketing system

### Database

```sql
CREATE TABLE support_tickets (
  id uuid PK,
  user_id uuid NOT NULL,
  subject text NOT NULL,
  category text NOT NULL,    -- 'billing' | 'technical' | 'account' | 'clinical' | 'other'
  priority text NOT NULL DEFAULT 'normal',  -- normal | high (Pro/Elite auto-high)
  status text NOT NULL DEFAULT 'open',      -- open | pending | resolved | closed
  created_at, updated_at,
  closed_at, resolution text
);

CREATE TABLE support_ticket_messages (
  id uuid PK,
  ticket_id uuid REFERENCES support_tickets,
  author_id uuid,
  author_role text,          -- 'user' | 'admin'
  body text NOT NULL,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz
);
```

RLS: users see/write only their own tickets + messages. Admins see all. Realtime enabled on `support_ticket_messages`.

### UI

**Client/Specialist side** — new tab `/my-space → Support`:
- Ticket list with status pills
- "New ticket" form (subject, category, body, optional attachments → `user-documents` bucket)
- Ticket detail = threaded chat-style view, realtime new messages
- Pro/Elite badge: "Priority — replies within 4h"

**Admin side** — new `/admin → Support`:
- Inbox view with filters (status, priority, category)
- Ticket detail with reply box + status changer + "Mark resolved"
- Notification on every new ticket (via existing `send-notification` function — we already built the dispatcher)

**Public** — keep existing `/contact` page as-is (it routes to `contact_submissions` table), but add: *"Already have an account? Open a support ticket from your dashboard for faster response."*

### Notifications integration

Hook into existing `send-notification` edge function:
- New ticket → admin in-app + email
- Admin reply → user in-app + email (respecting `notification_preferences`)
- Status change → user in-app

---

## Part C — Polish leftovers

1. Seed `gamification_badges` with 12 starter badges (First Mood, 7-Day Streak, First Booking, etc.) so the gamification grid renders icons + names instead of empty cells
2. Seed 20 more entries in the resources table across categories
3. Add the test-mode banner to `ClientBillingTab` (was planned, not shipped)
4. Footer link to `/pricing-specialists`

---

## Files I'll create

- `src/components/dashboard/SpecialistPlansTab.tsx` (replaces old BillingTab)
- `src/components/dashboard/PlanComparisonGrid.tsx`
- `src/components/dashboard/UpgradePromptCard.tsx` (small reusable upsell)
- `src/components/dashboard/SupportTab.tsx` + `SupportTicketDetail.tsx` + `NewTicketDialog.tsx`
- `src/components/admin/SupportInbox.tsx` + `SupportTicketDrawer.tsx`
- `src/components/admin/SpecialistPlanEditor.tsx`
- `src/hooks/useSpecialistPlan.ts`
- `src/hooks/useSupportTickets.ts`
- `src/pages/PricingSpecialists.tsx`
- Migration: plans schema + tickets schema + seed `specialist_plans` + seed badges

## Files I'll edit

- `src/services/psychologistsService.ts` — plan-aware sorting
- `src/components/home/FeaturedPsychologistsSection.tsx` — Elite-only
- `src/components/dashboard/{Profile,Analytics,Earnings}Tab.tsx` — gating
- `src/components/dashboard/AISummaryButton.tsx` — gate behind Pro
- `src/pages/{PatientDashboard,SpecialistDashboard,MySpace}.tsx` — wire new tabs
- `src/pages/admin/Dashboard.tsx` — Support inbox tab
- `src/components/Footer.tsx` — pricing link
- `src/App.tsx` — `/pricing-specialists` route
- `supabase/functions/simulate-payment-webhook/index.ts` — use plan commission

## Out of scope (deliberately deferred)

- Real Stripe wiring — schema is ready, swap mock dialog for Stripe Checkout when activated
- Recurring billing cron (auto-generate next month's invoice) — admin generates manually for now
- SLA enforcement / auto-escalation — priority flag is metadata only
