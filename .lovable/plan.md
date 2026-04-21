

## Add "Send video meeting invitation" — instant Jitsi link, no scheduling needed

Today the psychologist has two options: a **scheduled proposal** (client gets Accept/Decline email, must confirm) or a **booking link** (client picks their own slot). Neither covers the "let's meet right now" or "let's meet at 3pm, here's the link, no confirmation needed" use case.

This adds a third option: a **one-click meeting invite** that creates a confirmed booking with a Jitsi room and emails the client a join link.

### Where it lives
- New button **"Send meeting link"** in `SessionsTab` header (next to existing "Propose session").
- Same button on each row of `LeadsTab` and on the existing client list in `MatchingRequestsManager`.
- Inside the existing `ProposeSessionModal`, add a tab toggle at the top:
  - **Propose** (current flow — needs Accept/Decline)
  - **Send link directly** (new — auto-confirmed)

### Flow
```text
Psychologist → "Send meeting link"
   ├── Pick client (email or existing patient)
   ├── Pick when: [Now] [In 15 min] [In 1 hour] [Custom date/time]
   ├── Duration (30/45/60 min)
   └── Send
        ↓
   • Booking row created with status='confirmed', session_type='video'
   • Existing trigger ensure_video_room_on_confirm generates the Jitsi room
   • Email sent to client with a single big "Join the session" button
   • Link points to /video/:roomId (existing VideoCall page)
   • Psychologist sees it instantly in Sessions tab as confirmed
```

### What gets built

**Edge function: `send-meeting-link`** (new, mirrors `propose-session`)
- Same auth + slot validation as `propose-session` (calls `check_proposal_slot` RPC) but with the "1 hour minimum" rule relaxed to "5 minutes" so "Now" and "In 15 min" work.
- Inserts the booking with `status='confirmed'`, `payment_status='comp'` (free internal session), `session_type='video'`.
- Trigger fires → `video_room_id` populated automatically.
- Sends a Lovable transactional email using new template `meeting-link-invitation` with the Jitsi join URL.

**Email template: `meeting-link-invitation.tsx`**
- React Email component, maroon brand, EN/FR/AR.
- Shows: psychologist name + photo, date/time (or "Now"), duration, **single "Join session" button** linking to `https://upsy.ma/video/{video_room_id}`.
- Footer: Law 09-08 privacy notice, "Link active until session ends", quick-help contact.

**Hook: `useSendMeetingLink`**
- Wraps the edge function. On success: invalidate `upcoming-sessions` and `sessions-list` queries, toast "Meeting link sent to {email}", optionally copy link to clipboard.

**UI additions**
- `ProposeSessionModal.tsx` — add the **Propose / Send link directly** tab toggle at the top. The "Send link directly" tab reuses 80% of the form (client + duration), swaps the date picker for the quick-time chooser (`Now / +15m / +1h / Custom`), and changes the submit handler to call `useSendMeetingLink`.
- `SessionsTab.tsx` and `LeadsTab.tsx` — add `defaultMode="link"` prop so the new buttons open the modal pre-set to the "Send link directly" tab.
- Optional **"Copy join link"** secondary button in the success toast so the psychologist can also paste it into WhatsApp manually.

### Why this is different from the existing flows
| Flow | Client confirms? | Time to meet | Best for |
|---|---|---|---|
| **Booking link (`/b/:slug`)** | Client picks slot | Self-serve | Cold leads, async invites |
| **Propose session** | Yes (email Accept/Decline) | Future, planned | Follow-ups, agreed-on times |
| **Send meeting link (NEW)** | No (auto-confirmed) | Now or near-future | Active conversations, urgent sessions, established clients |

### Out of scope
- Phone/in-person meeting links (only video supported in this flow).
- WhatsApp auto-send of the join link (waiting on Meta API integration — manual copy button is the workaround).
- Recurring weekly meeting invites.
- SMS delivery.

