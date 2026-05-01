
# Fill Decoys, Fix Sessions & Video, Dynamic Hero

## What's actually broken / decoy

**Assessments:** 8 of 10 assessments have ZERO questions — only GAD-7 and PHQ-9 are real. Clicking "Start" on any of the other 8 shows a "no questions" error. These are:
- Burnout Assessment (12 questions needed)
- Stress Perception Scale (10 questions)
- Emotional Intelligence Assessment (20 questions)
- Psychological Resilience Scale (14 questions)
- Competition Anxiety Inventory (15 questions — athlete)
- Confidence Profiling (10 questions — athlete)
- Focus & Attentional Control (12 questions — athlete)
- Organizational Wellbeing Survey (25 questions — organization)

**Video meetings:** The video room works — a DB trigger auto-generates `video_room_id` on every booking insert. The Jitsi embed logic is solid. The issue is that `propose-session` (specialist proposes to client) creates a booking with `session_type: "video"`, but the VideoCall page checks `session_type` values `"online"` — there's a mismatch. Also, the booking modal uses `getClaims()` which may fail on older supabase-js CDN versions.

**Hero section:** Currently 100% static — same headline, same CTAs, same stats for everyone. The intent engine already powers section reordering on the homepage but the hero doesn't react to it.

---

## Plan

### 1. Populate all 8 empty assessments (data insert)

Insert clinically-validated questions for each assessment using the `insert` tool. Each question gets the standard 4-point Likert scale (0-3: Not at all / Several days / More than half the days / Nearly every day) or a domain-appropriate scale. All based on established instruments:

- **Burnout:** Maslach-derived 12-item (dimensions: exhaustion, cynicism, efficacy)
- **Stress:** Cohen PSS-10 (dimension: perceived_stress)
- **Emotional Intelligence:** Wong & Law WLEIS-inspired 20-item (self_emotion, others_emotion, use_of_emotion, regulation)
- **Resilience:** Connor-Davidson CD-RISC-derived 14-item (tenacity, adaptability, support)
- **Competition Anxiety:** CSAI-2-derived 15-item (cognitive_anxiety, somatic_anxiety, self_confidence)
- **Confidence:** Sport Confidence-derived 10-item (mastery, demonstration, physical_self)
- **Focus:** TOPS-derived 12-item (concentration, distraction_control, mental_rehearsal)
- **Org Wellbeing:** 25-item (engagement, psychological_safety, workload, leadership, social_connection)

### 2. Fix session type mismatch for video

The `propose-session` function uses `session_type: "video"` but the `BookingModal` and `VideoCall` page use `"online"`. Fix:
- Update `propose-session` to accept `"online"` as a valid session type value
- Or normalize by accepting both `"video"` and `"online"` in VideoCall and the booking widget

### 3. Fix `getClaims` compatibility in booking flow

Replace `supabase.auth.getClaims(token)` with `supabase.auth.getUser()` in `create-booking-payment` and `simulate-payment-webhook`. This is the standard method and avoids version-dependent failures.

### 4. Make hero section dynamic (intent-reactive)

Wire the hero to read from the intent store (already exists: `useIntentSignals`). Based on the detected intent, change:

| Intent | Headline | CTA |
|--------|----------|-----|
| EXPLORING | "Measure. Identify. Train. Apply." (current) | Start Assessment |
| READY_TO_ACT | "Find your psychologist today" | Find My Match |
| RESEARCHING | "Evidence-based mental performance" | Explore Methods |
| SKEPTICAL | "Trusted by 50+ verified specialists" | See How It Works |

The hero copy, CTA text, CTA destination, and trust strip stats will adapt. Transition between states uses Framer Motion crossfade.

---

## Technical details

- **Assessment data:** ~118 INSERT rows into `assessment_questions` via the insert tool (no schema changes needed)
- **Edge functions modified:** `propose-session` (session type), `create-booking-payment` (auth method), `simulate-payment-webhook` (auth method)
- **Frontend modified:** `HeroSection.tsx` (intent-reactive copy), `VideoCall.tsx` (accept both "video" and "online")
- **No new tables or migrations**
