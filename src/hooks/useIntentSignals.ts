import { useEffect, useRef } from "react";
import {
  useIntentStore,
  persistScrollDepth,
  type UserIntent,
} from "@/stores/intentStore";
import { initTracking, track } from "@/lib/tracking";

const CLASSIFY_DELAY_MS = 4000; // 4 seconds — within the 3-5s window
const VALID_INTENTS: UserIntent[] = [
  "EXPLORING",
  "READY_TO_ACT",
  "RESEARCHING",
  "SKEPTICAL",
];

/**
 * useIntentSignals
 *
 * Mounted once in the homepage (Index.tsx).
 * Collects behavioral signals for 4 seconds, then classifies and locks intent.
 * After lock, detaches all listeners.
 *
 * Also handles:
 * - Debug override via ?intent= query param
 * - Scroll depth persistence on unload
 * - Session tracking initialization
 */
export function useIntentSignals(): void {
  const {
    isLocked,
    sessionId,
    updateSignals,
    classifyAndLock,
    forceIntent,
  } = useIntentStore();
  const startTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // ── Initialize tracking ──
    initTracking(sessionId);
    track("page_view", { page: "homepage" });

    // ── Debug override ──
    const params = new URLSearchParams(window.location.search);
    const debugIntent = params.get("intent")?.toUpperCase() as
      | UserIntent
      | undefined;
    if (debugIntent && VALID_INTENTS.includes(debugIntent)) {
      forceIntent(debugIntent);
      track("intent_debug_override", { intent: debugIntent });
      return; // Skip signal collection
    }

    // ── If already locked (shouldn't happen on fresh mount, but safety) ──
    if (isLocked) return;

    // ── Scroll depth tracking ──
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const depth = (window.scrollY / scrollHeight) * 100;
      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
        updateSignals({ scrollDepthPercent: depth });
      }
    };

    // ── Click tracking ──
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      const clickTarget =
        link?.getAttribute("href") ||
        button?.textContent?.trim().toLowerCase().slice(0, 30) ||
        "";
      if (clickTarget) {
        const store = useIntentStore.getState();
        updateSignals({
          clickedTargets: [...store.signals.clickedTargets, clickTarget],
        });
      }
    };

    // ── Dwell time update ──
    const dwellInterval = setInterval(() => {
      updateSignals({ dwellTimeMs: Date.now() - startTime.current });
    }, 1000);

    // ── Attach listeners ──
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });

    // ── Classification timer ──
    const classifyTimer = setTimeout(() => {
      // Final dwell time update
      updateSignals({ dwellTimeMs: Date.now() - startTime.current });
      classifyAndLock();

      // Log the classification
      const state = useIntentStore.getState();
      track("intent_classified", {
        intent: state.intent,
        signals: { ...state.signals },
      });

      // Detach listeners after lock
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      clearInterval(dwellInterval);
    }, CLASSIFY_DELAY_MS);

    // ── Persist scroll depth on unload ──
    const handleUnload = () => {
      persistScrollDepth(maxScrollDepth.current);
      const state = useIntentStore.getState();
      track("session_end", {
        intent: state.intent,
        scrollDepth: maxScrollDepth.current,
        dwellTimeMs: Date.now() - startTime.current,
      });
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", handleUnload);
      clearInterval(dwellInterval);
      clearTimeout(classifyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
