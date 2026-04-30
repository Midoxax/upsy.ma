import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPostHog } from "./lib/analytics/posthog";
import { initSentry } from "./lib/analytics/sentry";

// Fire-and-forget — both silently no-op if env keys aren't set
initSentry();
initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
