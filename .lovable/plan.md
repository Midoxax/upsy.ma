# Dynamic Homepage Redesign — Process Academy Style

## What Process Academy Does That We Want

The Process Academy site is a **scroll-driven storytelling experience** with these standout features:

1. **Bold organic SVG shapes** — Large colored blobs (orange yellow, vine red) that create visual "rooms" as you scroll, replacing flat section backgrounds
2. **Floating decorative elements** — Triangles, circles, X-shapes, and dashed path lines scattered across sections, gently animated
3. **A mascot character (man in labiranth)** that appears at transitions, reacts to content, and guides the user through the page with speech bubbles
4. **Scroll-triggered content reveals** — Cards, text blocks, and images animate into view as you scroll (not all loaded at once)
5. **Content tiers with visual identity** — Each content tier (Brainsnack, Microlearning, Gigalearning) has its own color, icon, and section shape
6. **Interactive card carousels** — Horizontally scrollable content cards within sections
7. **Playful typography** — Large bold sans-serif headlines with supporting descriptive text

## How This Adapts to U.Psy

We keep the existing intent-engine, section ordering, and clinical branding. The change is purely **visual and interaction design**.

### 1. Organic Section Backgrounds

Replace flat `bg-background` sections with SVG wave/blob dividers between sections. Each major section gets a themed background shape:

- Hero: warm beige base with a maroon organic blob
- Self-Assessment: soft gold wave transition
- Featured Psychologists: neutral with floating neural-node decorations
- Programs/Learning: blue-tinted wave section

Implementation: Create a `SectionDivider` component using inline SVGs with `viewBox` preservation. CSS `clip-path` for simpler shapes.

### 2. Floating Decorative Elements

Add a `FloatingDecorations` component that renders small SVG shapes (circles, triangles, dots, dashed paths) positioned absolutely within sections. These use Framer Motion `float` animations (already in the motion language: 300-800ms).

Shapes use the brand palette: Deep Maroon circles, Muted Gold triangles, Soft Beige dots.

### 3. Scroll-Triggered Section Reveals

Enhance the existing `ScrollReveal` component to support multiple animation variants:

- **Slide up + fade** (current default)
- **Scale from center** (for hero-adjacent sections)
- **Stagger children** (for card grids)

Each homepage section wrapper gets scroll-triggered entrance animations using Intersection Observer (already used in `useIntentSignals`).

### 4. Mascot / Guide Character

Introduce a simple illustrated character (a "neural guide" — fits the brain/psychology brand) that appears at 2-3 scroll breakpoints with speech bubbles:

- After Hero: "Let's explore what fits you"
- Before Assessment: "Quick check — 2 minutes"
- Before CTA: "Ready to take the next step?"

Implementation: A `ScrollGuide` component using Framer Motion `whileInView`. Character is a static SVG/illustration (can use the existing BreathingOrb concept expanded into a face/character, or a simple emoji-style illustration rendered as SVG).

### 5. Interactive Content Cards

In sections like Programs, Learning, and Featured Psychologists — add horizontal scroll carousels on mobile and animated grid reveals on desktop. Cards tilt slightly on hover (CSS `perspective` + `rotateY`).

### 6. Hero Section Enhancements

- Add a large organic background shape (maroon/gold gradient blob) behind the hero text
- Add a dashed animated path SVG (like Process Academy's dotted trail) connecting the hero to the next section
- Floating decorative shapes around the edges

### 7. Narrative Connector Upgrade

Replace the current minimal `NarrativeConnector` (just a gradient line) with organic SVG wave dividers that match the section color transitions.

---

## Files to Create/Edit


| File                                                   | Action | Purpose                                                                        |
| ------------------------------------------------------ | ------ | ------------------------------------------------------------------------------ |
| `src/components/home/SectionDivider.tsx`               | Create | SVG wave/blob dividers between sections                                        |
| `src/components/home/FloatingDecorations.tsx`          | Create | Decorative SVG shapes (circles, triangles, paths)                              |
| `src/components/home/ScrollGuide.tsx`                  | Create | Mascot character with speech bubbles at scroll points                          |
| `src/components/home/HeroSection.tsx`                  | Edit   | Add organic blob background, dashed path, floating shapes                      |
| `src/pages/Index.tsx`                                  | Edit   | Replace NarrativeConnector with SectionDivider, add ScrollGuide at breakpoints |
| `src/components/home/FeaturedPsychologistsSection.tsx` | Edit   | Add horizontal scroll carousel and card hover tilt                             |
| `src/components/home/ProgramsSection.tsx`              | Edit   | Add card carousel and scroll-reveal stagger                                    |
| `src/components/home/LearningSection.tsx`              | Edit   | Add card carousel                                                              |
| `src/index.css`                                        | Edit   | Add organic shape CSS utilities, card tilt transforms                          |


No database changes needed. No new dependencies — uses Framer Motion (already installed) and inline SVGs.

### Scope Note

This is a large visual overhaul. I recommend implementing it in 2 passes:

- **Pass 1**: Section dividers, floating decorations, hero blob, enhanced narrative connectors
- **Pass 2**: Scroll guide mascot, card carousels, hover effects