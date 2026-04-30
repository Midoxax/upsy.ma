/**
 * Sentry initializer — gated on VITE_SENTRY_DSN.
 *
 * Privacy: PII scrubbing in `beforeSend`, no session replay by default
 * (replay can be enabled later when we have explicit user consent).
 * Compliant with Moroccan Law 09-08 / GDPR.
 */
import * as Sentry from "@sentry/react";

let initialized = false;

const PII_KEYS = new Set([
  "email",
  "phone",
  "full_name",
  "name",
  "first_name",
  "last_name",
  "address",
  "password",
  "notes",
  "content",
  "message",
]);

function scrubObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  const out: Record<string, unknown> = Array.isArray(obj) ? [] : ({} as any);
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (PII_KEYS.has(k.toLowerCase())) continue;
    if (typeof v === "string" && /@/.test(v)) continue; // strip email-likes
    out[k] = v && typeof v === "object" ? scrubObject(v as any) : v;
  }
  return out as T;
}

export function initSentry(): void {
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return; // silently skip if not configured

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION as string | undefined,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      integrations: [Sentry.browserTracingIntegration()],
      beforeSend(event) {
        if (event.user) {
          // Keep an anonymous ID, drop email/IP/username
          event.user = { id: event.user.id };
        }
        if (event.request?.cookies) delete event.request.cookies;
        if (event.request?.headers) {
          event.request.headers = scrubObject(event.request.headers);
        }
        if (event.extra) event.extra = scrubObject(event.extra);
        if (event.contexts) event.contexts = scrubObject(event.contexts);
        return event;
      },
    });
    initialized = true;
  } catch (e) {
    if (import.meta.env.DEV) console.warn("[sentry] init failed", e);
  }
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  Sentry.captureException(err, context ? { extra: scrubObject(context) } : undefined);
}

export function setSentryUser(userId: string | null): void {
  if (!initialized) return;
  Sentry.setUser(userId ? { id: userId } : null);
}