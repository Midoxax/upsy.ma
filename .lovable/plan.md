
## Two things in one go

### Part 1 — Why the photo upload doesn't work, and the fix

**Root cause.** In the **specialist dashboard → Profile tab**, the "Photo" field is a plain text input asking for a `https://...` URL. There is no file picker, no upload, no storage write. So unless the psychologist already has their photo hosted somewhere on the public internet, there's no way to add one — pasting a local file path or trying to drop a file does nothing.

Meanwhile, the **application wizard** (`/apply`) already has a working photo uploader (`DocUploader` → `useAccreditationUpload` → `accreditation-docs` bucket). The dashboard just never got the equivalent.

**Fix — make the dashboard photo field a real upload.**

1. **New public bucket `psychologist-photos`** (migration):
   - Public read (so photos render on profile pages and search cards without signed URLs).
   - Authenticated insert/update/delete restricted to the owner — path must start with `auth.uid()/...`.
   - Max 5 MB, JPG/PNG/WebP only (enforced client-side; matches existing photo limits).

2. **New `PhotoUploader` component** (`src/components/dashboard/PhotoUploader.tsx`):
   - Square avatar preview + "Change photo" / "Remove" buttons.
   - File picker → uploads to `psychologist-photos/{user_id}/profile-{timestamp}.{ext}` → writes the **public URL** back to `psychologist_profiles.photo_url`.
   - Shows progress bar during upload, toast on success/error.
   - Replaces the existing photo (deletes the old object) when a new one is uploaded.

3. **Wire it into `ProfileTab.tsx`**:
   - Replace the "Photo URL" `<Input type="url">` block with `<PhotoUploader value={formData.photo_url} onChange={(url) => setFormData({ ...formData, photo_url: url })} />`.
   - Keep the saved URL in the same `photo_url` column — no schema change needed, no impact on directory/profile pages.

4. **Backfill convenience**: if the psychologist already has a photo from the application (`accreditation-docs/.../photo-*.jpg`), the existing flow still copies that URL into `photo_url` at provisioning time — unchanged.

That's it. After this, a psychologist clicks **"Change photo" → picks a file → done**, no external image hosting required.

---

### Part 2 — How to make changes without coming back to Lovable every time

You have **three** options depending on what you want to change. They are not mutually exclusive.

**A. In-app admin tools you already have** (recommended for content/config — zero engineering needed):
- `/admin` → **Translation Manager**: edit any French/English/Arabic text on the site live (titles, CTAs, body copy). No deploy.
- `/admin` → **Pricing Control**: change commission rate, deposit %, VAT, min/max session price.
- `/admin` → **Learning Hub Manager**: add/edit courses and modules.
- `/admin` → **Anamnesis Copy Editor**: tweak intake-form questions.
- `/admin` → **Psychologist Directory**: edit any psychologist's profile, publish/unpublish, change accreditation level.
- `/admin` → **Applications**: approve/reject/provision accounts.
- Each psychologist's own dashboard already lets them edit their bio, photo (after this fix), pricing, availability, etc., without you touching anything.

**B. Connect your GitHub repo** (recommended for code changes from an external editor):
- Lovable → project settings → **GitHub integration** → connects this project to a repo you own.
- After that you can edit code in **VS Code, Cursor, GitHub Codespaces, or directly on github.com**, push commits, and Lovable picks them up automatically. Conversely, anything Lovable changes shows up as commits in your repo.
- This is how most teams stop "always returning to Lovable" — they treat Lovable as one of several editors, not the only one.

**C. Custom domain + CI** (for a fully self-managed deployment):
- You already have `upsy.ma` connected. Once GitHub is wired up (option B), you can deploy from your own pipeline (Vercel, Netlify, Cloudflare Pages) instead of Lovable's hosting if you ever want full control. Cloud (Supabase) stays the same — only the frontend deploy target changes.

For day-to-day text/pricing/profile edits, option **A** is enough and instant. For real code changes, option **B** is what you want.

---

### Files to create / edit (Part 1 only)

- **NEW** `supabase/migrations/<ts>_psychologist_photos_bucket.sql` — create public bucket + RLS policies.
- **NEW** `src/components/dashboard/PhotoUploader.tsx` — avatar upload component.
- **EDIT** `src/components/dashboard/ProfileTab.tsx` — swap URL input for `<PhotoUploader>`.

### Out of scope
- Cropping / centering UI (we keep it simple: upload as-is, square preview).
- Migrating existing `accreditation-docs` photos into the new bucket (they keep working via signed URLs already returned by the provisioning flow).
- Building an external "headless CMS" — option A above already covers the editable-content use case.
