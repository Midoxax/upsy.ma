import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { BookingWidget } from "@/components/psychologists/BookingWidget";
import BookingModal from "@/components/psychologists/BookingModal";
import { PoliciesDrawer } from "@/components/psychologists/PoliciesDrawer";
import ReviewsList from "@/components/psychologists/ReviewsList";
import SEOHead from "@/components/SEOHead";
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

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PsychologistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: psychologist, isLoading, error } = usePsychologistProfile(id!);
  const { t, locale } = useLocale();
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);
  const [reviewStats, setReviewStats] = useState({ count: 0, avg: 0 });
  const [availabilitySlots, setAvailabilitySlots] = useState<{ day_of_week: number; start_time: string; end_time: string }[]>([]);

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

  useEffect(() => {
    if (!psychologist) return;
    const fetchExtras = async () => {
      const [reviewsRes, slotsRes] = await Promise.all([
        supabase.from("reviews").select("rating").eq("psychologist_id", psychologist.id),
        supabase.from("availability_slots").select("day_of_week, start_time, end_time").eq("psychologist_id", psychologist.id).eq("is_available", true).order("day_of_week").order("start_time"),
      ]);
      if (reviewsRes.data && reviewsRes.data.length > 0) {
        const avg = reviewsRes.data.reduce((s, r) => s + r.rating, 0) / reviewsRes.data.length;
        setReviewStats({ count: reviewsRes.data.length, avg: Math.round(avg * 10) / 10 });
      }
      if (slotsRes.data) setAvailabilitySlots(slotsRes.data);
    };
    fetchExtras();
  }, [psychologist]);

  // Group availability by day
  const availabilityByDay = useMemo(() => {
    const map = new Map<number, string[]>();
    availabilitySlots.forEach((s) => {
      const existing = map.get(s.day_of_week) || [];
      existing.push(`${s.start_time.slice(0, 5)} – ${s.end_time.slice(0, 5)}`);
      map.set(s.day_of_week, existing);
    });
    return map;
  }, [availabilitySlots]);

  // Set page title
  useEffect(() => {
    if (psychologist) {
      document.title = `${psychologist.full_name} – Psychologist | U.Psy`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Book a session with ${psychologist.full_name}${psychologist.city ? ` in ${psychologist.city}` : ""}. ${psychologist.specialties.map(s => s.name).slice(0, 3).join(", ")}. Licensed psychologist on U.Psy.`);
      }
    }
  }, [psychologist]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-h2 mb-2">{t('profile.notFound')}</h2>
          <p className="text-muted-foreground mb-6">{t('profile.notFoundDesc')}</p>
          <Button asChild variant="primary">
            <Link to={addLocalePrefix("/psychologists", locale)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('profile.backToDirectory')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const scrollToBooking = () => setIsBookingModalOpen(true);

  const yearsExperience = psychologist.created_at
    ? Math.max(1, new Date().getFullYear() - new Date(psychologist.created_at).getFullYear())
    : 5;

  const therapyApproaches = psychologist.therapy_approaches || [];

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <SEOHead path={`/psychologists/${psychologist.slug}`} />
      
      <BookingWidget
        psychologistId={psychologist.id}
        calendlyUrl={psychologist.calendly_url}
        hourlyRate={psychologist.hourly_rate_mad}
        isAccredited={psychologist.is_accredited ?? false}
        onBookClick={scrollToBooking}
      />

      {/* Hero Banner */}
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 50%, hsl(var(--background)) 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--accent)) 0%, transparent 50%)' }} />
        <div className="container-custom relative z-10">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to={addLocalePrefix("/psychologists", locale)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('profile.backToDirectory')}
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
                  className="w-36 h-36 rounded-2xl object-cover shadow-xl"
                  style={{ border: '3px solid hsl(var(--primary) / 0.3)' }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-36 h-36 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'hsl(var(--primary) / 0.1)', border: '3px solid hsl(var(--primary) / 0.3)' }}
                >
                  <User className="w-16 h-16 text-primary" />
                </div>
              )}
              {psychologist.is_accredited && (
                <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2.5 shadow-lg">
                  <Award className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{psychologist.full_name}</h1>
                <div className="flex flex-wrap gap-2">
                  {psychologist.is_accredited && (
                    <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">
                      <Award className="mr-1 h-3 w-3" />
                      {t('psychologists.accredited')}
                    </Badge>
                  )}
                  {psychologist.offers_online && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <Globe className="mr-1 h-3 w-3" /> Online
                    </Badge>
                  )}
                  {psychologist.offers_in_person && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <MapPin className="mr-1 h-3 w-3" /> In-Person
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {psychologist.city && (
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /><span>{psychologist.city}</span></div>
                )}
                {psychologist.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary" />
                    <div className="flex gap-1.5">
                      {psychologist.languages.map((l) => (
                        <Badge key={l.id} variant="secondary" className="text-xs py-0.5 px-2">{l.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {psychologist.hourly_rate_mad && (
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-lg">{psychologist.hourly_rate_mad} MAD</span>
                    <span className="text-muted-foreground text-sm">/ session</span>
                  </div>
                )}
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="lg" onClick={scrollToBooking}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('booking.bookSession')}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setIsMatchingModalOpen(true)}>
                  {t('profile.getMatched')}
                </Button>
                <PoliciesDrawer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Band */}
      <section className="border-b border-border/50">
        <div className="container-custom py-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              ...(psychologist.is_accredited ? [{ icon: Award, label: t('profile.accreditedProfessional') }] : []),
              { icon: Briefcase, label: `${yearsExperience}+ ${t('profile.years')}` },
              ...(psychologist.languages.length > 0 ? [{ icon: Languages, label: `${psychologist.languages.length} ${t('common.languages')}` }] : []),
              ...(psychologist.specialties.length > 0 ? [{ icon: Shield, label: `${psychologist.specialties.length} ${t('common.specialties')}` }] : []),
            ].map((seal) => (
              <div key={seal.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <seal.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{seal.label}</span>
              </div>
            ))}
          </div>

          {(reviewStats.count > 0) && (
            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 mt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(reviewStats.avg) ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                  ))}
                </div>
                <span className="text-lg font-bold text-foreground">{reviewStats.avg}</span>
                <span className="text-sm text-muted-foreground">({reviewStats.count} {t('profile.reviews')})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-foreground">98%</span>
                <span className="text-sm text-muted-foreground">{t('profile.responseRate')}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <MaroonDivider />

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom lg:max-w-5xl xl:max-w-6xl">
          <div className="lg:pr-[340px] space-y-8">
            {/* About */}
            {psychologist.bio && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {t('profile.about')}
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{psychologist.bio}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Therapy Approaches (dynamic from DB) */}
            {therapyApproaches.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    {t('profile.therapyApproach')}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {therapyApproaches.map((approach) => (
                      <div key={approach.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground">{approach.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Fallback: hardcoded approaches if no DB data */}
            {therapyApproaches.length === 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    {t('profile.therapyApproach')}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { method: t('profile.cbt'), desc: t('profile.cbtDesc') },
                      { method: t('profile.evidenceBased'), desc: t('profile.evidenceBasedDesc') },
                      { method: t('profile.clientCentered'), desc: t('profile.clientCenteredDesc') },
                    ].map((approach) => (
                      <div key={approach.method} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-medium text-sm">{approach.method}</p>
                          <p className="text-muted-foreground text-sm">{approach.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Specialties */}
            {psychologist.specialties.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {t('profile.specialties')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {psychologist.specialties.map((s) => (
                      <Badge key={s.id} variant="outline" className="text-sm py-2 px-4 text-foreground border-border">{s.name}</Badge>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Weekly Availability Calendar */}
            {availabilitySlots.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-h3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Weekly Availability
                    </h2>
                    <Button variant="primary" size="sm" onClick={scrollToBooking}>
                      <Calendar className="mr-2 h-3.5 w-3.5" />
                      Book a Slot
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Day headers */}
                    {DAY_LABELS.map((day, i) => {
                      const hasSlots = availabilityByDay.has(i);
                      return (
                        <div key={day} className="text-center">
                          <p className={`text-xs font-semibold mb-2 ${hasSlots ? 'text-primary' : 'text-muted-foreground/40'}`}>{day}</p>
                          <div className={`rounded-xl p-2 min-h-[60px] flex flex-col items-center justify-center gap-1 ${hasSlots ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20 border border-transparent'}`}>
                            {hasSlots ? (
                              availabilityByDay.get(i)!.map((slot, j) => (
                                <span key={j} className="text-[10px] font-medium text-primary whitespace-nowrap">{slot.split(' – ')[0]}</span>
                              ))
                            ) : (
                              <span className="text-[10px] text-muted-foreground/40">—</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Times shown in your local timezone · Click "Book a Slot" to select a specific date
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Experience & Training */}
            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {t('profile.experienceTraining')}
                </h2>
                <div className="space-y-4">
                  {[
                    { label: t('profile.yearsOfPractice'), value: `${yearsExperience}+ ${t('profile.years')}` },
                    { label: t('profile.education'), value: t('profile.educationValue') },
                    { label: t('profile.certifications'), value: t('profile.certificationsValue') },
                    { label: t('profile.supervision'), value: t('profile.supervisionValue') },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm text-foreground font-medium">{item.value}</span>
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
                    <Clock className="w-5 h-5 text-primary" />
                    {t('profile.sessionFees')}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { duration: "30 min", rate: Math.round(psychologist.hourly_rate_mad * 0.5), label: t('profile.briefCheckin'), popular: false },
                      { duration: "60 min", rate: psychologist.hourly_rate_mad, label: t('profile.standardSession'), popular: true },
                      { duration: "90 min", rate: Math.round(psychologist.hourly_rate_mad * 1.5), label: t('profile.extendedSession'), popular: false },
                    ].map((tier) => (
                      <div
                        key={tier.duration}
                        className={`relative p-5 rounded-xl text-center transition-all cursor-pointer hover:scale-[1.02] ${tier.popular ? 'ring-2 ring-primary bg-primary/5' : 'bg-muted/30'}`}
                        onClick={scrollToBooking}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground mb-1">{tier.label}</p>
                        <p className="text-2xl font-bold text-primary mb-1">{tier.rate} <span className="text-sm font-normal">MAD</span></p>
                        <p className="text-xs text-muted-foreground">{tier.duration}</p>
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
                  <Globe className="w-5 h-5 text-primary" />
                  {t('profile.sessionOptions')}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {psychologist.offers_online && (
                    <Badge className="text-sm py-2 px-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <Globe className="mr-2 h-4 w-4" />
                      {t('booking.onlineSessions')}
                    </Badge>
                  )}
                  {psychologist.offers_in_person && (
                    <Badge className="text-sm py-2 px-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <MapPin className="mr-2 h-4 w-4" />
                      {t('booking.inPersonSessions')}
                    </Badge>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Reviews */}
            <ReviewsList psychologistId={psychologist.id} />

            {/* Final CTA */}
            <ScrollReveal>
              <div className="glass-card p-10 text-center" id="booking" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.05))' }}>
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-h3 mb-2">{t('booking.readyToBook')}</h2>
                <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
                  {t('booking.scheduleSession').replace('{name}', psychologist.full_name)}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="primary" size="lg" onClick={() => setIsBookingModalOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('booking.bookSession')}
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setIsMatchingModalOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('profile.getMatched')}
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Accreditation Notice */}
            {psychologist.is_accredited && (
              <ScrollReveal>
                <div className="glass-card p-7 bg-accent/5 border-accent/20">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-accent shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-accent">{t('profile.accreditedProfessional')}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{t('profile.accreditedDesc')}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      <MatchingFormModal open={isMatchingModalOpen} onClose={() => setIsMatchingModalOpen(false)} specialties={specialties} languages={languages} />
      <BookingModal open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} psychologistId={psychologist.id} psychologistName={psychologist.full_name} hourlyRate={psychologist.hourly_rate_mad} offersOnline={psychologist.offers_online} offersInPerson={psychologist.offers_in_person} city={psychologist.city} />
    </div>
  );
};

export default PsychologistProfile;
