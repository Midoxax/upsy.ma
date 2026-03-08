import { Heart, BookOpen, Activity, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const pillars = [
  {
    icon: Heart,
    title: "Care",
    description: "Online psychological consultations with licensed professionals.",
    href: "/services",
    color: "hsl(348, 82%, 26%)",
  },
  {
    icon: BookOpen,
    title: "Learning",
    description: "Courses and mental-health education for personal growth.",
    href: "/resources",
    color: "#FFB300",
  },
  {
    icon: Activity,
    title: "Performance",
    description: "Mental performance coaching for athletes and high performers.",
    href: "/services",
    color: "#F4A300",
  },
  {
    icon: Building2,
    title: "Organizations",
    description: "Mental-health solutions for institutions and sports organizations.",
    href: "/services/consulting-for-organizations",
    color: "hsl(348, 82%, 26%)",
  },
];

const PillarsSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">The U.Psy Ecosystem</h2>
            <p className="text-body text-u-gray-300 max-w-2xl mx-auto">
              A comprehensive mental-health ecosystem — from clinical care to organizational transformation.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Link to={pillar.href} className="block h-full">
                  <div className="glass-card p-7 h-full group">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                      style={{
                        background: `${pillar.color}15`,
                        border: `2px solid ${pillar.color}40`,
                      }}
                    >
                      <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="text-h3 mb-3">{pillar.title}</h3>
                    <p className="text-body text-u-gray-300 text-sm leading-relaxed mb-4">{pillar.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-u-gold font-medium group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default PillarsSection;
