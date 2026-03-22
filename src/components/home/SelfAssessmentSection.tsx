import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Brain, Clock, Flame, HeartPulse } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ScrollReveal from "@/components/ScrollReveal";
import MoodSpheres from "@/components/3d/MoodSpheres";

const SelfAssessmentSection = () => {
  const { t } = useLocale();

  const assessments = [
    { icon: HeartPulse, labelKey: "selfAssessment.anxiety" as const, fallback: "Anxiety Screening", className: "text-primary" },
    { icon: Brain, labelKey: "selfAssessment.stress" as const, fallback: "Stress Assessment", className: "text-primary" },
    { icon: Flame, labelKey: "selfAssessment.burnout" as const, fallback: "Burnout Check", className: "text-primary" },
  ];

  return (
    <section className="py-24 md:py-32 liquid-bg" id="self-assessment">
      <div className="container-custom">
        <div className="glass-card p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle warm glow behind */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.06), transparent 60%)'
          }} />

          {/* Mood Tracker Spheres */}
          <div className="h-48 md:h-56 mb-6 -mt-2 relative z-10">
            <MoodSpheres />
          </div>

          <ScrollReveal>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 border-2 border-primary/20">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/15 mb-4">
                <Clock className="w-3 h-3" /> {t("selfAssessment.duration") || "Takes only 2 minutes"}
              </span>
              <h2 className="text-h2 mb-4">{t("selfAssessment.title") || "Check Your Mental Health"}</h2>
              <p className="text-body text-muted-foreground max-w-xl mx-auto mb-4">
                {t("selfAssessment.subtitle") || "Take a quick self-assessment to understand your needs. Results will recommend resources or connect you with the right psychologist."}
              </p>
              <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-8 italic">
                {t("selfAssessment.reassurance") || "Your answers are completely confidential and never shared."}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {assessments.map((a) => (
                  <div key={a.fallback} className="flex items-center gap-2 glass-card !p-3 !shadow-none !transform-none hover:!transform-none">
                    <a.icon className={`w-5 h-5 ${a.className}`} />
                    <span className="text-sm text-muted-foreground font-medium">{t(a.labelKey) || a.fallback}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="lg" asChild>
                <Link to="/get-matched">{t("selfAssessment.cta") || "Start Assessment"}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SelfAssessmentSection;
