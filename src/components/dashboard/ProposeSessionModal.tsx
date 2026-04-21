import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useProposeSession } from "@/hooks/useProposeSession";
import { useSendMeetingLink } from "@/hooks/useSendMeetingLink";
import {
  Loader2,
  CalendarPlus,
  CheckCircle2,
  AlertTriangle,
  Video,
  Copy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
  defaultName?: string;
  defaultMode?: "propose" | "link";
}

export const ProposeSessionModal = ({
  open,
  onOpenChange,
  defaultEmail = "",
  defaultName = "",
  defaultMode = "propose",
}: Props) => {
  const { toast } = useToast();
  const propose = useProposeSession();
  const sendLink = useSendMeetingLink();
  const [mode, setMode] = useState<"propose" | "link">(defaultMode);

  useEffect(() => {
    if (open) setMode(defaultMode);
  }, [open, defaultMode]);

  const [clientEmail, setClientEmail] = useState(defaultEmail);
  const [clientName, setClientName] = useState(defaultName);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("50");
  const [type, setType] = useState<"video" | "in_person" | "phone">("video");
  const [notes, setNotes] = useState("");
  const [quickWhen, setQuickWhen] = useState<"now" | "15" | "60" | "custom">("now");
  const [slotCheck, setSlotCheck] = useState<
    { status: "idle" | "checking" | "ok" | "bad"; reason?: string }
  >({ status: "idle" });

  // Sync defaults when modal opens
  useEffect(() => {
    if (open) {
      setClientEmail(defaultEmail);
      setClientName(defaultName);
    }
  }, [open, defaultEmail, defaultName]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }, []);

  const scheduledAtIso = useMemo(() => {
    if (!date || !time) return null;
    const iso = new Date(`${date}T${time}`);
    return isNaN(iso.getTime()) ? null : iso.toISOString();
  }, [date, time]);

  // Live slot validation via RPC
  useEffect(() => {
    if (!scheduledAtIso) {
      setSlotCheck({ status: "idle" });
      return;
    }
    let cancelled = false;
    setSlotCheck({ status: "checking" });
    const run = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data, error } = await supabase.rpc("check_proposal_slot", {
        _psy: auth.user.id,
        _start: scheduledAtIso,
        _duration: parseInt(duration, 10),
      });
      if (cancelled) return;
      if (error) {
        setSlotCheck({ status: "bad", reason: "check_failed" });
        return;
      }
      const res = data as { ok: boolean; reason?: string } | null;
      if (res?.ok) setSlotCheck({ status: "ok" });
      else setSlotCheck({ status: "bad", reason: res?.reason });
    };
    const t = setTimeout(run, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [scheduledAtIso, duration]);

  const reasonMessage = (r?: string) => {
    switch (r) {
      case "too_soon":
        return "Must be at least 1 hour in the future.";
      case "outside_availability":
        return "Outside your configured weekly availability.";
      case "slot_conflict":
        return "Overlaps with an existing booking.";
      default:
        return "This slot can't be used.";
    }
  };

  const reset = () => {
    setClientEmail(defaultEmail);
    setClientName(defaultName);
    setDate("");
    setTime("");
    setDuration("50");
    setType("video");
    setNotes("");
    setQuickWhen("now");
    setSlotCheck({ status: "idle" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please provide client email, date and time.",
        variant: "destructive",
      });
      return;
    }
    const scheduled_at = new Date(`${date}T${time}`).toISOString();
    if (new Date(scheduled_at) < new Date()) {
      toast({
        title: "Invalid date",
        description: "The session must be scheduled in the future.",
        variant: "destructive",
      });
      return;
    }
    try {
      await propose.mutateAsync({
        client_email: clientEmail.trim().toLowerCase(),
        client_name: clientName.trim() || undefined,
        scheduled_at,
        duration_minutes: parseInt(duration, 10),
        session_type: type,
        notes: notes.trim() || undefined,
      });
      toast({
        title: "Invitation sent",
        description: `Your client will receive an email with the proposed time.`,
      });
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Could not send proposal",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Propose a session
          </DialogTitle>
          <DialogDescription>
            Send your client a meeting invitation. They'll receive an email with
            an Accept / Decline link, and see it in their dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client name</Label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Client email *</Label>
              <Input
                id="client-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="50">50 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Session type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video call</SelectItem>
                  <SelectItem value="in_person">In person</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note for client (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Follow-up on last week's exercise…"
              rows={3}
              maxLength={500}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            The invitation expires after 72 hours. Conformément à la loi 09-08,
            les données personnelles sont protégées.
          </p>

          {slotCheck.status !== "idle" && (
            <div
              className={
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs " +
                (slotCheck.status === "ok"
                  ? "border-green-500/30 bg-green-500/10 text-green-600"
                  : slotCheck.status === "checking"
                  ? "border-border bg-muted/40 text-muted-foreground"
                  : "border-destructive/30 bg-destructive/10 text-destructive")
              }
            >
              {slotCheck.status === "ok" && <CheckCircle2 className="h-3.5 w-3.5" />}
              {slotCheck.status === "checking" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {slotCheck.status === "bad" && <AlertTriangle className="h-3.5 w-3.5" />}
              <span>
                {slotCheck.status === "ok" && "Slot is available ✓"}
                {slotCheck.status === "checking" && "Checking availability…"}
                {slotCheck.status === "bad" && reasonMessage(slotCheck.reason)}
              </span>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={propose.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                propose.isPending ||
                slotCheck.status === "checking" ||
                slotCheck.status === "bad"
              }
            >
              {propose.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeSessionModal;