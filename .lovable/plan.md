

## U.Psy Website Fix Plan

### Issues to Fix (Ordered by Priority)

### 1. Contact Form -- Add Working Submission
- Add form state management and `onSubmit` handler to `Contact.tsx`
- Save submissions to a new `contact_submissions` database table (with RLS: anon can INSERT, admin can SELECT)
- Show success toast after submission
- Optionally trigger a notification email via an edge function

### 2. Mobile Menu Locale Bug
- In `Header.tsx` lines 142 and 155-156, wrap mobile menu `to={item.href}` and `to={subItem.href}` with `addLocalePrefix(href, locale)` to match the desktop navigation behavior

### 3. Fix `isActive` to Support Locale Prefixes
- Update `isActive()` in `Header.tsx` to strip the locale prefix from `location.pathname` before comparing, using the existing `stripLocalePrefix` utility

### 4. Social Media Links
- Replace all `href="#"` in `Footer.tsx` with actual social media URLs (or remove the links if URLs are not yet available)
- Will need the real URLs from you -- otherwise will add placeholder `https://youtube.com/@upsy` style links

### 5. Internationalize GetMatched Page
- Replace all hardcoded English strings in `GetMatched.tsx` with `t()` calls
- Add corresponding translation keys to the translations file for EN, FR, and AR

### 6. Fix Contact Page Inconsistent Details
- Update `Contact.tsx` email to `mypersonalpsychologist212@gmail.com` and phone to `+212 668-594699` to match the footer

### 7. Remove Dead Code
- Delete the unused `src/components/psychologists/MatchingFormModal.tsx` (the old simple version)
- Remove the unused hardcoded `services` and `expectations` arrays in `Services.tsx`

### 8. Tailwind CDN Warning
- Check `index.html` for a `cdn.tailwindcss.com` script tag and remove it

### 9. Add Password Reset Flow
- Add a "Forgot Password?" link on the Auth page login tab
- Use the built-in `supabase.auth.resetPasswordForEmail()` method

### Not Fixing Now (Requires Architectural Decision)
- **Auth signup creating psychologist profiles for everyone**: This needs a product decision about whether to have separate client vs psychologist registration flows. Will flag but not change without your input.

### Technical Details

**Database Migration (for Contact Form):**
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON contact_submissions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));
```

**Files to Modify:**
- `src/pages/Contact.tsx` -- add form submission logic
- `src/components/Header.tsx` -- fix mobile locale links + isActive
- `src/components/Footer.tsx` -- fix social links
- `src/pages/GetMatched.tsx` -- internationalize
- `src/pages/Services.tsx` -- remove dead code
- `src/pages/Auth.tsx` -- add forgot password link
- `src/lib/i18n/translations.ts` -- add GetMatched + password reset translations
- `index.html` -- remove Tailwind CDN if present
- Delete `src/components/psychologists/MatchingFormModal.tsx`

**Estimated scope:** Medium -- mostly straightforward fixes across multiple files, plus one small database table.

