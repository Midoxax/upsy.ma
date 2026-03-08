import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PsychologistProfile } from "@/types/psychologist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScrollReveal from "@/components/ScrollReveal";
import MaroonDivider from "@/components/ui/maroon-divider";
import {
  Heart, Brain, Shield, Clock, Globe, MapPin, Award, Star,
  Calendar, ArrowRight, ArrowLeft, CheckCircle2, User, Sparkles,
  Lock, ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Types ── */
interface AssessmentAnswers {
  feeling: string;
  needs: string[];
  wantToTalk: string;
  language: string;
  sessionType: string;
  gender: string;
}

const defaultAnswers: AssessmentAnswers = {
  feeling: "",
  needs: [],
  wantToTalk: "",
  language: "",
  sessionType: "",
  gender: "",
};

/* ── Option card ── */
const OptionCard = ({
  selected,
  onClick,
  icon: Icon,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  label: string;
  description?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
      selected
        ? "ring-2 ring-primary bg-primary/10"
        : "hover:bg-muted/40"
    }`}
    style={{
      background: selected ? undefined : "var(--glass-bg)",
      border: selected ? undefined : "var(--glass-border)",
    }}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className={`w-5 h-5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`} />}
      <div>
        <p className={`font-medium text-sm ${selected ? "text-primary" : "text-foreground"}`}>{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  </button>
);

/* ── Multi-select option ── */
const MultiOptionCard = ({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      selected
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
    style={
      selected
        ? {}
        : { background: "var(--glass-bg)", border: "var(--glass-border)" }
    }
  >
    {label}
  </button>
);

/* ── Assessment questions ── */
const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "feeling", label: "Wellbeing" },
  { id: "needs", label: "Needs" },
  { id: "preferences", label: "Preferences" },
  { id: "results", label: "Results" },
  { id: "matches", label: "Matches" },
];

const FEELING_OPTIONS = [
  { value: "calm", label: "Mostly calm", description: "I feel generally okay, looking for growth", icon: CheckCircle2 },
  { value: "stressed", label: "Sometimes stressed", description: "I experience occasional stress or worry", icon: Brain },
  { value: "overwhelmed", label: "Frequently overwhelmed", description: "I often feel anxious or unable to cope", icon: Heart },
  { value: "struggling", label: "Struggling significantly", description: "I'm having a hard time and need support now", icon: Shield },
];

const NEED_OPTIONS = [
  "Anxiety", "Stress", "Depression", "Relationships", "Trauma",
  "Sport Performance", "Burnout", "Self-esteem", "Grief", "Sleep Issues",
];

const GetMatched = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(defaultAnswers);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<(PsychologistProfile & { matchScore: number })[]>([]);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [s, l] = await Promise.all([
        supabase.from("specialties").select("id, name").order("name"),
        supabase.from("languages").select("id, name").order("name"),
      ]);
      if (s.data) setSpecialties(s.data);
      if (l.data) setLanguages(l.data);
    };
    fetch();
  }, []);

  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  const canProceed = () => {
    if (step === 0) return true; // welcome
    if (step === 1) return !!answers.feeling;
    if (step === 2) return answers.needs.length > 0;
    if (step === 3) return !!answers.language;
    return true;
  };

  const handleNext = () => {
    if (step === 3) {
      // Submit assessment → show results
      setStep(4);
    } else if (step === 4) {
      // Find matches
      findMatches();
    } else {
      setStep((s) => s + 1);
    }
  };

  const findMatches = async () => {
    setLoading(true);
    try {
      // Map needs to specialty IDs
      const needToSpecialty = answers.needs.map((need) => {
        const found = specialties.find((s) => s.name.toLowerCase() === need.toLowerCase());
        return found?.id;
      }).filter(Boolean) as string[];

      const languageId = languages.find(
        (l) => l.name.toLowerCase() === answers.language.toLowerCase()
      )?.id;

      const { data, error } = await supabase.functions.invoke("find-matches", {
        body: {
          specialtyNeeded: needToSpecialty[0] || specialties[0]?.id,
          languagesPreferred: languageId ? [languageId] : [],
          prefersOnline: answers.sessionType === "online",
        },
      });

      if (error) throw error;

      if (data?.success && data.matches) {
        // Add mock match scores
        const scored = data.matches.map((m: PsychologistProfile, i: number) => ({
          ...m,
          matchScore: Math.max(78, 98 - i * 4 - Math.floor(Math.random() * 3)),
        }));
        setMatches(scored);
      }
      setStep(5);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Unable to find matches. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleNeed = (need: string) => {
    setAnswers((a) => ({
      ...a,
      needs: a.needs.includes(need) ? a.needs.filter((n) => n !== need) : [...a.needs, need],
    }));
  };

  /* ── Step 0: Welcome ── */
  const renderWelcome = () => (
    <ScrollReveal>
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(255,179,0,0.1)", border: "2px solid rgba(255,179,0,0.3)" }}>
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-display leading-tight">Start Your Mental Health Journey</h1>
        <p className="text-body text-muted-foreground max-w-md mx-auto">
          Answer a few questions so we can recommend the best psychologist or program for you. It takes about <strong className="text-foreground">2 minutes</strong>.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-primary" />
          <span>Your answers remain confidential and are never shared.</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="primary" size="lg" onClick={() => setStep(1)}>
            Start Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/psychologists">Browse Psychologists Instead</Link>
          </Button>
        </div>
      </div>
    </ScrollReveal>
  );

  /* ── Step 1: Feeling ── */
  const renderFeeling = () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-h2">How have you been feeling recently?</h2>
        <p className="text-muted-foreground">There are no wrong answers — just be honest.</p>
      </div>
      <div className="space-y-3">
        {FEELING_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={answers.feeling === opt.value}
            onClick={() => setAnswers((a) => ({ ...a, feeling: opt.value }))}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>
    </div>
  );

  /* ── Step 2: Needs ── */
  const renderNeeds = () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-h2">What would you like help with?</h2>
        <p className="text-muted-foreground">Select all that apply.</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {NEED_OPTIONS.map((need) => (
          <MultiOptionCard key={need} label={need} selected={answers.needs.includes(need)} onClick={() => toggleNeed(need)} />
        ))}
      </div>
    </div>
  );

  /* ── Step 3: Preferences ── */
  const renderPreferences = () => (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Want to talk */}
      <div className="space-y-3">
        <h3 className="text-h3 text-center">Do you prefer speaking to someone?</h3>
        <div className="flex gap-2 justify-center">
          {["Yes", "Maybe", "Not sure yet"].map((opt) => (
            <MultiOptionCard key={opt} label={opt} selected={answers.wantToTalk === opt} onClick={() => setAnswers((a) => ({ ...a, wantToTalk: opt }))} />
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-h3 text-center">Preferred language</h3>
        <div className="flex gap-2 justify-center">
          {["Arabic", "French", "English"].map((lang) => (
            <MultiOptionCard key={lang} label={lang} selected={answers.language === lang} onClick={() => setAnswers((a) => ({ ...a, language: lang }))} />
          ))}
        </div>
      </div>

      {/* Session type */}
      <div className="space-y-3">
        <h3 className="text-h3 text-center">Session type preference</h3>
        <div className="flex gap-2 justify-center">
          {[
            { value: "online", label: "Online" },
            { value: "in-person", label: "In-Person" },
            { value: "either", label: "No preference" },
          ].map((opt) => (
            <MultiOptionCard key={opt.value} label={opt.label} selected={answers.sessionType === opt.value} onClick={() => setAnswers((a) => ({ ...a, sessionType: opt.value }))} />
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <h3 className="text-h3 text-center">Gender preference</h3>
        <div className="flex gap-2 justify-center">
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "any", label: "No preference" },
          ].map((opt) => (
            <MultiOptionCard key={opt.value} label={opt.label} selected={answers.gender === opt.value} onClick={() => setAnswers((a) => ({ ...a, gender: opt.value }))} />
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Step 4: Results ── */
  const renderResults = () => {
    const feelingLabels: Record<string, string> = {
      calm: "generally well but seeking growth",
      stressed: "some stress and occasional worry",
      overwhelmed: "frequent feelings of overwhelm or anxiety",
      struggling: "significant difficulty coping",
    };

    return (
      <ScrollReveal>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(255,179,0,0.1)", border: "2px solid rgba(255,179,0,0.3)" }}>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-h2">Your Assessment Summary</h2>

          <div className="glass-card p-6 text-left space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Your responses suggest you may be experiencing{" "}
              <strong className="text-foreground">{feelingLabels[answers.feeling] || "some challenges"}</strong>.
              {answers.needs.length > 0 && (
                <> You're interested in support with <strong className="text-foreground">{answers.needs.join(", ")}</strong>.</>
              )}
            </p>

            <div className="pt-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-sm font-medium text-foreground">We recommend:</p>
              <div className="space-y-2">
                {[
                  { icon: User, text: "Speak with a psychologist matched to your needs" },
                  { icon: Brain, text: "Explore mental health courses and exercises" },
                  { icon: Heart, text: "Try guided self-help tools between sessions" },
                ].map((rec) => (
                  <div key={rec.text} className="flex items-center gap-3">
                    <rec.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="primary" size="lg" onClick={handleNext} disabled={loading}>
              {loading ? "Finding Matches..." : "See Recommended Psychologists"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/resources">Explore Programs</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    );
  };

  /* ── Step 5: Matches ── */
  const renderMatches = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-h2">Your Top Matches</h2>
        <p className="text-muted-foreground">Based on your assessment, here are the best psychologists for you.</p>
      </div>

      {matches.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-h3 mb-2">No matches found</h3>
          <p className="text-muted-foreground mb-6">We couldn't find psychologists matching your exact criteria right now.</p>
          <Button variant="primary" asChild>
            <Link to="/psychologists">Browse All Psychologists</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((psychologist) => (
            <div key={psychologist.id} className="glass-card p-0 flex flex-col overflow-hidden">
              {/* Photo */}
              <div className="relative h-40 overflow-hidden" style={{ background: "rgba(255,179,0,0.03)" }}>
                {psychologist.photo_url ? (
                  <img src={psychologist.photo_url} alt={psychologist.full_name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-14 h-14 text-primary/30" />
                  </div>
                )}
                {/* Match score */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,179,0,0.9)", color: "hsl(var(--primary-foreground))" }}>
                  {psychologist.matchScore}% Match
                </div>
                {psychologist.is_accredited && (
                  <div className="absolute top-3 right-3 bg-secondary rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-secondary-foreground" />
                    <span className="text-[10px] text-secondary-foreground font-medium">Accredited</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground leading-tight">{psychologist.full_name}</h3>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-sm font-semibold text-primary">4.9</span>
                  </div>
                </div>

                {psychologist.specialties && psychologist.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {psychologist.specialties.slice(0, 3).map((s) => (
                      <Badge key={s.id} variant="outline" className="text-[11px] py-0.5">{s.name}</Badge>
                    ))}
                  </div>
                )}

                {psychologist.languages && psychologist.languages.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary/50" />
                    <span>{psychologist.languages.map((l) => l.name).join(" · ")}</span>
                  </div>
                )}

                {psychologist.city && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary/50" />
                    <span>{psychologist.city}</span>
                  </div>
                )}

                {psychologist.hourly_rate_mad && (
                  <p className="text-primary font-bold text-lg mb-4">
                    {psychologist.hourly_rate_mad} MAD <span className="text-xs font-normal text-muted-foreground">/ session</span>
                  </p>
                )}

                <div className="mt-auto flex gap-2">
                  <Button asChild variant="secondary" size="sm" className="flex-1">
                    <Link to={`/psychologists/${psychologist.slug}`}>View Profile</Link>
                  </Button>
                  <Button asChild variant="primary" size="sm" className="flex-1">
                    <Link to={`/psychologists/${psychologist.slug}#booking`}>
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      Book
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-4">
        <Button variant="ghost" asChild>
          <Link to="/psychologists">
            Browse All Psychologists
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );

  /* ── Main render ── */
  const stepRenderers = [renderWelcome, renderFeeling, renderNeeds, renderPreferences, renderResults, renderMatches];

  return (
    <div className="min-h-screen">
      {/* Progress bar */}
      {step > 0 && step < 5 && (
        <div className="sticky top-16 z-30 py-3" style={{ background: "rgba(26,26,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Step {step} of 4
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="hero-neural-bg relative py-16 md:py-24">
        <div className="container-custom relative z-10">
          {stepRenderers[step]()}

          {/* Navigation buttons for steps 1-3 */}
          {step >= 1 && step <= 3 && (
            <div className="flex justify-center pt-8">
              <Button variant="primary" size="lg" onClick={handleNext} disabled={!canProceed()}>
                {step === 3 ? "See My Results" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {step === 0 && (
        <>
          <MaroonDivider />
          {/* Trust strip */}
          <section className="liquid-bg py-12">
            <div className="container-custom">
              <div className="flex flex-wrap items-center justify-center gap-8">
                {[
                  { icon: Shield, label: "100% Confidential" },
                  { icon: Clock, label: "Takes 2 minutes" },
                  { icon: Brain, label: "Evidence-Based" },
                  { icon: Lock, label: "Data Protected" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default GetMatched;
