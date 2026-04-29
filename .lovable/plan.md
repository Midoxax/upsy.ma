# Plan — Specialist payouts visibility + unified notifications

Two pieces in one release. Earnings tab already exists and is solid, but it shows revenue, not **money owed to the specialist**. And the platform is silent — no emails or in-app pings on the events that matter (payment received, booking confirmed, badge unlocked). Both fixed here.

## Part 1 — Specialist payouts (extend existing Earnings tab)

`EarningsTab.tsx` shows gross revenue from `bookings.amount_mad` regardless of `payment_status`. That's misleading because a booking can be `completed` but `payment_status = 'pending'`. We need to split it into **earned vs. pending vs. paid out**.

### Schema additions (migration)

New table `specialist_payouts` to track when money has actually moved to the specialist:
```text
id uuid pk
psychologist_id uuid not null
period_start date, period_end date
gross_mad numeric, platform_fee_mad numeric, net_mad numeric
status text  -- pending | processing | paid | failed
paid_at timestamptz, payout_method text, reference text
transaction_ids uuid[]  -- which payment_transactions are in this payout
created_at, updated_at
```
RLS: specialist reads own (`psychologist_id = auth.uid()`); admin manages all.

Plus a view `specialist_earnings_summary` joining `payment_transactions` + `bookings` to compute per-specialist:
- Settled (succeeded payments, not yet paid out)
- Paid out (in a `paid` payout row)
- Pending (booking completed, payment not succeeded yet)

### UI changes to `EarningsTab.tsx`
Replace the top stat row with 4 new cards:
1. **Available to withdraw** — succeeded payments not yet in a paid payout
2. **Pending settlement** — completed sessions awaiting client payment
3. **Paid out (lifetime)** — sum from `specialist_payouts` where status=paid
4. **Rating** (keep existing)

Add a **"Payouts" section** below the chart: list of `specialist_payouts` rows with status badge, period, amount, "Download statement" link. Empty state: "No payouts yet — first payout processes once you have ≥500 MAD settled."

Keep the existing chart and recent sessions table.

### CSV export
Add a "Export tax statement" button → generates a CSV of all settled transactions for the year. Pure client-side, no backend.

## Part 2 — Notifications layer

Backend currently only sends emails for accreditation, proposals, meeting links. We extend this to cover the events that actually shape user behavior.

### Schema (migration)

Table `notifications`:
```text
id uuid pk
user_id uuid not null
type text  -- payment_succeeded | booking_confirmed | session_reminder | badge_unlocked | level_up | streak_at_risk | payout_processed
title text, body text
action_url text
read_at timestamptz
created_at timestamptz default now()
metadata jsonb
```
RLS: user reads/updates own only. Admin reads all. Indexed on `(user_id, read_at, created_at desc)`.

Table `notification_preferences` (one row per user):
```text
user_id uuid pk
email_payments boolean default true
email_bookings boolean default true
email_reminders boolean default true
email_gamification boolean default false  -- opt-in only
inapp_all boolean default true
```
RLS: user manages own.

### New edge function: `send-notification`
Single dispatcher. Input: `{ user_id, type, title, body, action_url?, metadata?, send_email? }`.
- Always inserts an in-app `notifications` row (if `inapp_all` is on).
- If `send_email && user opted in for that category`, sends a Resend email using a typed template per `type`.
- Templates: maroon brand, Outfit/Inter, hosted logo (matches existing `_shared/email-templates/` style).

### Wire-in points (existing code)
- `simulate-payment-webhook` → on success: `send-notification('payment_succeeded')` to client + `send-notification` to specialist for the new booking
- `propose-session` already emails — also drop in-app notification for the recipient
- `useGamification.ts` `award_xp` flow: on level-up or badge unlock, insert in-app notification (no email unless opted in)
- A daily cron (extend `anamnesis-reminder-cron` or new `session-reminder-cron`) for sessions in next 24h

### UI: Notification bell in Header
- New `NotificationBell.tsx` in `src/components/`: bell icon with unread count badge, dropdown listing recent 10 with title/time, "Mark all read", link to full page.
- Realtime: subscribe to `postgres_changes` on `notifications` filtered by `user_id` so the badge updates live.
- New page `src/pages/Notifications.tsx` for full history with filters (all / unread / by type).
- Add bell to `Header.tsx` next to the theme toggle, only when authenticated.

### Settings UI
Add a "Notifications" section to `ProfileTab.tsx` (or a new compact card in the dashboard) with toggles bound to `notification_preferences`. Default to current values, optimistic update.

### Hook
`src/hooks/useNotifications.ts`:
- `useNotifications()` — list with unread count
- `useMarkRead(id)` / `useMarkAllRead()`
- `useNotificationPreferences()` + `useUpdatePreferences()`

## Files touched (estimate)

**Part 1**
- New: migration adding `specialist_payouts` + view; `src/hooks/useSpecialistPayouts.ts`
- Edited: `src/components/dashboard/EarningsTab.tsx`

**Part 2**
- New migration: `notifications` + `notification_preferences` tables + RLS + realtime publication
- New edge function: `supabase/functions/send-notification/index.ts` with email templates inline
- New: `src/components/NotificationBell.tsx`, `src/pages/Notifications.tsx`, `src/hooks/useNotifications.ts`
- Edited: `src/components/Header.tsx` (mount bell), `src/App.tsx` (add /notifications route), `src/components/dashboard/ProfileTab.tsx` (preferences card), `supabase/functions/simulate-payment-webhook/index.ts` (call dispatcher), `src/hooks/useGamification.ts` (call dispatcher on level-up/badge)

## Out of scope
- Real Stripe / Paddle (still deferred)
- Push notifications / SMS (web push needs service worker + VAPID — separate sprint)
- Digest emails (daily summary) — start with per-event, batch later if noisy
- WhatsApp notifications (separate API integration)

## Technical notes
- All emails reuse the maroon-branded `_shared/email-templates/` pattern; one template file per notification type.
- Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;`
- Bell dropdown uses existing shadcn `Popover` + `ScrollArea`.
- `send-notification` function: `verify_jwt = false` since it's called from other edge functions with service-role key; validates `user_id` exists.
- All new tables follow strict RLS; no service-role bypass in client code.
- No new secrets needed (`RESEND_API_KEY` already configured for existing emailers).

## Why this order
Earnings split first because it's a 1-tab change that closes a real bug ("my dashboard shows revenue I haven't been paid"). Notifications second because it's bigger but unblocks every future feature — once the dispatcher exists, every new feature gets notifications for free.
