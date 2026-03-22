# U.Psy — Project Architecture Map

## Platform Vision
A scalable mental-health digital ecosystem for Africa & MENA, built on four pillars:
1. **Clinical Care** — Psychologist directory, matching, sessions, PSF initiative
2. **Learning & Education** — 3-tier MOOC, assessments, certificates
3. **Mental Performance** — Athlete hub, training sessions, coaching
4. **Institutional Services** — B2B diagnostics, organizational wellbeing

## Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Index | Conversion funnel: Hero → Trust → Assessment → Psychologists → Programs → CTA |
| `/about` | About | Team, mission, pillars |
| `/services` | Services | Service catalog |
| `/services/consulting-for-organizations` | ConsultingForOrganizations | B2B offering |
| `/psychologists` | Psychologists | Directory with filters (specialty, language, price, location) |
| `/psychologists/:id` | PsychologistProfile | Individual profile + booking |
| `/get-matched` | GetMatched | AI-powered matching form |
| `/assessments` | AssessmentLab | GAD-7, PHQ-9, burnout screenings |
| `/ai-assistant` | AIAssistant | AI mental health chat (Lovable AI) |
| `/skool` | Skool | Learning platform / MOOC |
| `/resources` | Resources | Articles, guides |
| `/apply` | Apply | Psychologist application form |
| `/auth` | Auth | Login / signup |
| `/my-space` | MySpace | Role-based dashboard (psychologist, athlete, coach, org) |
| `/dashboard` | PatientDashboard | Client sessions & mood tracking |
| `/athlete-hub` | AthleteHub | Mental performance dashboard |
| `/moroccan-umbrella` | MoroccanUmbrella | Umbrella organization page |
| `/psf` | PsychologuesSansFrontieres | PSF sub-brand: mission, pillars, programs, volunteer CTA |
| `/talent-innovation-hub` | TalentInnovationHub | Innovation programs |
| `/admin` | AdminDashboard | Admin panel |
| `/admin/applications` | Applications | Review psychologist applications |
| `/contact` | Contact | Contact form |
| `/legal` | Legal | Privacy, terms |
| `/brand` | BrandGuidelines | Design system reference |

## Homepage Sections (Conversion Funnel Order)

| Section | Responsibility | Data Source |
|---|---|---|
| HeroSection | Brand awareness + primary CTA | Static |
| TrustSection | Credibility signals | Static |
| SelfAssessmentSection | Quick mental health check → drives engagement | Links to `/assessments` |
| FeaturedPsychologistsSection | Showcase professionals → drive bookings | `psychologist_profiles` via Supabase |
| HowItWorksSection | Process explanation | Static |
| PillarsSection | Platform pillars overview | Static |
| ProgramsSection | Programs showcase | Static |
| LearningSection | MOOC / education CTA | Static |
| OrganizationsSection | B2B pitch | Static |
| ResearchSection | Research credibility | Static |
| PsfSection | Psychologues sans frontières | Static |
| CommunitySection | Community engagement | Static |
| TestimonialsSection | Social proof | Static |
| FinalCTASection | Final conversion push | Static |

## Data Flow Architecture

```
[UI Sections]
     ↓
[Hooks] (usePsychologists, useAssessments, useUserRole, etc.)
     ↓
[Services] (psychologistsService, assessmentsService, etc.)
     ↓
[Supabase Client] → Database
```

### Cross-Section State (Zustand)
```
[SelfAssessmentSection] → writes assessment result to store
     ↓
[FeaturedPsychologistsSection] → reads assessment state for recommendations
[FinalCTASection] → personalizes CTA based on assessment
```

## Database Schema (Key Tables)

| Table | Purpose |
|---|---|
| `profiles` | User profiles (linked to auth.users) |
| `user_roles` | Role assignments (admin, psychologist, user, athlete, coach, organization) |
| `psychologist_profiles` | Professional profiles |
| `psychologist_specialties` | Junction: psychologist ↔ specialties |
| `psychologist_languages` | Junction: psychologist ↔ languages |
| `psychologist_therapy_approaches` | Junction: psychologist ↔ approaches |
| `specialties` | Specialty catalog |
| `languages` | Language catalog |
| `therapy_approaches` | Therapy approach catalog |
| `sessions` | Booked sessions |
| `reviews` | Session reviews |
| `leads` | Client inquiry leads |
| `availability_slots` | Psychologist availability |
| `subscriptions` | Psychologist subscription plans |
| `assessments` | Assessment definitions |
| `assessment_questions` | Assessment questions |
| `assessment_results` | User assessment results |
| `courses` | MOOC courses |
| `course_modules` | Course content modules |
| `course_enrollments` | User enrollments |
| `certificates` | Issued certificates |
| `mood_entries` | Mood tracking data |
| `athlete_profiles` | Athlete mental performance profiles |
| `athlete_training_sessions` | Mental training sessions |
| `organization_profiles` | B2B organization profiles |
| `organization_diagnostics` | Organizational assessments |
| `ai_conversations` | AI chat conversations |
| `ai_messages` | AI chat messages |
| `client_matching_requests` | Matching form submissions |
| `contact_submissions` | Contact form entries |
| `proposal_requests` | B2B proposal requests |
| `psychologist_applications` | Practitioner applications |
| `translation_overrides` | i18n overrides from admin |

## Authentication & Roles
- Auth via Supabase Auth (email/password)
- Roles stored in `user_roles` table (not on profiles)
- Role check: `has_role(user_id, role)` security definer function
- Routes protected via `ProtectedRoute` and `AdminRoute` components

## Themes
- Route-based theming via `data-theme` attribute
- Themes: default, performance, institutions, innovation, skool, clinic, accreditation
