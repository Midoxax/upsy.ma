# U.Psy — Project Map (System Brain)

> Last updated: 2026-03-22

## Vision
A calm, trust-first mental wellness platform combining therapy, education, performance psychology, and community — designed for Morocco and francophone Africa.

## Architecture Model
`UX → Functionality → Database → UI`
`UI Components → Hooks → Services → API/Database`

## Documentation Files
| File | Purpose |
|------|---------|
| `masterplan.md` | Product strategy, roadmap, audience |
| `implementation-plan.md` | Phased build sequence with checkpoints |
| `design-guidelines.md` | Typography, color, spacing, motion, voice |
| `project_map.md` | Architecture, data flow, component map (this file) |
| `request.txt` | Feature specification log |

---

## Pages & Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Homepage (Index) | ✅ |
| `/psychologists` | Psychologist directory | ✅ |
| `/psychologists/:slug` | Psychologist profile | ✅ |
| `/get-matched` | Self-assessment / matching | ✅ |
| `/services` | Services overview | ✅ |
| `/services/consulting-for-organizations` | B2B consulting | ✅ |
| `/resources` | Learning resources | ✅ |
| `/about` | About U.Psy | ✅ |
| `/contact` | Contact form | ✅ |
| `/auth` | Login / Signup | ✅ |
| `/my-space` | User dashboard | ✅ |
| `/ai-assistant` | AI Mental Health Assistant | ✅ |
| `/psf` | Psychologues Sans Frontières | ✅ |
| `/moroccan-umbrella` | Moroccan Umbrella of Psychology | ✅ |
| `/apply` | Psychologist application | ✅ |
| `/assessment-lab` | Assessment instruments | ✅ |
| `/athlete-hub` | Athlete mental performance | ✅ |
| `/talent-innovation-hub` | Innovation hub | ✅ |
| `/skool` | Community platform | ✅ |
| `/legal` | Legal pages | ✅ |
| `/brand-guidelines` | Brand identity | ✅ |
| `/video-call/:id` | Video session | ✅ |
| `/admin/*` | Admin dashboard | ✅ |

---

## Homepage Sections (Conversion Flow)

| # | Section | Act | Responsibility | Loaded |
|---|---------|-----|---------------|--------|
| 1 | HeroSection | Safety | Brand intro + primary CTA | Eager |
| 2 | TrustSection | Safety | Credibility signals + social proof numbers | Eager |
| 3 | SelfAssessmentSection | Self-awareness | Entry hook (2-min assessment) | Eager |
| 4 | FeaturedPsychologistsSection | Solution | Therapist discovery + personalization | Eager |
| 5 | HowItWorksSection | Solution | 3-step journey | Eager |
| 6 | PillarsSection | Solution | 4 ecosystem pillars | Eager |
| 7 | ProgramsSection | Depth | Structured programs | Lazy |
| 8 | LearningSection | Depth | Educational content | Lazy |
| 9 | OrganizationsSection | Depth | B2B solutions | Lazy |
| 10 | ResearchSection | Depth | Research credibility | Lazy |
| 11 | PsfSection | Depth | Humanitarian sub-brand | Lazy |
| 12 | CommunitySection | Conversion | Community engagement | Lazy |
| 13 | TestimonialsSection | Conversion | Social proof | Lazy |
| 14 | FinalCTASection | Conversion | Final conversion push | Lazy |

---

## Data Flow Architecture

```
UI Components → Hooks → Services → Supabase
     ↑                                  ↓
  Zustand Store ←── Assessment Results ──┘
```

### Service Layer (`src/services/`)
- `psychologistsService.ts` — Supabase queries for psychologist data

### Hooks Layer (`src/hooks/`)
- `usePsychologists.ts` — React Query wrapper for psychologist fetching
- `usePsychologistProfile.ts` — Single profile fetching
- `usePsychologistDashboard.ts` — Dashboard data
- `useApplications.ts` — Application management
- `useAdminAuth.ts` — Admin authentication
- `useUserRole.ts` — Role checking

### Global State (`src/stores/`)
- `assessmentStore.ts` — Zustand store for assessment results, influences Featured section

---

## Database Schema

### Core Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles | ✅ |
| `user_roles` | Role-based access | ✅ |
| `psychologist_profiles` | Therapist profiles | ✅ |
| `psychologist_specialties` | M2M specialties | ✅ |
| `psychologist_languages` | M2M languages | ✅ |
| `psychologist_therapy_approaches` | M2M approaches | ✅ |

### Sessions & Booking
- `sessions`, `reviews`, `leads`, `availability_slots`

### Assessment
- `assessments`, `assessment_questions`, `assessment_results`

### Learning
- `courses`, `course_modules`, `course_enrollments`, `certificates`

### Organization
- `organization_profiles`, `organization_diagnostics`

### Other
- `contact_submissions`, `proposal_requests`, `psychologist_applications`
- `subscriptions`, `translation_overrides`, `ai_conversations`, `ai_messages`
- `mood_entries`, `athlete_profiles`, `athlete_training_sessions`
- `client_matching_requests`

---

## i18n
- Languages: EN, FR, AR
- Coverage: Navigation, homepage, assessments, psychologists, PSF, trust, featured, final CTA

## Sub-Brands
- **PSF** (`/psf`) — Humanitarian initiative, Heart icon + NEW badge
- **Moroccan Umbrella** (`/moroccan-umbrella`) — Professional association, Umbrella icon

## Design System
- Tokens: `src/index.css` + `tailwind.config.ts`
- Motion: Float, Pulse, Breathe, Orbit, Flow, Fade-rise
- Typography: Outfit + Inter
- See `design-guidelines.md` for full spec

## Pending
- [ ] Connect Programs/Learning/Research to database
- [ ] Partner logos in TrustSection
- [ ] Booking system (Calendly)
- [ ] Enhanced AI matching
- [ ] Accessibility audit (WCAG AA)
