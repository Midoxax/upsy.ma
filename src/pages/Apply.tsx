import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().optional(),
  qualifications: z.string().max(1000).optional(),
  accreditation_number: z.string().max(100).optional(),
});

const Apply = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/apply/wizard", { replace: true });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Devenir psychologue partenaire</span>
          </div>
          <CardTitle className="text-3xl">Rejoignez U.Psy</CardTitle>
          <CardDescription>
            Pour soumettre votre dossier d'accréditation en toute sécurité (téléversement de pièces, historique, signature),
            vous devez d'abord créer un compte ou vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/auth?redirect=/apply/wizard")}>
            Créer mon compte ou me connecter <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Vos documents sont stockés dans un espace privé chiffré accessible uniquement à vous et à l'équipe d'accréditation.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Apply;

const _unused = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("psychologist_applications").insert({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        qualifications: values.qualifications || null,
        accreditation_number: values.accreditation_number || null,
        status: "pending",
      });
      if (error) throw error;
      toast({ title: t('apply.successTitle'), description: t('apply.successMessage') });
      navigate(addLocalePrefix("/", locale));
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message || t('apply.errorMessage'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{t('apply.title')}</CardTitle>
            <CardDescription>{t('apply.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="full_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.fullName')} <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Dr. John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.email')} <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.phone')}</FormLabel>
                    <FormControl><Input type="tel" placeholder="+212 6XX XXX XXX" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="qualifications" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.qualifications')}</FormLabel>
                    <FormControl><Textarea placeholder={t('apply.qualificationsPlaceholder')} rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="accreditation_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.accreditationNumber')}</FormLabel>
                    <FormControl><Input placeholder={t('apply.accreditationPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DataPrivacyNotice />
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate(addLocalePrefix("/", locale))} className="flex-1">
                    {t('apply.cancel')}
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? t('apply.submitting') : t('apply.submitApplication')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Apply;
