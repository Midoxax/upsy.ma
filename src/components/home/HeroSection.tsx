// src/components/home/HeroSection.tsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { ArrowRight, Sparkles, Search, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.webp";
import { useIntentStore } from "@/stores/intentStore";
import type { UserIntent } from "@/stores/intentStore";

// ── Intent-reactive hero configurations ───────────────────────────────────────

interface HeroVariant {
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryCta: { label: string; to: string; icon: React.ReactNode };
  secondaryCta: { label: string; to: string; icon: React.ReactNode };
  stats: { value: string; label: string }[];
}

const heroVariants: Record<UserIntent, HeroVariant> = {
  EXPLORING: {
    title: "Measure. Identify. Train.",
    titleHighlight: "Apply.",
    subtitle:
      "A performance psychology system that quantifies mental readiness, identifies blind spots, and builds evidence-based protocols for peak performance.",
    primaryCta: {
      label: "Start Your Assessment",
      to: "/get-matched",
      icon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />,
    },
    secondaryCta: {
      label: "Talk to Nour · AI",
      to: "/ai-assistant",
      icon: <Sparkles className="h-4 w-4 text-primary" />,
    },
    stats: [
      { value: "50+", label: "Verified psychologists" },
      { value: "2 min", label: "To find your match" },
      { value: "98%", label: "Client satisfaction" },
    ],
  },
  READY_TO_ACT: {
    title: "Find your psychologist",
    titleHighlight: "today.",
    subtitle:
      "You know what you need. Match with a verified specialist in under 2 minutes — online or in-person across Morocco.",
    primaryCta: {
      label: "Find My Match",
      to: "/get-matched",
      icon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />,
    },
    secondaryCta: {
      label: "Browse Specialists",
      to: "/psychologists",
      icon: <Search className="h-4 w-4 text-primary" />,
    },
    stats: [
      { value: "50+", label: "Verified psychologists" },
      { value: "24h", label: "Average first session" },
      { value: "4.9★", label: "Average rating" },
    ],
  },
  RESEARCHING: {
    title: "Evidence-based mental",
    titleHighlight: "performance.",
    subtitle:
      "Explore our clinical screening tools, peer-reviewed methodologies, and structured protocols used by sports psychologists and organizations worldwide.",
    primaryCta: {
      label: "Explore Assessments",
      to: "/assessment-lab",
      icon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />,
    },
    secondaryCta: {
      label: "Our Methods",
      to: "/services",
      icon: <Sparkles className="h-4 w-4 text-primary" />,
    },
    stats: [
      { value: "10+", label: "Clinical screenings" },
      { value: "CBT", label: "Schema · EMDR · ACT" },
      { value: "100%", label: "Evidence-based" },
    ],
  },
  SKEPTICAL: {
    title: "Trusted by 50+ verified",
    titleHighlight: "specialists.",
    subtitle:
      "Every psychologist on U.Psy is clinically accredited, peer-reviewed, and bound by Moroccan Law 09-08 data protection. Your privacy is non-negotiable.",
    primaryCta: {
      label: "See How It Works",
      to: "/services",
      icon: <ShieldCheck className="h-4 w-4 transition-transform group-hover:translate-x-1" />,
    },
    secondaryCta: {
      label: "Read Reviews",
      to: "/psychologists",
      icon: <Search className="h-4 w-4 text-primary" />,
    },
    stats: [
      { value: "5-tier", label: "Accreditation system" },
      { value: "09-08", label: "Data law compliant" },
      { value: "0%", label: "Data shared with third parties" },
    ],
  },
};

const HeroSection = () => {
  const { t, locale } = useLocale();
  const intent = useIntentStore((s) => s.intent);
  const variant = heroVariants[intent];

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

          {/* Intent-reactive content with crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={intent}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-10"
            >
              {/* Headline */}
              <h1 className="font-bold tracking-[-0.03em] leading-[0.98] text-foreground text-[clamp(2.6rem,7vw,5.5rem)]">
                {variant.title}{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic font-serif text-primary">
                    {variant.titleHighlight}
                  </span>
                  <span
                    className="absolute inset-x-0 bottom-1 h-[0.2em] bg-primary/15 -z-0"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              {/* Subline */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                {variant.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button variant="primary" size="lg" asChild className="gap-2 group h-12 px-7 text-base">
                  <Link to={variant.primaryCta.to}>
                    {variant.primaryCta.label}
                    {variant.primaryCta.icon}
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="h-12 px-6 text-base">
                  <Link to={variant.secondaryCta.to} className="inline-flex items-center gap-2">
                    {variant.secondaryCta.icon}
                    {variant.secondaryCta.label}
                  </Link>
                </Button>
              </div>

              {/* Trust strip */}
              <div className="pt-12 mt-4 border-t border-border/60 max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-4 md:gap-12">
                  {variant.stats.map((s) => (
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
              </div>
            </motion.div>
          </AnimatePresence>
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
