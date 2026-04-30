## Problem

Clicking "Join" on a `proposed` booking lands on `/session/:id` and hits the hard wall **"Cannot Join — This session is proposed."** with no way forward. The user has to hunt for the email or the `PendingInvitationsCard` to accept.

Three concrete issues:

1. **Wrong destination for proposed bookings.** Join buttons (`SessionsTimeline`, `UpcomingSessionsCard`, `SessionsTab`) link straight to `/session/:id` for any session — including proposed ones — and `VideoCall` then dead-ends them.
2. **Proposed bookings never appear in `UpcomingSessionsCard` / `SessionsTimeline`** (they filter `status in ['confirmed','pending']`), so the patient only sees them in `PendingInvitationsCard` — easy to miss.
3. **`VideoCall` "Cannot Join" screen offers no path forward** when the cause is a proposal still awaiting response.

## Plan

### 1. Make `VideoCall` recover from a `proposed` status
File: `src/pages/VideoCall.tsx`

- When `data.status === "proposed"`, do **not** show "Cannot Join". Instead render a dedicated **"Awaiting your confirmation"** screen with:
  - Session details (psychologist, date, type, duration)
  - **Accept** and **Decline** buttons that call the same `useRespondToInvitation` mutation already used by `PendingInvitationsCard` (RLS already permits the patient to update their own proposed booking).
  - On accept → re-fetch booking; if `status === confirmed` and inside the join window, mount Jitsi automatically; otherwise show the existing "Room opens in X" countdown screen.
  - For psychologists landing on `/session/:id` of a still-proposed booking, show a "Waiting for client to accept" state instead of the error.
- Keep the existing "ended / cancelled / unauthorized" branches.

### 2. Surface proposed bookings in the patient timeline
Files: `src/components/dashboard/UpcomingSessionsCard.tsx`, `src/components/dashboard/SessionsTimeline.tsx`

- Include `"proposed"` in the status filter so the patient sees the proposal in the same list.
- For rows where `status === "proposed"`, replace the "Join" button with a yellow **"Confirm invitation"** button that links to `/session/:id` (which now handles accept inline) — and show a small "Pending your reply" badge.
- Keep `PendingInvitationsCard` as the dedicated banner above; both surfaces stay in sync via the existing react-query invalidation.

### 3. Don't offer "Join" for non-joinable rows
Files: `src/components/dashboard/SessionsTab.tsx` (specialist), `src/components/admin/BookingDetailDrawer.tsx`

- Specialist `SessionsTab`: hide the "Join Call" button when `status !== "confirmed"`. Add a small "Awaiting client confirmation" pill for `status === "proposed"`.
- Admin drawer: relabel the link to "Open session room" and add a tooltip when status is proposed.

### 4. Small consistency fixes
- In `VideoCall`, normalize the auth check so a psychologist with `psychologist_id === user.id` can also accept-on-behalf is **not** allowed — only the patient may accept (per RLS). The "Waiting for client" view replaces the buttons for the psychologist.
- After successful in-page accept, toast "Session confirmed" and update the URL phase so the join window opens automatically when applicable.

## Files to edit

- `src/pages/VideoCall.tsx` — handle `proposed` status with inline Accept/Decline (patient) and waiting-state (psychologist)
- `src/components/dashboard/UpcomingSessionsCard.tsx` — include proposed, swap CTA
- `src/components/dashboard/SessionsTimeline.tsx` — include proposed, swap CTA
- `src/components/dashboard/SessionsTab.tsx` — hide Join when not confirmed
- `src/components/admin/BookingDetailDrawer.tsx` — clarify label/state

No DB or edge function changes required — `useRespondToInvitation` and the `respond_to_proposal` RPC already exist and are RLS-safe.
