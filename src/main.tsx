import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Marketing type system — Fraunces / Cormorant Garamond display + Manrope body + Amiri (Arabic) + JetBrains Mono
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/jetbrains-mono/500.css";

import { initPostHog } from "./lib/analytics/posthog";
import { initSentry } from "./lib/analytics/sentry";
import { assertRequiredEnv, renderEnvErrorBanner } from "./lib/env-check";

// Fail loudly if required Supabase env vars are missing at runtime
const envError = assertRequiredEnv();
if (envError) {
  renderEnvErrorBanner("root", envError);
  throw new Error(envError);
}

// Fire-and-forget — both silently no-op if env keys aren't set
initSentry();
initPostHog();

// PWA: guard SW registration — never register inside iframes or Lovable preview
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname.includes("preview--");

if (isPreviewHost || isInIframe) {
  // Unregister any stale service workers in preview/iframe
  navigator.serviceWorker?.getRegistrations().then((regs) =>
    regs.forEach((r) => r.unregister())
  );
} else if ("serviceWorker" in navigator) {
  // Production: only register if /sw.js actually exists (avoids 404 registration errors)
  fetch("/sw.js", { method: "HEAD" })
    .then((res) => {
      if (!res.ok) {
        // No SW shipped on this host — clean up any stale registrations
        return navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((r) => r.unregister()));
      }
    })
    .catch(() => {
      /* network noise — ignore */
    });
}

createRoot(document.getElementById("root")!).render(<App />);
