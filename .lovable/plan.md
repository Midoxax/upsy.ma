
# Sprint 1 Continuation — Non-Payment Items

Payments are parked. Here's what I'll tackle next, ordered by impact on performance and client retention.

---

## 1. Crisis Safety — Full Coverage (P0)

**Problem:** CrisisModal + useCrisisScreening exist but are only wired into PatientDashboard. The AI Assistant (Nour), JournalTab, and TodaysStateCard have zero crisis detection.

**Work:**
- Wire crisis screening into **AIAssistant** — if the AI response or user message contains distress keywords, surface the CrisisModal.
- Add a low-mood trigger in **JournalTab** — when a user saves a journal entry flagged by the edge function, show CrisisModal.
- Add a low-score trigger in **TodaysStateCard** — if the user's self-reported state is very low, surface the modal.
- Write an audit row to `crisis_screenings` on every trigger so admin can review coverage.
- Verify the `crisis-screening` edge function works end-to-end by calling it.

---

## 2. PWA Completion — Offline + Install Prompt + Push (P1)

**Problem:** Manifest exists, Install page exists, but no service worker, no install prompt logic, no push. Icons reuse a single favicon.

**Work:**
- Add `vite-plugin-pwa` with the guarded config (disabled in iframe/preview, NetworkFirst for HTML, `navigateFallbackDenylist` for `/~oauth`).
- Generate proper 192px and 512px icons (+ maskable variant) from the existing favicon.
- Wire `beforeinstallprompt` into `InstallAppButton` so it shows a real native prompt on supported browsers.
- Create a `push_subscriptions` table (migration) to store push tokens per user.
- Add a lightweight push subscription flow on dashboard load (ask permission, store token).
- Hook `send-notification` edge function to also dispatch web push via the Web Push API for users who opted in.

---

## 3. Notification Preferences UI (P1)

**Problem:** `notification_preferences` table exists but there's no UI for users to toggle channels (email / in-app / push) per event type.

**Work:**
- Add a "Notification Settings" section to the patient and specialist dashboards (or a shared settings page).
- Read/write `notification_preferences` rows per user.
- Respect these preferences in `send-notification` and `notify-proposal-response` edge functions before dispatching.

---

## 4. Structured Logging Rollout (P0)

**Problem:** `_shared/logger.ts` was created but no edge functions use it yet. 17 raw `console.error` calls remain.

**Work:**
- Import and use the structured logger in the most critical edge functions: `crisis-screening`, `propose-session`, `notify-proposal-response`, `ai-assistant`, `create-booking-payment`.
- Replace raw `console.error` with `logger.error()` calls across edge functions.
- Add `requestId` header forwarding for traceability.

---

## 5. Sentry/PostHog Activation Reminder

SDKs are installed and wired. They silently no-op without keys. I'll add a small admin-visible banner (or console note) reminding that observability is inactive until you provide the DSN/key. No code blocker — everything works without them.

---

## Technical Details

- **New migration:** `push_subscriptions` table with `user_id`, `endpoint`, `p256dh`, `auth`, `created_at`, RLS policy (users manage own rows).
- **vite-plugin-pwa:** Added to `vite.config.ts` with iframe/preview guard in `src/main.tsx`.
- **Edge function changes:** Import `logger` in 5+ functions, add crisis triggers to 3 components.
- **No breaking changes** to existing flows.

---

Shall I proceed?
