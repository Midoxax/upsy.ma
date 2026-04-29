# "Nothing is working" — diagnose, then fix what's actually broken

## Why this plan is shaped this way

What I observed before writing this plan:
- Homepage at `/` renders correctly in the live preview (hero, CTA, copy all visible).
- Browser console: no app errors. Only a manifest 401 (preview iframe quirk, harmless) and React Router future-flag warnings (harmless).
- Edge function logs: zero 4xx/5xx in the recent window.
- Postgres logs: zero ERROR/FATAL severity entries.
- `LocaleContext` is correctly set up with cookie-as-source-of-truth.

So I cannot confirm a global breakage. Before doing a sweeping refactor across auth, payments, invoicing, anamnesis, admin and data protection at the same time, I want to **isolate what's actually failing**, fix exactly that, and then run targeted regression checks on the related flows. Otherwise we risk regressions in the parts that already work.

## Phase 1 — Reproduce and isolate (no code changes)

For each flow you mentioned, I will:
1. Open the relevant page in the in-tool browser, signed in as the right role (client, then specialist, then admin via `mehdifelji@gmail.com`).
2. Click through the user-visible steps.
3. Capture: screenshot, console errors, failing network request bodies, edge function logs, DB rows touched.
4. Mark each flow as: ✅ works / ⚠️ partial / ❌ broken — with the exact error.

Flows to verify, in this order:

```text
1. Auth          : email signup, email login, Google login, password reset
2. Locale        : pick FR on /, navigate to /psychologists, refresh — stays FR
3. Specialists   : list loads, photo upload from dashboard, profile saves
4. Booking       : send-meeting-link from specialist → client receives email
5. Anamnesis     : client fills form, specialist sees it
6. Payments      : create-booking-payment + simulate-payment-webhook flow
7. Invoices      : generate-org-invoice produces PDF, escapes XSS payload in org name
8. Admin         : edit a psychologist profile, change pricing, suspend a user
9. Data privacy  : confirm RLS by trying cross-tenant reads as a hacker persona
```

## Phase 2 — Fix only the confirmed failures

For every ❌ found in Phase 1, I'll do a focused fix:
- One root-cause change per failure.
- A note in the response showing: the symptom, the root cause, the change, and the verification step.

I will **not** touch flows marked ✅ unless the fix for a ❌ requires it. This is the most important constraint of this plan.

## Phase 3 — Regression check

After fixes:
- Re-run the relevant flows from Phase 1 in the browser.
- Run the existing security regression tests (`security_regression.test.ts`, `booking_proposal_flow.test.ts`, `generate-org-invoice/index.test.ts`).
- Run `supabase--linter` to confirm no new RLS regressions.

## What I will NOT do in this round

- I will not rewrite the auth context, the locale context, or the role router.
- I will not refactor admin tooling unless a specific admin action is broken.
- I will not change RLS policies unless a specific privacy violation is reproduced.
- I will not introduce new features (e.g. new payment provider, new invoice template).

## Technical scope

Files I expect to *read* in Phase 1: `Auth.tsx`, `LocaleContext.tsx`, `useSendMeetingLink.ts`, `useBooking.ts`, `useAnamnesis.ts`, `BillingTab.tsx`, edge functions (`send-meeting-link`, `create-booking-payment`, `generate-org-invoice`, `propose-session`).

Files I expect to *edit* in Phase 2: only those with a confirmed defect from Phase 1. Listed concretely in the implementation message after diagnosis.

## What I need from you

If you already know one specific flow that's broken (e.g. "I click Send meeting link and get a 500", or "I sign in with Google and land on a blank page"), tell me which one and I'll start there. Otherwise I'll begin top-down with Auth.

Approve this plan and I'll switch to build mode and start Phase 1.
