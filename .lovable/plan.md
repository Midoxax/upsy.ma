
# U.Psy 2.0 — Performance Psychology Ecosystem

A complete restructure positioning U.Psy as the fusion of **Skool + WHOOP + Headspace + MasterClass + Apple-grade UX**, organized around two flagship ecosystems sitting above the existing therapy directory.

---

## 1. Product Vision

**One-liner:** The operating system for psychological performance — where mental health, sport psychology, and human potential converge.

**Three pillars (new IA):**
1. **Care** — existing directory, booking, clinical tools (kept, deprioritized in nav)
2. **Training Center** — Skool-style community + learning + certification ecosystem
3. **Athlete Hub** — WHOOP-style mental performance intelligence dashboard

Care funds trust. Training Center funds growth. Athlete Hub funds prestige and B2B.

---

## 2. Information Architecture (new top nav)

```
Care            Training Center        Athlete Hub        For Organizations
 ├ Find a       ├ Communities          ├ Dashboard         ├ Teams
 │  specialist  ├ Courses & Tracks     ├ Readiness         ├ Pulse
 ├ Get Matched  ├ Live & Events        ├ Protocols         ├ Programs
 ├ Programs     ├ Certifications       ├ Journal & Mood    └ Analytics
 └ Crisis       └ Mentors              └ AI Coach
```

Auth zone collapses `/my-space` into a contextual workspace that swaps based on the user's **primary identity** (Client, Student, Practitioner, Athlete, Coach, Org).

---

## 3. Membership Architecture

| Tier | Audience | Price (MAD/mo) | Unlocks |
|---|---|---|---|
| **Discover** | Public | Free | Community read, 3 lessons/mo, mood log, 5 AI msgs/day |
| **Student** | Learners | 99 | Full library, cohort access, basic certificate prep |
| **Athlete** | Performers | 199 | Athlete Hub, protocols, AI coach, readiness analytics |
| **Practitioner** | Specialists | 499 | Pro community, clinical CE credits, supervision groups |
| **Elite** | Top 1% | 1499 | Mentor matching, private mastermind, white-glove AI |
| **Coach** | Trainers | 299 | Team dashboard (10 athletes), session feedback tools |
| **Organization / Gym** | B2B | Custom | Multi-seat, branded portal, pulse + analytics, SSO |

**Mechanics:** annual save 20%, founding-member badge (first 500/tier), gifting, student verification, scholarship pool funded by Elite (1 free Student seat per Elite sub — prestige + ESG story).

---

## 4. Training Center / Community Ecosystem

