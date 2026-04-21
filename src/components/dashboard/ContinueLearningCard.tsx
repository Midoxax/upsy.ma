import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight } from "lucide-react";

export default function ContinueLearningCard({ path }: { path?: "mental-health" | "performance" | "clinical-cpd" }) {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["continue-learning", user?.id, path],
    enabled: !!user,
    queryFn: async () => {
      const { data: enrs } = await supabase
        .from("course_enrollments")
        .select("*, courses(*)")
        .eq("user_id", user!.id)
        .is("completed_at", null)
        .order("started_at", { ascending: false })
        .limit(5);
      const list = (enrs ?? []).filter((e: any) => !path || e.courses?.learning_path === path);
      return list[0] ?? null;
    },
  });

  if (!data) return null;
  const c = (data as any).courses;
  return (
    <Link
      to={`/learn/${c.slug}`}
      className="block rounded-2xl border border-border bg-surface hover:border-primary/40 transition-colors p-4 group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Continue learning</p>
          <p className="font-semibold text-sm">{c.title}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <Progress value={Number((data as any).progress_percent ?? 0)} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground mt-1">{Math.round(Number((data as any).progress_percent ?? 0))}% complete</p>
    </Link>
  );
}