import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedPsychologistsSection = () => {
  const { data: psychologists } = useQuery({
    queryKey: ["featured-psychologists"],
    queryFn: async () => {
      const { data } = await supabase
        .from("psychologist_profiles")
        .select(`
          id, full_name, bio, photo_url, city, slug, hourly_rate_mad,
          offers_online, offers_in_person,
          psychologist_specialties(specialty_id, specialties(name)),
          psychologist_languages(language_id, languages(name))
        `)
        .eq("is_published", true)
        .limit(4);
      return data || [];
    },
  });

  const displayPsychologists = psychologists && psychologists.length > 0
    ? psychologists
    : [
        { id: "1", full_name: "Dr. Sarah Ahmed", city: "Casablanca", hourly_rate_mad: 500, slug: "sarah-ahmed", photo_url: null, offers_online: true, offers_in_person: true, bio: "Clinical Psychologist", psychologist_specialties: [{ specialties: { name: "CBT" } }], psychologist_languages: [{ languages: { name: "Arabic" } }, { languages: { name: "French" } }] },
        { id: "2", full_name: "Dr. Karim Benali", city: "Rabat", hourly_rate_mad: 600, slug: "karim-benali", photo_url: null, offers_online: true, offers_in_person: false, bio: "Sport Psychologist", psychologist_specialties: [{ specialties: { name: "Sport Psychology" } }], psychologist_languages: [{ languages: { name: "French" } }, { languages: { name: "English" } }] },
        { id: "3", full_name: "Dr. Amina Tazi", city: "Marrakech", hourly_rate_mad: 450, slug: "amina-tazi", photo_url: null, offers_online: true, offers_in_person: true, bio: "Schema Therapist", psychologist_specialties: [{ specialties: { name: "Schema Therapy" } }], psychologist_languages: [{ languages: { name: "Arabic" } }, { languages: { name: "English" } }] },
      ];

  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Meet Our Psychologists</h2>
            <p className="text-body text-u-gray-300">Licensed professionals ready to support your journey.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPsychologists.map((psych: any) => (
              <StaggerItem key={psych.id}>
                <div className="glass-card p-6 text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"
                    style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}>
                    {psych.photo_url ? (
                      <img src={psych.photo_url} alt={psych.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-u-gold text-2xl font-bold">
                        {psych.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-u-white mb-1">{psych.full_name}</h3>
                  <p className="text-sm text-u-gold mb-3">
                    {psych.psychologist_specialties?.[0]?.specialties?.name || psych.bio}
                  </p>
                  <div className="flex items-center justify-center gap-3 text-xs text-u-gray-300 mb-3">
                    {psych.city && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{psych.city}</span>
                    )}
                    {psych.offers_online && (
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Online</span>
                    )}
                  </div>
                  <p className="text-sm text-u-gray-300 mb-4">
                    {psych.psychologist_languages?.map((l: any) => l.languages?.name).filter(Boolean).join(" · ")}
                  </p>
                  {psych.hourly_rate_mad && (
                    <p className="text-u-gold font-semibold mb-4">{psych.hourly_rate_mad} MAD / session</p>
                  )}
                  <Button variant="primary" size="sm" asChild className="w-full">
                    <Link to={`/psychologists/${psych.slug}`}>Book Session</Link>
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/psychologists" className="inline-flex items-center gap-2">
              View All Psychologists <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPsychologistsSection;
