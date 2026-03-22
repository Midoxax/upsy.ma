# U.Psy — Implementation Plan

## Step-by-step build sequence

---

## Phase 1 — Foundation ✅ (Complete)

- [x] Define section roles (Trust / Action / Education / Proof)
- [x] Group sections into 5 "acts": Safety → Self-awareness → Solution → Depth → Conversion
- [x] Create project_map.md as system brain
- [x] Create request.txt as feature specification log

## Phase 2 — Homepage Restructuring ✅ (Complete)

- [x] Section order follows conversion funnel
- [x] Configuration-driven SectionConfig[] system
- [x] One dominant section per act
- [x] Stronger headline hierarchy
- [x] Single primary CTA per section

## Phase 3 — Emotional UX Layer ✅ (Complete)

- [x] Replace harsh loaders with skeleton/fade-in patterns
- [x] Section entrance transitions (ScrollReveal + StaggerContainer)
- [x] Max 1 primary CTA per section enforced
- [x] Motion language: Float, Pulse, Breathe, Orbit, Flow
- [x] 150–300ms durations with ease-out curves

## Phase 4 — Performance Polish ✅ (Complete)

- [x] Lazy loading for below-the-fold sections only
- [x] Above-the-fold sections eagerly loaded (Hero, Trust, SelfAssessment, Featured, HowItWorks, Pillars)
- [x] Priority loading for Hero assets
- [x] Code splitting via React.lazy

## Phase 5 — Trust System 🔄 (In Progress)

- [x] TrustSection with credentials and icons
- [x] Microcopy: "Licensed Psychologists", "100% Confidential"
- [ ] Add social proof numbers (sessions completed, experts count)
- [ ] Partner logos section
- [ ] "Trusted by X people" counter

## Phase 6 — Conversion Optimization 🔄 (In Progress)

- [x] CTA after SelfAssessment section
- [x] CTA after Testimonials (FinalCTA section)
- [x] "Start with 2-min assessment" badge
- [ ] CTA repetition between mid-sections
- [ ] A/B test CTA copy variations

## Phase 7 — Content System 🔜 (Planned)

- [ ] Connect dynamic data to Programs section
- [ ] Connect dynamic data to Learning section
- [ ] Connect dynamic data to Research section
- [ ] CMS integration (headless, optional)

---

## Timeline with Checkpoints

| Week | Focus | Status |
|------|-------|--------|
| 1 | Structure fixed, sections reordered | ✅ |
| 2 | Emotional UX added, performance optimized | ✅ |
| 3 | Trust + conversion improved | 🔄 |
| 4 | Content system + testing | 🔜 |

## Team Roles & Rituals

- **Product thinker:** Define user journey, prioritize features
- **UI/UX designer:** Emotional audit, accessibility checks
- **Frontend dev:** Implementation, refactoring
- **Content writer:** Trust microcopy, section content (critical)

### Weekly Ritual
- 30-min usability test (3 users)
- Ask: "What is this site about?", "Do you trust it?", "What would you click?"
- Track top 3 confusions → fix those first

## Optional Integrations

| Integration | Purpose | Priority |
|------------|---------|----------|
| Calendly | Booking API | High |
| Stripe | Payments | Medium |
| n8n / Make | Backend automation | Medium |
| Headless CMS | Content management | Low |

## AI Features (High Leverage)

- [x] AI Mental Health Assistant (basic)
- [ ] Smart therapist matching (post-assessment)
- [ ] AI-guided self-assessment
- [ ] Mood tracking with AI insights
