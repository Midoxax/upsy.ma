

## Admin power-up: account control, embedded role views, clickable everything, Learning & Performance Hub

You already have detail drawers for Users, Psychologists and Bookings — clicking any row opens them. The pain points are: (1) the drawer entry isn't obvious, (2) the Users drawer only shows profile/roles/suspend (no email, no password reset, no quick status switches inline), (3) you can't preview the Specialist/Client/Org dashboards from inside the admin console, and (4) the Learning & Performance Hub is just a Skool teaser page with no admin CRUD. This plan fixes all four.

---

### 1. Make every row obviously clickable + add inline status controls

**Users tab**
- Add visible affordance: hover row → "Open" button on the right + chevron icon, plus a `Manage` button in a new Actions column.
- New columns: **Email**, **Roles** (chips), **Status** pill (Active / Suspended / Pending verification), **Last seen**.
- Inline row actions (no drawer needed): toggle Suspend/Reactivate, quick "Add admin" / "Add psychologist" role from a dropdown, "Send password reset" (calls `supabase.auth.resetPasswordForEmail`).
- Filter chips: All · Admins · Psychologists · Clients · Orgs · Suspended · Unverified.
- Bulk select → bulk suspend, bulk role assign, bulk CSV.

**Psychologists tab**
- Add `Manage` button + visible chevron on each row. Add columns: **Bookings count**, **Avg rating**, **Accreditation level pill**.
- Inline actions: publish/unpublish toggle (already there, made larger), inline accreditation-level dropdown, "View public profile ↗".

**Bookings tab**
- Same affordance pattern. Add inline status menu (Confirm / Complete / Cancel / Refund) directly on the row, drawer for full edit.

### 2. Expand the User drawer (full account control)

Replace the current 4-tab drawer with a richer one:
- **Profile**: editable name, email (read-only with "Send change-email link"), city, phone, bio, locale, avatar.
- **Roles**: chips with + / × (already present, kept).
- **Status**: Active / Suspended / Locked dropdown with reason field, plus "Force sign-out", "Send password reset email", "Resend verification email".
- **Activity**: recent bookings, recent assessments, recent journal/mood counts, last 10 audit-log entries for this user.
- **Danger zone**: delete profile (admin RPC, with confirm).

New admin-only RPCs: `admin_force_signout(_user_id)`, `admin_send_password_reset(_email)`, `admin_resend_verification(_email)` — all `SECURITY DEFINER`, write to `audit_log`.

### 3. Dashboard-on-dashboard (admin can preview every role view)

Add a new **"Live views"** tab in the admin console that embeds the actual role dashboards inside the admin shell so you don't have to leave `/admin`:

```text
[Tab: Live views]
  Sub-tabs:
    ┌── Specialist view ── Client view ── Organization view ── Athlete view ──┐
    │  <iframe-free embed: imports SpecialistDashboard / PatientDashboard /   │
    │  OrganizationDashboard / AthleteHub directly, wrapped in a              │
    │  ViewAsContext that forces the chosen role for read-only preview>        │
```

Mechanism:
- New `AdminPreviewProvider` that overrides `useUserRole().primaryRole` for the subtree (no real session swap, no DB writes — read-only flag carried through React context).
- Each preview shows a top banner "Viewing as <Role> — read-only preview" with a "Stop preview" button.
- Bonus: row-level `Impersonate (preview)` action on the Users tab opens that user's data in the matching role view (still read-only).

This complements the existing `ViewAsSwitcher` (which navigates away) by keeping you inside the admin console.

### 4. Click-anywhere on Psychologist → full editor

Already wired: clicking a psychologist row opens `PsychologistEditDrawer`. We will:
- Make the affordance obvious (chevron, hover `Open` button).
- Extend the drawer with: photo upload, specialties + languages multi-select, therapy approaches, availability shortcut link, accreditation level + revoke, "View public profile" button, recent bookings + reviews, "Suspend account" mirror (same RPC as user suspend).
- Add a `Reviews` tab inside the drawer to read/hide individual reviews.

### 5. Develop the Learning & Performance Hub (admin + client side)

Today `/skool` and `/resources` show static content while `courses` and `course_modules` tables already exist with public RLS. We will turn them into a managed product:

**New admin tab: "Learning Hub"**
- CRUD for `courses` (title, category, difficulty, duration, thumbnail upload, publish toggle).
- CRUD for `course_modules` (drag-to-reorder, video URL, content, duration).
- Enrollment stats per course (count, completion rate, avg progress) read from `course_enrollments`.
- "Issue certificate template" link per course.

**Client side improvements**
- New page `/learn` (rename Skool to a Hub landing) listing published courses from DB grouped by category, with progress bars from `course_enrollments`.
- New page `/learn/:slug` showing modules in order, marking completion, awarding XP via existing gamification hooks, generating certificate via `generate-certificate` edge function on full completion.
- Patient + Athlete dashboards get a "Continue learning" card linking to `/learn` with the current in-progress course.

**Performance dimension (athletes/specialists)**
- Add `learning_path` field on `courses` to tag content as `mental-health` | `performance` | `clinical-cpd`.
- Athlete Hub shows only `performance` paths; Specialist Dashboard shows only `clinical-cpd` paths (CPD credits tracked in `certificates`).

---

### Technical changes

**DB / RPC**
- `admin_force_signout`, `admin_send_password_reset`, `admin_resend_verification`, `admin_delete_profile` (SECURITY DEFINER, admin-only, audit-logged).
- `admin_update_booking_status(_booking_id, _new_status)` for inline row actions.
- `admin_hide_review(_review_id, _reason)`.
- Add column `courses.learning_path text default 'mental-health'` and `courses.slug text unique`.
- View `admin_users_rich` (joins `profiles` + `user_roles` array + email from `auth.users` via SECURITY DEFINER RPC `admin_list_users_rich`) so the Users tab can show email + roles in one query.

**New / updated components**
- `src/pages/admin/Dashboard.tsx`: add **Live views** tab, **Learning Hub** tab; restyle row actions.
- `src/components/admin/AdminPreviewProvider.tsx` + `RolePreviewFrame.tsx`: embedded read-only role views.
- `src/components/admin/UsersTab.tsx` (extracted): chips, filters, inline actions.
- `src/components/admin/UserDetailDrawer.tsx`: add Status tab (force sign-out, password reset, resend verification, delete), Activity tab with audit-log tail, locale + avatar editing.
- `src/components/admin/PsychologistEditDrawer.tsx`: add Reviews tab, photo upload, suspend mirror, public-profile link.
- `src/components/admin/LearningHubManager.tsx` + `CourseEditDrawer.tsx` + `ModuleListEditor.tsx`.
- `src/pages/Learn.tsx` + `src/pages/LearnCourse.tsx` (replaces hardcoded Skool/Resources sections that can't manage content).
- `src/components/dashboard/ContinueLearningCard.tsx` (mounted in Patient + Athlete dashboards).

**Hooks**
- `useAdminUsersRich`, `useAdminCourses`, `useAdminCourseModules`, `useEnrollments`, `useForceSignout`, `useSendPasswordReset`, `useResendVerification`.

**Security**
- All new mutations behind admin RPCs or RLS.
- Preview mode is enforced in React context only — no service-role calls, no DB writes from preview frames; mutations are disabled and inputs become read-only.
- Audit-log row for every admin action: role change, suspend, reset email, course publish, module delete.

---

### Out of scope (next pass)
- Real impersonation tokens (true session swap).
- Live cohort progress charts in the Learning Hub.
- AI-generated module quizzes.

