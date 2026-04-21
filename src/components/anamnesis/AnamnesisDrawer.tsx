import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Check, AlertTriangle, Save, Loader2, ShieldCheck } from "lucide-react";
import { useAnamnesis, type AnamnesisSection } from "@/hooks/useAnamnesis";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clientId: string;
  clientName?: string;
  psychologistId?: string | null;
  bookingId?: string | null;
  onCrisisFlag?: () => void;
}

const STEPS: { key: AnamnesisSection; label: string; description: string }[] = [
  { key: "identity", label: "Identity", description: "Basic info and context" },
  { key: "presenting_complaint", label: "Reason for visit", description: "Main complaint and triggers" },
  { key: "history_personal", label: "Personal history", description: "Childhood, education, life events" },
  { key: "history_family", label: "Family history", description: "Family structure and mental health" },
  { key: "medical", label: "Medical", description: "Treatments, medications, prior therapy" },
  { key: "lifestyle", label: "Lifestyle", description: "Sleep, appetite, substances, support" },
  { key: "risk_screening", label: "Risk screening", description: "Safety questions" },
  { key: "goals", label: "Goals", description: "What client wants from therapy" },
];

const AnamnesisDrawer = ({ open, onOpenChange, clientId, clientName, psychologistId, bookingId, onCrisisFlag }: Props) => {
  const { data, loading, saving, autoSave, complete, giveConsent, progress } = useAnamnesis(clientId, psychologistId, bookingId);
  const { toast } = useToast();
  const [stepIdx, setStepIdx] = useState(0);
  const [local, setLocal] = useState<Record<string, any>>({});

  const step = STEPS[stepIdx];

  useEffect(() => {
    if (data) setLocal({ ...data[step.key] });
  }, [stepIdx, data, step.key]);

  const updateField = (field: string, value: any) => {
    const next = { ...local, [field]: value };
    setLocal(next);
    autoSave({ [step.key]: next } as any);

    // Crisis trigger
    if (step.key === "risk_screening" && (field === "suicidal_ideation" || field === "self_harm") && value === true) {
      onCrisisFlag?.();
      toast({
        title: "Important",
        description: "We've flagged this for immediate review. Crisis support is available.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    if (!data?.consent_given) {
      toast({ title: "Consent required", description: "Please confirm Law 09-08 consent first.", variant: "destructive" });
      return;
    }
    await complete();
    toast({ title: "Anamnesis completed", description: "Saved to client record." });
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (step.key) {
      case "identity":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Age</Label><Input type="number" value={local.age || ""} onChange={(e) => updateField("age", e.target.value)} /></div>
              <div><Label>Gender</Label><Input value={local.gender || ""} onChange={(e) => updateField("gender", e.target.value)} /></div>
            </div>
            <div><Label>Marital status</Label><Input value={local.marital_status || ""} onChange={(e) => updateField("marital_status", e.target.value)} /></div>
            <div><Label>Profession</Label><Input value={local.profession || ""} onChange={(e) => updateField("profession", e.target.value)} /></div>
            <div><Label>Children</Label><Input value={local.children || ""} onChange={(e) => updateField("children", e.target.value)} /></div>
          </div>
        );
      case "presenting_complaint":
        return (
          <div className="space-y-4">
            <div><Label>Main reason for seeking help</Label><Textarea rows={3} value={local.main_reason || ""} onChange={(e) => updateField("main_reason", e.target.value)} /></div>
            <div><Label>When did it start?</Label><Input value={local.onset || ""} onChange={(e) => updateField("onset", e.target.value)} /></div>
            <div><Label>Triggers</Label><Textarea rows={2} value={local.triggers || ""} onChange={(e) => updateField("triggers", e.target.value)} /></div>
            <div>
              <Label>Severity (1–10): {local.severity || 5}</Label>
              <Slider value={[local.severity || 5]} min={1} max={10} step={1} onValueChange={([v]) => updateField("severity", v)} />
            </div>
          </div>
        );
      case "history_personal":
        return (
          <div className="space-y-4">
            <div><Label>Childhood</Label><Textarea rows={3} value={local.childhood || ""} onChange={(e) => updateField("childhood", e.target.value)} /></div>
            <div><Label>Education</Label><Textarea rows={2} value={local.education || ""} onChange={(e) => updateField("education", e.target.value)} /></div>
            <div><Label>Key life events</Label><Textarea rows={3} value={local.key_events || ""} onChange={(e) => updateField("key_events", e.target.value)} /></div>
            <div><Label>Past traumas</Label><Textarea rows={3} value={local.traumas || ""} onChange={(e) => updateField("traumas", e.target.value)} /></div>
          </div>
        );
      case "history_family":
        return (
          <div className="space-y-4">
            <div><Label>Family structure</Label><Textarea rows={3} value={local.structure || ""} onChange={(e) => updateField("structure", e.target.value)} /></div>
            <div><Label>Family mental health history</Label><Textarea rows={3} value={local.mental_health || ""} onChange={(e) => updateField("mental_health", e.target.value)} /></div>
            <div><Label>Relationships quality</Label><Textarea rows={2} value={local.relationships || ""} onChange={(e) => updateField("relationships", e.target.value)} /></div>
          </div>
        );
      case "medical":
        return (
          <div className="space-y-4">
            <div><Label>Current medical conditions</Label><Textarea rows={2} value={local.conditions || ""} onChange={(e) => updateField("conditions", e.target.value)} /></div>
            <div><Label>Medications</Label><Textarea rows={2} value={local.medications || ""} onChange={(e) => updateField("medications", e.target.value)} /></div>
            <div><Label>Allergies</Label><Input value={local.allergies || ""} onChange={(e) => updateField("allergies", e.target.value)} /></div>
            <div><Label>Prior psychotherapy / psychiatry</Label><Textarea rows={2} value={local.prior_therapy || ""} onChange={(e) => updateField("prior_therapy", e.target.value)} /></div>
          </div>
        );
      case "lifestyle":
        return (
          <div className="space-y-4">
            <div><Label>Sleep</Label><Input value={local.sleep || ""} onChange={(e) => updateField("sleep", e.target.value)} placeholder="hours / quality" /></div>
            <div><Label>Appetite</Label><Input value={local.appetite || ""} onChange={(e) => updateField("appetite", e.target.value)} /></div>
            <div><Label>Substances (alcohol, tobacco, other)</Label><Textarea rows={2} value={local.substances || ""} onChange={(e) => updateField("substances", e.target.value)} /></div>
            <div><Label>Exercise</Label><Input value={local.exercise || ""} onChange={(e) => updateField("exercise", e.target.value)} /></div>
            <div><Label>Social support</Label><Textarea rows={2} value={local.social_support || ""} onChange={(e) => updateField("social_support", e.target.value)} /></div>
          </div>
        );
      case "risk_screening":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground/80 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <span>If any flag is positive, the SOS Amitié Maroc protocol will be offered.</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!local.suicidal_ideation} onCheckedChange={(v) => updateField("suicidal_ideation", v)} />
              <span className="text-sm">Current suicidal ideation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!local.self_harm} onCheckedChange={(v) => updateField("self_harm", v)} />
              <span className="text-sm">Recent self-harm</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!local.violence_risk} onCheckedChange={(v) => updateField("violence_risk", v)} />
              <span className="text-sm">Risk of violence to others</span>
            </label>
            <div><Label>Notes</Label><Textarea rows={3} value={local.notes || ""} onChange={(e) => updateField("notes", e.target.value)} /></div>
          </div>
        );
      case "goals":
        return (
          <div className="space-y-4">
            <div><Label>What does the client want from therapy?</Label><Textarea rows={4} value={local.therapy_goals || ""} onChange={(e) => updateField("therapy_goals", e.target.value)} /></div>
            <div><Label>Expected timeline</Label><Input value={local.timeline || ""} onChange={(e) => updateField("timeline", e.target.value)} /></div>
            <div><Label>Success indicators</Label><Textarea rows={3} value={local.success_indicators || ""} onChange={(e) => updateField("success_indicators", e.target.value)} /></div>
          </div>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            Anamnesis {clientName && <Badge variant="outline">{clientName}</Badge>}
          </SheetTitle>
          <SheetDescription>
            Step {stepIdx + 1} of {STEPS.length}: {step.label} — {step.description}
          </SheetDescription>
          <Progress value={progress} className="h-1.5 mt-2" />
        </SheetHeader>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="py-4">{renderStep()}</div>

            {!data?.consent_given && (
              <div className="rounded-lg border border-border bg-muted/40 p-3 my-4">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-foreground/80">
                  <Checkbox onCheckedChange={(v) => v && giveConsent()} />
                  <span>
                    <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-primary" />
                    Conformément à la loi 09-08, j'accepte que ces données personnelles soient utilisées pour mon suivi clinique.
                  </span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border sticky bottom-0 bg-background">
              <Button variant="ghost" size="sm" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <span className="text-xs text-muted-foreground">
                {saving ? <><Save className="inline h-3 w-3 mr-1 animate-pulse" /> Saving…</> : "Auto-saved"}
              </span>
              {stepIdx < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setStepIdx((i) => i + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleComplete}>
                  <Check className="h-4 w-4 mr-1" /> Complete
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AnamnesisDrawer;