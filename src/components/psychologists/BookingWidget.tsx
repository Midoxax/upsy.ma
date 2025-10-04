import { useState, useEffect } from "react";
import { Calendar, Clock, Globe2, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingWidgetProps {
  calendlyUrl?: string;
  hourlyRate?: number;
  isAccredited: boolean;
  className?: string;
  onBookClick?: () => void;
}

export const BookingWidget = ({ 
  calendlyUrl, 
  hourlyRate, 
  isAccredited,
  className,
  onBookClick 
}: BookingWidgetProps) => {
  const [timezone, setTimezone] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Detect user's timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, []);

  useEffect(() => {
    // Handle sticky behavior on scroll (desktop only)
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsSticky(window.scrollY > 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock next available slots - in production, fetch from Calendly/Cal.com API
  const nextSlots = [
    { date: "Today", time: "14:30" },
    { date: "Tomorrow", time: "10:00" },
    { date: "Wed, Jan 10", time: "15:00" }
  ];

  return (
    <>
      {/* Desktop: Sticky top-right widget */}
      <div className={cn(
        "hidden lg:block fixed top-24 right-8 w-80 z-40 transition-all duration-300",
        isSticky ? "translate-y-0 opacity-100" : "translate-y-0 opacity-100",
        className
      )}>
        <Card className="bg-white border-secondary/20 shadow-card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" strokeWidth={2} />
              Book Your Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Next Available Slots */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Next Available</p>
              <div className="space-y-2">
                {nextSlots.map((slot, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-secondary/40 hover:bg-secondary/5 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-secondary" strokeWidth={2} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{slot.date}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
              <Globe2 className="w-4 h-4 text-secondary" strokeWidth={2} />
              <span className="truncate">{timezone || "Loading timezone..."}</span>
            </div>

            {/* Fee */}
            {hourlyRate && (
              <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" strokeWidth={2} />
                  <span className="text-sm font-medium text-foreground">Session Fee</span>
                </div>
                <span className="text-lg font-bold text-foreground">{hourlyRate} MAD</span>
              </div>
            )}

            {/* Accreditation Badge */}
            {isAccredited && (
              <Badge className="w-full justify-center bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
                ✓ U.Psy Accredited
              </Badge>
            )}

            {/* Book Now Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
              onClick={onBookClick}
            >
              Book Now
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Free cancellation up to 24h before
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Bottom dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-secondary/20 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] backdrop-blur-lg">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Next: Today at 14:30</p>
              {hourlyRate && (
                <p className="text-xs text-muted-foreground">{hourlyRate} MAD / session</p>
              )}
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap"
              size="lg"
              onClick={onBookClick}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
