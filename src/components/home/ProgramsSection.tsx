import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Activity, Leaf, ShieldCheck, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const programs = [
  { icon: Heart, title: "Clinical Care", description: "Evidence-based therapy for anxiety, depression, and trauma.", color: "hsl(348, 82%, 26%)", audiences: ["Adults", "Students"] },
  { icon: Activity, title: "Mental Performance", description: "Peak performance coaching for athletes and professionals.", color: "#FFB300", audiences: ["Athletes", "Professionals"] },
  { icon: Leaf, title: "Mindfulness Training", description: "Structured mindfulness programs for daily resilience.", color: "#F4A300", audiences: ["All Levels"] },
  { icon: ShieldCheck, title: "Trauma Recovery", description: "Specialized trauma processing and recovery pathways.", color: "hsl(348, 82%, 26%)", audiences: ["Adults", "Professionals"] },
];

const ProgramsSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Mental Health Programs</h2>
            <p className="text-body text-muted-foreground">Structured programs designed for lasting change.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <StaggerItem key={program.title}>
                <div className="glass-card p-7 h-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                    style={{ background: `${program.color}15`, border: `2px solid ${program.color}40` }}>
                    <program.icon className="w-6 h-6" style={{ color: program.color }} />
                  </div>
                  <h3 className="text-h3 mb-2 text-lg">{program.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{program.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {program.audiences.map((audience) => (
                      <span key={audience} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="primary" size="lg" asChild>
            <Link to="/services" className="inline-flex items-center gap-2">
              Explore Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
