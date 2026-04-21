

## Multi-Role Admin + Clinical Anamnesis System

You want to (1) wear multiple hats from your admin account (admin + psychologist + client + organization views), and (2) add a structured **anamnesis** (clinical intake) form clients fill during early sessions.

---

### Part 1 — Multi-role view switcher for your admin account

Today `useUserRole` picks ONE primary role and `RoleRouter` redirects accordingly. We'll keep that for normal users, but add a **"View As" switcher** for admins (and any user with multiple roles).

**What you'll get:**
- A dropdown in the header (visible only when you have ≥2 roles or are admin) with:
  - Admin Console (`/admin`)
  - Specialist Dashboard (`/dashboard/specialist`)
  - Client Dashboard (`/dashboard/client`)
  - Organization Dashboard (`/dashboard/organization`)
- Selection persists in `localStorage` as `upsy.activeView`
- `RoleRouter` reads `activeView` first, falls back to `primaryRole`
- `ProtectedRoute` keeps real RLS-backed role checks (security unchanged — switching view never grants data you don't own)

**Backend change:** assign you (`mehdifelji@gmail.com`) the missing roles so the dashboards have data scopes:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, unnest(ARRAY['psychologist','organization']::app_role[])
FROM auth.users WHERE email = 'mehdifelji@gmail.com'
ON CONFLICT DO NOTHING;
```

Plus seed a minimal `psychologist_profiles` row + `organization_accounts` row owned by you so the Specialist and Org dashboards render real data instead of empty states.

---

### Part 2 — Clinical Anamnesis (intake form)

A structured first-session intake the **psychologist opens during the session** and the **client fills (or the psychologist fills with the client)**. Stored per client, versioned, editable later.

**New table `client_anamneses`:**
- `id`, `client_id`, `psychologist_id`, `booking_id` (nullable, links to first session)
- Sections (all `jsonb` for flexibility + future i18n):
  - `identity` (age, gender, marital status, profession, children)
  - `presenting_complaint` (main reason, onset, triggers, severity 1–10)
  - `history_personal` (childhood, education, key life events, traumas)
  - `history_family` (family structure, mental health history)
  - `medical` (current treatments, medications, allergies, prior therapy)
  - `lifestyle` (sleep, appetite, substances, exercise, social support)
  - `risk_screening` (suicidal ideation, self-harm, crisis flags → triggers `CrisisModal` if positive)
  - `goals` (what client wants from therapy)
- `status`: `draft` | `in_progress` | `completed` | `reviewed`
- `completed_at`, `reviewed_at`, `created_at`, `updated_at`
- `consent_given` boolean + Law 09-08 timestamp

**RLS:**
- Client: read/write own anamnesis (where `client_id = auth.uid()`)
- Psychologist: read/write anamneses for clients they have a booking with (via `EXISTS (bookings WHERE psychologist_id = auth.uid() AND patient_id = client_anamneses.client_id)`)
- Admin: full access

**UI surfaces:**
1. **Specialist dashboard → Sessions tab → per-booking action "Open Anamnesis"** — opens a multi-step drawer (Identity → Complaint → History → Medical → Lifestyle → Risk → Goals → Review). Auto-save every step. Risk section triggers crisis flow if flagged.
2. **Client dashboard → new "My Intake" card** — client can pre-fill before first session; shows progress %.
3. **PDF export** of the completed anamnesis (reuses the `generate-certificate` jsPDF pattern) into the client's `documents` table → downloadable from Documents tab.

---

### Technical changes

**Files created:**
- `src/components/ViewAsSwitcher.tsx` — header dropdown
- `src/hooks/useActiveView.ts` — reads/writes `localStorage` view, exposes `activeView`
- `src/components/anamnesis/AnamnesisDrawer.tsx` — multi-step form (uses `react-hook-form` + `zod`)
- `src/components/anamnesis/AnamnesisStepIdentity.tsx` … `StepRisk.tsx` … `StepReview.tsx` (7 steps)
- `src/components/dashboard/AnamnesisCard.tsx` — client-side card
- `src/hooks/useAnamnesis.ts` — CRUD + autosave
- `supabase/functions/anamnesis-pdf/index.ts` — PDF export edge function
- `supabase/migrations/<ts>_anamnesis.sql` — table + RLS + trigger to update `updated_at`

**Files updated:**
- `src/components/RoleRouter.tsx` — respect `activeView` override
- `src/components/Header.tsx` — mount `ViewAsSwitcher` (admin or multi-role only)
- `src/pages/MySpace.tsx` — same logic
- `src/components/dashboard/SessionsTab.tsx` — "Open Anamnesis" button per booking
- `src/pages/PatientDashboard.tsx` — embed `AnamnesisCard`
- `src/lib/i18n/translations.ts` — EN/FR/AR keys for anamnesis steps
- `src/integrations/supabase/types.ts` — auto-regenerated

**Security guarantees:**
- View switching is **UI-only**; every query still passes through RLS
- Anamnesis risk flags positive → reuse existing `CrisisScreening` + `SOS Amitié Maroc` protocol
- Mandatory Law 09-08 consent checkbox before saving
- Anamnesis content treated as sensitive: logged via `log_sensitive_change` trigger

---

### Out of scope (ask if you want them next)
- Real-time co-editing of anamnesis during session
- AI-assisted anamnesis summary (could plug into existing `session-summary` edge function)
- Anamnesis templates per specialty (CBT-focused, trauma-focused, sport-psych)

