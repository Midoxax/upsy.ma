

## Sending booking links to clients (two paths — pick one or both)

You already have the **"Propose session"** flow built and deployed (psychologist picks a date/time → client gets an email with Accept/Decline). What's missing is a simpler, lower-friction option: a **shareable booking link** the psychologist can copy and send via WhatsApp, SMS, or email — the client lands on a page showing only that psychologist's availability and books themselves.

### Path A — Use what's already built (no new code)
From your dashboard:
- **Sessions tab** → click **"Propose session"** → fill in client email, date, time, duration → Send.
- The client receives a branded email with **Accept** / **Decline** buttons that hit `/booking/respond/:token`.
- You see the response in real time (Pending → Confirmed) and a Jitsi room is auto-generated on Accept.

This is the right path when you already know the exact time you want to offer.

### Path B — Add a personal "Book with me" link (new, small build)

For when you'd rather let the client pick from your open slots themselves.

**1. Add `booking_url` shortcut on the psychologist profile**
Every psychologist already has a `slug` (e.g. `mehdi-felji-a3f9c102`). The public booking widget lives on `/psychologists/:slug` already. Add a one-click **"Copy my booking link"** action in:
- `My Space` → header (always visible) → copies `https://upsy.ma/psychologists/{slug}?book=1`
- New share menu next to it: **WhatsApp**, **Email**, **SMS** prefilled buttons (`wa.me/?text=...`, `mailto:?...`, `sms:?body=...`).

**2. Auto-open the booking widget when `?book=1` is present**
Update `src/pages/PsychologistProfile.tsx` to read the `book` query param on mount and scroll to (or open) the existing `BookingWidget` automatically — so the client lands directly on the calendar instead of the full profile bio.

**3. Optional: trackable short link**
Add a tiny redirect on `/b/:slug` → `/psychologists/:slug?book=1&src=share` so links shared on WhatsApp look cleaner and we can count clicks via the existing PostHog tracking.

**4. Empty-state nudge**
On `AvailabilityTab.tsx`, if the psychologist has zero slots configured, show an inline banner: "Set your weekly hours first — clients can't book an empty calendar." with a jump link to the new grid editor you already have.

### Files touched (Path B only)
- `src/components/dashboard/ProfileTab.tsx` — add "Copy booking link" + share menu.
- `src/pages/PsychologistProfile.tsx` — handle `?book=1` to auto-focus the BookingWidget.
- `src/App.tsx` — add `/b/:slug` redirect route.
- `src/components/dashboard/AvailabilityTab.tsx` — add empty-state nudge.

### Out of scope
- Custom vanity URLs (`upsy.ma/mehdi`).
- WhatsApp Business API auto-send (waiting on Meta integration).
- Per-link analytics dashboard (basic PostHog event only).

