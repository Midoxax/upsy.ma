import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { BookingWidget } from "@/components/psychologists/BookingWidget";
import { PoliciesDrawer } from "@/components/psychologists/PoliciesDrawer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Award, MapPin, Globe, User, ArrowLeft,
  Calendar, Shield, Clock, Star, MessageSquare,
  Briefcase, Languages,
} from "lucide-react";

const PsychologistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: psychologist, isLoading, error } = usePsychologistProfile(id!);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [s, l] = await Promise.all([
        supabase.from("specialties").select("id, name").order("name"),
        supabase.from("languages").select("id, name").order("name"),
      ]);
      if (s.data) setSpecialties(s.data);
      if (l.data) setLanguages(l.data);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-u-gold"></div>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <User className="w-16 h-16 text-u-gray-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-h2 mb-2">Psychologist Not Found</h2>
          <p className="text-u-gray-300 mb-6">This profile is not available or has been removed.</p>
          <Button asChild variant="primary">
            <Link to="/psychologists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const yearsExperience = psychologist.created_at
    ? new Date().getFullYear() - new Date(psychologist.created_at).getFullYear()
    : 5;

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Sticky Booking Widget */}
      <BookingWidget
        calendlyUrl={psychologist.calendly_url}
        hourlyRate={psychologist.hourly_rate_mad}
        isAccredited={psychologist.is_accredited}
        onBookClick={scrollToBooking}
      />

      {/* Hero Section */}
      <section className="hero-neural-bg relative py-12">
        <div className="container-custom relative z-10">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="text-u-gray-300 hover:text-u-white">
              <Link to="/psychologists">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <div className="relative shrink-0">
              {psychologist.photo_url ? (
                <img
                  src={psychologist.photo_url}
                  alt={psychologist.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                  style={{ border: '3px solid rgba(255,179,0,0.3)' }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,179,0,0.1)', border: '3px solid rgba(255,179,0,0.3)' }}
                >
                  <User className="w-16 h-16 text-u-gold" />
                </div>
              )}
              {psychologist.is_accredited && (
                <div className="absolute -bottom-2 -right-2 bg-u-burgundy rounded-full p-2.5 shadow-lg">
                  <Award className="w-5 h-5 text-u-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-display mb-2">{psychologist.full_name}</h1>
                {psychologist.is_accredited && (
                  <Badge className="bg-u-burgundy/20 text-u-burgundy border-u-burgundy/30 hover:bg-u-burgundy/30">
                    <Award className="mr-1 h-3 w-3" />
                    U.Psy Accredited
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-u-gray-300">
                {psychologist.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-u-gold" />
                    <span>{psychologist.city}</span>
                  </div>
                )}
                {psychologist.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-u-gold" />
                    <span>{psychologist.languages.map((l) => l.name).join(", ")}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="lg" onClick={scrollToBooking}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setIsMatchingModalOpen(true)}>
                  Get Matched
                </Button>
                <PoliciesDrawer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Seals */}
      <section className="liquid-bg" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-custom py-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {psychologist.is_accredited && (
              <div className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
                <Award className="w-4 h-4 text-u-gold" />
                <span className="text-sm font-medium text-u-gray-200">U.Psy Accredited</span>
              </div>
            )}
            <div className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-u-gold" />
              <span className="text-sm font-medium text-u-gray-200">{yearsExperience}+ Years</span>
            </div>
            {psychologist.languages.length > 0 && (
              <div className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
                <Languages className="w-4 h-4 text-u-gold" />
                <span className="text-sm font-medium text-u-gray-200">{psychologist.languages.length} Language{psychologist.languages.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {psychologist.specialties.length > 0 && (
              <div className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
                <Shield className="w-4 h-4 text-u-gold" />
                <span className="text-sm font-medium text-u-gray-200">{psychologist.specialties.length} Specialties</span>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-u-gold text-u-gold" />
                ))}
              </div>
              <span className="text-lg font-bold text-u-white">4.9</span>
              <span className="text-sm text-u-gray-400">avg rating</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-u-gold" />
              <span className="text-lg font-bold text-u-white">127</span>
              <span className="text-sm text-u-gray-400">reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-u-gold" />
              <span className="text-lg font-bold text-u-white">98%</span>
              <span className="text-sm text-u-gray-400">response rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom lg:max-w-5xl xl:max-w-6xl">
          <div className="lg:pr-[340px] space-y-8">
            {/* Bio */}
            {psychologist.bio && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4">About</h2>
                  <p className="text-u-gray-300 whitespace-pre-line leading-relaxed">{psychologist.bio}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Specialties */}
            {psychologist.specialties.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {psychologist.specialties.map((s) => (
                      <Badge key={s.id} variant="outline" className="text-sm py-2 px-4 text-u-gray-200 border-white/10">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Fees */}
            {psychologist.hourly_rate_mad && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4">Session Fees</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { duration: "30 min", rate: Math.round(psychologist.hourly_rate_mad * 0.5) },
                      { duration: "60 min", rate: psychologist.hourly_rate_mad },
                      { duration: "90 min", rate: Math.round(psychologist.hourly_rate_mad * 1.5) },
                    ].map((tier) => (
                      <div key={tier.duration} className="flex items-center gap-3 p-4 rounded-xl"
                        style={{ background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.15)' }}>
                        <Clock className="w-5 h-5 text-u-gold" />
                        <div>
                          <p className="text-sm text-u-gray-400">{tier.duration}</p>
                          <p className="text-lg font-semibold text-u-gold">{tier.rate} MAD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Session Options */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4">Session Options</h2>
                <div className="flex gap-3">
                  {psychologist.offers_online && (
                    <Badge className="text-sm py-2 px-4 bg-u-gold/10 text-u-gold border-u-gold/20 hover:bg-u-gold/20">
                      <Globe className="mr-2 h-4 w-4" />
                      Online Sessions
                    </Badge>
                  )}
                  {psychologist.offers_in_person && (
                    <Badge className="text-sm py-2 px-4 bg-u-gold/10 text-u-gold border-u-gold/20 hover:bg-u-gold/20">
                      <MapPin className="mr-2 h-4 w-4" />
                      In-Person Sessions
                    </Badge>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Booking / Calendly */}
            {psychologist.calendly_url && (
              <ScrollReveal>
                <div className="glass-card p-7" id="booking">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-u-gold" />
                    <h2 className="text-h3">Book Your Session</h2>
                  </div>
                  <div
                    className="calendly-inline-widget w-full h-[600px] rounded-xl overflow-hidden"
                    data-url={psychologist.calendly_url}
                  />
                  <script
                    type="text/javascript"
                    src="https://assets.calendly.com/assets/external/widget.js"
                    async
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Trust Note */}
            {psychologist.is_accredited && (
              <ScrollReveal>
                <div className="glass-card p-7" style={{ background: 'linear-gradient(180deg, rgba(122,12,32,0.1), rgba(122,12,32,0.05))', border: '1px solid rgba(122,12,32,0.3)' }}>
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-u-burgundy shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-u-burgundy">
                        U.Psy-Accredited Professional
                      </h3>
                      <p className="text-u-gray-300 text-sm leading-relaxed">
                        This psychologist is verified and accredited by U.Psy, ensuring evidence-based
                        care and adherence to professional standards. All sessions are confidential and
                        conducted with the highest level of ethical practice.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      <MatchingFormModal
        open={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        specialties={specialties}
        languages={languages}
      />
    </div>
  );
};

export default PsychologistProfile;
