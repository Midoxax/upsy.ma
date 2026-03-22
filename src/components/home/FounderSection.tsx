import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { ArrowRight, Award, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import mehdiPhoto from "@/assets/mehdi-felji.png";

const FounderSection = () => {
  const { t, locale } = useLocale();

  return (
    <section className="section-spacing">
      <div className="container-custom">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Photo */}
            <div className="w-full max-w-xs mx-auto lg:mx-0">
              <div className="aspect-square rounded-u-lg overflow-hidden shadow-glass">
                <img
                  src={mehdiPhoto}
                  alt="Mehdi Felji — Founder of UPsy"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {t("founder.sectionBadge") || "Built from the Field"}
              </span>
              <h2 className="text-h2">
                {t("founder.sectionTitle") || "A Platform Built on Practice, Not Theory"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {t("founder.sectionDesc") || "Mehdi Felji created UPsy to bridge the gap between psychology, technology, and real human needs. With expertise spanning clinical, sport, and organizational psychology, UPsy is designed to guide — not just connect."}
              </p>

              {/* Proof bullets */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: Brain, label: t("founder.proof1") || "Clinical Psychology" },
                  { icon: Target, label: t("founder.proof2") || "Performance Psychology" },
                  { icon: Award, label: t("founder.proof3") || "Accredited Network" },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </span>
                ))}
              </div>

              <Button variant="secondary" size="lg" asChild>
                <Link to={addLocalePrefix("/founder", locale)} className="inline-flex items-center gap-2">
                  {t("founder.exploreWork") || "Explore Founder's Work"} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FounderSection;
