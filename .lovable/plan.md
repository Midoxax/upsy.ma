

## Two things you're asking about — and how to add the missing piece

### 1. Setting your available hours (already built — here's where)

Sign in as a psychologist → **My Space** → **Availability** tab. You'll see a 7-day grid (Sun → Sat).

For each day:
- Click **+ Add slot**
- Pick a **start** and **end** time (e.g. 09:00 → 12:00)
- Save

Each saved range becomes a recurring weekly window. Patients only see times that fall inside these windows when they open your booking widget. You can stack multiple ranges per day (e.g. 09:00–12:00 and 15:00–18:00) and delete any with the trash icon.

That part is fully working today via the `availability_slots` table and the `get_available_slots` RPC.

### 2. What's missing: psychologist-initiated meeting invitations

Right now, only the **patient** can create a booking. A psychologist cannot proactively say "let's meet Tuesday at 4pm" and send the client a confirmation. We'll add that.

**New feature: "Propose a session" from the psychologist dashboard**

Where it lives:
- New button **"Propose session"** in the Sessions tab header and on each client row in the Leads tab.
- New button **"Schedule with…"** on the Availability tab.

Flow:
```text
Psychologist → "Propose session"
   ├── Pick a client (dropdown of past patients + leads + free email entry)
   ├── Pick date + time (calendar + time picker, defaults to next free slot)
   ├── Duration (30 / 45 / 50 / 60 min)
   ├── Type (video / in-person / phone)
   ├── Optional note ("Follow-up on last week's exercise")
   └── Send
        ↓
   • Booking row created with status='proposed', payment_status='unpaid'
   • Email sent to client with Accept / Decline links
   • Client sees it in their dashboard under "Pending invitations"
   • On Accept → status='confirmed', video room ID generated
   • On Decline → status='cancelled' with reason
```

What gets built:

**Database (migration)**
- Extend `bookings.status` to allow `proposed` and `declined` (currently uses pending/confirmed/completed/cancelled/no_show).
- Add columns: `proposed_by` (uuid, who initiated), `proposal_token` (text, for the email accept/decline link), `proposal_expires_at` (timestamptz, default 72h).
- RLS update: psychologists can `INSERT` bookings where they are the `psychologist_id` and `status='proposed'`.
- Trigger to auto-generate `video_room_id` when a `video` booking flips to `confirmed`.

**Edge function: `propose-session`**
- Validates the slot doesn't collide with existing bookings or fall outside availability.
- Resolves the patient (existing user by email, or creates a `growth_leads` row if they're not signed up yet).
- Inserts the booking with `status='proposed'`.
- Sends a branded email (maroon template, EN/FR/AR depending on client locale) with Accept and Decline buttons that hit `/booking/respond/:token`.

**Edge function: `respond-to-proposal`** (public, token-gated)
- Verifies token + expiry.
- Sets status to `confirmed` or `cancelled`.
- If confirmed and the recipient has no account, redirects them to signup with a link-on-signup token so the booking attaches to their new user.

**UI components**
- `src/components/dashboard/ProposeSessionModal.tsx` — the form (client picker, date/time, duration, type, note).
- `src/components/dashboard/PendingInvitationsCard.tsx` — shown on the **Patient Dashboard** so clients see and accept pending proposals in-app (no email click needed).
- New page `src/pages/BookingResponse.tsx` at `/booking/respond/:token` for the email-link flow.
- "Propose session" button added to `SessionsTab.tsx` and an entry on each row of `LeadsTab.tsx`.

**Hooks**
- `useProposeSession` — wraps the edge function call.
- `usePendingInvitations` — patient-side list of `bookings` with `status='proposed'`.
- `useRespondToProposal` — accept/decline.

**Email**
- New template `supabase/functions/_shared/email-templates/session-proposal.tsx` — maroon brand, includes psychologist name+photo, date/time, duration, Accept/Decline buttons, 72h expiry note, Law 09-08 privacy footer.

### Out of scope (next pass)
- Recurring proposals (weekly series).
- Calendar sync (.ics file attachment).
- WhatsApp delivery of the invite (waiting on WhatsApp Business API integration).

