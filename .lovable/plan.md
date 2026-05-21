## Goal

Unblock the platform with one focused fix now, and queue three follow-up plans for the rest.

---

## Phase 1 — Now: Auth redirect bug

**Symptom:** After signing up / signing in (especially via Google/Apple OAuth), the page doesn't move forward. The user is left on `/auth` or `/` instead of landing on `/my-space`.

**Root cause:** `src/pages/Auth.tsx` only navigates inside the `handleLogin` success branch. It has no effect that listens to the auth context — so when:
- OAuth returns the user to `/` with a fresh session, nothing routes them onward
- A user with an existing session visits `/auth`, they stay stuck on the form
- Email verification link lands them on `/my-space` but role-based routing doesn't fire

**Changes:**

1. **`src/pages/Auth.tsx`** — add a `useEffect` watching `user` from `useAuth()`. When a session exists and we're on `/auth`, navigate to `?redirect=` param or `/my-space`.
2. **`src/pages/Auth.tsx`** — in `handleOAuth`, if `result.redirected` is false (already-authenticated case the SDK returns), also navigate.
3. **OAuth landing** — verify the OAuth callback path (`redirect_uri: window.location.origin`) actually completes session restore before the homepage renders. If `Index.tsx` doesn't gate on `loading`, add a small effect there too: when an authenticated user with a known role lands on `/`, send them to `/my-space` only if they came from the OAuth round-trip (detect via URL hash `#access_token` or sessionStorage flag set before `signInWithOAuth`).
4. **`useRoleBasedRoute`** check — ensure `/my-space` itself dispatches admin → `/admin`, psychologist → psychologist dashboard, etc. (already exists per memory; just verify it fires on first mount after OAuth, not just on cached sessions).

**Verification:** sign up with email → toast appears, stays on /auth (correct). Sign in with email → lands on /my-space. Sign in with Google → returns and lands on /my-space (or /admin for admin account).

---

## Phase 2 — Queued (separate plans when you say go)

These are scoped but I'm not building them in this plan — too much surface to bundle safely.

### A. Legal status section (Wyoming LLC vs SARL vs Autoentrepreneur)
- Add a new "Structure & Conformité" section to `src/pages/About.tsx` (or `/legal`).
- Three comparison cards: Autoentrepreneur MA (current), SARL MA, Wyoming LLC — with cost, tax, liability, banking, international payments rows.
- Honest framing: today U.Psy operates under Autoentrepreneur; SARL/LLC are planned milestones.
- Pure content + table, no backend.

### B. Session minuteur (specialist-side toggle)
- Add a `SessionTimer` component inside the video consultation room (`src/components/video/*` or wherever Jitsi iframe lives).
- Two modes via a small switch visible only to specialists: **Elapsed** (counts up from `session.started_at`) and **Remaining** (counts down to `started_at + duration_minutes`).
- Warning state at <5 min remaining (color shifts to gold, then maroon).
- No new tables — read `sessions.started_at` and `sessions.duration_minutes` from existing schema.

### C. Blog editor with dual mode
- Extend the admin blog insertion form (`src/pages/admin/*` blog editor) so authors can pick **Rich text** or **Markdown** with a tab toggle, in addition to file upload.
- Rich text: `@tiptap/react` with starter-kit + image + link extensions (already a common dep).
- Markdown: textarea + live preview via `react-markdown`.
- File upload stays as a third tab.
- Save normalized HTML to the existing `blog_posts.content` column.

### D. Other items you mentioned (parked, will scope individually)
- Light theme contrast + colorfulness pass
- Burger banner contrast
- Pricing/tarifs page for Autoentrepreneur + MAD + CIH manual confirmation
- Credit system for organisms
- Contracts & partnerships flow
- CIH bank payment confirmation emails

---

## Technical details (Phase 1)

```text
src/pages/Auth.tsx
├── import { useAuth } from "@/contexts/AuthContext"
├── const { user, loading } = useAuth()
└── useEffect(() => {
      if (loading) return
      if (!user) return
      const redirectTo = new URLSearchParams(location.search).get("redirect")
      navigate(redirectTo || "/my-space", { replace: true })
    }, [user, loading])
```

No DB changes. No new dependencies. ~15 lines touched in one file.
