import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Video, PhoneOff, ArrowLeft, Loader2, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

// Allow joining the room from T-10min until T+duration+5min.
const JOIN_EARLY_MS = 10 * 60 * 1000;
const JOIN_LATE_BUFFER_MS = 5 * 60 * 1000;
const JITSI_DOMAIN = "meet.jit.si";
const JITSI_SCRIPT_SRC = `https://${JITSI_DOMAIN}/external_api.js`;

const loadJitsiScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${JITSI_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Jitsi")));
      return;
    }
    const s = document.createElement("script");
    s.src = JITSI_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Jitsi"));
    document.body.appendChild(s);
  });

const VideoCall = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    if (!user || !sessionId) return;

    const loadSession = async () => {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from("sessions")
        .select("*, psychologist:psychologist_profiles(full_name)")
        .eq("id", sessionId)
        .single();

      if (fetchErr || !data) {
        setError("Session not found.");
        setLoading(false);
        return;
      }

      // Verify the user is a participant.
      if (data.client_id !== user.id && data.psychologist_id !== user.id) {
        setError("You are not authorized to join this session.");
        setLoading(false);
        return;
      }

      // Status must be active.
      if (!["confirmed", "scheduled", "in_progress"].includes(data.status)) {
        setError("This session is not active.");
        setLoading(false);
        return;
      }

      // Time-window check: only allow joining near the scheduled time.
      const startsAt = new Date(data.date_time).getTime();
      const duration = (data.duration_minutes ?? 50) * 60 * 1000;
      const now = Date.now();
      if (now < startsAt - JOIN_EARLY_MS) {
        setError("This session has not opened yet. The room unlocks 10 minutes before the start time.");
        setLoading(false);
        return;
      }
      if (now > startsAt + duration + JOIN_LATE_BUFFER_MS) {
        setError("This session has ended.");
        setLoading(false);
        return;
      }

      setSessionData(data);
      setRoomId(data.video_room_id);
      setLoading(false);
    };

    loadSession();
  }, [user, sessionId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-h2 mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to join a video session.</p>
          <Button variant="primary" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-h2 mb-2">Cannot Join</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Build Jitsi Meet URL with config
  const displayName = encodeURIComponent(user.user_metadata?.full_name || user.email || "Participant");
  const jitsiUrl = `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=true&config.startWithAudioMuted=true&config.startWithVideoMuted=false&userInfo.displayName="${displayName}"`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            <Video className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Session with {sessionData?.psychologist?.full_name || "Psychologist"}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <PhoneOff className="h-4 w-4 mr-1" /> Leave
        </Button>
      </div>

      {/* Jitsi iframe */}
      <div className="flex-1 relative bg-black">
        <iframe
          ref={iframeRef}
          src={jitsiUrl}
          className="w-full h-full absolute inset-0"
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default VideoCall;
