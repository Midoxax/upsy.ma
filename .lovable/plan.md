

## Wire up the proposal system end-to-end

Most of this is already built (modal, hooks, card, response page, RPC). The gaps: **server-side collision/availability validation** and an **upgraded Availability UI** with multi-range entry + booker preview. Plan covers all six asks; existing pieces are marked ✅.

### 1. Propose-session validation (gap → build)
Update `supabase/functions/propose-session/index.ts` to reject the request before insert if:
- The proposed `scheduled_at` weekday/time falls **outside** any active `availability_slots` row for the psychologist (compare `day_of_week` + `start_time`/`end_time` in the psychologist's local TZ, default `Africa/Casablanca`).
- The `[scheduled_at, scheduled_at + duration]` window **overlaps** any existing booking for the same psychologist with status in `('proposed','pending','confirmed')`. Use a single SQL check with `tstzrange` overlap (`&&`).
- The slot is in the past or less than 1h away.

Return structured 4xx errors (`outside_availability`, `slot_conflict`, `too_soon`) so the modal can show a clear toast. Mirror the same checks client-side in `ProposeSessionModal` for instant feedback (disable Send button, show inline reason).

Add a new RPC `check_proposal_slot(_psy uuid, _start timestamptz, _duration int)` returning `{ ok, reason }` so the modal can call it on every date/time change for a live "Available ✓ / Conflict ✗" indicator.

### 2. Availability UI upgrade (gap → rebuild `AvailabilityTab`)
Replace the current list with a **week grid** that supports rapid multi-range entry:

```text
┌──────┬─────────────────────────────────────────────┐
│ Mon  │ [09:00–12:00] [14:00–18:00]  [+ Add range]  │
│ Tue  │ [10:00–13:00]                [+ Add range]  │
│ Wed  │ (no availability)            [+ Add range]  │
│ ...  │                                             │
└──────┴─────────────────────────────────────────────┘
[Copy Mon → all weekdays]   [Clear week]
```

Features:
- Inline range chips with start/end time inputs and a delete (✕) button.
- "+ Add range" button per day → appends a default 09:00–10:00 row.
- "Copy Mon → all weekdays" duplicates Monday's ranges to Tue–Fri.
- **Preview drawer** on the right showing the next 14 days with computed bookable 50-min slots from `get_available_slots` so the psychologist sees exactly what clients will see. Toggle between "What clients see" and "My week template".
- Validation: end must be > start, ranges per day cannot overlap (highlight in red).
- Single "Save changes" button → diff against DB and run insert/update/delete in one transaction via a new `replace_availability_for_day(_day smallint, _ranges jsonb)` RPC to keep it atomic.

### 3. ✅ Already built (verify wiring)
- **Propose-session modal + button** in `SessionsTab.tsx` and `LeadsTab.tsx`.
- **Pending invitations card** mounted on `PatientDashboard.tsx` (`PendingInvitationsCard.tsx`).
- **`/booking/respond/:token` page** registered in `App.tsx` → `BookingResponse.tsx` calling `respond_to_proposal` RPC.

Quick QA pass after step 1+2 ships:
- Confirm the route renders for an anon visitor (RLS already allows token-based reads).
- Confirm the patient card refreshes after `respond_to_proposal` via React Query invalidation on `pending-invitations` and `upcoming-sessions`.
- Confirm the email link in `propose-session` points to `${SITE_URL}/booking/respond/${token}`.

### Technical notes
- New migration: `check_proposal_slot` RPC + `replace_availability_for_day` RPC + index on `bookings(psychologist_id, scheduled_at)` if missing.
- All time math in the edge function uses `Africa/Casablanca` (no per-psychologist TZ field exists yet — out of scope to add).
- Audit log row written for every availability replace and every proposal validation rejection.

### Out of scope
- Per-psychologist timezone setting.
- iCal export of availability.
- Drag-to-resize range chips.

