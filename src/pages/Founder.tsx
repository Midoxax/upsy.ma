import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Award, Globe, Brain, Users, Target } from "lucide-react";
import mehdiPhoto from "@/assets/mehdi-felji.png";

const Founder = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <SEOHead path="/founder" />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-neural-bg py-20 md:py-32">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal>
                <div className="space-y-6">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {t("founder.badge") || "Founder & Vision"}
                  </span>
                  <h1 className="text-display leading-tight">
                    {t("founder.heroTitle") || "Built from the Field, Not from Theory"}
                  </h1>
                  <p className="text-body text-muted-foreground leading-relaxed max-w-lg">
                    {t("founder.heroSubtitle") || "Mehdi Felji created UPsy to bridge the gap between psychology, technology, and human-centered design — making mental health support accessible, trustworthy, and actionable."}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal>
                <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                  <div className="aspect-[3/4] rounded-u-lg overflow-hidden shadow-glass">
                    <img
                      src={mehdiPhoto}
                      alt="Mehdi Felji — Founder of UPsy"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Mot du Président */}
        <section className="py-16 md:py-24">
          <div className="container-custom max-w-3xl">
            <ScrollReveal>
              <div className="space-y-8">
                <h2 className="text-h2 text-center">{t("founder.motTitle") || "A Word from the Founder"}</h2>
                <div className="space-y-6 text-body text-muted-foreground leading-relaxed">
                  <p>{t("founder.mot1") || "Psychology is one of the most important tools we have for human development. Yet for most people, accessing meaningful psychological support remains confusing, intimidating, or simply unavailable."}</p>
                  <p>{t("founder.mot2") || "I built UPsy because I believe the problem isn't a lack of psychologists — it's a lack of systems that connect the right people with the right support at the right time."}</p>
                  <p>{t("founder.mot3") || "UPsy is not just a directory. It's a guided experience that helps individuals understand their needs, find trusted professionals, and take action with confidence. Every feature, every decision, every design choice is made with one question in mind: does this reduce friction and build trust?"}</p>
                  <p className="text-foreground font-medium">{t("founder.mot4") || "Mental health support should feel as natural as seeking any other form of care. That's the future UPsy is building."}</p>
                </div>
                <p className="text-sm text-primary font-semibold">— Mehdi Felji</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="py-16 md:py-24 liquid-bg">
          <div className="container-custom">
            <ScrollReveal>
              <h2 className="text-h2 text-center mb-12">{t("founder.expertiseTitle") || "Areas of Focus"}</h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Brain, title: t("founder.area1Title") || "Clinical Psychology", desc: t("founder.area1Desc") || "Evidence-based approaches to mental health assessment and intervention." },
                { icon: Target, title: t("founder.area2Title") || "Sport & Performance Psychology", desc: t("founder.area2Desc") || "Mental performance frameworks for athletes and high-performing professionals." },
                { icon: Users, title: t("founder.area3Title") || "Organizational Wellbeing", desc: t("founder.area3Desc") || "Consulting and diagnostics for workplace mental health and team resilience." },
                { icon: Globe, title: t("founder.area4Title") || "Humanitarian Psychology", desc: t("founder.area4Desc") || "Psychologues Sans Frontières — free mental health support for underserved communities." },
                { icon: Award, title: t("founder.area5Title") || "Training & Accreditation", desc: t("founder.area5Desc") || "Professional development programs and accreditation for psychologists." },
              ].map((area, i) => (
                <ScrollReveal key={i}>
                  <div className="glass-card p-6 h-full space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <area.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{area.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container-custom max-w-2xl">
            <ScrollReveal>
              <div className="glass-card p-8 md:p-12 text-center space-y-4">
                <h2 className="text-h2">{t("founder.ctaTitle") || "Let's Build Something Meaningful"}</h2>
                <p className="text-body text-muted-foreground">
                  {t("founder.ctaText") || "Whether you're a professional looking to collaborate, an organization seeking consulting, or someone who wants to contribute to the mission — let's connect."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button variant="primary" size="lg" asChild>
                    <Link to={addLocalePrefix("/contact", locale)} className="inline-flex items-center gap-2">
                      {t("founder.ctaButton") || "Get in Touch"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
};

export default Founder;
