import { useMemo } from "react";
import { useIntentStore, type UserIntent } from "@/stores/intentStore";
import { track } from "@/lib/tracking";
import type { SectionConfig } from "@/pages/Index";

const MAX_POSITION_SHIFT = 2;
const MIN_CONFIDENCE_FOR_SORTING = 0.3;

/**
 * useDynamicSections
 *
 * Sorts homepage sections based on detected user intent.
 *
 * Algorithm:
 * 1. Separate pinned (anchor) sections from adaptive sections
 * 2. Sort adaptive sections by intent priority
 * 3. Clamp each section to ±2 from its default position (HARD LIMIT)
 * 4. Enforce narrative constraints ONLY within ±2 bounds (soft)
 * 5. Reassemble: [pinned_first, pinned_second, pinned_third, ...adaptive, pinned_last]
 *
 * If confidence < 0.3, returns default order (no sorting).
 */
export function useDynamicSections(
  sections: SectionConfig[]
): SectionConfig[] {
  const intent = useIntentStore((s) => s.intent);
  const confidence = useIntentStore((s) => s.confidence);
  const isLocked = useIntentStore((s) => s.isLocked);

  return useMemo(() => {
    // ── Step 0: Don't sort until intent is locked ──
    if (!isLocked) return sections;

    // ── Step 0b: Low confidence → default order ──
    if (confidence < MIN_CONFIDENCE_FOR_SORTING) {
      track("sorting_skipped", { reason: "low_confidence", confidence });
      return sections;
    }

    // ── Step 1: Separate pinned vs adaptive ──
    const pinFirst = sections.find(
      (s) => s.narrativeConstraints.pinPosition === "first"
    );
    const pinSecond = sections.find(
      (s) => s.narrativeConstraints.pinPosition === "second"
    );
    const pinThird = sections.find(
      (s) => s.narrativeConstraints.pinPosition === "third"
    );
    const pinLast = sections.find(
      (s) => s.narrativeConstraints.pinPosition === "last"
    );

    const adaptive = sections.filter(
      (s) => !s.narrativeConstraints.pinPosition
    );

    // Adaptive zone starts at index 3 (after 3 pinned sections)
    const ADAPTIVE_ZONE_START = 3;

    // ── Step 2: Sort by intent priority (ascending — 1 = first) ──
    const sorted = [...adaptive].sort(
      (a, b) =>
        a.priorityByIntent[intent] - b.priorityByIntent[intent]
    );

    // ── Step 3: Clamp positions (HARD LIMIT ±2) ──
    const clamped = clampPositions(sorted, ADAPTIVE_ZONE_START);

    // ── Step 4: Enforce narrative constraints (SOFT — within ±2 only) ──
    const constrained = enforceNarrativeConstraints(clamped);

    // ── Step 5: Reassemble ──
    const result = [
      ...(pinFirst ? [pinFirst] : []),
      ...(pinSecond ? [pinSecond] : []),
      ...(pinThird ? [pinThird] : []),
      ...constrained,
      ...(pinLast ? [pinLast] : []),
    ];

    // Log the reordering
    track("sections_reordered", {
      intent,
      confidence,
      order: result.map((s) => s.key),
    });

    return result;
  }, [sections, intent, confidence, isLocked]);
}

/**
 * Clamp each section's position to within ±MAX_POSITION_SHIFT
 * of its default index in the adaptive zone.
 *
 * Uses a greedy slot-filling approach:
 * 1. For each section, compute its allowed range [min, max]
 * 2. Assign sections to slots in priority order
 * 3. Each section gets the best available slot within its range
 */
