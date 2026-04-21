

## Big Push: Audit-Ready Accreditation + Multilingual Emails + Anamnesis Polish + Dashboard Cleanup

This wraps the accreditation flow into a true production-grade system, finishes the anamnesis loop with reminders + per-org branding + admin-editable copy, and tightens every dashboard link.

---

### 1. Multilingual emails (EN/FR/AR)

**Welcome / approval email** (`provision-psychologist`) and **rejection email** (`send-rejection-email`) become locale-aware.

- Read locale from `application.preferred_locale` (new column, default `fr`) → falls back to FR.
- New shared file `supabase/functions/_shared/email-templates/accreditation/{approval,rejection}.tsx` returning `{ subject, html }` for `en | fr | ar` (RTL `dir="rtl"` for Arabic, U.Psy maroon/gold styling).
- `provision-psychologist` & `send-rejection-email` import the right template by locale.
- Migration: `ALTER TABLE psychologist_applications ADD COLUMN preferred_locale text DEFAULT 'fr' CHECK (preferred_locale IN ('en','fr','ar'))`. Apply form (`Apply.tsx`) sets it from current `LocaleContext`.

---

### 2. Provisioning audit + structured logs

**New table `provisioning_attempts`:**
```
id, application_id, admin_user_id, user_id (nullable),
status ('success'|'failure'), reused_existing_user bool,
error_code text, error_message text, duration_ms int,
steps jsonb,        -- [{step:'auth_user', ok:true, ms:120}, ...]
created_at timestamptz
```
RLS: admins read/write; nobody else.

**`provision-psychologist` rewrite:**
- Wrap each step (auth, role upsert, profile, subscription, app update, email) in a timed try block, push `{step, ok, error, ms}` into a local `steps` array.
- Use `console.log(JSON.stringify({ event, applicationId, userId, reusedExistingUser, step, ms }))` so logs are queryable.
- On finish (success OR failure), insert one row into `provisioning_attempts`.
- Return shape extended:
  ```json
  { success, userId, reusedExistingUser, errorCode?, errorMessage?, attemptId, steps }
  ```

---

### 3. Retry-friendly approval flow + admin notification panel

**Edge function:**
- Pre-flight: if `application.status === 'approved'` AND profile + role + subscription already exist → return `{ success: true, alreadyProvisioned: true, userId }` (idempotent re-run).
- If `status === 'approved'` but pieces are missing → finish the missing pieces only, mark `attempt.status='success'` with `partial: true`.
- Surface precise `errorCode` per step (`AUTH_CREATE_FAILED`, `ROLE_UPSERT_FAILED`, `PROFILE_INSERT_FAILED`, `SUBSCRIPTION_INSERT_FAILED`, `APP_UPDATE_FAILED`, `EMAIL_SEND_FAILED`).

**UI — `AccreditationManager.tsx`:**
- Approve button no longer auto-fires. Opens enhanced `ApprovalModal`:
  - Pre-flight summary (account exists? profile exists? subscription exists?) fetched via a small RPC `inspect_provisioning_state(app_id)`.
  - "Approve & provision" → mutation.
- New **Provisioning Result Banner** under each row with `attemptId`:
  - ✅ Created new account / 🔁 Reused existing account / ⚠️ Partial (with missing steps) / ❌ Failed (with `errorCode + errorMessage + Retry` button).
- New **"Provisioning Audit" sub-tab** inside Accreditation: timeline of all `provisioning_attempts` (filter by app, by status), shows `steps` jsonb prettified.

---

### 4. Anamnesis: reminders + admin-editable copy + per-org PDF branding

**A. Reminder workflow**
- New table `anamnesis_reminders (id, client_id, booking_id, anamnesis_id, due_at, sent_at, status)`.
- Edge function `anamnesis-reminder-cron` (scheduled via `pg_cron` every 6h): for every booking in next 72h where the client's `client_anamneses.status != 'completed'`, enqueue/send an email + create an in-app `notifications` row.
- Client dashboard `AnamnesisCard.tsx`: shows progress %, list of missing required steps, "Resume intake" CTA, and a "Reminder sent X days ago" badge.

**B. Admin translations editor for anamnesis**
- Extend existing `translation_overrides` (already used by `TranslationManager`) — no new table.
- New `AnamnesisCopyEditor.tsx` admin component (sub-tab in Translation Manager) filtered to keys `anamnesis.*` and `consent.law_09_08.*`, with a 3-column EN/FR/AR editor and live preview of the question.
- `AnamnesisDrawer` reads through the existing `t()` helper → overrides take effect without redeploy.

