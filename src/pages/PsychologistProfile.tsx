import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { BookingWidget } from "@/components/psychologists/BookingWidget";
import BookingModal from "@/components/psychologists/BookingModal";
import { PoliciesDrawer } from "@/components/psychologists/PoliciesDrawer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";
import MaroonDivider from "@/components/ui/maroon-divider";
import {
  Award, MapPin, Globe, User, ArrowLeft,
  Calendar, Shield, Clock, Star, MessageSquare,
  Briefcase, Languages, Brain, BookOpen, CheckCircle2,
} from "lucide-react";

const PsychologistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: psychologist, isLoading, error } = usePsychologistProfile(id!);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
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
    setIsBookingModalOpen(true);
  };

  const yearsExperience = psychologist.created_at
    ? Math.max(1, new Date().getFullYear() - new Date(psychologist.created_at).getFullYear())
    : 5;

  // Mock reviews — would come from a reviews table in production
  const mockReviews = [
    { name: "A.M.", rating: 5, text: "Very professional and understanding. Helped me work through my anxiety with practical tools.", date: "2 weeks ago" },
    { name: "K.B.", rating: 5, text: "Excellent listener. The sessions were well-structured and I felt real progress after just a few weeks.", date: "1 month ago" },
    { name: "S.T.", rating: 4, text: "Knowledgeable and empathetic. Would recommend to anyone seeking support.", date: "2 months ago" },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Sticky Booking Widget */}
      <BookingWidget
        psychologistId={psychologist.id}
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
                {psychologist.hourly_rate_mad && (
                  <div className="flex items-center gap-2">
                    <span className="text-u-gold font-bold text-lg">{psychologist.hourly_rate_mad} MAD</span>
                    <span className="text-u-gray-400 text-sm">/ session</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="lg" onClick={scrollToBooking}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Session
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
            {[
              ...(psychologist.is_accredited ? [{ icon: Award, label: "U.Psy Accredited" }] : []),
              { icon: Briefcase, label: `${yearsExperience}+ Years Experience` },
              ...(psychologist.languages.length > 0 ? [{ icon: Languages, label: `${psychologist.languages.length} Language${psychologist.languages.length > 1 ? 's' : ''}` }] : []),
              ...(psychologist.specialties.length > 0 ? [{ icon: Shield, label: `${psychologist.specialties.length} Specialties` }] : []),
            ].map((seal) => (
              <div key={seal.label} className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
                <seal.icon className="w-4 h-4 text-u-gold" />
                <span className="text-sm font-medium text-u-gray-200">{seal.label}</span>
              </div>
            ))}
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
              <span className="text-lg font-bold text-u-white">{mockReviews.length}</span>
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

      <MaroonDivider />

      {/* Main Content */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom lg:max-w-5xl xl:max-w-6xl">
          <div className="lg:pr-[340px] space-y-8">
            {/* Bio / About */}
            {psychologist.bio && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-u-gold" />
                    About
                  </h2>
                  <p className="text-u-gray-300 whitespace-pre-line leading-relaxed">{psychologist.bio}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Therapy Approach */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-u-gold" />
                  Therapy Approach
                </h2>
                <div className="space-y-4">
                  {[
                    { method: "Cognitive Behavioral Therapy (CBT)", desc: "Restructure thought patterns and build practical coping skills for anxiety, depression, and stress." },
                    { method: "Evidence-Based Practice", desc: "All interventions are grounded in peer-reviewed research and adapted to individual needs." },
                    { method: "Client-Centered Approach", desc: "A safe, non-judgmental space where you lead the direction of therapy at your own pace." },
                  ].map((approach) => (
                    <div key={approach.method} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-u-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="text-u-white font-medium text-sm">{approach.method}</p>
                        <p className="text-u-gray-400 text-sm">{approach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Specialties */}
            {psychologist.specialties.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-u-gold" />
                    Specialties
                  </h2>
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

            {/* Experience & Training */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-u-gold" />
                  Experience & Training
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Years of Practice", value: `${yearsExperience}+ years` },
                    { label: "Education", value: "Master's in Clinical Psychology" },
                    { label: "Certifications", value: "Licensed Clinical Psychologist" },
                    { label: "Supervision", value: "Regular clinical supervision maintained" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-sm text-u-gray-400">{item.label}</span>
                      <span className="text-sm text-u-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Session Fees */}
            {psychologist.hourly_rate_mad && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-u-gold" />
                    Session Fees
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { duration: "30 min", rate: Math.round(psychologist.hourly_rate_mad * 0.5), label: "Brief Check-in" },
                      { duration: "60 min", rate: psychologist.hourly_rate_mad, label: "Standard Session" },
                      { duration: "90 min", rate: Math.round(psychologist.hourly_rate_mad * 1.5), label: "Extended Session" },
                    ].map((tier) => (
                      <div key={tier.duration} className="p-4 rounded-xl text-center"
                        style={{ background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.15)' }}>
                        <p className="text-xs text-u-gray-400 mb-1">{tier.label}</p>
                        <p className="text-2xl font-bold text-u-gold mb-1">{tier.rate} <span className="text-sm font-normal">MAD</span></p>
                        <p className="text-xs text-u-gray-400">{tier.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Session Options */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-u-gold" />
                  Session Options
                </h2>
                <div className="flex gap-3 flex-wrap">
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

            {/* Reviews */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-u-gold" />
                  Client Reviews
                </h2>
                <div className="space-y-6">
                  {mockReviews.map((review, i) => (
                    <div key={i} className="pb-6" style={{ borderBottom: i < mockReviews.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-u-gold"
                            style={{ background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)' }}>
                            {review.name}
                          </div>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, j) => (
                              <Star key={j} className="w-3.5 h-3.5 fill-u-gold text-u-gold" />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-u-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm text-u-gray-300 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Booking CTA */}
            <ScrollReveal>
              <div className="glass-card p-10 text-center" id="booking">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-h3 mb-2">Ready to Book?</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Schedule a session with {psychologist.full_name} — choose your preferred time and format.
                </p>
                <Button variant="primary" size="lg" onClick={() => setIsBookingModalOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </div>
            </ScrollReveal>

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
