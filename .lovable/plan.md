# Conversion Overhaul — U.Psy

Traffic is fine; the site isn't asking for the sale. This plan fixes the four blockers you flagged (price/trust unclear, too many paths, weak psychologist proof, booking friction), refreshes typography, and rewrites public pages to funnel every visitor into ONE next action per screen.

Guiding rule going forward: **every public page has exactly one primary CTA and one secondary CTA.** No third option above the fold.

---

## 1. Typography & visual polish (foundation)

New pairing, installed via `@fontsource` (no CDN):

- **Headings:** Fraunces (editorial serif — trust, warmth, premium clinical)
- **UI / Body:** Geist (modern, high-legibility sans — SaaS feel)
- **Numerals / price / data:** Geist Mono (pricing, timers, stats)

Kept: Outfit/Inter tokens remain as fallback so nothing breaks mid-migration.

Type scale rebuilt (mobile → desktop):
- Display 44/56, H1 36/48, H2 28/36, H3 22/26, Body 17/1.65, Small 15, Caption 13
- Max measure 68ch on body copy, 22ch on hero headlines
- Tighter tracking on serif headlines (-0.02em), looser on all-caps eyebrows (+0.12em)

Also: unify button sizes (single `hero` size for primary CTAs), stronger focus rings, remove the 3–4 competing accent colors currently on the home page in favor of Maroon primary + Gold accent only.

## 2. Homepage — one funnel, not four

Current homepage tries to serve exploring / researching / ready / skeptical simultaneously via dynamic reordering. That's diluting conversion. New structure:

1. **Hero** — one headline, one sub, ONE primary CTA "Book a session" + secondary "Take the 2-min match quiz". Kill the third link. Add: "First session guarantee — not the right fit? Free rebook."
2. **Proof bar** — logos + "1,200+ sessions delivered", accreditation, press.
3. **Featured psychologists (3)** — real cards with photo, name, credentials badge, price/session, next available slot ("Tomorrow 18:30"), instant "Book" button. This is the money section — move it up.
4. **How it works** — 3 steps max, all leading to Book.
5. **Pricing** — transparent table (see §4).
6. **Testimonials** — 3 real quotes with photos + outcome ("Anxiety score -6 in 8 weeks").
7. **FAQ (conversion-focused)** — refund, confidentiality, insurance, language, first-session process.
8. **Final CTA** — repeat hero CTA.

Retire secondary sections from the home route (Learning, Research, PSF, Community, Organizations). They stay accessible via nav but no longer compete for hero attention.

## 3. Psychologist directory + profile — proof heavy

Directory card redesign:
- Photo, name, one-line specialty, credentials badge, star rating + review count
- **Price / 50-min session** shown up front
- **Next available slot** shown up front (live from calendar)
- Single "Book" button (opens booking modal directly, no profile detour required)

Profile page: add a sticky right-rail booking widget with price, next 5 slots, and "Book now" — visible on every scroll position.

## 4. Pricing page (new)

Right now pricing is fragmented. Create `/pricing` (public) with three clear cards:
- **Single session** — MAD X, one 50-min session, video or in-person
- **Focus pack (4 sessions)** — MAD Y (save Z%), best for a focused issue
- **Ongoing care (monthly)** — MAD W/mo, weekly sessions + Nour AI + journaling

Under the cards: refund policy, what's included, how billing works, "free rebook if not the right fit". Link to it from header, hero, and every psychologist card.

## 5. Booking friction — cut steps

Current flow requires account before seeing availability. New flow:
1. Pick psychologist → see slots immediately (no login)
2. Pick slot → email + phone only (magic-link account created in background)
3. Pay → confirmed

Add: express Google sign-in on the payment step. Preserve pending booking through auth redirect (already partially wired). Post-booking screen shows Jitsi link + calendar add + "prepare for your session" checklist.

## 6. Copy rewrite (all client-facing pages)

Every headline and CTA rewritten against: **specific, benefit-first, one-verb CTAs**. Examples:
- "Take the First Step" → "Book your first session"
- "Browse Specialists" → "See psychologists available this week"
- "Run Your Diagnostic" → "Take the 2-min match quiz"

Pages in scope for copy pass: Home, Psychologists, Psychologist profile, Get Matched, Pricing (new), Services, Membership, For Athletes, For Organizations, Contact, Auth, Footer.

## 7. Trust layer (site-wide)

- Sticky footer trust strip: "Accredited psychologists · Encrypted sessions · Law 09-08 compliant · Free rebook guarantee"
- Add security/confidentiality mini-page linked from footer + booking
- Real testimonials with photos + first name + city (with consent) replace generic quotes
- Add review counts + average rating to psychologist cards, backed by existing reviews table

## 8. B2B path (kept separate, not diluting B2C)

Single entry point `/for-organizations` with one CTA → proposal request form. Removed from home hero. Nav item stays.

---

## Order of work (so you see revenue impact fast)

1. Type system + button/CTA unification (site-wide, 1 pass)
2. Homepage rebuild (biggest conversion lever)
3. Psychologist card redesign + directory
4. Pricing page (new)
5. Booking flow: slot-before-signup
6. Profile page sticky booking rail
7. Copy pass across remaining public pages
8. Trust strip + FAQ + testimonials

Each step is shippable independently — you don't wait for the whole thing to see lift.

---

## Technical notes

- Fonts: `bun add @fontsource/fraunces @fontsource/geist-sans @fontsource/geist-mono`, import in `src/main.tsx`, register in `tailwind.config.ts` as `font-display`, `font-sans`, `font-mono`. Keep existing Outfit/Inter tokens as fallback for one release.
- Homepage: simplify `src/pages/Index.tsx` — remove dynamic reorder for the retired sections; keep intent engine only for micro-copy variants in hero.
- New route `/pricing` → `src/pages/Pricing.tsx` (file exists, will be rewritten).
- Booking flow: adjust `useBooking`, `BookingWidget`, `BookingModal` to allow slot selection pre-auth; defer account creation to the payment step via magic link.
- No schema changes required for phases 1–7. Phase 8 (rating aggregate on cards) may add a small view over `reviews` — will surface a migration then.
- Everything stays within the locked design memory (Maroon/Beige/Gold, no heavy 3D, Framer only).

## What I need from you before building

- Confirm the 3 pricing tiers and the actual MAD amounts (or say "use current values from `platform_pricing`").
- Confirm the "free rebook if not the right fit" guarantee is something you'll honor — it's the single strongest trust lever.
- 3 real testimonials (name, city, one-line outcome, optional photo) — or approval to use placeholder quotes marked as such until you provide real ones.
