import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Brain } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

const OAuthButtons = ({ onGoogle, onApple, isGoogleLoading, isAppleLoading, t }: {
  onGoogle: () => void;
  onApple: () => void;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
  t: (key: string) => string;
}) => (
  <div className="space-y-3">
    <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={isGoogleLoading}>
      {isGoogleLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      {t('auth.continueWithGoogle')}
    </Button>
    <Button type="button" variant="outline" className="w-full" onClick={onApple} disabled={isAppleLoading}>
      {isAppleLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      )}
      {t('auth.continueWithApple') || 'Continue with Apple'}
    </Button>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-surface px-2 text-muted-foreground">{t('auth.orContinueWith')}</span>
      </div>
    </div>
  </div>
);

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);

  const throttle = () => {
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      toast({ title: "Please wait", description: "Too many attempts. Try again shortly.", variant: "destructive" });
      return true;
    }
    setLastAttempt(now);
    return false;
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const setter = provider === "google" ? setIsGoogleLoading : setIsAppleLoading;
    setter(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: t('auth.loginFailed'), description: String(error), variant: "destructive" });
      }
    } catch {
      toast({ title: t('auth.loginFailed'), description: `${provider} sign-in failed`, variant: "destructive" });
    } finally {
      setter(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (throttle()) return;
    setIsLoading(true);
    try {
      emailSchema.parse(loginData.email);
      passwordSchema.parse(loginData.password);
      const { error } = await signIn(loginData.email, loginData.password);
      if (error) {
        toast({ title: t('auth.loginFailed'), description: error.message, variant: "destructive" });
      } else {
        toast({ title: t('auth.welcomeBack'), description: t('auth.welcomeBackDesc') });
        navigate("/my-space");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: t('auth.validationError'), description: error.errors[0].message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (throttle()) return;
    setIsLoading(true);
    try {
      emailSchema.parse(signupData.email);
      passwordSchema.parse(signupData.password);
      if (!signupData.fullName.trim()) throw new Error("Full name is required");

      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
      if (error) {
        toast({ title: t('auth.signupFailed'), description: error.message, variant: "destructive" });
      } else {
        // Don't navigate — user must verify email first
        toast({
          title: t('auth.checkEmail') || "Check your email",
          description: t('auth.verifyEmailDesc') || "We sent a verification link to your email. Please confirm before signing in.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: t('auth.validationError'), description: error.errors[0].message, variant: "destructive" });
      } else if (error instanceof Error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-h2">{t('auth.portalTitle')}</CardTitle>
          <CardDescription>{t('auth.portalDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                <OAuthButtons
                  onGoogle={() => handleOAuth("google")}
                  onApple={() => handleOAuth("apple")}
                  isGoogleLoading={isGoogleLoading}
                  isAppleLoading={isAppleLoading}
                  t={t}
                />
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('auth.email')}</Label>
                    <Input id="login-email" type="email" required value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="your@email.com" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('auth.password')}</Label>
                    <Input id="login-password" type="password" required value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••" className="bg-background" />
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('auth.loggingIn')}</> : t('auth.login')}
                  </Button>
                  <button type="button"
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
                    onClick={async () => {
                      if (!loginData.email) {
                        toast({ title: t('auth.enterEmail'), description: t('auth.enterEmailDesc'), variant: "destructive" });
                        return;
                      }
                      try {
                        await supabase.auth.resetPasswordForEmail(loginData.email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        toast({ title: t('auth.checkEmail'), description: t('auth.checkEmailDesc') });
                      } catch {
                        toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
                      }
                    }}
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <OAuthButtons
                  onGoogle={() => handleOAuth("google")}
                  onApple={() => handleOAuth("apple")}
                  isGoogleLoading={isGoogleLoading}
                  isAppleLoading={isAppleLoading}
                  t={t}
                />
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
                    <Input id="signup-name" type="text" required value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      placeholder="Dr. John Doe" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.email')}</Label>
                    <Input id="signup-email" type="email" required value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="your@email.com" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.password')}</Label>
                    <Input id="signup-password" type="password" required value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="••••••••" className="bg-background" />
                    <p className="text-xs text-muted-foreground">Min 8 chars, uppercase, lowercase, and a number</p>
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('auth.creatingAccount')}</> : t('auth.createAccount')}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
