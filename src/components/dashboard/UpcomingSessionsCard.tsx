import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Session {
  id: string;
  date_time: string;
  session_type: string;
  status: string;
  video_room_id: string | null;
  psychologist: { full_name: string } | null;
}

const UpcomingSessionsCard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("sessions")
        .select("id, date_time, session_type, status, video_room_id, psychologist:psychologist_profiles(full_name)")
        .eq("client_id", user.id)
        .eq("status", "confirmed")
        .gte("date_time", new Date().toISOString())
        .order("date_time", { ascending: true })
        .limit(5);
      if (data) setSessions(data as unknown as Session[]);
    };
    load();
  }, [user]);

  if (sessions.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="text-h3 flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        Upcoming Sessions
      </h3>
      <div className="space-y-3">
        {sessions.map((s) => {
          const dt = new Date(s.date_time);
          const isOnline = s.session_type === "online";
          return (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "var(--glass-bg)", border: "var(--glass-border)" }}
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {(s.psychologist as any)?.full_name || "Psychologist"}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(dt, "MMM d, h:mm a")}
                  </span>
                  <span className="flex items-center gap-1">
                    {isOnline ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {isOnline ? "Online" : "In-Person"}
                  </span>
                </div>
              </div>
              {isOnline && s.video_room_id && (
                <Button variant="primary" size="sm" asChild>
                  <Link to={`/session/${s.id}`}>
                    <Video className="h-4 w-4 mr-1" /> Join
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingSessionsCard;
