import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Conversion type system — Fraunces (editorial serif headings), Geist (UI/body), JetBrains Mono (numerals)
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/600-italic.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
// Manrope retained as body fallback during migration
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
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
