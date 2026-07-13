## Problem

The published app shows a blank screen because the frontend can't reach the backend at runtime. The Supabase client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env`, but `.env` is listed in `.gitignore`. That means the file exists locally in the sandbox but is excluded from the deployment build, so the published bundle boots with `undefined` credentials and crashes on first render. The Node 20 / service-worker noise is a side effect of the same broken deploy — not the real cause.

## Fix

Remove the `.env` entry from `.gitignore` so the managed env file is included when the project is published.

### Change

- **`.gitignore`** — delete the final `.env` line. Keep everything else untouched.

### After the edit

- The next publish will include `.env`, so `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are available to the client bundle and the app renders normally.
- The `.env` file is Lovable-managed and only contains the public Supabase URL + anon key (both safe to ship — they're already exposed to every browser client).

### Verification

1. Reload the preview — app should render.
2. Click Publish and confirm the live site at `upsy.lovable.app` loads without a blank screen.

No code, dependency, or backend changes are needed.
