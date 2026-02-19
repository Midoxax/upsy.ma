import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import MatchingFormModal from "@/components/matching/MatchingFormModal";
import { BookingWidget } from "@/components/psychologists/BookingWidget";
import { PoliciesDrawer } from "@/components/psychologists/PoliciesDrawer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  MapPin,
  Globe,
  User,
  ArrowLeft,
  DollarSign,
  Calendar,
  Shield,
  Clock,
  Star,
  MessageSquare,
  Briefcase,
  Languages,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-h2 font-semibold">Psychologist Not Found</h2>
          <p className="text-muted-foreground">This profile is not available or has been removed.</p>
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
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate years of experience (mock - would come from psychologist data)
  const yearsExperience = psychologist.created_at 
    ? new Date().getFullYear() - new Date(psychologist.created_at).getFullYear() 
    : 5;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Sticky Booking Widget */}
      <BookingWidget 
        calendlyUrl={psychologist.calendly_url}
        hourlyRate={psychologist.hourly_rate_mad}
        isAccredited={psychologist.is_accredited}
        onBookClick={scrollToBooking}
      />

      {/* Hero Section */}
      <section className="bg-surface border-b border-border">
        <div className="container-custom py-12">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/psychologists">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <div className="relative">
              {psychologist.photo_url ? (
                <img
                  src={psychologist.photo_url}
                  alt={`${psychologist.full_name} - Professional psychologist headshot photo`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20"
                  role="img"
                  aria-label={`${psychologist.full_name} - No photo available`}
                >
                  <User className="w-16 h-16 text-primary" aria-hidden="true" />
                </div>
              )}
              {psychologist.is_accredited && (
                <div 
                  className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3 shadow-glow"
                  role="img"
                  aria-label="Accredited by U.Psy"
                >
                  <Award className="w-6 h-6 text-background" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-h1 font-bold mb-2">{psychologist.full_name}</h1>
                {psychologist.is_accredited && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Award className="mr-1 h-3 w-3" />
                    U.Psy Accredited
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {psychologist.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{psychologist.city}</span>
                  </div>
                )}
                {psychologist.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{psychologist.languages.map((lang) => lang.name).join(", ")}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                  size="lg"
                  onClick={scrollToBooking}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsMatchingModalOpen(true)}
                >
                  Get Matched
                </Button>
                <PoliciesDrawer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Seals & Social Proof */}
      <section className="border-b border-border bg-background">
        <div className="container-custom py-8">
          {/* Trust Seals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {psychologist.is_accredited && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <Award className="w-5 h-5 text-secondary" strokeWidth={2} />
                <span className="text-sm font-semibold text-foreground">U.Psy Accredited</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <Briefcase className="w-5 h-5 text-secondary" strokeWidth={2} />
              <span className="text-sm font-semibold text-foreground">{yearsExperience}+ Years Experience</span>
            </div>
            {psychologist.languages.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <Languages className="w-5 h-5 text-secondary" strokeWidth={2} />
                <span className="text-sm font-semibold text-foreground">{psychologist.languages.length} Language{psychologist.languages.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {psychologist.specialties.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <Shield className="w-5 h-5 text-secondary" strokeWidth={2} />
                <span className="text-sm font-semibold text-foreground">{psychologist.specialties.length} Specialties</span>
              </div>
            )}
          </div>

          {/* Social Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-center pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-lg font-bold text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">avg rating</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" strokeWidth={2} />
              <span className="text-lg font-bold text-foreground">127</span>
              <span className="text-sm text-muted-foreground">client reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" strokeWidth={2} />
              <span className="text-lg font-bold text-foreground">98%</span>
              <span className="text-sm text-muted-foreground">response rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-custom lg:max-w-5xl xl:max-w-6xl">
          <div className="lg:pr-[340px] space-y-8">
            {/* Bio */}
            {psychologist.bio && (
              <Card className="bg-white border-secondary/20">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body whitespace-pre-line">{psychologist.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Specialties */}
            {psychologist.specialties.length > 0 && (
              <Card className="bg-white border-secondary/20">
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {psychologist.specialties.map((specialty) => (
                      <Badge key={specialty.id} variant="outline" className="text-sm py-2 px-4 border-secondary/30">
                        {specialty.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fees */}
            {psychologist.hourly_rate_mad && (
              <Card className="bg-white border-secondary/20">
                <CardHeader>
                  <CardTitle>Session Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                      <Clock className="w-5 h-5 text-secondary" strokeWidth={2} />
                      <div>
                        <p className="text-sm text-muted-foreground">30 minutes</p>
                        <p className="text-lg font-semibold">{Math.round(psychologist.hourly_rate_mad * 0.5)} MAD</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                      <Clock className="w-5 h-5 text-secondary" strokeWidth={2} />
                      <div>
                        <p className="text-sm text-muted-foreground">60 minutes</p>
                        <p className="text-lg font-semibold">{psychologist.hourly_rate_mad} MAD</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                      <Clock className="w-5 h-5 text-secondary" strokeWidth={2} />
                      <div>
                        <p className="text-sm text-muted-foreground">90 minutes</p>
                        <p className="text-lg font-semibold">{Math.round(psychologist.hourly_rate_mad * 1.5)} MAD</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Options */}
            <Card className="bg-white border-secondary/20">
              <CardHeader>
                <CardTitle>Session Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {psychologist.offers_online && (
                    <Badge className="text-sm py-2 px-4 bg-secondary/10 text-secondary border-secondary/20">
                      <Globe className="mr-2 h-4 w-4" strokeWidth={2} />
                      Online Sessions
                    </Badge>
                  )}
                  {psychologist.offers_in_person && (
                    <Badge className="text-sm py-2 px-4 bg-secondary/10 text-secondary border-secondary/20">
                      <MapPin className="mr-2 h-4 w-4" strokeWidth={2} />
                      In-Person Sessions
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking/Availability */}
            {psychologist.calendly_url && (
              <Card className="bg-white border-secondary/20" id="booking">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" strokeWidth={2} />
                    Book Your Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="calendly-inline-widget w-full h-[600px] rounded-lg overflow-hidden bg-background"
                    data-url={psychologist.calendly_url}
                  />
                  <script
                    type="text/javascript"
                    src="https://assets.calendly.com/assets/external/widget.js"
                    async
                  />
                </CardContent>
              </Card>
            )}

            {/* Trust Note */}
            {psychologist.is_accredited && (
              <Card className="bg-secondary/10 border-secondary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-secondary flex-shrink-0 mt-1" strokeWidth={2} />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-secondary">
                        U.Psy-Accredited Professional
                      </h3>
                      <p className="text-muted-foreground">
                        This psychologist is verified and accredited by U.Psy, ensuring evidence-based
                        care and adherence to professional standards. All sessions are confidential and
                        conducted with the highest level of ethical practice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <MatchingFormModal open={isMatchingModalOpen} onClose={() => setIsMatchingModalOpen(false)} specialties={specialties} languages={languages} />
    </div>
  );
};

export default PsychologistProfile;
