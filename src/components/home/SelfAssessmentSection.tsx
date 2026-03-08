import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Brain, Flame, HeartPulse } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const assessments = [
  { icon: HeartPulse, label: "Anxiety Screening", color: "hsl(348, 82%, 26%)" },
  { icon: Brain, label: "Stress Assessment", color: "#FFB300" },
  { icon: Flame, label: "Burnout Check", color: "#F4A300" },
];

const SelfAssessmentSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <div className="glass-card p-10 md:p-14 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}>
                <BarChart3 className="w-8 h-8 text-u-gold" />
              </div>
              <h2 className="text-h2 mb-4">Check Your Mental Health</h2>
              <p className="text-body text-u-gray-300 max-w-xl mx-auto mb-8">
                Take a quick self-assessment to understand your needs. Results will recommend resources or connect you with the right psychologist.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {assessments.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 glass-card !p-3 !shadow-none !transform-none hover:!transform-none">
                    <a.icon className="w-5 h-5" style={{ color: a.color }} />
                    <span className="text-sm text-u-gray-200 font-medium">{a.label}</span>
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
