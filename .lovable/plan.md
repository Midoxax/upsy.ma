# Fix the video room error & simplify meeting setup

## What's broken today

**1. The video room never loads** — the page queries the wrong table.
- `VideoCall.tsx` reads from the legacy `sessions` table (`client_id`, `date_time`)
- All real bookings live in `bookings` (`patient_id`, `scheduled_at`)
- Result: every "Join" click ends in *"Session not found."*

**2. Three different URLs point to the same page**, only one matches the route:
| Source | URL it builds | Works? |
|---|---|---|
| `App.tsx` route | `/session/:sessionId` | only this one |
| `SessionsTimeline` (client dashboard) | `/video-call/:id` | 404 |
| `BookingDetailDrawer` (admin) | `/video/:roomId` | 404 |
| `UpcomingSessionsCard` | `/session/:id` (but reads dead table) | yes route, no data |

**3. Wrong post-call redirect** — VideoCall navigates to `/dashboard` but real users are on `/my-space`.

**4. Meeting-setup modal is overloaded** — "Propose" and "Send link directly" share the same form, the same fields appear twice, the slot-availability checker only runs in one tab, and the "Now / +15 / +1h / Custom" toggle creates four code paths for one date input. Specialists report it feels confusing.

## What we'll change

### A. Fix the video room (the actual error)

1. Rewrite `VideoCall.tsx` to load from `bookings` using the correct columns:
   - `patient_id` instead of `client_id`
   - `scheduled_at` instead of `date_time`
   - keep the same authorization rule (only patient or psychologist)
2. Keep the existing 10-min-early / +5-min-late join window, but show a live countdown ("Opens in 7 min") instead of a hard error before T-10.
3. After the call ends or "Leave" is clicked → navigate to `/my-space` (not `/dashboard`).
4. Improve error states: show *Reconnect* button on Jitsi load failure instead of a dead end.

### B. Standardize the join URL across the app

Pick **one** canonical route: `/session/:bookingId` (already in `App.tsx`).

Update the three places that build wrong URLs:
- `SessionsTimeline.tsx`: `/video-call/${id}` → `/session/${id}`
- `BookingDetailDrawer.tsx`: `/video/${video_room_id}` → `/session/${booking.id}`
- `UpcomingSessionsCard.tsx`: keep `/session/${id}` but switch its data source from `sessions` to `bookings_with_details` so the IDs are valid bookings.

### C. Simplify the meeting setup modal

The current modal has **two tabs × two forms × duplicated fields**. Collapse to a single linear form:

```text
┌─ New session ──────────────────────────────┐
│ Client email *           Client name        │
│ ──────────────────       ──────────────     │
│                                              │
│ When *   [ Now | +15m | +1h | Pick date ]   │
│ (Custom date/time appears only if "Pick")   │
│                                              │
│ Duration  [50 min ▼]   Type [Video ▼]       │
│ Note (optional)  ───────────────────         │
│                                              │
│ ◉ Send confirmed meeting link now            │
│ ○ Propose time (client must accept)          │
│                                              │
│ [Slot status: available ✓]                   │
│                                              │
│              [Cancel]  [Send]                │
└──────────────────────────────────────────────┘
```

Concrete changes inside `ProposeSessionModal.tsx`:
- Replace the two-tab structure with a single form + a radio at the bottom: *Send link now* / *Propose time*
- Remove the duplicated `link-client-name`, `link-client-email`, `link-duration` fields
- Run `check_proposal_slot` for **both** modes (today only "propose" validates)
- "Now / +15m / +1h" become quick-fill buttons that just populate the date+time inputs (one source of truth instead of `quickWhen` state vs. `date/time` state)
- Show a single inline status pill: *"Slot available ✓"* / *"Conflict at 14:00"*
- Default mode = *Send link now* (the path most specialists actually use)

### D. Small quality-of-life additions

- After "Send link", show the `join_url` as a copy-button + a "Open room now" link, instead of buried in a toast action.
- On the join screen, surface the `whatsapp_deeplink` and `.ics` calendar download next to "Copy link" so the specialist can share it through any channel without re-opening email.

## Out of scope

- Migrating the legacy `sessions` table away (kept read-only — it has 1 row and is not in the booking flow). We just stop reading it from the video page.
- Replacing Jitsi (`meet.jit.si`) with a paid provider — no change here.
- Reminder cron logic — already shipped, untouched.

## Files to edit

- `src/pages/VideoCall.tsx` — rewrite data load, fix redirect, add countdown, reconnect button
- `src/components/dashboard/SessionsTimeline.tsx` — fix URL
- `src/components/dashboard/UpcomingSessionsCard.tsx` — switch to bookings, fix URL
- `src/components/admin/BookingDetailDrawer.tsx` — fix URL
- `src/components/dashboard/ProposeSessionModal.tsx` — collapse to single form, single slot-check, quick-fill buttons

No database migration needed. No edge function changes needed.
