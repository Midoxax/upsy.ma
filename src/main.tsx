import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPostHog } from "./lib/analytics/posthog";

// Fire-and-forget — silently no-ops if env keys aren't set
initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
