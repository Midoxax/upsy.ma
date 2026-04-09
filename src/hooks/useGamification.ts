import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Level {
  level: number;
  name: string;
  name_fr: string | null;
  xp_required: number;
  color: string;
}

interface Badge {
  slug: string;
  name: string;
  name_fr: string | null;
  description: string | null;
  description_fr: string | null;
  icon: string;
  rarity: string;
  xp_reward: number;
}

interface UserProgress {
  xp_total: number;
  xp_this_week: number;
  streak_days: number;
  streak_best: number;
}

// ── Rarity styles ─────────────────────────────────────────────────────────────

export const RARITY_STYLES = {
  common: {
    border: "border-gray-300",
    bg: "bg-gray-100",
    text: "text-gray-600",
    glow: "",
  },
  uncommon: {
    border: "border-green-400",
    bg: "bg-green-50",
    text: "text-green-600",
    glow: "shadow-green-500/10",
  },
  rare: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-600",
    glow: "shadow-blue-500/15",
  },
  epic: {
    border: "border-purple-400",
    bg: "bg-purple-50",
    text: "text-purple-600",
    glow: "shadow-purple-500/20",
  },
  legendary: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
    glow: "shadow-amber-500/25",
  },
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useLevels = () =>
  useQuery({
    queryKey: ["gamification-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gamification_levels")
        .select("*")
        .order("level");
      if (error) throw error;
      return (data ?? []) as Level[];
    },
    staleTime: 60_000 * 30,
  });

export const useAllBadges = () =>
  useQuery({
    queryKey: ["gamification-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gamification_badges")
        .select("*")
        .order("rarity");
      if (error) throw error;
      return (data ?? []) as Badge[];
    },
    staleTime: 60_000 * 30,
  });

export const useUserProgress = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as UserProgress | null) ?? {
        xp_total: 0,
        xp_this_week: 0,
        streak_days: 0,
        streak_best: 0,
      };
    },
    enabled: !!user,
  });
};

export const useUserBadges = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_slug, earned_at")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []).map((b) => ({ slug: b.badge_slug, earned_at: b.earned_at }));
    },
    enabled: !!user,
  });
};

// ── Utility ───────────────────────────────────────────────────────────────────

export const getLevelInfo = (levels: Level[], xp: number) => {
  const sorted = [...levels].sort((a, b) => a.xp_required - b.xp_required);
  let current = sorted[0];
  let next: Level | null = null;

  for (let i = 0; i < sorted.length; i++) {
    if (xp >= sorted[i].xp_required) {
      current = sorted[i];
      next = sorted[i + 1] ?? null;
    }
  }

  const xpIntoLevel = xp - current.xp_required;
  const xpNeededForNext = next ? next.xp_required - current.xp_required : 1;
  const pct = next ? Math.min((xpIntoLevel / xpNeededForNext) * 100, 100) : 100;

  return { current, next, xpIntoLevel, xpNeededForNext, pct };
};
