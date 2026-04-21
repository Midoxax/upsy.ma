import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ChevronRight, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnamnesis } from "@/hooks/useAnamnesis";
import AnamnesisDrawer from "@/components/anamnesis/AnamnesisDrawer";
import { useLocale } from "@/contexts/LocaleContext";
import jsPDF from "jspdf";

const AnamnesisCard = () => {
  const { user } = useAuth();
  const { data, progress, loading } = useAnamnesis(user?.id);
  const [open, setOpen] = useState(false);
  const { t, locale } = useLocale();

  if (!user) return null;

  const status = data?.status || "draft";
  const statusLabel: Record<string, string> = {
    draft: t("anamnesis.notStarted"),
    in_progress: t("anamnesis.inProgress"),
    completed: t("anamnesis.completed"),
    reviewed: t("anamnesis.reviewed"),
  };

  const STEP_KEYS = ["identity","presenting_complaint","history_personal","history_family","medical","lifestyle","risk_screening","goals"] as const;

  const handleDownloadPdf = () => {
    if (!data) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;
    doc.setFontSize(16);
    doc.text("U.Psy — " + t("anamnesis.title"), margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(new Date().toLocaleDateString(locale), margin, y);
    y += 10;
    doc.setTextColor(0);
    for (const sec of STEP_KEYS) {
      const secData: any = (data as any)[sec] || {};
      if (Object.keys(secData).length === 0) continue;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t(`anamnesis.steps.${sec}.label`), margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const [k, v] of Object.entries(secData)) {
        if (v == null || v === "") continue;
        const label = t(`anamnesis.fields.${k}`) || k;
        const val = typeof v === "boolean" ? (v ? t("anamnesis.yes") : t("anamnesis.no")) : String(v);
        const lines = doc.splitTextToSize(`${label}: ${val}`, 180);
        if (y + lines.length * 5 > 285) { doc.addPage(); y = 20; }
        doc.text(lines, margin, y);
        y += lines.length * 5 + 1;
      }
      y += 4;
    }
    doc.save(`anamnesis-${user.id}.pdf`);
  };

  return (
    <>
      <Card className="glass-effect">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5 text-primary" />
            {t("anamnesis.myIntake")}
            <Badge variant={status === "completed" ? "default" : "outline"} className="ml-auto text-[10px]">
              {statusLabel[status]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {t("anamnesis.cardHelp")}
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t("anamnesis.progress")}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <Button size="sm" className="w-full" onClick={() => setOpen(true)} disabled={loading}>
            {progress > 0 ? t("anamnesis.continue") : t("anamnesis.start")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          {status === "reviewed" && (
            <Button size="sm" variant="outline" className="w-full" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-1" /> {t("anamnesis.downloadPdf")}
            </Button>
          )}
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