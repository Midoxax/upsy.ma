import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().optional(),
  qualifications: z.string().max(1000, "Qualifications must be less than 1000 characters").optional(),
  accreditation_number: z.string().max(100, "Accreditation number must be less than 100 characters").optional(),
});

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      qualifications: "",
      accreditation_number: "",
    },
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

      toast({
        title: "Application Submitted",
        description: "Thank you for applying! You'll receive an email within 3-5 business days.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
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
            <CardTitle className="text-3xl">Apply to Join Our Network</CardTitle>
            <CardDescription>
              Become part of our professional psychology network. Fill out the form below and we'll review your
              application within 3-5 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} aria-label="Full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} aria-label="Email address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+212 6XX XXX XXX" {...field} aria-label="Phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your degrees, certifications, and professional experience..."
                          rows={4}
                          {...field}
                          aria-label="Qualifications and experience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accreditation_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accreditation Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your professional accreditation number" {...field} aria-label="Accreditation number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DataPrivacyNotice />

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Application"}
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
