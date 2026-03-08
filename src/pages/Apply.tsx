import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataPrivacyNotice from "@/components/DataPrivacyNotice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().optional(),
  qualifications: z.string().max(1000).optional(),
  accreditation_number: z.string().max(100).optional(),
});

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { full_name: "", email: "", phone: "", qualifications: "", accreditation_number: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
