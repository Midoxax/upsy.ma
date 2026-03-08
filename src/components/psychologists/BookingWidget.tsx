import { useState, useEffect } from "react";
import { Calendar, Clock, Globe2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BookingWidgetProps {
  psychologistId: string;
  calendlyUrl?: string | null;
  hourlyRate?: number | null;
  isAccredited: boolean;
  className?: string;
  onBookClick?: () => void;
}

export const BookingWidget = ({
  psychologistId,
  calendlyUrl,
  hourlyRate,
  isAccredited,
  className,
  onBookClick,
}: BookingWidgetProps) => {
  const [timezone, setTimezone] = useState<string>("");
  const [nextSlots, setNextSlots] = useState<{ date: string; time: string }[]>([]);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    const fetchNext = async () => {
      const { data } = await supabase
        .from("availability_slots")
        .select("day_of_week, start_time")
        .eq("psychologist_id", psychologistId)
        .eq("is_available", true)
        .order("day_of_week")
        .limit(3);

      if (data && data.length > 0) {
        const today = new Date();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const mapped = data.map((s) => {
          let diff = s.day_of_week - today.getDay();
          if (diff <= 0) diff += 7;
          const label = diff === 1 ? "Tomorrow" : dayNames[s.day_of_week];
          return { date: label, time: s.start_time.slice(0, 5) };
        });
        setNextSlots(mapped);
      } else {
        setNextSlots([
          { date: "Today", time: "14:30" },
          { date: "Tomorrow", time: "10:00" },
          { date: "Wed", time: "15:00" },
        ]);
      }
    };
    fetchNext();
  }, [psychologistId]);

  return (
    <>
      {/* Desktop: Sticky widget */}
      <div className={`hidden lg:block fixed top-24 right-8 w-80 z-40 ${className || ""}`}>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Book Your Session</h3>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Next Available</p>
            {nextSlots.map((slot, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-colors group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onClick={onBookClick}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary/60" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{slot.date}</p>
                    <p className="text-xs text-muted-foreground">{slot.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Globe2 className="w-3.5 h-3.5 text-primary/60" />
            <span className="truncate">{timezone || "Detecting..."}</span>
          </div>

          {hourlyRate && (
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)' }}>
              <span className="text-sm text-muted-foreground">Session Fee</span>
              <span className="text-lg font-bold text-primary">{hourlyRate} MAD</span>
            </div>
          )}

          {isAccredited && (
            <div className="text-center text-xs text-primary/80 font-medium py-1">
              ✓ U.Psy Accredited
            </div>
          )}

          <Button variant="primary" className="w-full" size="lg" onClick={onBookClick}>
            Book Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free cancellation up to 24h before
          </p>
        </div>
      </div>

      {/* Mobile: Bottom dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50" style={{
        background: 'rgba(26,26,26,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      }}>
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {nextSlots[0] ? `Next: ${nextSlots[0].date} at ${nextSlots[0].time}` : "Book a session"}
              </p>
              {hourlyRate && (
                <p className="text-xs text-muted-foreground">{hourlyRate} MAD / session</p>
              )}
            </div>
            <Button variant="primary" size="lg" onClick={onBookClick}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
