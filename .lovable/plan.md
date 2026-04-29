
# Finish the monetization & polish loop

Four tracks, built in this order: gating → notifications → public pricing visibility → resource seeding.

---

## Track 1 — Finish plan gating

Make Pro/Elite tier features actually do something.

**Featured homepage rail (Elite-only)**
- `getFeaturedPsychologists` in `src/services/psychologistsService.ts`: join active subscriptions and prefer specialists whose plan exposes `featured_rail = true`. Fall back to most-recent if not enough Elite specialists exist so the rail is never empty.

**Earnings tab — dynamic commission**
- `src/components/dashboard/EarningsTab.tsx`: pull commission via `useSpecialistPlan()` and replace any hardcoded percentage with `plan.commission_rate * 100`. Show the rate next to the "platform fee" line and add a tiny "Lower fee on Pro/Elite" hint for Free users (links to `/my-space?tab=plans`).

**Nour AI clinical assistant gate**
- `src/pages/AIAssistant.tsx`: wrap the assistant chat with a check using `useHasFeature("ai_clinical_assistant")`. If the user is a specialist (psychologist role) and the feature is off, show an `UpgradePromptCard` instead of the chat UI. Patients/clients keep current access — gating only applies to specialists using it as a clinical tool.

**Analytics tab gating**
- New `src/components/dashboard/SpecialistAnalyticsTab.tsx` with three states:
  - Free: locked card with `UpgradePromptCard` ("Upgrade to Pro for analytics")
  - Pro (`analytics_basic`): bookings count, completion rate, revenue trend (last 30/90 days)
  - Elite (`analytics_advanced`): adds client retention, top specialties, hour-of-day heatmap
- Add as a new tab in `SpecialistDashboard.tsx` between "Sessions" and "Plan".

---

## Track 2 — Support ticket notifications

Use the existing `notifications` table + `send-notification` edge function so admin replies hit the user's bell + email, and user replies appear in the admin's inbox header.

**Database**
- New trigger `notify_on_ticket_message` on `support_ticket_messages` AFTER INSERT:
  - When `author_role = 'admin'`: insert a `notifications` row for `ticket.user_id` (`type = 'support_reply'`, links to `/my-space?tab=support&ticket=<id>`).
  - When `author_role = 'user'`: insert notifications for every admin (`user_roles.role = 'admin'`) so the team sees pending replies.

**Edge function call (optional email)**
- The trigger keeps things in-database (no HTTP). Email is optional — for now we lean on the in-app bell + the existing realtime subscription. We can layer email later via the `send-notification` function if you want.

**UI**
- Support tab already deep-links by ticket ID via `?ticket=<id>` once we read that param in `SupportTab.tsx`.
- Admin Dashboard "Support" tab gets a small unread badge (count of `pending_admin` tickets) on its tab trigger.

---

## Track 3 — Public pricing visibility

`/pricing-specialists` exists but is invisible. Surface it where it counts.

**Header navigation**
- Add a "For specialists" entry in the main nav with a dropdown:
  - "Apply to join" → `/apply`
  - "Plans & pricing" → `/pricing-specialists`
  - "Already a member? Sign in" → `/auth`
- Mobile nav: same items in the slide-up panel.

**Footer**
- Under the "Specialists" column add the "Pricing" link.

**Apply page CTA**
- On `/apply`, add a small "See plans →" link near the submit button so applicants know what comes after acceptance.

---

## Track 4 — Seed 20 curated resources

Populate the Resources hub so it doesn't feel empty. Mix of articles, audio (guided breathing scripts), and worksheets.

**Schema check**
- Reuse the existing `resources` table (no migration unless a column is missing). I'll inspect once and adjust if needed.

**Content categories (5 each)**
- Anxiety & stress (e.g. "Box breathing", "Grounding 5-4-3-2-1", "Worry postponement", "Cognitive defusion", "Stress thermometer")
- Mood & depression (e.g. "Behavioral activation menu", "Pleasure & mastery log", "Self-compassion break", "Values compass", "Mood-thought link")
- Sleep & recovery (e.g. "Sleep hygiene checklist", "Wind-down protocol", "Stimulus control", "Worry parking", "Caffeine cutoff timing")
- Relationships & boundaries (e.g. "DEAR MAN script", "I-statements", "Boundary scripts", "Active listening", "Repair after conflict")
- Performance & focus (e.g. "Pre-performance routine", "Deep work blocks", "Pomodoro+self-talk", "Visualization script", "Post-event debrief")

Each resource: bilingual (FR/EN) title + summary, category tag, ~300-word body or downloadable PDF link, public read.

---

## Technical details

```text
Track 1 — Files touched
├── src/services/psychologistsService.ts          (Featured rail Elite-first)
├── src/components/dashboard/EarningsTab.tsx      (dynamic commission)
├── src/pages/AIAssistant.tsx                     (clinical assistant gate)
├── src/components/dashboard/SpecialistAnalyticsTab.tsx  (NEW)
└── src/pages/SpecialistDashboard.tsx             (add Analytics tab)

Track 2 — Migration + 1-2 file edits
├── migration: trigger notify_on_ticket_message
├── src/components/dashboard/SupportTab.tsx       (read ?ticket query param)
└── src/pages/admin/Dashboard.tsx                 (badge on Support tab)

Track 3 — Nav/footer/apply edits
├── src/components/Header.tsx (or whatever main nav file is)
├── src/components/Footer.tsx
└── src/pages/Apply.tsx

Track 4 — Single insert (data only)
└── 20 rows into public.resources via insert tool
```

**Order of execution**
1. Track 1 gating (no DB changes) → 2. Track 2 migration (trigger only) → 3. Track 3 nav/footer (UI) → 4. Track 4 data seed.

I'll build them top-to-bottom in one pass and report when each track is done.
