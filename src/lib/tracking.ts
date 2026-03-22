/**
 * UPsy Event Tracking System
 *
 * Provider-agnostic event bus.
 * Buffers events internally for future integration with
 * PostHog, Mixpanel, or any analytics provider.
 *
 * Usage:
 *   track("section_view", { section: "HeroSection" })
 *   track("cta_click", { section: "hero", label: "Find Psychologist" })
 */

export interface TrackingEvent {
  name: string;
  payload: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

// ─── Internal Buffer ───
const eventBuffer: TrackingEvent[] = [];
let sessionId = "";

/**
 * Initialize the tracking system with a session ID.
 * Called once from useIntentSignals.
 */
export function initTracking(sid: string): void {
  sessionId = sid;
}

/**
 * Track an event.
 */
export function track(
  name: string,
  payload: Record<string, unknown> = {}
): void {
  const event: TrackingEvent = {
    name,
    payload,
    timestamp: Date.now(),
    sessionId,
  };
  eventBuffer.push(event);

  // Development logging (non-sensitive)
  if (import.meta.env.DEV) {
    console.debug(`[track] ${name}`, payload);
  }
}

/**
 * Get all buffered events (for future provider flush).
 */
export function getEventBuffer(): ReadonlyArray<TrackingEvent> {
  return eventBuffer;
}

/**
 * Flush buffer (called when sending to external provider).
 */
export function flushEventBuffer(): TrackingEvent[] {
  return eventBuffer.splice(0);
}

/**
 * Get event count (useful for debugging).
 */
export function getEventCount(): number {
  return eventBuffer.length;
}
