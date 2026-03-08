import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { BookingWidget } from "@/components/psychologists/BookingWidget";
import BookingModal from "@/components/psychologists/BookingModal";
import { PoliciesDrawer } from "@/components/psychologists/PoliciesDrawer";
import ReviewsList from "@/components/psychologists/ReviewsList";
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
  const { t, locale } = useLocale();
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);
  const [reviewStats, setReviewStats] = useState({ count: 0, avg: 0 });

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
    const fetchStats = async () => {
      const { data } = await supabase.from("reviews").select("rating").eq("psychologist_id", psychologist.id);
      if (data && data.length > 0) {
        const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
        setReviewStats({ count: data.length, avg: Math.round(avg * 10) / 10 });
      }
    };
    fetchStats();
  }, [psychologist]);

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
          <h2 className="text-h2 mb-2">{t('profile.notFound')}</h2>
          <p className="text-u-gray-300 mb-6">{t('profile.notFoundDesc')}</p>
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

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
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
              <Link to={addLocalePrefix("/psychologists", locale)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('profile.backToDirectory')}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative shrink-0">
              {psychologist.photo_url ? (
                <img src={psychologist.photo_url} alt={psychologist.full_name} className="w-32 h-32 rounded-full object-cover" style={{ border: '3px solid rgba(255,179,0,0.3)' }} loading="lazy" />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,179,0,0.1)', border: '3px solid rgba(255,179,0,0.3)' }}>
                  <User className="w-16 h-16 text-u-gold" />
                </div>
              )}
              {psychologist.is_accredited && (
                <div className="absolute -bottom-2 -right-2 bg-u-burgundy rounded-full p-2.5 shadow-lg">
                  <Award className="w-5 h-5 text-u-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-display mb-2">{psychologist.full_name}</h1>
                {psychologist.is_accredited && (
                  <Badge className="bg-u-burgundy/20 text-u-burgundy border-u-burgundy/30 hover:bg-u-burgundy/30">
                    <Award className="mr-1 h-3 w-3" />
                    {t('psychologists.accredited')}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-u-gray-300">
                {psychologist.city && (
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-u-gold" /><span>{psychologist.city}</span></div>
                )}
                {psychologist.languages.length > 0 && (
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-u-gold" /><span>{psychologist.languages.map((l) => l.name).join(", ")}</span></div>
                )}
                {psychologist.hourly_rate_mad && (
                  <div className="flex items-center gap-2">
                    <span className="text-u-gold font-bold text-lg">{psychologist.hourly_rate_mad} MAD</span>
                    <span className="text-u-gray-400 text-sm">{t('psychologists.perSession')}</span>
                  </div>
                )}
              </div>

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

      {/* Trust Seals */}
      <section className="liquid-bg" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-custom py-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {[
              ...(psychologist.is_accredited ? [{ icon: Award, label: t('profile.accreditedProfessional') }] : []),
              { icon: Briefcase, label: `${yearsExperience}+ ${t('profile.years')}` },
              ...(psychologist.languages.length > 0 ? [{ icon: Languages, label: `${psychologist.languages.length} ${t('common.languages')}` }] : []),
              ...(psychologist.specialties.length > 0 ? [{ icon: Shield, label: `${psychologist.specialties.length} ${t('common.specialties')}` }] : []),
            ].map((seal) => (
              <div key={seal.label} className="glass-card !p-3 !shadow-none !transform-none hover:!transform-none flex items-center gap-2">
                <seal.icon className="w-4 h-4 text-u-gold" />
                <span className="text-sm font-medium text-u-gray-200">{seal.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {reviewStats.count > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(reviewStats.avg) ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-foreground">{reviewStats.avg}</span>
                  <span className="text-sm text-muted-foreground">{t('profile.avgRating')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{reviewStats.count}</span>
                  <span className="text-sm text-muted-foreground">{t('profile.reviews')}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-foreground">98%</span>
              <span className="text-sm text-muted-foreground">{t('profile.responseRate')}</span>
            </div>
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* Main Content */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom lg:max-w-5xl xl:max-w-6xl">
          <div className="lg:pr-[340px] space-y-8">
            {psychologist.bio && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-u-gold" />
                    {t('profile.about')}
                  </h2>
                  <p className="text-u-gray-300 whitespace-pre-line leading-relaxed">{psychologist.bio}</p>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-u-gold" />
                  {t('profile.therapyApproach')}
                </h2>
                <div className="space-y-4">
                  {[
                    { method: t('profile.cbt'), desc: t('profile.cbtDesc') },
                    { method: t('profile.evidenceBased'), desc: t('profile.evidenceBasedDesc') },
                    { method: t('profile.clientCentered'), desc: t('profile.clientCenteredDesc') },
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

            {psychologist.specialties.length > 0 && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-u-gold" />
                    {t('profile.specialties')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {psychologist.specialties.map((s) => (
                      <Badge key={s.id} variant="outline" className="text-sm py-2 px-4 text-u-gray-200 border-white/10">{s.name}</Badge>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-u-gold" />
                  {t('profile.experienceTraining')}
                </h2>
                <div className="space-y-4">
                  {[
                    { label: t('profile.yearsOfPractice'), value: `${yearsExperience}+ ${t('profile.years')}` },
                    { label: t('profile.education'), value: t('profile.educationValue') },
                    { label: t('profile.certifications'), value: t('profile.certificationsValue') },
                    { label: t('profile.supervision'), value: t('profile.supervisionValue') },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-sm text-u-gray-400">{item.label}</span>
                      <span className="text-sm text-u-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {psychologist.hourly_rate_mad && (
              <ScrollReveal>
                <div className="glass-card p-7">
                  <h2 className="text-h3 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-u-gold" />
                    {t('profile.sessionFees')}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { duration: "30 min", rate: Math.round(psychologist.hourly_rate_mad * 0.5), label: t('profile.briefCheckin') },
                      { duration: "60 min", rate: psychologist.hourly_rate_mad, label: t('profile.standardSession') },
                      { duration: "90 min", rate: Math.round(psychologist.hourly_rate_mad * 1.5), label: t('profile.extendedSession') },
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

            <ScrollReveal>
              <div className="glass-card p-7">
                <h2 className="text-h3 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-u-gold" />
                  {t('profile.sessionOptions')}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {psychologist.offers_online && (
                    <Badge className="text-sm py-2 px-4 bg-u-gold/10 text-u-gold border-u-gold/20 hover:bg-u-gold/20">
                      <Globe className="mr-2 h-4 w-4" />
                      {t('booking.onlineSessions')}
                    </Badge>
                  )}
                  {psychologist.offers_in_person && (
                    <Badge className="text-sm py-2 px-4 bg-u-gold/10 text-u-gold border-u-gold/20 hover:bg-u-gold/20">
                      <MapPin className="mr-2 h-4 w-4" />
                      {t('booking.inPersonSessions')}
                    </Badge>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ReviewsList psychologistId={psychologist.id} />

            <ScrollReveal>
              <div className="glass-card p-10 text-center" id="booking">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-h3 mb-2">{t('booking.readyToBook')}</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  {t('booking.scheduleSession').replace('{name}', psychologist.full_name)}
                </p>
                <Button variant="primary" size="lg" onClick={() => setIsBookingModalOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('booking.bookSession')}
                </Button>
              </div>
            </ScrollReveal>

            {psychologist.is_accredited && (
              <ScrollReveal>
                <div className="glass-card p-7" style={{ background: 'linear-gradient(180deg, rgba(122,12,32,0.1), rgba(122,12,32,0.05))', border: '1px solid rgba(122,12,32,0.3)' }}>
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-u-burgundy shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-u-burgundy">{t('profile.accreditedProfessional')}</h3>
                      <p className="text-u-gray-300 text-sm leading-relaxed">{t('profile.accreditedDesc')}</p>
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
