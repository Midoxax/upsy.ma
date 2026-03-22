

## Plan: Replace Hero Whisper with U.Psy Logo

**What changes:**
- Remove the `hero.whisper` text line from `HeroSection.tsx`
- Replace it with the U.Psy logo (`src/assets/logo.webp`, already used in the Header)
- Logo displayed small (e.g. `h-10`) above the headline, with the same fade-in animation
- Keep the `hero.trustWhisper` line below CTAs (or remove it too — your call)

**Why it works:**
- Instant brand recognition in the hero
- More professional than a whisper sentence
- Reinforces trust through visual identity
- Aligns with premium platform feel

**File modified:**
- `src/components/home/HeroSection.tsx` — swap whisper `<p>` for logo `<img>`

**No other files affected.**

