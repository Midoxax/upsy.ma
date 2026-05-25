## Goal
Add a new **luxe editorial light theme** ("Frosted Crystal Museum") to U.Psy. Apply it to the homepage and key landing pages (Why Us, Pricing, Founder, Services). The existing dark burgundy/gold theme stays exactly as-is and remains the default — users get this new look only when they toggle to light mode.

Composition, hierarchy, and tokens come straight from the selected prototype — no re-derivation.

## Design tokens (locked from the prototype)

Colors (light theme only):
- Canvas: `#F8F4EE` (ivory pearl)
- Surface glass: `rgba(255,255,255,0.30–0.40)` + `backdrop-blur-xl/2xl` + `border-white/60`
- Ink / type: `#1A1A1A`
- Burgundy (emotional accent): `#6D0F22`
- Crimson (shadow layering): `#3D0611` — used only inside long-shadow rgba (`rgba(61,6,17,0.08–0.12)`)
- Gold (identity, CTA, highlights): `#F2B705`
- Ambient backgrounds: burgundy 5% blur and gold 10% blur orbs in corners

Typography:
- Display / italic accents: **Fraunces** (italic, weights 400/600)
- Body + UI: **Manrope** (400/500/700)
- Micro-labels / stat captions: **JetBrains Mono** (500)
- Loaded via `@fontsource/*` packages and imported in `src/main.tsx` (no CDN, no `<link>` in `index.html`)

Surface system:
- `radius-card: 20px` kept; pills (`rounded-full`) for CTAs
- Soft long shadow: `0 32–40px 64–80px -16/-20px rgba(61,6,17,0.08–0.12)`
- Gold glow on primary CTA: `0 20px 40px -10px rgba(242,183,5,0.4)` → hover `0.6`
- Hover language: `-translate-y-1/2`, `scale-105`, sheen overlay on gold buttons, arrow `translate-x-1`

## Implementation plan

### 1. Fonts + tokens (foundation)
- `bun add @fontsource/fraunces @fontsource/manrope @fontsource/jetbrains-mono`
- Import in `src/main.tsx`
- Extend `tailwind.config.ts` `fontFamily`: `fraunces`, `manrope`, `mono`
- In `src/index.css`, replace the **light-mode** `:root` HSL tokens with the new palette (background, foreground, primary=gold, accent=burgundy, muted, card, border). Add new tokens: `--glass-bg`, `--glass-border`, `--shadow-crystal`, `--shadow-gold-glow`. Add a `.glass-card` light variant (white/30 + 60 border + crystal shadow). Dark-mode block untouched.

### 2. Global primitives
- `src/components/ui/button.tsx`: keep existing variants. Add a `crystal` variant (white/40 + blur + border + hover gold border).
- `src/components/ui/card.tsx`: `.glass-card` already used; CSS update in step 1 retunes it for light mode automatically.

### 3. Homepage sections (`src/components/home/*`)
Reskin only — keep all copy, structure, and translation keys:
- **HeroSection** — match prototype exactly: logo crystal chip, h1 with Fraunces italic "Stress", two floating 3D cards (`System Status / Clinical Precision` and `Readiness Score 94%`) absolutely positioned with rotate + hover-lift, gold pill CTA + glass secondary + AI tertiary, 3-column divided stat strip with Mono labels.
- **WhyUsSection, PillarsSection, MethodsMetricsBand, FeaturedPsychologistsSection, TestimonialsSection, FounderSection, FinalCTASection** — wrap content in `glass-card` containers, apply Fraunces italic for accent words inside H2s, swap H1/H2 to Manrope 500/700, captions to Mono, ensure every card has `hover:-translate-y-1 hover:shadow-crystal` and gold underline-on-hover for stat groups.
- Decorative atmosphere: add two ambient blur orbs (burgundy 5% top-left, gold 10% bottom-right) at the page wrapper so the whole homepage breathes the museum vibe.

### 4. Landing pages
Apply same reskin pattern to:
- `src/pages/WhyUs.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/Founder.tsx`
- `src/pages/Services.tsx`

Only visual layer — no copy, route, or logic changes.

### 5. Header & Footer
- `src/components/Header.tsx`: light-mode pass — frosted bar `bg-white/40 backdrop-blur-xl border-b border-white/60`, gold underline on hover for nav items.
- `src/components/Footer.tsx`: matching crystal panel with hairline gold dividers.

### 6. QA
- Toggle theme on `/`, `/why-us`, `/pricing`, `/founder`, `/services` → verify dark mode unchanged, light mode shows luxe glass with all hovers working.
- Mobile viewport: floating hero cards collapse below 768px (stack/hide rotated cards), CTAs stay sticky-friendly.
- Check existing translation keys still render (EN/FR/AR including RTL).

## Out of scope
- Dark theme (untouched)
- Dashboards (`/my-space`, `/admin`) — they're product UI, not marketing surfaces
- Copy, i18n strings, routes, business logic
- Any 3D libraries — pure CSS/Tailwind + Framer Motion only

## Figma
No Figma needed for this build. If you want to push fidelity further later, enable the Figma Desktop MCP (Figma → Dev Mode → "Enable desktop MCP server" → Lovable Settings → Connectors → Local MCP servers) and drop frames into chat — I can match them tighter on a follow-up pass.