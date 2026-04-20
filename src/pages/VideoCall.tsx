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
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [embedReady, setEmbedReady] = useState(false);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "disconnected">("connecting");

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

  // Log a session event (best-effort).
  const logEvent = useCallback(
    async (eventType: string, metadata?: Record<string, unknown>) => {
      if (!user || !sessionId) return;
      try {
        await supabase.from("session_events").insert([
          {
            booking_id: sessionData?.booking_id ?? null,
            session_id: sessionId,
            user_id: user.id,
            event_type: eventType,
            metadata: (metadata ?? null) as any,
          },
        ]);
      } catch (e) {
        // non-blocking
        console.warn("session_events insert failed", e);
      }
    },
    [user, sessionId, sessionData],
  );

  // Mount Jitsi External API once we have a roomId
  useEffect(() => {
    if (!roomId || !user || !containerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        await loadJitsiScript();
        if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;

        const displayName = user.user_metadata?.full_name || user.email || "Participant";
        const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName: roomId,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: { displayName, email: user.email ?? undefined },
          configOverwrite: {
            prejoinPageEnabled: true,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            enableClosePage: false,
            requireDisplayName: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: "#0F0F0F",
            TOOLBAR_BUTTONS: [
              "microphone", "camera", "desktop", "fullscreen",
              "fodeviceselection", "hangup", "chat", "raisehand",
              "videoquality", "tileview", "settings",
            ],
          },
        });
        apiRef.current = api;

        api.addListener("videoConferenceJoined", () => {
          setConnectionState("connected");
          setEmbedReady(true);
          logEvent("joined");
        });
        api.addListener("videoConferenceLeft", () => {
          setConnectionState("disconnected");
          logEvent("left");
          toast("Session ended");
          setTimeout(() => navigate("/dashboard"), 800);
        });
        api.addListener("readyToClose", () => {
          navigate("/dashboard");
        });
      } catch (e) {
        console.error(e);
        setError("Could not load the meeting room. Please check your connection and retry.");
        logEvent("connection_failed", { reason: (e as Error).message });
      }
    })();

    return () => {
      cancelled = true;
      try {
        apiRef.current?.dispose();
      } catch {
        /* ignore */
      }
      apiRef.current = null;
    };
  }, [roomId, user, navigate, logEvent]);

  const handleLeave = () => {
    try {
      apiRef.current?.executeCommand("hangup");
    } catch {
      /* ignore */
    }
    navigate("/dashboard");
  };

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
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              {connectionState === "connected" ? (
                <><Wifi className="h-3 w-3 text-primary" /> Connected</>
              ) : connectionState === "connecting" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Connecting…</>
              ) : (
                <><WifiOff className="h-3 w-3 text-destructive" /> Disconnected</>
              )}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLeave}
        >
          <PhoneOff className="h-4 w-4 mr-1" /> Leave
        </Button>
      </div>

      {/* Jitsi External API mount */}
      <div className="flex-1 relative bg-black">
        {!embedReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Preparing your secure room…</p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full absolute inset-0" />
      </div>
    </div>
  );
};

export default VideoCall;
