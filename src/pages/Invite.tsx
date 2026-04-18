import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!code) {
      setValid(false);
      return;
    }
    (async () => {
      const { data } = await supabase.from("referrals").select("id, status").eq("code", code).maybeSingle();
      if (data) {
        sessionStorage.setItem("upsy_referral_code", code);
        setValid(true);
      } else {
        setValid(false);
      }
    })();
  }, [code]);

  return (
    <>
      <Helmet>
        <title>You're invited — U.Psy</title>
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full glass-card">
          <CardHeader>
            <CardTitle className="font-display text-center">
              {valid === null ? "Checking invitation…" : valid ? "You're invited 🎁" : "Invitation not found"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {valid === true && (
              <>
                <p className="text-sm text-muted-foreground">
                  A friend invited you to U.Psy. Sign up to claim your welcome bonus.
                </p>
                <Button onClick={() => navigate("/auth")} className="w-full" size="lg">
                  Continue to sign up
                </Button>
              </>
            )}
            {valid === false && (
              <Button onClick={() => navigate("/")} variant="outline">
                Back to home
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
