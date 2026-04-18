// src/components/home/HeroSection.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.webp";

// ── Editorial hero — single column, bold typography, quiet visuals ───────────

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-background">
      {/* Ambient gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* Fine grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="container-custom relative z-10 w-full py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img
              src={logo}
              alt="U.Psy"
              className="h-16 md:h-20 w-auto dark:brightness-110"
              style={{ filter: "drop-shadow(0 2px 8px hsl(var(--primary) / 0.15))" }}
            />
          </motion.div>

          {/* Headline — editorial, large, refined */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-bold tracking-[-0.03em] leading-[0.98] text-foreground text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            {t("hero.title")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic font-serif text-primary">
                {t("hero.titleHighlight")}
              </span>
              <span
                className="absolute inset-x-0 bottom-1 h-[0.2em] bg-primary/15 -z-0"
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          >
            <Button variant="primary" size="lg" asChild className="gap-2 group h-12 px-7 text-base">
              <Link to="/get-matched">
                {t("hero.startAssessment")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="h-12 px-6 text-base">
              <Link to="/ai-assistant" className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("hero.talkToNour") || "Talk to Nour · AI"}
              </Link>
            </Button>
          </motion.div>

          {/* Trust strip — minimal, editorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-12 mt-4 border-t border-border/60 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-4 md:gap-12">
              {[
                { value: "50+", label: t("hero.statPsychologists") || "Verified psychologists" },
                { value: "2 min", label: t("hero.statMatch") || "To find your match" },
                { value: "98%", label: t("hero.statSatisfaction") || "Patient satisfaction" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
