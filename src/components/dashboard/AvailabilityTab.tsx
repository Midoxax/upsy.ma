import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Plus, Trash2, Save, Clock } from "lucide-react";
import { usePsychologistSlots, useUpsertSlot, useDeleteSlot, usePsychologistBookings } from "@/hooks/useBooking";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/15 text-amber-600 border-amber-500/30",
  confirmed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  completed: "bg-green-500/15 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
  no_show:   "bg-gray-500/15 text-gray-500 border-gray-500/30",
};

export const AvailabilityTab = () => {
  const { toast } = useToast();
  const { data: slots = [], isLoading: slotsLoading } = usePsychologistSlots();
  const { data: bookings = [], isLoading: bookingsLoading } = usePsychologistBookings();
  const upsertSlot = useUpsertSlot();
  const deleteSlot = useDeleteSlot();

  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:00");

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.scheduled_at) >= new Date() && b.status !== "cancelled"
  );

  const slotsByDay = DAYS.map((_, i) => slots.filter((s) => s.day_of_week === i));

  const handleAddSlot = async (day: number) => {
    if (newStart >= newEnd) {
      toast({ title: "Invalid time", description: "End time must be after start time", variant: "destructive" });
      return;
    }
    try {
      await upsertSlot.mutateAsync({
        day_of_week: day,
        start_time: newStart,
        end_time: newEnd,
        session_duration_minutes: 50,
        is_active: true,
      });
      toast({ title: "Slot added" });
      setAddingDay(null);
    } catch (e) {
      toast({ title: "Failed to add slot", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlot.mutateAsync(id);
      toast({ title: "Slot removed" });
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly availability
          </CardTitle>
          <CardDescription>
            Set the recurring time slots when you're available for sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slotsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex items-start gap-4 py-3 border-b border-border/50 last:border-0">
                  <div className="w-12 text-sm font-medium text-muted-foreground pt-1">{day}</div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {slotsByDay[dayIndex].map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-2 bg-primary/8 border border-primary/20 text-primary rounded-lg px-3 py-1.5 text-sm"
                      >
                        <Clock className="h-3 w-3" />
                        {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="text-primary/50 hover:text-destructive transition-colors ml-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {addingDay === dayIndex ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newStart}
                          onChange={(e) => setNewStart(e.target.value)}
                          className="text-sm rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {HOURS.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <span className="text-muted-foreground text-xs">to</span>
                        <select
                          value={newEnd}
                          onChange={(e) => setNewEnd(e.target.value)}
                          className="text-sm rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {HOURS.filter((h) => h > newStart).map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <Button size="sm" onClick={() => handleAddSlot(dayIndex)} disabled={upsertSlot.isPending}>
                          {upsertSlot.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingDay(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingDay(dayIndex); setNewStart("09:00"); setNewEnd("10:00"); }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/40 rounded-lg px-3 py-1.5 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                        Add slot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Upcoming sessions
            {upcomingBookings.length > 0 && (
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20">
                {upcomingBookings.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Your confirmed and pending sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming sessions yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Set your availability above so patients can book with you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background"
                >
                  <div className="w-14 text-center flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.scheduled_at), "EEE")}
                    </p>
                    <p className="text-xl font-bold leading-none">
                      {format(new Date(booking.scheduled_at), "d")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.scheduled_at), "MMM")}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {(booking as any).patient_name ?? "Anonymous patient"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.scheduled_at), "HH:mm")} · {booking.duration_minutes}min · {booking.session_type}
                    </p>
                    {booking.patient_notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                        "{booking.patient_notes}"
                      </p>
                    )}
                  </div>
                  <Badge className={cn("text-xs border flex-shrink-0", STATUS_STYLES[booking.status] || "")}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
