import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const PsychologistCardSkeleton = () => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-muted relative">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </Card>
  );
};
