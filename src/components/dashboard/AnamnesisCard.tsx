import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnamnesis } from "@/hooks/useAnamnesis";
import AnamnesisDrawer from "@/components/anamnesis/AnamnesisDrawer";

const AnamnesisCard = () => {
  const { user } = useAuth();
  const { data, progress, loading } = useAnamnesis(user?.id);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const status = data?.status || "draft";
  const statusLabel: Record<string, string> = {
    draft: "Not started",
    in_progress: "In progress",
    completed: "Completed",
    reviewed: "Reviewed by therapist",
  };

  return (
    <>
      <Card className="glass-effect">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5 text-primary" />
            My intake (anamnesis)
            <Badge variant={status === "completed" ? "default" : "outline"} className="ml-auto text-[10px]">
              {statusLabel[status]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Pre-fill your clinical intake before your first session. Your therapist can review it together with you.
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <Button size="sm" className="w-full" onClick={() => setOpen(true)} disabled={loading}>
            {progress > 0 ? "Continue" : "Start intake"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
      <AnamnesisDrawer
        open={open}
        onOpenChange={setOpen}
        clientId={user.id}
      />
    </>
  );
};

export default AnamnesisCard;