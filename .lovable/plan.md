# Fix: "Could not send proposal" when sending a direct booking link

## Root cause

The `propose-session` edge function inserts a booking with `status = 'proposed'`, but the database CHECK constraint on `public.bookings.status` only allows:

```
pending, confirmed, completed, cancelled, no_show
```

So Postgres rejects the insert with error `23514` (check constraint violation), and the edge function returns the generic "could not send proposal" toast to the user.

Confirmed from edge function logs:
```
new row for relation "bookings" violates check constraint "bookings_status_check"
```

The proposal flow was built end-to-end in code (RPCs `respond_to_proposal`, `get_booking_by_token`, hooks, UI), but the CHECK constraint was never widened.

## What I'll change

**1. Database migration** — drop and recreate `bookings_status_check` to include `'proposed'`:

```sql
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status = ANY (ARRAY['pending','proposed','confirmed','completed','cancelled','no_show']));
```

**2. Update `admin_update_booking_status`** — its hardcoded validation list also omits `'proposed'`. Add it so admins can move bookings into/out of that state if needed.

That's it. No edge function or UI changes — the rest of the flow (token RPC, accept/decline, email send) is already correct and just needs the DB to accept the row.

## Verification after deploy

1. From the specialist dashboard "Send direct link" / Propose Session modal, enter a client email + slot → should succeed and email the proposal.
2. Edge function logs for `propose-session` should no longer show error `23514`.
3. Existing booking flows (`pending` / `confirmed` / etc.) remain unaffected — we only **added** a value to the allowed set.
