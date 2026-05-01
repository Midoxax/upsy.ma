
# Clinical Psychotherapy Process — What's Next

## Current State (what exists)

The platform already covers these stages of the psychotherapy process:

| Stage | Feature | Status |
|-------|---------|--------|
| 1. Discovery / Matching | Get-Matched funnel, directory, filters | Done |
| 2. Booking / Scheduling | BookingModal, BookingWidget, availability slots, propose-session | Done |
| 3. Intake / Anamnesis | Full 8-section anamnesis form with auto-save, consent, review | Done |
| 4. Assessment / Screening | GAD-7, PHQ-9, assessment lab, automated scoring | Done |
| 5. Session Delivery | Video call (Jitsi), session types (video/in-person/phone) | Done |
| 6. Session Notes | Progress notes, intake notes, treatment plan notes, discharge notes (free-text inside note types) | Done |
| 7. Journaling | Interactive journal entries for clients | Done |
| 8. Mood Tracking | Mood + stress entries, MPS score computation | Done |

## What's Missing (the gaps in the therapy process)

Following the standard psychotherapy lifecycle, these structured clinical features are absent:

### Phase A — Treatment Planning (post-intake, pre-ongoing sessions)
**Treatment Plans** — A structured document (not just a note type) linking:
- Presenting problems (from anamnesis)
- Therapeutic goals (SMART format)
- Selected interventions/approaches (CBT, EMDR, Schema, etc.)
- Estimated session count / review milestones
- Status tracking (active / revised / completed)

### Phase B — Between-Session Work
**Homework / Tasks** — Assignments the psychologist gives clients between sessions:
- Task description, due date, category (worksheet, exercise, reading, reflection)
- Client completion status + optional response/reflection
- Visible in both specialist and patient dashboards

### Phase C — Progress Review
**Clinical Progress Timeline** — A unified view per client showing:
- Assessment score trends over time (GAD-7/PHQ-9 chart)
- Mood trajectory graph
- Treatment plan milestone markers
- Session count and frequency

### Phase D — Termination / Discharge
**Discharge Summary** — A structured document (beyond the note type):
- Reason for termination (goals met, client request, referral, dropout)
- Summary of progress (initial vs. final assessment scores)
- Recommendations / aftercare plan
- Optional referral to another specialist

---

## Proposed Implementation

### 1. Database: New tables via migrations

**`treatment_plans`** — psychologist_id, client_id, presenting_problems (jsonb), goals (jsonb array of SMART goals), interventions (text[]), estimated_sessions (int), status (enum: draft/active/revised/completed), review_at (timestamptz), created/updated timestamps. RLS: psychologist owner + admin read.

**`homework_assignments`** — psychologist_id, client_id, session_id (nullable), title, description, category (enum: worksheet/exercise/reading/reflection/other), due_date, completed_at, client_response (text), created/updated. RLS: psychologist owner + client (own rows) read/update completion.

**`discharge_summaries`** — psychologist_id, client_id, treatment_plan_id (nullable), reason (enum: goals_met/client_request/referral/dropout/other), progress_summary (text), initial_scores (jsonb), final_scores (jsonb), aftercare_recommendations (text), referral_to (uuid nullable), created_at. RLS: psychologist owner + admin.

### 2. Specialist Dashboard: New tabs/sections

- **Treatment Plans tab** — List of plans per client, create/edit form with SMART goal builder, status badges, review reminders.
- **Homework tab** — Assign tasks to clients, see completion status, filter by client.
- **Client Progress view** — Chart of assessment scores + mood over time (inside sessions or as a sub-view when viewing a client).

### 3. Patient Dashboard: New sections

- **My Homework** card/tab — See assigned tasks, mark complete, add reflections.
- **My Progress** — Visual timeline of their journey (assessment trends, session milestones, goals achieved).
- **Treatment Plan view** — Read-only view of active treatment plan goals and progress.

### 4. Discharge flow

- Button on specialist dashboard to initiate discharge for a client.
- Structured form pulling initial/final assessment scores automatically.
- Generates a discharge summary viewable by both parties.

### Technical notes

- Assessment score charts will use Recharts (already in the project).
- Treatment plan goals use a JSONB array for flexibility (each goal: description, target_date, status, notes).
- Homework completion triggers XP award via existing `award_xp` function.
- All new tables get RLS policies and audit logging via existing `log_sensitive_change` trigger.
- No new edge functions needed — all CRUD via Supabase client SDK.
