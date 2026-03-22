import { create } from "zustand";

// ─── Intent Types ───
export type UserIntent =
  | "EXPLORING"
  | "READY_TO_ACT"
  | "RESEARCHING"
  | "SKEPTICAL";

// ─── Signal Snapshot (collected during first 3-5s) ───
export interface IntentSignals {
  visitCount: number;
  previousScrollDepth: number; // 0-100, from last visit
  referrerType: "search" | "direct" | "social" | "referral" | "unknown";
  dwellTimeMs: number;
  scrollDepthPercent: number;
  clickedTargets: string[];
}

// ─── Store Shape ───
interface IntentState {
  intent: UserIntent;
  isLocked: boolean;
  signals: IntentSignals;
  sessionId: string;

  // Actions
  updateSignals: (partial: Partial<IntentSignals>) => void;
  classifyAndLock: () => void;
  forceIntent: (intent: UserIntent) => void; // debug override
}

// ─── LocalStorage Keys ───
const LS_VISIT_COUNT = "upsy_visit_count";
const LS_PREV_SCROLL_DEPTH = "upsy_prev_scroll_depth";
const LS_LAST_INTENT = "upsy_last_intent";

// ─── Helpers ───
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getVisitCount(): number {
  try {
    const raw = localStorage.getItem(LS_VISIT_COUNT);
    const count = raw ? parseInt(raw, 10) : 0;
    localStorage.setItem(LS_VISIT_COUNT, String(count + 1));
    return count + 1;
  } catch {
    return 1;
  }
}

function getPreviousScrollDepth(): number {
  try {
    const raw = localStorage.getItem(LS_PREV_SCROLL_DEPTH);
    return raw ? parseFloat(raw) : 0;
  } catch {
    return 0;
  }
}

function detectReferrerType(): IntentSignals["referrerType"] {
  try {
    const ref = document.referrer;
    if (!ref) return "direct";
    const url = new URL(ref);
    const searchEngines = ["google", "bing", "yahoo", "duckduckgo", "baidu"];
    if (searchEngines.some((se) => url.hostname.includes(se))) return "search";
    const socialPlatforms = [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "tiktok",
    ];
    if (socialPlatforms.some((sp) => url.hostname.includes(sp))) return "social";
    if (url.hostname === window.location.hostname) return "direct";
    return "referral";
  } catch {
    return "unknown";
  }
}

/**
 * Classification algorithm.
 * Runs once after 3-5 seconds of signal collection.
 * Uses weighted scoring — highest score wins.
 */
function classifyIntent(signals: IntentSignals): UserIntent {
  const scores: Record<UserIntent, number> = {
    EXPLORING: 0,
    READY_TO_ACT: 0,
    RESEARCHING: 0,
    SKEPTICAL: 0,
  };

  // ── Visit count signals ──
  if (signals.visitCount === 1) {
    scores.EXPLORING += 3;
  } else if (signals.visitCount >= 2 && signals.visitCount <= 3) {
    scores.READY_TO_ACT += 3;
    scores.RESEARCHING += 1;
  } else if (signals.visitCount >= 4) {
    scores.READY_TO_ACT += 4;
  }

  // ── Previous scroll depth (returning users) ──
  if (signals.visitCount > 1) {
    if (signals.previousScrollDepth < 25) {
      scores.SKEPTICAL += 3;
    } else if (signals.previousScrollDepth > 60) {
      scores.RESEARCHING += 2;
    }
  }

  // ── Referrer type ──
  if (signals.referrerType === "search") {
    scores.RESEARCHING += 2;
  } else if (signals.referrerType === "social") {
    scores.EXPLORING += 2;
  } else if (signals.referrerType === "direct") {
    scores.READY_TO_ACT += 1;
  }

  // ── Early dwell time ──
  if (signals.dwellTimeMs > 8000) {
    scores.RESEARCHING += 2;
  } else if (signals.dwellTimeMs < 3000) {
    scores.EXPLORING += 1;
  }

  // ── Early scroll depth ──
  if (signals.scrollDepthPercent > 30) {
    scores.RESEARCHING += 1;
    scores.EXPLORING += 1;
  } else if (signals.scrollDepthPercent < 10) {
    scores.SKEPTICAL += 1;
  }

  // ── Click behavior ──
  if (signals.clickedTargets.length > 0) {
    scores.READY_TO_ACT += 2;
    if (
      signals.clickedTargets.some(
        (t) => t.includes("assessment") || t.includes("matched")
      )
    ) {
      scores.READY_TO_ACT += 2;
    }
    if (
      signals.clickedTargets.some(
        (t) => t.includes("research") || t.includes("learn")
      )
    ) {
      scores.RESEARCHING += 2;
    }
  }

  // ── Find winner ──
  let maxIntent: UserIntent = "EXPLORING";
  let maxScore = scores.EXPLORING;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as UserIntent;
    }
  }

  return maxIntent;
}

// ─── Store ───
export const useIntentStore = create<IntentState>((set, get) => ({
  intent: "EXPLORING",
  isLocked: false,
  sessionId: generateSessionId(),
  signals: {
    visitCount: getVisitCount(),
    previousScrollDepth: getPreviousScrollDepth(),
    referrerType: detectReferrerType(),
    dwellTimeMs: 0,
    scrollDepthPercent: 0,
    clickedTargets: [],
  },

  updateSignals: (partial) => {
    if (get().isLocked) return; // No updates after lock
    set((state) => ({
      signals: { ...state.signals, ...partial },
    }));
  },

  classifyAndLock: () => {
    if (get().isLocked) return;
    const classified = classifyIntent(get().signals);
    set({ intent: classified, isLocked: true });

    // Persist last intent for next-visit analysis
    try {
      localStorage.setItem(LS_LAST_INTENT, classified);
    } catch {
      // Silent fail
    }
  },

  forceIntent: (intent) => {
    set({ intent, isLocked: true });
  },
}));

/**
 * Save scroll depth on page unload for next-visit classification.
 * Called from useIntentSignals cleanup.
 */
export function persistScrollDepth(depth: number): void {
  try {
    localStorage.setItem(LS_PREV_SCROLL_DEPTH, String(Math.round(depth)));
  } catch {
    // Silent fail
  }
}
