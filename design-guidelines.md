# U.Psy — Design Guidelines

## Emotional Thesis

> Calm, supportive, and quietly confident—like someone who listens before they speak.

Feels like a calm, private therapy room—warm, quiet, and deeply reassuring.

---

## Typography

### Principles
- Prioritize clarity over style
- Avoid dense text blocks
- Let content breathe

### Type System

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 / Display | 40–48px (72px display) | Semi-bold (600) | Page hero titles |
| H2 | 28–36px | Semi-bold (600) | Section anchors |
| H3 | 20–26px | Medium (500) | Sub-structure |
| Body | 16–18px | Regular (400) | Paragraphs, line-height 1.6–1.7 |
| Caption | 14px | Regular (400) | Labels, meta info |

### Font Stack
- **Primary:** Outfit (clean sans-serif, calm + modern)
- **Fallback:** Inter, system-ui, -apple-system, sans-serif

### Rules
- Max body width: 60–70 characters
- Line height: 1.6–1.8 for body text
- Letter-spacing: -0.02em for headings, 0.01em for body

---

## Color System

### Emotional Direction
Calm → Safe → Non-clinical → Slight warmth

### Palette (CSS Custom Properties)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--primary` (light) | 220 72% 50% | #2563EB | Primary actions, links |
| `--secondary` (light) | 262 60% 50% | #7C3AED | Secondary actions |
| `--accent` (light) | 160 60% 32% | #217A5B | Success, growth |
| `--burgundy` | 348 82% 26% | #7A0C20 | Brand anchor (dark mode primary) |
| `--gold-accent` | 42 100% 50% | #FFB300 | Premium highlights, dark mode primary |
| `--foreground` | 224 30% 12% | Dark text |
| `--muted-foreground` | 224 10% 42% | Soft text |
| `--background` | 225 25% 97% | Light background |

### Rules
- Maintain contrast ≥ 4.5:1 (WCAG AA)
- Avoid pure white backgrounds (use `--background`)
- Prefer soft gradients over flat harsh colors
- All colors must use HSL via CSS variables
- Never hardcode color values in components

---

## Spacing & Layout

### Grid
- Base unit: 8px
- Section padding: 80–120px (desktop), 48–64px (mobile)
- Component padding: 16–32px
- Max content width: 1200px
- Gutter: 24px

### Layout Principles
- One idea per section
- Clear vertical rhythm
- Avoid visual clutter
- Mobile-first: stack everything cleanly

### Breakpoints
- Mobile: < 768px
- Tablet: 768–1024px
- Desktop: > 1024px

---

## Motion & Interaction

### Philosophy
> Motion should support, not distract. Feedback should feel gentle, not mechanical.

### Rules

| Property | Value | Usage |
|----------|-------|-------|
| Duration (UI) | 150–300ms | Buttons, toggles, inputs |
| Duration (emphasis) | 300–500ms | Section reveals, modals |
| Duration (ambient) | 600–800ms | Background animations |
| Easing | ease-out / cubic-bezier(0.25, 0.1, 0.25, 1) | All transitions |

### Motion Language

| Pattern | Usage | Duration |
|---------|-------|----------|
| Float | Hero objects, decorative icons | 6s infinite |
| Pulse | Emotional states, AI indicators | 3s infinite |
| Breathe | Loading states | 2.4s infinite |
| Orbit | Cognitive/learning metaphors | 12s infinite |
| Flow | Data/insights wave | 8s infinite |
| Fade-rise | Section entrance | 500ms once |

### Interactions

| Element | Hover Effect |
|---------|-------------|
| Cards | translateY(-6px) + enhanced shadow |
| Buttons | scale(1.02–1.05) + shadow |
| Links | Underline animation (scaleX) |
| Section load | Fade-in (opacity + translateY) |

### Avoid
- Aggressive spinners
- Sudden jumps
- Flashy/distracting animations
- Animations > 800ms for UI elements

---

## Voice & Tone

### Personality
Calm • Supportive • Non-judgmental • Human

### Microcopy Examples

| Context | Copy |
|---------|------|
| Onboarding | "Let's take this one step at a time." |
| Success | "You're making progress. Keep going." |
| Error | "Something went wrong. We're here to help." |
| Trust | "You're in safe hands." |
| CTA | "Start with a 2-minute check-in" |

---

## System Consistency

### Design Anchors
- Apple HIG → warmth + clarity
- Linear → clean structure
- Headspace → emotional tone

### Patterns
- Cards = safe containers
- Rounded corners (softness via `--radius-card: 20px`)
- Clear hierarchy always visible
- Glass morphism for depth and layering

---

## Accessibility

- Semantic HTML structure (proper heading hierarchy)
- Keyboard navigable (all interactive elements)
- Visible focus states (gold outline + shadow)
- No color-only meaning
- Readable font sizes (minimum 14px)
- `prefers-reduced-motion` respected
- Alt text on all images

---

## Emotional Audit Checklist

- [ ] Does this feel safe within 3 seconds?
- [ ] Does any element create stress?
- [ ] Is the next step obvious without thinking?
- [ ] Does the UI feel patient, not demanding?

## Technical QA Checklist

- [ ] Typography follows scale
- [ ] Spacing consistent (8pt grid)
- [ ] Contrast passes WCAG AA+
- [ ] Motion within 150–300ms for UI
- [ ] No layout shifts during load
- [ ] All colors use design tokens (no hardcoded values)
