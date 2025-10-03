import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { Heart, Users, Target, Sparkles } from "lucide-react";

interface Specialty {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
}

const GetMatched = () => {
  const [showModal, setShowModal] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [specialtiesRes, languagesRes] = await Promise.all([
        supabase.from("specialties").select("id, name").order("name"),
        supabase.from("languages").select("id, name").order("name"),
      ]);

      if (specialtiesRes.data) setSpecialties(specialtiesRes.data);
      if (languagesRes.data) setLanguages(languagesRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Psychologist Match</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Answer a few questions and we'll connect you with the best psychologists who match your specific needs,
              preferences, and budget.
            </p>
            <Button size="lg" onClick={() => setShowModal(true)}>
              Get Matched Now
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Tell Us Your Needs</CardTitle>
                <CardDescription>
                  Share what you're looking for: specialty, languages, budget, location, and session preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Get Matched</CardTitle>
                <CardDescription>
                  Our algorithm analyzes your preferences and matches you with the most suitable psychologists.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Choose & Connect</CardTitle>
                <CardDescription>
                  Review your top 3 matches, explore their profiles, and book a session directly with your preferred
                  psychologist.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Why Use Matching */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Why Use Our Matching Service?</h2>
              <div className="space-y-4 text-left">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">✓ Save Time</h3>
                    <p className="text-muted-foreground">
                      No need to browse through dozens of profiles. We find the best matches for you instantly.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">✓ Personalized Results</h3>
                    <p className="text-muted-foreground">
                      Our algorithm considers specialty, language, location, budget, and session type to ensure the
                      perfect fit.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">✓ Quality Assured</h3>
                    <p className="text-muted-foreground">
                      All psychologists are verified professionals, with many holding U.Psy accreditation.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Button size="lg" className="mt-8" onClick={() => setShowModal(true)}>
                Start Matching Process
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <MatchingFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        specialties={specialties}
        languages={languages}
      />
    </div>
  );
};

export default GetMatched;
