# Platform QA — 5 personas

I'll run a structured audit of the platform from 5 viewpoints: **Client**, **Specialist (psychologist)**, **Business (organization)**, **Admin**, **HIPAA/privacy reviewer**, and **Security hacker**. Each persona has a clear test list, and I already have a baseline of confirmed issues from the latest security scan + Supabase auth logs.

## What "test" means here

I will not click through the live UI as a real user (browser automation is reserved for explicit interactive testing). Instead I'll do a **deep code + database + logs audit per persona**, then deliver:

1. A pass/fail checklist per role
2. A prioritized list of bugs / risks found
3. Fixes implemented for the critical ones (security + the broken admin user list)
4. A short list of items that need your decision before I change them

---

## Already-confirmed issues (from scan + logs)

Three are critical and I'll fix them in this pass:

1. **`recommend` edge function leaks any user's mood/stress data** — accepts `user_id` from request body, queries `mood_entries` with service role. Anyone can pull any patient's mental health timeline.  *(HIPAA + Security)*
2. **`bookings` RLS policy "Public token holders can read proposal"** — returns every active proposal to anyone, not just the row matching their token. Exposes patient emails, notes, payment status. *(HIPAA + Security)*
3. **Admin user list is broken in production** — auth log shows `GET /admin/users → 500: converting NULL to string is unsupported (confirmation_token)`. Admin "Users" tab can't load. *(Admin)*

Plus two warns:
4. **Stored XSS in org invoice HTML** — org fields (`name`, `billing_address`, `ice`, etc.) interpolated unescaped, then rendered via `document.write`. Malicious org → script in admin's browser. *(Security + Admin)*
5. **`org_pulse_responses`** has no SELECT policy for org owners — owners can't read their own survey results without going through `org_pulse_aggregate` RPC. Confirm intent, otherwise add owner policy. *(Business)*

---

## Persona test matrix

### 1. Client (patient)
Flows audited from code:
- Signup / Google sign-in / email verification (`Auth.tsx`, `AuthContext`)
- Browse psychologists, filters, profile page, booking widget
- Booking flow + payment (`create-booking-payment`, `simulate-payment-webhook`)
- Booking proposal accept/decline via email link (`/booking/respond/:token`, `BookRedirect`)
- Patient dashboard: mood, journal, anamnesis, sessions, video call
- Crisis screening, AI assistant (Nour), assessments
- Idle auto-logout (24h default)

### 2. Specialist (psychologist)
- Apply wizard + accreditation docs upload
- Provisioning after approval (`provision-psychologist`)
- Profile tab + new **photo uploader** (just shipped)
- Availability tab (replace_availability_for_day)
- Leads, Sessions, Session notes (encrypt/decrypt), Earnings, Pricing
- Propose session + Send meeting link (just shipped)
- Share booking link card (just shipped)
- Idle logout 30 min (privileged role)

### 3. Business (organization)
- Apply as organization, invite members (`invite_org_member` — recently hardened)
- Org dashboard: overview, users, programs, billing, branding, pulse, reports, analytics
- Generate invoice PDF/HTML
- Pulse survey k-anonymity (≥5 responses) — already enforced in RPC ✅

### 4. Admin
- Admin dashboard, applications queue, approve/reject + email
- User management (search, suspend, force sign-out, assign roles, delete)
- Pricing control, accreditation manager, transactions, subscriptions
- Translation manager, learning hub, matching requests, org applications
- Audit log

### 5. HIPAA / privacy reviewer
- PHI tables: `session_notes` (encrypted), `mood_entries`, `journal_entries`, `assessment_results`, `anamnesis_*`, `crisis_*`
- RLS coverage on all PHI
- Audit logging on sensitive changes (`log_sensitive_change` trigger)
- Encryption at rest for notes (`encrypt-note`/`decrypt-note` + pgsodium)
- Data subject rights (Moroccan Law 09-08 notice present ✅)
- Idle timeout for clinical roles (30 min ✅)
- Email verification before login (no anon signups ✅)

### 6. Security hacker (red-team checklist)
- Edge functions accepting trusted IDs from body without JWT check
- RLS policies with overly permissive `USING (true)` or token-leak patterns
- Direct service-role usage in user-facing functions
- XSS via `document.write` / `dangerouslySetInnerHTML`
- IDOR on `/booking/respond/:token`, `/b/:slug`, `/session/:id`
- Storage bucket policies (`psychologist-photos`, `accreditation-docs`, `user-documents`)
- Rate limiting on auth + sensitive RPCs
- Open CORS on edge functions
- SQL injection via `execute_sql`-style RPCs (none expected)

---

## What I'll fix in this pass

**Critical (no questions asked):**

1. **`recommend` edge function** → require `Authorization` header, derive `user.id` from `auth.getClaims()`, drop service-role client, ignore body `user_id`.
2. **Booking proposal RLS** → drop the broad public policy. Replace with a SECURITY DEFINER RPC `get_booking_by_token(_token text)` that returns only the matching row and only if not expired. Update `BookingResponse.tsx` to call the RPC.
3. **Admin users 500** → root cause is `supabase.auth.admin.listUsers()` choking on NULL `confirmation_token` from a Postgres driver mismatch. Fix by switching the admin user list to `admin_list_users_rich` (already exists, queries `auth.users` directly via SQL) instead of the `auth.admin.listUsers()` JS call. Verify all admin user-management surfaces use it.
4. **Org invoice XSS** → add `escapeHtml()` in `generate-org-invoice` and wrap every interpolated org field. Mirror the pattern from `generate-certificate`.

**Warn (also fixed in same pass):**

5. **Org pulse owner read** → add SELECT policy on `org_pulse_responses` allowing org owners to read their org's rows (raw responses are still anonymous because `user_id` is nullable). Or, if you prefer aggregate-only, leave as-is and I'll just document it.

**Audit deliverable (no code change, just a report):**

6. Per-persona pass/fail list with everything else I checked (storage policies, IDOR surfaces, RLS coverage, idle timeout, CORS, etc.).

---

## Out of scope for this pass

- Live click-through testing in the browser (will do only if you explicitly ask)
- Penetration testing tools (Burp, ZAP) against the live deployment
- Load / rate-limit testing
- Mobile-device testing
- Re-auditing the items already fixed in the previous security pass (admin function auth, invite_org_member ownership, pricing config RLS) unless the new audit surfaces a regression

---

## Files I expect to touch

- `supabase/functions/recommend/index.ts`
- `supabase/functions/generate-org-invoice/index.ts`
- `src/pages/BookingResponse.tsx` (and possibly `BookRedirect.tsx`)
- `src/components/admin/UserManagement.tsx` + any hook that calls `auth.admin.listUsers()`
- New migration:
  - drop + replace booking proposal token policy
  - create `get_booking_by_token` RPC
  - add owner SELECT policy on `org_pulse_responses` (pending your call)

After the fixes I'll mark the corresponding security findings as resolved and post the full per-persona QA report in chat.
