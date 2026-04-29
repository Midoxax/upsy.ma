# Plan — QA the release, then wire client Billing (mock payments)

Two phases in one release. Phase 1 verifies what we just shipped works. Phase 2 closes the original "client dashboard is broken" complaint by giving clients a real Billing tab backed by the mock-payment flow that already exists in the backend.

## Phase 1 — QA the gamification + resources release

### What I'll verify (read-only checks on live DB + manual flows)
- `/resources`: page loads, search filters work, topic filters work, format icons render, completion call hits `resource_completions` and triggers XP via `award_xp`.
- Daily Challenge card on Patient Dashboard: `get_or_assign_daily_challenge` returns a challenge for a fresh user, "Mark complete" calls `complete_daily_challenge`, XP increments.
- Leaderboard card: the `gamification_leaderboard` view returns rows once at least one user has XP. (Currently 0 users in `user_progress` — expected since no logged-in user has triggered an action yet.)
- Mood log → XP chain: submit a mood entry, confirm `user_progress.xp_total` increments and `streak_days` advances.
- RLS sanity: `resource_completions`, `user_daily_challenges`, `user_progress` reject reads of other users' rows.

### Fixes I expect to make (small, in-place)
- The previous release notes mentioned "15+ badges seeded" but only `user_badges` exists — no `badges` lookup table. I'll either:
  - Create a `badges` reference table with the 15 badges and wire `useGamification` to read from it for the badge-grid UI, **or**
  - Remove any stale badge-grid UI references and document badges as award-only (a row in `user_badges` per unlock).
  Decision will be based on what `useGamification.ts` currently expects.
- Any console/network errors found while clicking through the flows.

## Phase 2 — Client Billing tab (mock payments, no real money)

The current `BillingTab.tsx` is the **specialist's** subscription view. Clients have no Billing tab at all. The backend already has `payment_transactions`, `bookings.payment_status`, `simulate-payment-webhook`, and a `user-documents` private bucket for invoice PDFs — we just need to expose this to clients and finish the simulation loop.

### New: `src/components/dashboard/ClientBillingTab.tsx`
Sections:
1. **Outstanding** — bookings with `payment_status IN ('pending','deposit_pending')`. Each row: psychologist, date/time, amount, "Pay deposit" / "Pay balance" button.
2. **Payment history** — `payment_transactions` for the user, with status badge (succeeded / failed / refunded), amount, date, and "Download invoice" link if `invoice_pdf_url` exists.
3. **Simulated checkout dialog** — opens a modal with "Simulate success" / "Simulate failure" buttons that call `simulate-payment-webhook` with `outcome: succeeded | failed`. Clearly labeled "Test mode — no real money".

### Hook: `src/hooks/useClientBilling.ts`
- `useOutstandingBookings()` — bookings where `patient_id = me` and `payment_status` is unpaid.
- `useTransactionHistory()` — `payment_transactions` rows for me, ordered by `created_at` desc.
- `useSimulatePayment()` — mutation that calls the existing `simulate-payment-webhook` edge function.

### Wire into Patient Dashboard
Add a `<TabsTrigger value="billing">` in `src/pages/PatientDashboard.tsx` (between "documents" and "certificates") and a `<TabsContent value="billing">` rendering the new `ClientBillingTab`.

### Invoice generation on payment success
On simulate-success, generate a PDF via the existing pattern (jsPDF — same approach as certificates) and upload to `user-documents/{user_id}/invoices/{invoice_no}.pdf`, then store the path on `payment_transactions.invoice_pdf_url`. Make this part of `simulate-payment-webhook` so any path that confirms a payment produces an invoice.

If `payment_transactions.invoice_pdf_url` doesn't exist as a column, add it via migration. (I'll confirm the column set when I start; if missing, single ALTER TABLE.)

### Banner on dashboard
Small banner at the top of the Billing tab: "Payments are in test mode. No real charges occur." So the user is never confused about charge state.

## Out of scope (this release)
- Real Stripe / Paddle integration (deferred per your earlier choice).
- Refund UX for clients (admin-only RPC `admin_refund_booking` already exists).
- Specialist payouts dashboard (separate workstream).

## Technical notes
- All new code follows existing patterns: TanStack Query hooks, shadcn cards, maroon/gold tokens, Outfit/Inter typography, glassmorphism panels.
- RLS already covers `payment_transactions` and `bookings` for `patient_id = auth.uid()` reads — no policy changes expected. I'll double-check during implementation.
- No new secrets needed; no config.toml changes.

## Files touched (estimate)
- New: `src/components/dashboard/ClientBillingTab.tsx`, `src/hooks/useClientBilling.ts`, `src/components/dashboard/SimulateCheckoutDialog.tsx`
- Edited: `src/pages/PatientDashboard.tsx`, `supabase/functions/simulate-payment-webhook/index.ts` (add invoice PDF generation)
- Possible migration: add `invoice_pdf_url` to `payment_transactions` if absent
- Possible migration: create `badges` reference table if Phase 1 finds we need it

After this release, Sessions / Journal / Documents / Billing / Certificates / Resources / Gamification are all live for the client. The only deferred piece is real-money payments.