**C. Per-org PDF branding**
- Add to `organization_accounts`: `pdf_logo_url text`, `pdf_primary_color text`, `pdf_signature_label text`.
- New `OrgBrandingTab` in Organization Dashboard to upload logo + pick color + set signature label (e.g., "Therapist signature", "Date").
- Anamnesis PDF generator (`anamnesis-pdf` edge function): if the requesting psychologist belongs to an org, fetch its branding and apply (header logo, accent color, footer signature line). Falls back to U.Psy default branding.

---

### 5. Edge function tests (Deno)

`supabase/functions/provision-psychologist/index.test.ts` covering:
- ✅ Happy path: new email → user created, role/profile/subscription inserted, attempt row written.
- ✅ Idempotent: existing email → `reusedExistingUser=true`, no duplicate role/profile/subscription.
- ✅ Re-run on already-approved app → `alreadyProvisioned=true`, no side effects.
- ✅ Partial recovery: pre-existing user + missing subscription → only subscription created.
- ✅ Rollback: simulate profile insert failure for a freshly-created user → auth user is deleted, attempt logged as failure.
- ✅ Validation: bad uuid → 400.
- ✅ Unauthorized: non-admin caller → 403/Unauthorized.

Tests load `.env` via Deno dotenv per the testing guide and use a dedicated test schema prefix to avoid polluting production tables.

---

### 6. Dashboard polish: every link valid, accreditation tab neat

**Audit + fix:**
- Walk every nav target in `Header.tsx`, `MegaMenu.tsx`, `Footer.tsx`, all dashboard tabs (Specialist, Patient, Org, Admin), and `RoleRouter`. Replace dead/duplicate routes, add missing ones to `App.tsx`.
- Ensure every "View", "Edit", "Open" button on Admin Dashboard tabs (Psychologists, Bookings, Users, Applications, Subscriptions, Transactions, Org Applications) actually navigates or opens a working modal.

**Accreditation tab redesign:**
- Top KPIs row: Pending / Approved / Rejected / Provisioning failures (last 7d) — clickable filters.
- Single unified table with: avatar, name, email, status pill, level pill, docs count, last action (with attempt status icon), actions menu.
- Side drawer (instead of modal) for full detail: tabs **Application · Documents · Provisioning Audit · Decisions**.
- Bulk "Retry failed provisioning" action.
- Clear empty states with explicit next-step CTA.

---

### Technical changes

**New files:**
- `supabase/functions/_shared/email-templates/accreditation/approval.tsx`
- `supabase/functions/_shared/email-templates/accreditation/rejection.tsx`
- `supabase/functions/_shared/email-templates/accreditation/i18n.ts`
- `supabase/functions/anamnesis-reminder-cron/index.ts`
- `supabase/functions/provision-psychologist/index.test.ts`
- `src/components/admin/ProvisioningAuditTab.tsx`
- `src/components/admin/AnamnesisCopyEditor.tsx`
- `src/components/organization/OrgBrandingTab.tsx`
- `src/hooks/useProvisioningAttempts.ts`

**Updated:**
- `supabase/functions/provision-psychologist/index.ts` — locale-aware email, structured logs, audit row, idempotent + partial recovery, precise error codes.
- `supabase/functions/send-rejection-email/index.ts` — locale-aware template.
- `supabase/functions/anamnesis-pdf/index.ts` — per-org branding.
- `src/components/admin/AccreditationManager.tsx` — KPI row, new table layout, side drawer, result banner, retry, audit sub-tab.
- `src/components/admin/ApprovalModal.tsx` — pre-flight inspection.
- `src/components/dashboard/AnamnesisCard.tsx` — progress + missing-steps + reminder badge.
- `src/pages/Apply.tsx` — capture `preferred_locale`.
- `src/components/Header.tsx`, `Footer.tsx`, `MegaMenu.tsx`, `RoleRouter.tsx`, `App.tsx` — link audit fixes.

**DB migrations:**
- `psychologist_applications.preferred_locale` (text, check, default `'fr'`).
- `provisioning_attempts` table + RLS (admin-only) + index on `(application_id, created_at desc)`.
- `anamnesis_reminders` table + RLS.
- `organization_accounts.pdf_logo_url`, `pdf_primary_color`, `pdf_signature_label`.
- `inspect_provisioning_state(app_id uuid)` SECURITY DEFINER function returning `{ user_exists, role_exists, profile_exists, subscription_exists }`.
- `pg_cron` job → `anamnesis-reminder-cron` every 6 hours.

**Security:**
- All new tables RLS-locked (admin or owner only).
- No raw SQL from client; all writes go through edge functions or typed Supabase client.
- PDF branding upload restricted to org owner; URL stored, file lives in existing private bucket with signed URLs.

---

### Out of scope (next round if you want)
- Real-time push notifications for reminders (currently email + in-app row).
- Multi-org membership for one psychologist (current design = one org owner).
- AI-suggested fixes for failed provisioning attempts.

