import { Skeleton } from "@/components/ui/skeleton";

export const PsychologistCardSkeleton = () => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 bg-white/5" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-20 bg-white/5" />
        <Skeleton className="h-5 w-24 bg-white/5" />
      </div>
      <Skeleton className="h-4 w-2/3 bg-white/5" />
      <Skeleton className="h-4 w-1/2 bg-white/5" />
      <Skeleton className="h-10 w-full bg-white/5" />
    </div>
  );
};
