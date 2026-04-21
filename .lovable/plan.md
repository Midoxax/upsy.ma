

## Admin Dashboard Polish — Easier Manipulation & Editing

Make every admin tab actionable end-to-end: edit, suspend, cancel, reassign, export, jump-to. Tighten the Accreditation tab into a clean, audit-ready workspace.

---

### 1. Global admin shell
- **Command palette** (`⌘K` / `Ctrl+K`) — instant search across users, psychologists, bookings, applications. Selecting a result opens the right tab + detail drawer.
- **Sticky toolbar** keeps Refresh, Export CSV, and a "Pending actions" pill (count of pending apps + pending bookings + failed provisionings) that deep-links to filtered views.
- **Toast → Undo** for destructive actions (suspend user, cancel booking) with 5s undo window.

---

### 2. Users tab — fully editable
Replace the read-only list with a real management table:
- Columns: avatar+name, email, **roles** (chips), city, joined, last seen.
- Row actions menu: **Edit profile**, **Manage roles** (add/remove admin/psychologist/athlete/coach/organization via `user_roles` upserts), **Send password reset**, **Suspend / Reactivate**, **Impersonate (View as)**, **Delete**.
- Side drawer "User details": profile fields editable inline, role chips with add/remove, recent bookings, recent assessments, audit-log tail.
- Bulk select → bulk role assign / bulk export CSV.
- Filter chips: All / Admins / Psychologists / Clients / Orgs / Suspended.

---

### 3. Psychologists tab — full CRUD + accreditation inline
- Add columns: accreditation level pill, # bookings, # reviews, avg rating.
- Row actions: **View public profile** (new tab), **Edit** (drawer with all profile fields: bio, rate, city, specialties, languages, gender, online/in-person), **Toggle publish**, **Set accreditation level** inline (provisional/verified/accredited), **Reset photo**, **Delete profile**.
- Specialties/languages multi-select editor in drawer (writes to junction tables).
- Filter chips: All / Published / Unpublished / Accredited / Missing photo / Missing bio.
- Bulk publish/unpublish.

---

### 4. Bookings tab — operational controls
- Row actions: **View details** (drawer with patient + psychologist + notes + payment status), **Mark completed**, **Mark no-show**, **Cancel** (with reason), **Reschedule** (date/time picker), **Refund** (mark `payment_status='refunded'`), **Open video room**.
- Add date-range picker + psychologist filter + payment-status filter.
- Quick stats strip above table: today's sessions, this week, pending payments.
- Export filtered set to CSV.

---

### 5. Accreditation tab — neat & clear (the priority)
Redesign into one focused workspace:

```text
┌─ KPIs ────────────────────────────────────────────────────────┐
│  Pending 4   Approved 27   Rejected 3   Provisioning fails 1 │
│  (each clickable → filters table)                             │
└───────────────────────────────────────────────────────────────┘
┌─ Filters: status · level · search name/email ────────────────┐
└───────────────────────────────────────────────────────────────┘
┌─ Table: Avatar · Name · Email · Status · Level · Docs · ───┐
│         Last attempt (✓/⚠/✗) · Submitted · Actions          │
└───────────────────────────────────────────────────────────────┘
```

- **Side drawer** (replaces cramped modal) with 4 tabs:
  1. **Application** — all fields, editable notes, preferred locale.
  2. **Documents** — `AccreditationDocsPanel` with download/preview.
  3. **Provisioning Audit** — `ProvisioningAuditTab` timeline (already exists), plus a clear **Retry provisioning** button when last attempt failed.
  4. **Decisions** — log of approve/reject/upgrade events from `accreditation_decisions`.
- **Result banner per row** under failed rows: red strip with `errorCode`, `errorMessage`, **Retry** button → re-invokes `provision-psychologist`.
- **Bulk actions**: bulk approve pending, bulk retry failed.
- **Inline level upgrade** dropdown on approved rows (no modal needed for simple upgrades).
- **Empty states** with explicit next-step CTA ("No pending applications — view approved psychologists →").

---

### 6. Org Applications tab
- Row actions: **Approve** (creates `organization_accounts` row, links owner), **Reject** (with reason), **View** drawer with all submitted fields + contact CTA buttons (email, WhatsApp).
- Status filter chips and search.

---

### 7. Pricing & Transactions
- Pricing: add "Save & log change" confirmation, show last-3 changes inline (uses existing `platform_pricing_history`).
- Transactions: add date range, status filter, **Mark refunded** action, CSV export.

---

### 8. Translations
- Keep `AnamnesisCopyEditor` + `TranslationManager`. Add a **"Missing translations"** filter chip that surfaces keys present in EN but missing in FR or AR. Add **"Copy from EN"** button per row.

---

### Technical changes

**New components**
- `src/components/admin/CommandPalette.tsx` — `⌘K` global search (uses existing `cmdk` via `command.tsx`).
- `src/components/admin/UserDetailDrawer.tsx` — edit profile, manage roles, view activity.
- `src/components/admin/PsychologistEditDrawer.tsx` — full profile editor incl. specialties/languages.
- `src/components/admin/BookingDetailDrawer.tsx` — view/cancel/reschedule/refund.
- `src/components/admin/AccreditationDrawer.tsx` — 4-tab side drawer replacing the current Dialog.
- `src/components/admin/ProvisioningResultBanner.tsx` — per-row status banner with Retry.
- `src/components/admin/AccreditationKpiRow.tsx` — clickable KPI cards.
- `src/components/admin/ExportCsvButton.tsx` — generic CSV exporter.

**Updated**
- `src/pages/admin/Dashboard.tsx` — mount CommandPalette; add Pending-actions pill; wire new tab toolbars.
- `src/components/admin/AccreditationManager.tsx` — KPI row, filters refactor, drawer instead of dialog, retry banners, bulk actions, inline level upgrade.
- Users / Psychologists / Bookings tab components — extracted into their own files for clarity and to host new drawers + actions.

**New hooks**
- `useAdminUsers` (with role-aware joins), `useUpdateUserRole`, `useSuspendUser`, `useImpersonate`.
- `useUpdatePsychologistProfile`, `useUpdatePsychologistRelations` (specialties/languages).
- `useCancelBooking`, `useRescheduleBooking`, `useRefundBooking`.
- `useRetryProvisioning` (re-invokes edge function and refetches `provisioning_attempts`).

**DB / RPC additions**
- Migration: enable admin to suspend a user — add `profiles.is_suspended boolean default false` + RLS clause blocking suspended users from session-creating actions.
- RPC `admin_assign_role(_user_id uuid, _role app_role)` and `admin_revoke_role(...)` (SECURITY DEFINER, admin-only).
- RPC `admin_cancel_booking(_booking_id uuid, _reason text)` updates status + writes to `audit_log`.
- Index on `provisioning_attempts(application_id, created_at desc)` (already in earlier migration — verify).

**Security**
- Every new mutation goes through admin-only RPC or RLS-checked update.
- `audit_log` row written for: role change, suspend/reactivate, booking cancel/refund, accreditation upgrade, provisioning retry, profile delete.
- Impersonation = "View as" only (read-only flag in `useActiveView`), never a real session swap.

**Out of scope (next pass)**
- Real-time presence indicator on user rows.
- Charts/analytics tab redesign.
- Bulk email composer.

