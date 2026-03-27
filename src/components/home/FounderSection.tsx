import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { ArrowRight, Award, Brain, Target, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import mehdiPhoto from "@/assets/mehdi-felji.png";

const FounderSection = () => {
  const { t, locale } = useLocale();

  return (
    <section className="section-spacing">
      <div className="container-custom">
        <ScrollReveal>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Photo — smaller, authoritative */}
            <div className="lg:col-span-2 w-full max-w-xs mx-auto lg:mx-0">
              <div className="aspect-[3/4] rounded-u-lg overflow-hidden shadow-glass">
                <img
                  src={mehdiPhoto}
                  alt="Mehdi Felji — Founder of U.Psy"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content — editorial */}
            <div className="lg:col-span-3 space-y-6 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                {t("founder.sectionBadge") || "Built from the Field"}
              </span>

              <h2 className="text-h2">
                {t("founder.sectionTitle") || "A System Built on Practice, Not Theory"}
              </h2>

              {/* Quote excerpt from Mot du Président */}
              <blockquote className="text-base md:text-lg italic text-muted-foreground/80 pl-4 border-l-2 border-primary/25 leading-relaxed">
                <Quote className="w-4 h-4 text-primary/40 mb-1 inline-block" />{" "}
                {t("founder.sectionQuote") || "Psychology doesn't lack theories. It lacks applicability under pressure."}
              </blockquote>

              <p className="text-body text-muted-foreground leading-relaxed">
                {t("founder.sectionDesc") || "Mehdi Felji designed U.Psy from operational experience — in elite sport, humanitarian contexts, and institutional systems. The platform is built to diagnose, match, and train. Not to browse."}
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
                  {t("founder.exploreWork") || "Read the Mot du Président"} <ArrowRight className="w-4 h-4" />
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
