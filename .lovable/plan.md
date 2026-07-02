# Apply audit fixes from `UPsy_ma_perfected.zip`

The uploaded archive contains a technical audit (`AUDIT_UPsy_ma.md`) with 7 targeted fixes. Each is small, isolated, and independently verified against the current codebase — none conflict with recent work.

## Changes

1. **RGPD deletion bug (blocker)** — `src/components/dashboard/DataPrivacyTab.tsx`
   The current code inserts into `support_tickets.description`, a column that does not exist. Every "Delete my data" request fails in production. Fix follows the canonical `useSupportTickets` pattern: create the ticket, then insert the message into `support_ticket_messages`.

2. **Type error** — `src/hooks/useProposeSession.ts`
   Replace the `Record<string, unknown>` update payload with an explicit shape compatible with the generated `bookings` `Update` type.

3. **GTM 404 on every page + CSP gap** — `index.html` + `vercel.json`
   - Guard the GTM loader so it only fires when `{{GTM_ID}}` has actually been substituted; otherwise just init `dataLayer`.
   - Add `www.googletagmanager.com` to `script-src` and `connect-src`, and `*.google-analytics.com` to `connect-src`.

4. **Bundle splitting** — `vite.config.ts`
   Add `manualChunks` for react, router, supabase, framer-motion, radix, tanstack-query, gsap. Main bundle drops from ~353 kB gzip to ~151 kB gzip; vendors become independently cacheable.

5. **Open Graph / Twitter metadata** — `index.html`
   Add `og:site_name`, `og:title`, `og:description`, `og:locale` (+ fr/ar alternates), `og:image:width/height`, `twitter:title`, `twitter:description`.

6. **.env hygiene** — `.gitignore` + `.env.example`
   Add `.env` to `.gitignore` and create an empty `.env.example`. (Not deleting the existing `.env` — Lovable manages it.)

7. **Portability** — `package.json`
   Swap `bunx` → `npx` in `predev`, `prebuild`, `sitemap`, `test:visual` so builds work in non-Bun CI environments.

## Out of scope

The audit's backlog (any-cast debt, exhaustive-deps warnings, HeroScene mobile fallback, `unsafe-eval` removal, Recharts v3, prerendering) is not applied — flagged for later.

## Verification

Automatic build check after edits. No DB migrations, no runtime behavior changes beyond fixing the RGPD insert.
