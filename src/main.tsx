import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Marketing type system — Instrument Serif (editorial luxe headlines) + Work Sans (body/UI)
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
// Geist kept for existing UI chrome fallback; Fraunces + Manrope removed.
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/jetbrains-mono/500.css";

import { initPostHog } from "./lib/analytics/posthog";
import { initSentry } from "./lib/analytics/sentry";

// Fire-and-forget — both silently no-op if env keys aren't set
initSentry();
initPostHog();

// PWA: guard SW registration — never register inside iframes or Lovable preview
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  // Unregister any stale service workers in preview/iframe
  navigator.serviceWorker?.getRegistrations().then((regs) =>
    regs.forEach((r) => r.unregister())
  );
}

createRoot(document.getElementById("root")!).render(<App />);