**Surfaces**
- `/center` — feed (intelligent: people you follow + tracks you're in + curated)
- `/center/c/:slug` — community spaces (topic, regional, cohort, expert AMA)
- `/center/learn` — Netflix-grade course browser with tracks
- `/center/learn/:course` — lesson player + comments + assignments
- `/center/live` — calendar (AMAs, cohorts, workshops, group coaching)
- `/center/certifications` — pathways with visual progression maps
- `/center/mentors` — directory + booking for 1:1 mentorship

**Anti-toxicity engine**
- No public like counts (private only)
- Reactions instead of comments on low-signal posts
- AI pre-moderation (Gemini Flash) flags hostility / off-topic before publish
- Slow-mode in heated threads; "cool-down" prompt when sentiment dips
- No infinite scroll — sessions end with a "completion" screen ("You've caught up — go train")

**Engagement loops (healthy)**
- Daily 10-min lesson nudge tied to streak
- Weekly cohort check-in
- Monthly challenge (skill, not vanity)
- Quarterly certification milestone

---

## 5. Gamification System

**Core mechanics**
- **XP** for actions weighted by depth (lesson complete > comment > reaction)
- **Skill trees** per domain (Mindfulness, Resilience, Combat Psychology, Clinical Foundations…)
- **Streaks** — separate streaks for Learn / Train / Reflect (so one bad day doesn't kill everything)
- **Ranks** — Apprentice → Practitioner → Specialist → Master → Mentor (gated by XP + assessments + community contribution)
- **Seasons** — 12-week themes with leaderboards in private cohorts only (no global)
- **Badges** — earned for outcomes, never for vanity ("Completed 30-day visualization protocol")
- **Quests** — multi-step missions ("Pre-fight Prep" = 5 lessons + 7 breathing sessions + 1 coach check-in)

**Psychologically healthy guardrails:** no public global leaderboards, no loss-aversion notifications ("you'll lose your streak!"), opt-out per mechanic, streak freezes (2/month free, more with tier).

---

## 6. Athlete Hub / Performance Ecosystem

**Dashboard layout (immersive, ambient)**
```
┌─ Readiness Ring (0-100)  ─┬─ Today's Focus ─┐
│  composite of: mood,      │  protocol card  │
│  sleep, stress, HRV-in,   │  + AI insight   │
│  cognitive load           │                 │
├───────────────────────────┴─────────────────┤
│  Trends (7/30/90d)   Streaks   Next Event   │
├─────────────────────────────────────────────┤
│  Protocols  │  Journal  │  AI Coach  │ Team │
└─────────────────────────────────────────────┘
```

**Modules**
- **Readiness Score** — daily composite, explainable ("Stress high + sleep short")
- **Protocols** — guided audio/video sessions (visualization, box-breathing, pre-comp ritual, post-loss recovery)
- **Mood + Stress + Energy** logs (3-tap entry, < 8 seconds)
- **Cognitive load tracker** — quick Stroop / reaction game weekly
- **Burnout detector** — rolling 14-day trend triggers alert + AI conversation + optional specialist referral
- **Competition prep flow** — 14/7/3/1-day countdown protocols
- **Journal** with AI summaries, theme detection, exportable to specialist
- **Coach portal** — read-only athlete cards, session feedback, RPE
- **Team dashboards** — anonymized k=5 aggregates for gyms/federations

**Integrations (V2):** Apple Health, Garmin, WHOOP, Oura — read-only HRV, sleep, RHR feeding the Readiness composite.

---

## 7. AI Systems

**One AI surface ("Nour"), multiple personalities scoped by context:**
- *Companion* (general support, free tier capped)
- *Coach* (Athlete Hub, performance lens)
- *Tutor* (in lesson player, Socratic)
- *Reflective* (journal, after-entry summaries)
- *Triage* (intake forms, never diagnoses, routes to specialist)

**Architecture**
- Lovable AI Gateway, default `google/gemini-2.5-flash` for chat, `gpt-5-mini` for journal synthesis, `gemini-2.5-pro` for clinical brief generation
- System prompts include user context: tier, streak, recent mood, current protocol — never PHI to model when journal opt-out is set
- All AI responses stream (SSE) with the existing `ai-assistant` edge function as base
- **Hard rails:** crisis keyword detector (already exists via `crisis-screening`) → SOS Amitié protocol; never claims clinical diagnosis; always offers human option

---

## 8. UX / Motion Direction

**Visual system (extends current Maroon/Beige/Gold tokens)**
- Add **performance accent**: `--athletic-cyan: 188 78% 52%` (only inside Athlete Hub)
- Glass surfaces: 3 depths (`--glass-1/2/3`) with backdrop-blur 12/20/32px
- Ambient backgrounds: AuroraBackground (already exists) per ecosystem with hue shifts
- Type scale unchanged (Outfit/Inter) — adds `font-display` weight 500 for hero metrics

**Motion language (extends current tokens)**
- Readiness ring uses `SPRING.breath`
- Skill-tree node unlocks: `EASE.exhale` 700ms + soft gold pulse
- Lesson completion: full-screen celebration (subtle confetti, no sound by default)
- Page transitions: shared element on athlete card → profile (Framer Motion `layoutId`)

**No new 3D libs.** Pure CSS + Framer Motion (per existing constraint). Three.js stays banned.

---

## 9. Database Schema (additions)

```text
-- Membership
plans                  (tier, price_mad, features jsonb, stripe_price_id)
user_memberships       (user_id, tier, status, current_period_end, …)

-- Community
community_spaces       (slug, name, tier_required, type: topic|cohort|region|ama)
space_members          (space_id, user_id, role)
posts                  (space_id, author_id, body, attachments, ai_score, is_hidden)
post_reactions         (post_id, user_id, kind)  -- private counts
comments               (post_id, parent_id, author_id, body)

-- Learning
tracks                 (slug, title, level, tier_required)
courses                (track_id, slug, title, hours, instructor_id)
lessons                (course_id, order, type: video|audio|reading|exercise, content_url, duration_s)
enrollments            (user_id, course_id, progress_pct, completed_at)
lesson_progress        (user_id, lesson_id, completed_at, time_spent_s)
assignments            (lesson_id, prompt, rubric jsonb)
assignment_submissions (assignment_id, user_id, body, ai_feedback, grade)

-- Gamification
xp_events              (user_id, action, xp, source_id, source_type, created_at)
skill_trees            (slug, domain, tree jsonb)
user_skill_nodes       (user_id, tree_slug, node_id, unlocked_at)
streaks                (user_id, kind: learn|train|reflect, current, best, last_at)
badges                 (slug, name, criteria jsonb, tier)
user_badges            (user_id, badge_slug, earned_at)
quests                 (slug, title, steps jsonb, xp_reward)
user_quest_progress    (user_id, quest_slug, step_idx, completed_at)
seasons                (slug, starts_at, ends_at, theme)

-- Athlete Hub
athlete_metrics_daily  (user_id, date, mood, stress, energy, sleep_h, hrv, cognitive_score, readiness)
protocols              (slug, category, duration_min, tier_required, media_url, script jsonb)
protocol_sessions      (user_id, protocol_slug, started_at, completed_at, rating, notes)
journal_entries        (user_id, body_encrypted, ai_summary, themes text[], mood_at_write)
team_athletes          (coach_id, athlete_id, joined_at, status)  -- consent-based
team_aggregates_daily  (team_id, date, n, readiness_avg, mood_avg, stress_avg)  -- k≥5

-- Certifications
certifications         (slug, name, requirements jsonb, tier_required)
user_certifications    (user_id, cert_slug, issued_at, pdf_url, verification_code)

-- Mentors / Live
mentor_profiles        (user_id, bio, hourly_mad, specialties text[])
mentor_bookings        (mentor_id, mentee_id, scheduled_at, status, …)
live_events            (slug, host_id, starts_at, tier_required, capacity, recording_url)
event_attendees        (event_id, user_id, joined_at)
```

All `public.*` tables: GRANTs + RLS + indexes on `(user_id, created_at)` patterns. Reuse existing `has_role`, add `has_tier(_user, _tier)` security-definer.

---

## 10. Monetization & Retention

**Revenue mix target (12 months):**
- 40% subscriptions (Athlete + Practitioner + Elite carry margin)
- 25% B2B (orgs, gyms, federations)
- 20% therapy commission (existing)
- 10% certifications (one-time + renewal)
- 5% live events / cohorts

**Retention engines:**
- Cohort-based courses (8-week, fixed start) — completion rates 5-10× self-paced
- Streaks with freezes (loss aversion without toxicity)
- Quarterly certification milestones (sunk-cost progression)
- Private community identity (rank visible only inside spaces — *belonging*, not status)
- Annual "Athlete Year in Review" (Spotify Wrapped style — Dec drop)

---

## 11. Growth & Differentiation

**Acquisition:**
- Free Readiness Assessment (viral hook, no signup for first run)
- Coach affiliate program (20% recurring for first year)
- Federation partnerships (MMA Maroc, Athlétisme, e-sports) — free org seats in exchange for case studies
- Founder content (Mehdi's authority on combat psychology — already positioned in memory)

**Differentiation vs Skool/WHOOP/Headspace:**
- Only platform fusing **community + protocols + clinical safety net + multilingual MENA**
- Only one with **human specialist fallback** built-in (crisis routing, referral one-click)
- Only one with **Moroccan Law 09-08 compliance + Arabic RTL**

---

## 12. Roadmap

### MVP (8 weeks) — Foundations
1. Membership tiers table + `has_tier` + tier-gated routes/components
2. Community spaces (topic + cohort) with posts, reactions, AI moderation hook
3. Athlete Hub v1: daily metrics, readiness composite, 5 protocols, journal
4. Gamification v1: XP events, streaks, 20 starter badges, 1 skill tree (Mindfulness)
5. AI surface unified as "Nour" with 3 personalities (Companion/Coach/Tutor)
6. Stripe integration for tiers (via Lovable payments tool)

### V1 (weeks 9-20) — Depth
- Courses + cohorts with live events
- Certifications + visual progression dashboards
- Coach portal + team dashboards (k≥5 aggregates)
- Quests, seasons, full skill trees (5 domains)
- AI journal synthesis + burnout detector

### V2 (weeks 21-36) — Premium
- Wearable integrations (Apple Health, WHOOP read-only)
- White-label org portals + SSO (SAML already supported)
- Mobile app (React Native) — Athlete Hub-first
- Mentor marketplace + supervision groups
- Year-in-review + virality hooks

### V3 — Scale
- International expansion (Gulf, Francophone Africa) — pricing localization
- API for federations
- AI fine-tuned on (consented, de-identified) journal corpus

---

## 13. Engineering Notes

**Build with Lovable:**
- All UI, edge functions, RLS, migrations, Framer Motion, Stripe via Lovable payments
- Reuse: AuroraBackground, BreathingOrb, motion tokens, design system, i18n (EN/FR/AR-RTL)
- New shared components: `<TierGate>`, `<XPBadge>`, `<ReadinessRing>`, `<SkillTree>`, `<ProtocolPlayer>`, `<CommunityFeed>`, `<LessonPlayer>`

**Custom-code carefully:**
- Readiness composite algorithm (edge function, tested)
- AI moderation pre-publish (edge function, < 800ms p95)
- Streak engine (transactional, idempotent, timezone-aware Africa/Casablanca)

**Performance budget:**
- Athlete Hub LCP < 1.8s, dashboard FCP < 1s
- Lesson player video uses HLS via existing storage
- Lazy-load everything below Athlete Hub fold
- React Query with 60s staleTime for metrics

---

## 14. What I need from you to start

Confirm scope for the first build slice — I recommend **MVP step 1+2+4** in parallel:

1. **Membership tiers** (DB + Stripe + `<TierGate>` + pricing page redesign)
2. **Community Spaces v1** (DB + feed + post composer + AI moderation hook)
3. **Gamification v1** (XP ledger + streaks + first skill tree + badge case)

Athlete Hub v1 (step 3 of MVP) as the second slice, since it's the most distinctive surface and deserves focused design polish.

Or — if you want a different first slice (e.g. lead with Athlete Hub for differentiation), say so and I'll resequence.
