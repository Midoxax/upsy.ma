import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Brain, Clock, Flame, HeartPulse } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import MoodSpheres from "@/components/3d/MoodSpheres";

const assessments = [
  { icon: HeartPulse, label: "Anxiety Screening", className: "text-secondary" },
  { icon: Brain, label: "Stress Assessment", className: "text-primary" },
  { icon: Flame, label: "Burnout Check", className: "text-primary" },
];

const SelfAssessmentSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <div className="glass-card p-10 md:p-14 max-w-4xl mx-auto">
          {/* Mood Tracker Spheres */}
          <div className="h-48 md:h-56 mb-6 -mt-2">
            <MoodSpheres />
          </div>
          <ScrollReveal>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 border-2 border-primary/30">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                <Clock className="w-3 h-3" /> Takes only 2 minutes
              </span>
              <h2 className="text-h2 mb-4">Check Your Mental Health</h2>
              <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
                Take a quick self-assessment to understand your needs. Results will recommend resources or connect you with the right psychologist.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {assessments.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 glass-card !p-3 !shadow-none !transform-none hover:!transform-none">
                    <a.icon className={`w-5 h-5 ${a.className}`} />
                    <span className="text-sm text-muted-foreground font-medium">{a.label}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="lg" asChild>
                <Link to="/get-matched">Start Assessment</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SelfAssessmentSection;
