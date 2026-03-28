

## Auth Security Audit & Fix Plan

### Current Issues Found

**Critical Security Vulnerabilities (from scan):**
1. **Privilege Escalation** — `user_roles` table has no explicit INSERT/UPDATE/DELETE deny for non-admins. The `FOR ALL` admin policy is permissive, meaning any authenticated user can insert a row granting themselves admin.
2. **Reviews Public Exposure** — `reviews` table exposes client identities (client_id, comments) to public via `USING (true)` SELECT policy.
3. **Leaked Password Protection** — HIBP check is disabled.

**Auth Flow Gaps:**
4. **No `/reset-password` page** — Password reset redirects to `/auth`, meaning users get auto-logged-in without actually resetting their password.
5. **Signup navigates immediately** — After signup, the user is navigated to `/my-space` even though email confirmation may be required. Should show "check your email" message instead.
6. **No rate limiting on auth forms** — Login/signup forms have no client-side throttling.

**Sign-in Method Limitations:**
- **Google**: Working (via `lovable.auth.signInWithOAuth`)
- **Microsoft**: Not supported by Lovable Cloud
- **SMS/Phone**: Not currently implemented
- **Apple**: Supported by Lovable Cloud but not implemented in UI

### Plan

#### 1. Fix Privilege Escalation on `user_roles` (Database Migration)

Add explicit restrictive policies to block non-admin INSERT, UPDATE, DELETE:

```sql
-- Drop the overly broad "Admins can manage all roles" ALL policy
-- Replace with specific admin-only INSERT/UPDATE/DELETE policies
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

#### 2. Fix Reviews Public Exposure (Database Migration)

Replace the blanket public SELECT policy with one that restricts client identity:

```sql
-- Drop the existing permissive policy
-- Create a new policy that only allows authenticated users to see reviews,
-- or create a view that strips client_id for public access
```

#### 3. Enable Leaked Password Protection

Guide user to enable HIBP check in Cloud → Users → Auth Settings.

#### 4. Create `/reset-password` Page

New file `src/pages/ResetPassword.tsx`:
- Detects `type=recovery` in URL hash
- Shows form to enter new password
- Calls `supabase.auth.updateUser({ password })`
- Register route in `App.tsx`
- Update `Auth.tsx` to redirect password reset to `/reset-password`

#### 5. Fix Signup Flow

Update `Auth.tsx` `handleSignup`: instead of navigating to `/my-space`, show a toast telling the user to check their email for verification. Only navigate after email is confirmed (handled by auth state listener).

#### 6. Add Apple Sign-In Button

Add Apple OAuth button using `lovable.auth.signInWithOAuth("apple")` alongside Google on both login and signup tabs.

#### 7. Stronger Password Validation

Upgrade password schema from just `min(6)` to require uppercase, lowercase, number, and minimum 8 characters.

### Not Possible (Lovable Cloud Limitations)
- **Microsoft OAuth** — not supported natively
- **SMS/Phone auth** — requires Twilio connector setup; will note as optional follow-up
- **2FA/MFA** — Supabase MFA (TOTP) is available but requires additional UI; will note as optional follow-up

### Files Changed
- **New**: `src/pages/ResetPassword.tsx`
- **Edit**: `src/App.tsx` — add `/reset-password` route
- **Edit**: `src/pages/Auth.tsx` — fix signup flow, add Apple button, improve password validation, fix reset redirect
- **Edit**: `src/contexts/AuthContext.tsx` — no changes needed
- **Migration**: Fix `user_roles` RLS + `reviews` RLS

### Technical Details

- The `handle_new_psychologist` trigger inserts into `user_roles` using `SECURITY DEFINER`, so it bypasses RLS — no conflict with the new restrictive policies.
- The `create_admin_user` function is also `SECURITY DEFINER` and already has `EXECUTE` revoked from anon/authenticated (from previous security fix).
- Apple sign-in uses the same `lovable.auth.signInWithOAuth("apple")` pattern as Google — no additional configuration needed.

