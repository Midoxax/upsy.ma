import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePsychologistProfile } from "@/hooks/usePsychologistProfile";
import { MatchingFormModal } from "@/components/psychologists/MatchingFormModal";
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
} from "lucide-react";

const PsychologistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: psychologist, isLoading, error } = usePsychologistProfile(id!);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
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
                  alt={psychologist.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <User className="w-16 h-16 text-primary" />
                </div>
              )}
              {psychologist.is_accredited && (
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3 shadow-glow">
                  <Award className="w-6 h-6 text-background" />
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
                <Button variant="primary" size="lg" asChild>
                  <a href={`#booking`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Session
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsMatchingModalOpen(true)}
                >
                  Get Matched
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-custom max-w-4xl space-y-8">
          {/* Bio */}
          {psychologist.bio && (
            <Card className="bg-surface border-border">
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
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {psychologist.specialties.map((specialty) => (
                    <Badge key={specialty.id} variant="outline" className="text-sm py-2 px-4">
                      {specialty.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fees */}
          {psychologist.hourly_rate_mad && (
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Session Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">30 minutes</p>
                      <p className="text-lg font-semibold">{Math.round(psychologist.hourly_rate_mad * 0.5)} MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                      <p className="text-lg font-semibold">{psychologist.hourly_rate_mad} MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
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
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle>Session Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {psychologist.offers_online && (
                  <Badge variant="secondary" className="text-sm py-2 px-4">
                    <Globe className="mr-2 h-4 w-4" />
                    Online Sessions
                  </Badge>
                )}
                {psychologist.offers_in_person && (
                  <Badge variant="secondary" className="text-sm py-2 px-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    In-Person Sessions
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking/Availability */}
          {psychologist.calendly_url && (
            <Card className="bg-surface border-border" id="booking">
              <CardHeader>
                <CardTitle>Book Your Session</CardTitle>
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
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-primary">
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
      </section>

      <MatchingFormModal open={isMatchingModalOpen} onOpenChange={setIsMatchingModalOpen} />
    </div>
  );
};

export default PsychologistProfile;
