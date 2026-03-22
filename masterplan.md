# U.Psy — Masterplan

## 30-Second Elevator Pitch

A calm, trust-first mental wellness platform that helps users understand themselves → find support → take action. Designed to feel safe, not overwhelming. Converts through clarity, not pressure.

## Problem & Mission

**Problem:** Mental health platforms feel clinical, overwhelming, and transactional.

**Mission:** Make mental health feel safe, human, and approachable in 30 seconds.

## Target Audience

### Primary
- Young professionals (20–40)
- First-time therapy seekers
- Users in Morocco and francophone Africa

### Secondary
- People exploring self-growth (not crisis)
- Organizations (employee wellness)
- Athletes and high performers

## Core Features

| Feature | Status | Entry Point |
|---------|--------|-------------|
| Self-assessment | ✅ MVP | /get-matched |
| Therapist discovery | ✅ MVP | /psychologists |
| Educational content | ✅ MVP | /resources |
| Structured programs | ✅ MVP | /services |
| Trust signals | ✅ MVP | Homepage |
| Testimonials + community | ✅ MVP | Homepage |
| AI Mental Health Assistant | ✅ MVP | /ai-assistant |
| PSF sub-brand | ✅ MVP | /psf |
| Booking system | 🔜 V1 | Profile pages |
| User accounts | ✅ MVP | /auth |
| Personalized recommendations | 🔜 V1 | Post-assessment |

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + custom design system (Liquid-Glass)
- **State:** Zustand (global) + React Query (server)
- **Backend:** Lovable Cloud (Supabase)
- **Performance:** React.lazy + Suspense for below-fold sections
- **i18n:** Custom context-based (EN/FR/AR)

## Conceptual Data Model

```
User → Profile → Assessment Results
Psychologist → Profile → Specialties, Languages, Availability
Content → Courses → Modules → Enrollments
Sessions → Reviews
Organizations → Diagnostics
```

## UI Design Principles (Krug-aligned)

1. **Don't make users think:** One clear action per section
2. **Scan-friendly:** Headlines > paragraphs
3. **Emotional clarity:** Calm > clever
4. **Reduce decisions:** Guide, don't overwhelm

## Phased Roadmap

### MVP (Current)
- Homepage with conversion flow
- Self-assessment → therapist listing
- Basic CTA flow
- AI assistant
- PSF sub-brand page

### V1
- User accounts with profiles
- Booking system integration
- Personalized recommendations post-assessment

### V2
- AI-guided matching
- Progress tracking
- Organization dashboards
- Mobile optimization

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Trust barrier | Credentials + human stories + numbers |
| Overwhelm | Progressive disclosure + calm design |
| Drop-off | Early engagement (2-min assessment hook) |
| Content gaps | CMS-ready architecture |

## Future Expansion

- Mobile app (React Native)
- AI therapist assistant (enhanced)
- Corporate wellness SaaS
- Community groups + forums
- Voice journaling
- Daily check-in feature
