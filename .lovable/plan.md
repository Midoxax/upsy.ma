## Goals

Address 5 work items in priority order. Items 1–2 are urgent user-facing bugs; 3–5 are security/QA hardening.

---

## 1. Fix "Send meeting link" 500 error (URGENT)

**Root cause confirmed in logs:**
```
new row for relation "bookings" violates check constraint "bookings_payment_status_check"
```
`send-meeting-link/index.ts` inserts `payment_status: "comp"`, but the DB CHECK constraint only allows `'unpaid' | 'paid' | 'refunded'`.

**Fix:** Change the insert in `supabase/functions/send-meeting-link/index.ts` from `payment_status: "comp"` to `payment_status: "paid"` (the session is comped/auto-confirmed by the psychologist, no payment owed by client). Track the "comp" semantics via `amount_mad: 0` + a note in `patient_notes`, or add a small migration extending the CHECK to include `'comp'`. Recommended: extend the CHECK constraint to add `'comp'` so reporting can distinguish complimentary sessions from real paid ones.

**Test after fix:** call the function via `supabase--curl_edge_functions` with a test payload, confirm 200 + booking row created.

---

## 2. Sticky language selection (URGENT UX)

**Root cause in `src/contexts/LocaleContext.tsx`:**
The `// Sync locale with URL changes` effect calls `setLocaleState(getLocaleFromPath(location.pathname))` on every URL change. `getLocaleFromPath` returns `'en'` as the default for any path missing `/fr` or `/ar` prefix. So when a user picks French, then clicks any internal `<Link to="/psychologists">` (no prefix), the locale flips back to English.

**Fix:**
- When a non-prefixed path is visited and the user's saved cookie is `fr` or `ar`, redirect to the prefixed equivalent (`/fr/psychologists`) instead of switching state to `en`.
- Audit `<Link>` / `navigate()` calls in headers/menus to use locale-aware paths via a helper (`addLocalePrefix(path, locale)`); fix the most common offenders (Header, MegaMenu, Footer, RoleRouter).
- Keep the cookie as the source of truth; URL syncs only when an explicit prefix exists.

---

## 3. Invoice HTML escaping + stored-XSS test

In `supabase/functions/generate-org-invoice/index.ts`:
- Audit every `${...}` interpolation into HTML; ensure each runs through the existing `escapeHtml()` helper. Cover: `name`, `billing_address`, `ice`, `rc_number`, `if_number`, `contact_email`, `pdf_signature_label`, `plan_type`, `invoice_number`, member email/name, period strings.
- For URLs (`logo_url`, `pdf_logo_url`), validate they start with `https://` and escape as attribute values; reject `javascript:` / `data:` schemes.
- Add `supabase/functions/generate-org-invoice/index.test.ts` (Deno.test) that:
  1. Seeds an org with payloads like `<script>alert(1)</script>` and `" onerror=alert(1) x="` in name, address, ICE.
  2. Invokes the function and asserts the resulting HTML contains escaped entities (`&lt;script&gt;`) and no raw `<script>`, no unescaped `onerror=`.

---

## 4. Security regression tests (RLS / PHI)

Add `supabase/functions/_tests/security_regression.test.ts` (Deno) using `dotenv/load.ts` per the testing guide. Create 5 throwaway auth users (client A, client B, specialist, business owner, "hacker" = unauth + unrelated user) and assert:

- **bookings**
  - Client A cannot SELECT client B's bookings (RLS denies).
  - Specialist sees only their own.
  - Hacker (unauth) gets 0 rows.
  - `get_booking_by_token(valid_token)` returns the row to anon.
  - `get_booking_by_token(expired_token)` returns 0 rows.
  - `get_booking_by_token('garbage')` returns 0 rows.
- **recommend** edge function
  - Anon call → returns FALLBACK only, never user-scoped data.
  - Sending another user's id in body is ignored (function uses JWT).
- **org_pulse_responses / org_pulse_surveys**
  - Member of org X can submit; member of org Y cannot submit to X's survey.
  - Org owner of X can SELECT responses for X only.
  - Random user cannot SELECT any responses.
- **PHI tables** (mood_entries, journal_entries, client_anamneses, session_notes)
  - Cross-user SELECT returns 0; UPDATE/DELETE denied.

Test asserts both row counts and that error codes are RLS denials (`42501` / empty result), not 500s. Cleanup runs in `afterAll` style block.

---

## 5. Rate limiting for high-risk edge functions

Backend has no shared rate-limit primitive (per directive). Implement a lightweight DB-backed limiter for `crisis-screening` and `ai-assistant` only.

**Migration:** new table `edge_rate_limits(key text pk, window_start timestamptz, count int)` with a SECURITY DEFINER RPC `check_and_increment_rate_limit(_key text, _max int, _window_seconds int) returns boolean`. Returns `true` if allowed, `false` if over quota; resets per window.

**In each function:**
- Derive identity key: prefer `auth.uid()` from JWT, else hash of `x-forwarded-for` IP.
- `crisis-screening`: 30 req / 5 min per user, 60 / 5 min per IP.
- `ai-assistant`: 60 req / hour per user, 120 / hour per IP.
- On limit, return 429 with `{ error: "Too many requests, please slow down." }` and `Retry-After` header.
- Caller is told this is ad-hoc until proper infra exists.

---

## 6. End-to-end booking proposal flow test

Manual + scripted check via `supabase--curl_edge_functions` and `supabase--read_query`:

1. Specialist creates a proposal (status='proposed', token + 48h expiry).
2. Anon hits `/booking-response?token=...`; `get_booking_by_token` returns row → page renders.
3. Client accepts → status flips to 'confirmed', token cleared.
4. Re-fetching with same token returns 0 rows.
5. Manually expire a token (`UPDATE bookings SET proposal_expires_at = now() - interval '1 hour'`); fetch returns 0 rows.
6. Patient B (different account) cannot SELECT this booking via direct table query.

Capture results in a short audit note.

---

## Files to change

**Code**
- `supabase/functions/send-meeting-link/index.ts` — fix `payment_status`.
- `src/contexts/LocaleContext.tsx` — locale stickiness.
- `src/components/Header.tsx`, `MegaMenu.tsx`, `Footer.tsx`, any `navigate()` calls dropping locale prefix — locale-aware routing helper.
- `supabase/functions/generate-org-invoice/index.ts` — full escape audit + URL validation.
- `supabase/functions/crisis-screening/index.ts`, `supabase/functions/ai-assistant/index.ts` — rate limiting.

**New files**
- `supabase/functions/generate-org-invoice/index.test.ts`
- `supabase/functions/_tests/security_regression.test.ts`
- `supabase/functions/_tests/booking_proposal_flow.test.ts`

**Migrations**
- Optional: extend `bookings_payment_status_check` to allow `'comp'`.
- New: `edge_rate_limits` table + `check_and_increment_rate_limit` RPC.

---

## Out of scope
- Replacing the ad-hoc rate limiter with proper infra (waiting on backend primitive).
- Migrating all internal links to a `<LocalizedLink>` component (only fix the high-traffic offenders this round).
- WhatsApp delivery of meeting link (Meta API pending).
