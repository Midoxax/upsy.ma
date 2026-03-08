

# U.Psy Platform Transformation Plan

## Current State Audit

The site currently has: dark charcoal/gold/teal theme, 3-dropdown nav (Services, About, Community), homepage with hero + 3 feature cards + testimonials + CTA, psychologist marketplace with filters, consulting for organizations page, psychologist dashboard (MySpace), admin dashboard, multi-language support (EN/FR/AR), and a matching system. Database has psychologist profiles, specialties, languages, leads, applications, subscriptions, and contact/proposal tables.

**What's missing vs. the vision:** Blog, Research Hub, Learning/MOOC platform, self-assessment tools, AI wellbeing tools, athlete performance section, client dashboard, calm blue/violet design language, and the new navigation structure.

## Phased Implementation Strategy

Given the scope (17 major sections), this must be phased. Here is the full plan broken into implementable phases.

---

### Phase 1 — Navigation + Homepage Redesign + Design System

**Design system overhaul:**
- Replace dark charcoal/gold/teal CSS variables with calm blue/violet/light-grey palette
- New `--bg: 220 25% 97%` (near-white), `--surface: 0 0% 100%` (white), `--primary: 245 58% 51%` (violet), `--secondary: 210 100% 56%` (calming blue), accents in soft teal
- Add glassmorphism utility classes (`glass-card`: `backdrop-blur-xl bg-white/60 border border-white/20`)
- Update shadows to soft, diffused styles
- Keep Outfit font but soften weights

**Navigation restructure:**
- Replace 3-dropdown nav with flat top nav: Home | Find a Psychologist | Programs | Learning | Organizations | Research | About | Blog | Contact
- Clean dropdown only for Programs (athlete performance, group workshops) and Organizations (corporate, NGO, sports)
- Login/Sign Up buttons in header

**Homepage redesign:**
- Hero: "Your Personal Psychologist" tagline, CTAs "Find a Psychologist" + "Explore Programs"
- 4 pillars section: Care, Learning, Performance, Organizations (icon cards)
- How it works: 3-step visual flow
- Self-assessment teaser card (links to future tools)
- Featured psychologists carousel (from existing DB)
- Featured courses placeholder section
- Institutional partnerships strip
- Research/insights preview
- Final CTA

**Files changed:** `src/index.css`, `tailwind.config.ts`, `src/components/Header.tsx`, `src/pages/Index.tsx`, translation files, new route entries in `App.tsx`

---

### Phase 2 — New Content Sections (Blog, Research, Programs)

**Blog page (`/blog`):**
- Blog listing page with card grid, categories, search
- Individual blog post page (`/blog/:slug`)
- Database tables: `blog_posts` (title, slug, content, excerpt, cover_image, category, author, published_at, is_published), `blog_categories`
- Admin can create/edit posts from dashboard

**Research Hub (`/research`):**
- Static page with categorized cards: Reports, White Papers, Policy Briefs, Insights
- Database table: `research_publications` (title, type, description, file_url, published_at)
- Download/view links

**Programs page (`/programs`):**
- Athlete mental performance section with program cards
- Group workshops listing
- Links to booking/contact

**Files changed:** New pages, new DB tables via migration, new admin tabs, route additions

---

### Phase 3 — Learning Platform (MOOC)

**Learning page (`/learning`):**
- 3 tiers: Public Psychoeducation, Professional Training, Certification Programs
- Course listing with filters (level, topic, duration)
- Database tables: `courses` (title, description, level, instructor, price, thumbnail, is_published), `course_modules`, `course_lessons`, `course_enrollments`, `course_progress`
- Individual course page with module breakdown, lesson list, enroll button
- Progress tracking for enrolled users
- Certificate generation placeholder

**Files changed:** New pages, new DB tables, new components, route additions

---

### Phase 4 — Self-Assessment Tools + AI Features

**Self-assessment tools (`/self-assessment`):**
- Validated screening questionnaires: GAD-7 (anxiety), PHQ-9 (depression), MBI (burnout), PSS (stress)
- Step-by-step form UI with progress bar
- Results page with score interpretation, resource recommendations, CTA to book a psychologist
- Database table: `assessment_results` (user_id nullable, type, score, created_at)

**AI wellbeing tools (`/wellbeing-tools`):**
- Mood check-in (emoji scale + journal prompt)
- Guided journaling with AI prompts (using Lovable AI / Gemini)
- CBT thought record exercise
- Edge function for AI responses
- Clear disclaimer: "This is not therapy"

---

### Phase 5 — Client Dashboard + Enhanced Psychologist Dashboard

**Client dashboard (extend `/my-space`):**
- Role-based tabs: detect if user is client vs psychologist
- Client tabs: My Sessions, Invoices, Journal, Course Progress, Messages
- Database tables: `sessions`, `invoices`, `journal_entries`, `messages`

**Psychologist dashboard enhancements:**
- Session notes tab
- Analytics (sessions per month, revenue chart)
- Message center

---

### Phase 6 — Organizations B2B Enhancement

**Expanded `/services/consulting-for-organizations`:**
- 3 sub-sections: Corporate, NGOs/Humanitarian, Sports Organizations
- Detailed service cards for each
- Enhanced proposal request form with service type selection
- Case studies / testimonials section

---

## Implementation Priority

I recommend starting with **Phase 1** (design system + navigation + homepage) as it sets the foundation for everything else. Each subsequent phase builds on the previous.

**Estimated scope per phase:**
- Phase 1: ~15 files modified/created
- Phase 2: ~10 new files + 2 DB migrations
- Phase 3: ~12 new files + 4 DB migrations
- Phase 4: ~8 new files + 1 DB migration + 1 edge function
- Phase 5: ~10 new files + 3 DB migrations
- Phase 6: ~4 files modified

Shall I proceed with Phase 1?

