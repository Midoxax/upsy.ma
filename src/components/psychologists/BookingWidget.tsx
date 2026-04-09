import { useState } from "react";
import { format, addDays, startOfDay, isSameDay, isPast } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { Calendar, Clock, Video, MapPin, Phone, ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAvailableSlots, useCreateBooking } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";

interface BookingWidgetProps {
  psychologistId: string;
  psychologistName: string;
  hourlyRate?: number;
  offersOnline?: boolean;
  offersInPerson?: boolean;
}

const SESSION_TYPES = [
  { value: "video", label: "Video call", icon: Video },
  { value: "in_person", label: "In person", icon: MapPin },
  { value: "phone", label: "Phone call", icon: Phone },
] as const;

type SessionType = "video" | "in_person" | "phone";

export const BookingWidget = ({
  psychologistId,
  psychologistName,
  hourlyRate,
  offersOnline = true,
  offersInPerson = false,
}: BookingWidgetProps) => {
  const { locale } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();

  const dateLocale = locale === "fr" ? fr : locale === "ar" ? ar : undefined;

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<SessionType>("video");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"date" | "slot" | "confirm" | "success">("date");

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfDay(new Date()), weekOffset * 7 + i)
  );

  const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(
    psychologistId,
    selectedDate
  );
  const createBooking = useCreateBooking();

  const availableSlots = slots.filter((s) => s.is_available);

  const handleDateSelect = (date: Date) => {
    if (isPast(date) && !isSameDay(date, new Date())) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("slot");
  };

  const handleSlotSelect = (slotStart: string) => {
    setSelectedSlot(slotStart);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !user) return;
    try {
      await createBooking.mutateAsync({
        psychologist_id: psychologistId,
        scheduled_at: selectedSlot,
        session_type: sessionType,
        duration_minutes: 50,
        patient_notes: notes || undefined,
        amount_mad: hourlyRate ?? undefined,
      });
      setStep("success");
    } catch (err) {
      toast({
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Session requested</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {psychologistName} will confirm your session on{" "}
            {selectedDate && format(selectedDate, "EEEE d MMMM", { locale: dateLocale })} at{" "}
            {selectedSlot && format(new Date(selectedSlot), "HH:mm")}.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          You'll receive a confirmation email once the psychologist accepts.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStep("date");
            setSelectedDate(null);
            setSelectedSlot(null);
            setNotes("");
          }}
        >
          Book another session
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
          disabled={weekOffset === 0}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {format(weekDays[0], "MMM d", { locale: dateLocale })} –{" "}
          {format(weekDays[6], "MMM d, yyyy", { locale: dateLocale })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => w + 1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const past = isPast(day) && !isSameDay(day, new Date());
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateSelect(day)}
              disabled={past}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all",
                "hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed",
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary"
                  : "text-foreground"
              )}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-60">
                {format(day, "EEE", { locale: dateLocale }).slice(0, 2)}
              </span>
              <span className="text-sm font-semibold">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {step !== "date" && selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(selectedDate, "EEEE, MMMM d", { locale: dateLocale })}
            </span>
          </div>

          {slotsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No available slots on this day. Try another date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const time = format(new Date(slot.slot_start), "HH:mm");
                const isSelectedSlot = selectedSlot === slot.slot_start;
                return (
                  <button
                    key={slot.slot_start}
                    onClick={() => handleSlotSelect(slot.slot_start)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all",
                      isSelectedSlot
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation step */}
      {step === "confirm" && selectedSlot && (
        <div className="space-y-4 border border-border rounded-xl p-4 bg-background">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Session type
            </p>
            <div className="flex gap-2 flex-wrap">
              {SESSION_TYPES.filter(
                (t) => t.value !== "in_person" || offersInPerson
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSessionType(value as SessionType)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all",
                    sessionType === value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm space-y-1 text-muted-foreground">
            <p><span className="text-foreground font-medium">With:</span> {psychologistName}</p>
            <p>
              <span className="text-foreground font-medium">When:</span>{" "}
              {format(new Date(selectedSlot), "EEEE d MMMM 'at' HH:mm", { locale: dateLocale })}
            </p>
            <p><span className="text-foreground font-medium">Duration:</span> 50 minutes</p>
            {hourlyRate && (
              <p><span className="text-foreground font-medium">Fee:</span> {hourlyRate} MAD</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Notes for the psychologist (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brief description of what you'd like to work on..."
              rows={3}
              className="bg-surface text-sm resize-none"
            />
          </div>

          {!user && (
            <p className="text-xs text-amber-600 bg-amber-500/10 rounded-lg px-3 py-2">
              You need to be signed in to book a session.
            </p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep("slot")} className="flex-1">
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={createBooking.isPending || !user}
              className="flex-1"
            >
              {createBooking.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm booking"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
