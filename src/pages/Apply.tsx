import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    qualifications: "",
    accreditation_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("psychologist_applications").insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        qualifications: formData.qualifications || null,
        accreditation_number: formData.accreditation_number || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Thank you for applying! You'll receive an email within 3-5 business days.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accreditation_number">Accreditation Number (U.Psy ID)</Label>
                <Input
                  id="accreditation_number"
                  name="accreditation_number"
                  value={formData.accreditation_number}
                  onChange={handleChange}
                  placeholder="U.Psy XXXXX"
                />
                <p className="text-sm text-muted-foreground">Optional - If you're accredited by U.Psy Morocco</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">
                  Qualifications & Experience <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your education, certifications, specialties, and professional experience..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Apply;