function clampPositions(
  sorted: SectionConfig[],
  adaptiveZoneStart: number
): SectionConfig[] {
  const totalSlots = sorted.length;

  // Track which slots are taken
  const slotTaken = new Array(totalSlots).fill(false);

  // Result array
  const result = new Array<SectionConfig | null>(totalSlots).fill(null);

  // Process sections in priority order (sorted is already by priority)
  for (const section of sorted) {
    const defaultAdaptiveIdx = section.defaultIndex - adaptiveZoneStart;
    const minSlot = Math.max(
      0,
      defaultAdaptiveIdx - MAX_POSITION_SHIFT
    );
    const maxSlot = Math.min(
      totalSlots - 1,
      defaultAdaptiveIdx + MAX_POSITION_SHIFT
    );

    // Find the best available slot within the allowed range
    // Prefer the slot closest to the desired priority position
    let bestSlot = -1;
    let bestDistance = Infinity;

    // The desired slot is its position in the priority-sorted array
    const desiredSlot = sorted.indexOf(section);

    for (let slot = minSlot; slot <= maxSlot; slot++) {
      if (!slotTaken[slot]) {
        const distance = Math.abs(slot - desiredSlot);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSlot = slot;
        }
      }
    }

    // If no slot found within range (conflict), find nearest available
    if (bestSlot === -1) {
      for (let slot = 0; slot < totalSlots; slot++) {
        if (!slotTaken[slot]) {
          bestSlot = slot;
          break;
        }
      }
      // Log this edge case
      track("clamp_overflow", {
        section: section.key,
        defaultIndex: section.defaultIndex,
      });
    }

    if (bestSlot !== -1) {
      result[bestSlot] = section;
      slotTaken[bestSlot] = true;
    }
  }

  // Filter out nulls (shouldn't happen, but safety)
  return result.filter((s): s is SectionConfig => s !== null);
}

/**
 * Enforce narrative constraints (soft — best-effort).
 *
 * mustAppearAfter: section X should appear after sections Y, Z
 * mustAppearBefore: section X should appear before sections Y, Z
 *
 * If enforcing would require moving beyond ±2 from default,
 * the constraint is SKIPPED and logged.
 */
function enforceNarrativeConstraints(
  sections: SectionConfig[]
): SectionConfig[] {
  const result = [...sections];
  const ADAPTIVE_ZONE_START = 3;

  // Build key → index map
  const indexMap = new Map<string, number>();
  result.forEach((s, i) => indexMap.set(s.key, i));

  for (let i = 0; i < result.length; i++) {
    const section = result[i];

    // ── mustAppearAfter ──
    if (section.narrativeConstraints.mustAppearAfter) {
      for (const depKey of section.narrativeConstraints.mustAppearAfter) {
        const depIdx = indexMap.get(depKey);
        if (depIdx !== undefined && depIdx >= i) {
          // Dependency is at or after this section — violation
          // Try to swap, but ONLY if the swap keeps both within ±2
          const newPosForSection = depIdx + 1;
          const defaultAdaptiveIdx =
            section.defaultIndex - ADAPTIVE_ZONE_START;

          if (
            Math.abs(newPosForSection - defaultAdaptiveIdx) <=
            MAX_POSITION_SHIFT
          ) {
            // Safe to move — perform swap
            result.splice(i, 1);
            result.splice(
              Math.min(newPosForSection, result.length),
              0,
              section
            );
            // Rebuild index map
            result.forEach((s, idx) => indexMap.set(s.key, idx));
          } else {
            // Would violate ±2 — skip constraint
            track("narrative_constraint_skipped", {
              section: section.key,
              constraint: "mustAppearAfter",
              dependency: depKey,
              reason: "would_violate_max_shift",
            });
          }
        }
      }
    }

    // ── mustAppearBefore ──
    if (section.narrativeConstraints.mustAppearBefore) {
      for (const targetKey of section.narrativeConstraints.mustAppearBefore) {
        const targetIdx = indexMap.get(targetKey);
        if (targetIdx !== undefined && targetIdx <= i) {
          // Target is at or before this section — violation
          const newPosForSection = targetIdx;
          const defaultAdaptiveIdx =
            section.defaultIndex - ADAPTIVE_ZONE_START;

          if (
            Math.abs(newPosForSection - defaultAdaptiveIdx) <=
            MAX_POSITION_SHIFT
          ) {
            result.splice(i, 1);
            result.splice(newPosForSection, 0, section);
            result.forEach((s, idx) => indexMap.set(s.key, idx));
          } else {
            track("narrative_constraint_skipped", {
              section: section.key,
              constraint: "mustAppearBefore",
              target: targetKey,
              reason: "would_violate_max_shift",
            });
          }
        }
      }
    }
  }

  return result;
}
