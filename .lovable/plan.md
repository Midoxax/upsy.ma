
# UPSY OPS — MVP Vertical Slice

A cinematic, standalone operations layer mounted at `/ops`, visually disconnected from the U.Psy marketing site. Three.js + GSAP allowed inside `/ops/*` only. Claude (Anthropic) powers the AI Operations Director.

## Scope of this build

In:
- `/ops` landing (cinematic command center entry)
- Workspace switcher (multi-tenant scaffold, single seeded org: LSSPM)
- Realtime Command Center dashboard shell
- **Dynamic SOP / Protocol Engine** (the hero feature)
- Operational task system tied to generated SOPs
- Claude-powered AI Ops Director (generation + chat)
- Auth gate (reuses existing Lovable Cloud auth)

Out (later phases):
- Finance/logistics intelligence
- Psychological safety workflows (schema seeded, no UI)
- Supplier/procurement, transport, accommodation modules
- Mobile-first polish (desktop-first for MVP)

## Architecture

```text
/ops                          → Cinematic landing (Three.js hero)
/ops/auth                     → Operator login
/ops/[workspace]              → Workspace shell
  ├── /command                → Realtime command center
  ├── /events                 → Event list
  ├── /events/[id]            → Event detail + generated SOP
  ├── /events/new             → SOP Engine intake → AI generation
  ├── /tasks                  → Task board (Kanban + list)
  └── /director               → Claude AI Ops Director chat
```

Layout: `OpsLayout` (dedicated, full-bleed, dark, no U.Psy header/footer).
Theme: scoped CSS variables under `.ops-theme` — black base, single neon cyan accent (`hsl(180 100% 60%)`), glass surfaces, futuristic mono+sans pairing.

## Visual / motion stack (scoped to /ops)

- `@react-three/fiber@^8.18` + `@react-three/drei@^9.122` + `three@^0.160`
- `gsap@^3.12`
- Framer Motion (already present)
- Lazy-loaded via `React.lazy` so marketing routes don't pay the bundle cost
- Hero: WebGL particle network ("operational nervous system")
- Command center: ambient grid shader background, cursor parallax
- Reduced-motion fallback: static gradient + CSS-only glow

## Dynamic SOP / Protocol Engine (core)

Intake form captures: event type, participants, duration, budget, city, overnight, media exposure, VIP, public/private, psychological sensitivity, risk level.

Flow:
1. Operator fills intake → `protocol_drafts` row created
2. Edge function `ops-generate-protocol` calls Claude with a structured tool-call schema
3. Claude returns: phases → tasks (owner role, deadline offset, dependencies, escalation, proof type, psych-safety flags)
4. Persisted to `ops_events`, `ops_protocol_phases`, `ops_tasks`
5. UI renders generated SOP with edit/approve, then materializes tasks on approval

Re-generation: operator can ask the Director to "tighten timeline" / "add calm room" — patch-style updates via a second tool call.

## Task & accountability system

States: `pending | active | blocked | delayed | escalated | validated | completed | archived`.
Each task: owner, deadline, dependencies[], proof_required, attachments[], comments[], escalation_chain[], state_log[].
Delay detection via a `pg_cron` job (`ops-task-watcher`) that flips overdue → delayed and notifies via Supabase Realtime.

## Realtime Command Center

Single-screen tactical view:
- Event timeline (horizontal, GSAP scrub)
- Task flow rail with live state pulses (Supabase Realtime on `ops_tasks`)
- KPI tiles (open/blocked/escalated counts)
- Activity feed (last 50 ops events)
- Director quick-prompt pinned bottom-right

## AI Ops Director (Claude)

- Edge function `ops-director` — SSE stream from Claude `claude-sonnet-4-5-20250929` via Anthropic API
- Tools: `generate_protocol`, `patch_protocol`, `escalate_task`, `summarize_event`
- Context: current workspace, active event, recent task state changes
- Secret required: `ANTHROPIC_API_KEY`

## Database (new tables, all RLS + GRANTs)

- `ops_workspaces` (tenants — LSSPM seeded)
- `ops_workspace_members` (user_id, workspace_id, role: `director|operator|viewer`)
- `ops_events` (workspace_id, type, intake jsonb, status, dates)
- `ops_protocol_phases` (event_id, order, title, description)
- `ops_tasks` (event_id, phase_id, owner_user_id, owner_role, state, deadline, deps uuid[], proof_required, escalation jsonb)
- `ops_task_events` (task_id, actor, from_state, to_state, note, ts)
- `ops_director_threads` + `ops_director_messages` (Claude conversation history)
- Security-definer helper `ops_has_workspace_access(user_id, workspace_id)` to avoid recursive RLS

All policies scope via `ops_has_workspace_access`. `service_role` granted for edge functions. No anon access.

## Edge functions

- `ops-generate-protocol` (Anthropic, tool-call, returns structured SOP)
- `ops-director` (Anthropic, SSE stream, multi-turn with tools)
- `ops-task-watcher` (cron, flips overdue tasks, emits realtime events)

## Files to create (high-level)

- `src/ops/` — fully isolated tree
  - `OpsApp.tsx`, `OpsLayout.tsx`, `ops-theme.css`
  - `pages/` Landing, Command, Events, EventDetail, NewEvent, Tasks, Director
  - `components/three/` HeroNetwork, GridShader, CursorParallax
  - `components/sop/` IntakeForm, GeneratedSOPViewer, PhaseCard
  - `components/tasks/` TaskBoard, TaskCard, StateBadge, EscalationTimeline
  - `components/director/` DirectorChat, QuickPrompt
  - `hooks/` useOpsWorkspace, useOpsEvents, useOpsTasks (Realtime), useDirector
- `src/App.tsx` — add lazy `/ops/*` route
- Migration: tables above
- Edge functions: three listed
- Seed: one `ops_workspaces` row for LSSPM

## Required secret

`ANTHROPIC_API_KEY` — will be requested via the secrets tool before edge functions are wired.

## What it will feel like

Black room. A slow particle network breathes behind the headline "Operational Nervous System." Hover any tile and the grid behind it ripples. Open an event, watch tasks pulse cyan when a teammate flips their state in another browser. Ask the Director "we just added 200 attendees," and the SOP rewires itself in front of you.

## Not in this slice

Finance dashboards, supplier CRM, calm-room workflows, transport orchestration, mobile layout, organization onboarding wizard, theming per tenant. All have schema hooks reserved but no UI.
