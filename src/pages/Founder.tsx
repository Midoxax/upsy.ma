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
                <h2 className="text-h2 text-center">{t("founder.motTitle") || "Mot du Président"}</h2>
                <div className="space-y-6 text-body text-muted-foreground leading-relaxed">
                  <p className="text-lg font-medium text-foreground italic">
                    {t("founder.motOpener") || "La psychologie ne manque pas de théories. Elle manque d'applicabilité sous pression."}
                  </p>
                  <p>{t("founder.mot1") || "Sur le terrain — dans le sport de haut niveau, dans les contextes migratoires, dans les situations de crise — les modèles classiques atteignent rapidement leurs limites. Ce qui fonctionne en cabinet ne fonctionne pas toujours dans l'urgence, dans l'incertitude, ou face à la performance."}</p>
                  <p className="text-foreground font-medium">{t("founder.mot2") || "C'est dans cet écart que s'inscrit U.Psy."}</p>
                  <p>{t("founder.mot3") || "U.Psy n'a pas été conçu comme une plateforme. C'est un système. Un système construit à partir du terrain, où la psychologie doit être : opérationnelle, mesurable, mobilisable immédiatement."}</p>
                  <p>{t("founder.mot4") || "Mon parcours m'a conduit à intervenir dans des environnements où l'exigence est non négociable : accompagnement d'athlètes en performance, soutien psychosocial auprès de populations vulnérables, coordination de projets en santé mentale et développement."}</p>
                  <p>{t("founder.mot5") || "Dans chacun de ces contextes, une même question revient : comment transformer la psychologie en un outil utilisable, et non en un savoir abstrait ?"}</p>
                  <p>{t("founder.mot6") || "U.Psy est une réponse à cette question. Nous structurons une approche qui relie trois dimensions souvent séparées : la rigueur clinique, la performance mentale, et l'impact systémique."}</p>
                  <p>{t("founder.mot7") || "Notre ambition est claire : redéfinir la manière dont la psychologie est utilisée — dans le sport, dans les institutions, et dans la société. Non pas comme un discours. Mais comme un levier."}</p>
                  <p className="text-foreground font-medium italic">{t("founder.mot8") || "U.Psy est en construction. Mais sa direction est déjà définie : Créer une psychologie qui tient dans la réalité."}</p>
                </div>
                <p className="text-sm text-primary font-semibold">— Mehdi Felji</p>
                <p className="text-xs text-muted-foreground">{t("founder.motSignature") || "Fondateur, U.Psy"}</p>
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
