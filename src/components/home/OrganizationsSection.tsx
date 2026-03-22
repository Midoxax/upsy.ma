import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, HeartHandshake, Trophy, ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const services = [
  { icon: Building2, titleKey: "orgs.corporate.title" as const, descKey: "orgs.corporate.desc" as const, fallbackTitle: "Corporate Wellbeing", fallbackDesc: "Employee mental health programs, workshops, and EAP solutions." },
  { icon: HeartHandshake, titleKey: "orgs.ngo.title" as const, descKey: "orgs.ngo.desc" as const, fallbackTitle: "NGO Mental Health", fallbackDesc: "Scalable mental health programs for humanitarian organizations." },
  { icon: Trophy, titleKey: "orgs.sports.title" as const, descKey: "orgs.sports.desc" as const, fallbackTitle: "Sports Organizations", fallbackDesc: "Performance psychology and athlete wellbeing for clubs and federations." },
];

const OrganizationsSection = () => {
  const { t } = useLocale();

  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">{t("orgs.title") || "Mental Health for Organizations"}</h2>
            <p className="text-body text-muted-foreground">
              {t("orgs.subtitle") || "Tailored solutions for teams, institutions, and sports organizations."}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.15}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.map((service) => (
              <StaggerItem key={service.fallbackTitle}>
                <div className="glass-card p-7 h-full text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-primary/8 border-2 border-primary/15">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t(service.titleKey) || service.fallbackTitle}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(service.descKey) || service.fallbackDesc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="primary" size="lg" asChild>
            <Link to="/services/consulting-for-organizations" className="inline-flex items-center gap-2">
              {t("orgs.cta") || "Request a Proposal"} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsSection;
