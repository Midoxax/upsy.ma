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

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setIsLoading(true);

    try {
      emailSchema.parse(signupData.email);
      passwordSchema.parse(signupData.password);

      if (!signupData.fullName.trim()) {
        throw new Error("Full name is required");
      }

      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);

      if (error) {
        toast({ title: t('auth.signupFailed'), description: error.message, variant: "destructive" });
      } else {
        toast({ title: t('auth.welcomeNew'), description: t('auth.welcomeNewDesc') });
        navigate("/my-space");
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
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="bg-background"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('auth.loggingIn')}</>
                  ) : (
                    t('auth.login')
                  )}
                </Button>
                <button
                  type="button"
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
                  onClick={async () => {
                    if (!loginData.email) {
                      toast({ title: t('auth.enterEmail'), description: t('auth.enterEmailDesc'), variant: "destructive" });
                      return;
                    }
                    try {
                      await supabase.auth.resetPasswordForEmail(loginData.email, {
                        redirectTo: `${window.location.origin}/auth`,
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
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    required
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Dr. John Doe"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('auth.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('auth.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="••••••••"
                    className="bg-background"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('auth.creatingAccount')}</>
                  ) : (
                    t('auth.createAccount')
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;