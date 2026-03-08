import { ArrowRight, ClipboardCheck, Search, Video } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Take a Self-Assessment",
    description: "Understand your mental wellbeing with a quick evidence-based screening.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find the Right Psychologist",
    description: "Filter by language, specialty, availability, and session format.",
  },
  {
    number: "03",
    icon: Video,
    title: "Start Your Sessions",
    description: "Secure video consultations with licensed professionals.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Start Your Mental Health Journey</h2>
            <p className="text-body text-u-gray-300">Three simple steps to get the support you need.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number}>
              <div className="glass-card p-7 text-center relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}>
                  <step.icon className="w-7 h-7 text-u-gold" />
                </div>
                <div className="text-5xl font-bold text-u-gold/20 mb-2">{step.number}</div>
                <h3 className="text-h3 mb-3">{step.title}</h3>
                <p className="text-body text-u-gray-300 text-sm">{step.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-5 h-5 text-u-gold/30" />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
