import { useState, useEffect } from "react";
import { Calendar, Clock, Globe2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingWidgetProps {
  calendlyUrl?: string | null;
  hourlyRate?: number | null;
  isAccredited: boolean;
  className?: string;
  onBookClick?: () => void;
}

export const BookingWidget = ({
  calendlyUrl,
  hourlyRate,
  isAccredited,
  className,
  onBookClick,
}: BookingWidgetProps) => {
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const nextSlots = [
    { date: "Today", time: "14:30" },
    { date: "Tomorrow", time: "10:00" },
    { date: "Wed", time: "15:00" },
  ];

  return (
    <>
      {/* Desktop: Sticky widget */}
      <div className={`hidden lg:block fixed top-24 right-8 w-80 z-40 ${className || ""}`}>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-u-gold" />
            <h3 className="font-semibold text-u-white">Book Your Session</h3>
          </div>

          {/* Next Available */}
          <div className="space-y-2">
            <p className="text-xs text-u-gray-400 font-medium uppercase tracking-wide">Next Available</p>
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
                  <Clock className="w-4 h-4 text-u-gold/60" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-u-white">{slot.date}</p>
                    <p className="text-xs text-u-gray-400">{slot.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-u-gray-400 group-hover:text-u-gold transition-colors" />
              </button>
            ))}
          </div>

          {/* Timezone */}
          <div className="flex items-center gap-2 text-xs text-u-gray-400 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Globe2 className="w-3.5 h-3.5 text-u-gold/60" />
            <span className="truncate">{timezone || "Detecting..."}</span>
          </div>

          {/* Fee */}
          {hourlyRate && (
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)' }}>
              <span className="text-sm text-u-gray-200">Session Fee</span>
              <span className="text-lg font-bold text-u-gold">{hourlyRate} MAD</span>
            </div>
          )}

          {/* Accreditation */}
          {isAccredited && (
            <div className="text-center text-xs text-u-gold/80 font-medium py-1">
              ✓ U.Psy Accredited
            </div>
          )}

          {/* Book Button */}
          <Button variant="primary" className="w-full" size="lg" onClick={onBookClick}>
            Book Now
          </Button>

          <p className="text-xs text-center text-u-gray-400">
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
              <p className="text-sm font-semibold text-u-white">Next: Today at 14:30</p>
              {hourlyRate && (
                <p className="text-xs text-u-gray-400">{hourlyRate} MAD / session</p>
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
