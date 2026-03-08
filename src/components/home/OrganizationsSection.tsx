import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, HeartHandshake, Trophy, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const services = [
  { icon: Building2, title: "Corporate Wellbeing", description: "Employee mental health programs, workshops, and EAP solutions." },
  { icon: HeartHandshake, title: "NGO Mental Health", description: "Scalable mental health programs for humanitarian organizations." },
  { icon: Trophy, title: "Sports Organizations", description: "Performance psychology and athlete wellbeing for clubs and federations." },
];

const OrganizationsSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Mental Health for Organizations</h2>
            <p className="text-body text-muted-foreground">Tailored solutions for teams, institutions, and sports organizations.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.15}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <div className="glass-card p-7 h-full text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-secondary/10 border-2 border-secondary/25">
                    <service.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-h3 mb-2 text-lg">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="primary" size="lg" asChild>
            <Link to="/services/consulting-for-organizations" className="inline-flex items-center gap-2">
              Request a Proposal <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsSection;
