
# Kinetic Hero Section

## What changes

The hero headline becomes alive with motion. Each session randomly picks one of four animation styles, and the headline cycles through **problem → solution** word pairs.

### Word pairs (problem → solution)

| Problem | Solution |
|---------|----------|
| Burnout | Recovery |
| Anxiety | Clarity |
| Stress | Balance |
| Self-doubt | Confidence |
| Overwhelm | Focus |
| Disconnection | Resilience |

### Four animation modes (random per session)

1. **Rotating words** — The highlight word in the headline fades/slides up through the pairs on a 3-second loop (e.g., "Psychology, Built for **Burnout** → **Recovery**")
2. **Staggered word entrance** — Each word in the headline slides in one by one with a 80ms stagger delay on first load
3. **Typewriter effect** — The subtitle types itself out character by character after the headline lands
4. **Floating background elements** — Soft keyword pills ("CBT", "EMDR", "Schema", "Resilience") and abstract shapes drift slowly behind the text

On each page load/session, one mode is selected at random. The rotating word pairs always run regardless of mode (they are the core motion).

### Technical approach

**File: `src/components/home/HeroSection.tsx`**
- Add a `useEffect` that picks a random animation mode and stores it in local state
- Create a `RotatingWord` component using Framer Motion `AnimatePresence` to cycle through the problem→solution pairs every 3 seconds (fade-up in, fade-down out)
- Add `StaggeredHeadline` variant — wraps each word in a `motion.span` with `delay: index * 0.08`
- Add `TypewriterSubtitle` variant — reveals subtitle character by character via a `useState` + `setInterval`
- Add `FloatingKeywords` — 6-8 absolutely positioned `motion.div` pills with slow infinite drift animation (`y: [0, -15, 0]`, duration 6-10s, random delay)
- All animations use Framer Motion only (per project constraints)
- The intent-reactive content swap remains — these kinetic effects layer on top

**No new dependencies.** Pure Framer Motion + CSS.

### Mobile behavior
- Floating keywords hidden on screens < 768px (too cluttered)
- Stagger timing reduced on mobile for snappier feel
- Rotating word container has fixed height to prevent layout shift
