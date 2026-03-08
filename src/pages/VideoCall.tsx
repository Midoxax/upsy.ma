import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Video, PhoneOff, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

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

      // Verify the user is a participant
      if (data.client_id !== user.id && data.psychologist_id !== user.id) {
        setError("You are not authorized to join this session.");
        setLoading(false);
        return;
      }

      if (data.status !== "confirmed") {
        setError("This session is not confirmed.");
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
