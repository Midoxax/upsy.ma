# Seed One Confirmed Test Booking

## Accounts to use

- **Patient**: `mehdifelji@gmail.com` — `6b5abd90-ec31-4013-b6d2-f28848b1e7fe` (your admin account)
- **Psychologist**: **Dr. Amina Benali** — `48993805-f94c-4b29-9fe8-54c7b9dad829`, published, online, 500 MAD/h, `slug: dr-amina-benali-48993805`

These are two different UUIDs — fixes the previous "patient_id == psychologist_id" issue that made every test session look cancelled/invalid.

> Note: `mehdifelji@gmail.com` is also the user behind the "Mehdi Felji" psychologist profile, so I deliberately avoid using that profile to keep patient ≠ psychologist.

## What I'll insert

A single `bookings` row with the `supabase--insert` tool (no schema change needed):

```text
patient_id          = 6b5abd90-ec31-4013-b6d2-f28848b1e7fe   (Mehdi)
psychologist_id     = 48993805-f94c-4b29-9fe8-54c7b9dad829   (Dr. Amina)
scheduled_at        = now() + interval '5 minutes'
duration_minutes    = 50
session_type        = 'video'
status              = 'confirmed'
payment_status      = 'paid'
amount_mad          = 500
patient_notes       = 'Seeded test session'
video_room_id       = (auto-set by the set_booking_video_room trigger)
```

The existing `set_booking_video_room` BEFORE-INSERT trigger generates a fresh `upsy-…` room id, and `ensure_video_room_on_confirm` covers the confirmed-status path as a safety net. So `video_room_id` is guaranteed populated.

After insert I'll read the row back and return:
- the booking `id`
- the `video_room_id`
- the direct URL: `/session/<id>`

## Verification (after build mode)

1. Run a `read_query` to confirm the row exists, status=confirmed, video_room_id is set, and `scheduled_at` is in the future.
2. Confirm the `VideoCall.tsx` join window: it allows joining from `scheduled - 10 min` until `scheduled + duration + 30 min`. Scheduling 5 min out keeps it well inside the window.
3. Hand back the URL so you can open it while logged in as Mehdi and Jitsi will mount.

## Cleanup

If later you want to remove it, I can delete by id with the insert tool.

## Out of scope

- No code changes.
- No schema/RLS changes — RLS already lets the patient read their own bookings.
- Not seeding availability slots for Dr. Amina (not needed for this confirmed booking; can be done separately if you want to test the booking modal flow next).
