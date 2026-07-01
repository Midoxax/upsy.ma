// src/components/home/HeroSection.tsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Search, ShieldCheck, Phone } from "lucide-react";
import logo from "@/assets/logo.webp";
import { useIntentStore } from "@/stores/intentStore";
import type { UserIntent } from "@/stores/intentStore";
import FloatingDecorations from "./FloatingDecorations";
import { useLocale } from "@/contexts/LocaleContext";
import { BreathingOrb, MagneticButton } from "@/lib/motion";

// Reduced motion check
const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Word-pair key suffixes (translated at render time)
const WORD_PAIR_KEYS = ["burnout", "anxiety", "stress", "doubt", "overwhelm", "disconnection"] as const;

const WORD_INTERVAL = 3000;

// ── Animation modes ──────────────────────────────────────────────────────────

type AnimMode = "rotating" | "stagger" | "typewriter" | "floating";
const ANIM_MODES: AnimMode[] = ["rotating", "stagger", "typewriter", "floating"];

// Floating keyword pill positions (label resolved via t())
const floatingKeywordSlots = [
  { key: "cbt", x: "8%", y: "18%", duration: 7, delay: 0 },
  { key: "emdr", x: "85%", y: "22%", duration: 8, delay: 1.2 },
  { key: "schema", x: "12%", y: "72%", duration: 9, delay: 0.5 },
  { key: "resilience", x: "78%", y: "68%", duration: 6.5, delay: 2 },
  { key: "act", x: "92%", y: "45%", duration: 7.5, delay: 1.8 },
  { key: "mindfulness", x: "5%", y: "48%", duration: 8.5, delay: 0.8 },
  { key: "peakPerformance", x: "70%", y: "85%", duration: 10, delay: 1.5 },
  { key: "wellbeing", x: "25%", y: "88%", duration: 7, delay: 2.5 },
] as const;

// ── Rotating Word component ──────────────────────────────────────────────────

function RotatingWord() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setShowSolution((prev) => {
        if (prev) {
          setIndex((i) => (i + 1) % WORD_PAIR_KEYS.length);
          return false;
        }
        return true;
      });
    }, WORD_INTERVAL / 2);
    return () => clearInterval(timer);
  }, []);

  const pairKey = WORD_PAIR_KEYS[index];
  const problem = t(`home.hero.words.${pairKey}P`);
  const solution = t(`home.hero.words.${pairKey}S`);
  const word = showSolution ? solution : problem;
  const color = showSolution ? "text-primary" : "text-primary/70";

  if (prefersReducedMotion) {
    return (
      <span className="block w-full mt-1 text-center accent-italic text-secondary dark:text-primary" aria-live="polite">
        {problem} → {solution}
      </span>
    );
  }

  return (
    <span className="relative block w-full h-[1.25em] mt-1 overflow-hidden" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${index}-${showSolution}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className={`absolute inset-x-0 text-center accent-italic ${color}`}
        >
          {word}
          {showSolution && (
            <span className="absolute inset-x-0 bottom-0 h-[0.18em] bg-primary/15" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ── Staggered headline ──────────────────────────────────────────────────────

function StaggeredHeadline({ text }: { text: string }) {
  if (prefersReducedMotion) return <>{text}</>;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

// ── Typewriter subtitle ─────────────────────────────────────────────────────

function TypewriterSubtitle({ text, startDelay = 800 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) { setStarted(true); setDisplayed(text); return; }
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay, text]);

  useEffect(() => {
    if (!started || prefersReducedMotion) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [text, started]);

  if (!started) return <span className="invisible">{text}</span>;
  if (prefersReducedMotion) return <span>{text}</span>;

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

// ── Floating keywords background ─────────────────────────────────────────────

function FloatingKeywords() {
  const { t } = useLocale();
  if (prefersReducedMotion) return null;
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
      {floatingKeywordSlots.map((kw) => (
        <motion.div
          key={kw.key}
          className="absolute text-[11px] tracking-widest uppercase text-muted-foreground/20 font-medium select-none"
          style={{ left: kw.x, top: kw.y }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: [0, -18, -10, 0],
          }}
          transition={{
            duration: kw.duration,
            delay: kw.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          {t(`home.hero.keywords.${kw.key}`)}
        </motion.div>
      ))}
    </div>
  );
}

// ── Preview cards under hero ─────────────────────────────────────────────────

const previewCardSlots = [
  { keyBase: "services", href: "/services", icon: "🧠" },
  { keyBase: "resources", href: "/resources", icon: "📚" },
  { keyBase: "community", href: "/skool", icon: "🤝" },
] as const;

// ── Intent-reactive hero configurations ───────────────────────────────────────

interface HeroVariant {
  titlePrefix: string;
  subtitle: string;
  primaryCta: { label: string; to: string; icon: React.ReactNode };
  secondaryCta: { label: string; to: string; icon: React.ReactNode };
  stats: { value: string; label: string }[];
}

// Per-intent visual config (icons + routes + stat values stay static; copy is translated)
type IntentSlug = "exploring" | "ready" | "researching" | "skeptical";
const INTENT_TO_SLUG: Record<UserIntent, IntentSlug> = {
  EXPLORING: "exploring",
  READY_TO_ACT: "ready",
  RESEARCHING: "researching",
  SKEPTICAL: "skeptical",
};
const intentVisuals: Record<IntentSlug, {
  primaryTo: string;
  primaryIcon: React.ReactNode;
  secondaryTo: string;
  secondaryIcon: React.ReactNode;
  stat1Value: string; stat2Value: string; stat3Value: string;
}> = {
  exploring: {
    primaryTo: "/get-matched",
    primaryIcon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />,
    secondaryTo: "/ai-assistant",
    secondaryIcon: <Sparkles className="h-4 w-4 text-primary" />,
    stat1Value: "50+", stat2Value: "2 min", stat3Value: "98%",
  },
  ready: {
    primaryTo: "/get-matched",
    primaryIcon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />,
    secondaryTo: "/psychologists",
    secondaryIcon: <Search className="h-4 w-4 text-primary" />,
    stat1Value: "50+", stat2Value: "24h", stat3Value: "4.9★",
  },
  researching: {
    primaryTo: "/assessment-lab",
    primaryIcon: <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />,
    secondaryTo: "/services",
    secondaryIcon: <Sparkles className="h-4 w-4 text-primary" />,
    stat1Value: "10+", stat2Value: "CBT", stat3Value: "100%",
  },
  skeptical: {
    primaryTo: "/services",
    primaryIcon: <ShieldCheck className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />,
    secondaryTo: "/psychologists",
    secondaryIcon: <Search className="h-4 w-4 text-primary" />,
    stat1Value: "5-tier", stat2Value: "09-08", stat3Value: "0%",
  },
};

// ── Main component ───────────────────────────────────────────────────────────

const HeroSection = () => {
  const { t } = useLocale();
  const intent = useIntentStore((s) => s.intent);
  const intentSlug = INTENT_TO_SLUG[intent];
  const visuals = intentVisuals[intentSlug];
  const variant = useMemo<HeroVariant>(() => ({
    titlePrefix: t(`home.hero.intent.${intentSlug}.titlePrefix`),
    subtitle: t(`home.hero.intent.${intentSlug}.subtitle`),
    primaryCta: {
      label: t(`home.hero.intent.${intentSlug}.primary`),
      to: visuals.primaryTo,
      icon: visuals.primaryIcon,
    },
    secondaryCta: {
      label: t(`home.hero.intent.${intentSlug}.secondary`),
      to: visuals.secondaryTo,
      icon: visuals.secondaryIcon,
    },
    stats: [
      { value: visuals.stat1Value, label: t(`home.hero.intent.${intentSlug}.stat1Label`) },
      { value: visuals.stat2Value, label: t(`home.hero.intent.${intentSlug}.stat2Label`) },
      { value: visuals.stat3Value, label: t(`home.hero.intent.${intentSlug}.stat3Label`) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [intentSlug, t]);

  const animMode = useMemo<AnimMode>(
    () => prefersReducedMotion ? "rotating" : ANIM_MODES[Math.floor(Math.random() * ANIM_MODES.length)],
    []
  );

  const showFloating = animMode === "floating";
  const useStagger = animMode === "stagger";
  const useTypewriter = animMode === "typewriter";

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-background">
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

      {/* Organic blob background shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 1200 800"
          className="absolute -right-[10%] -top-[10%] w-[80%] h-[120%] opacity-[0.07]"
          preserveAspectRatio="none"
          role="presentation"
        >
          <path
            d="M600,50 C850,0 1100,150 1150,350 C1200,550 1050,750 800,780 C550,810 350,700 200,550 C50,400 100,200 250,100 C400,0 500,50 600,50 Z"
            fill="hsl(var(--upsy-maroon))"
          />
        </svg>
        <svg
          viewBox="0 0 800 600"
          className="absolute -left-[15%] bottom-[5%] w-[50%] h-[60%] opacity-[0.04]"
          preserveAspectRatio="none"
          role="presentation"
        >
          <path
            d="M200,50 C400,-30 600,100 700,250 C800,400 650,550 400,580 C150,610 0,450 50,280 C100,110 150,80 200,50 Z"
            fill="hsl(var(--upsy-gold))"
          />
        </svg>
      </div>

      {/* Floating decorative shapes */}
      <FloatingDecorations preset="hero" />

      {/* Dashed animated path */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 md:h-32 pointer-events-none opacity-20"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        role="presentation"
      >
        {prefersReducedMotion ? (
          <path
            d="M0,100 C300,20 500,180 800,100 C1100,20 1300,160 1920,80"
            fill="none"
            stroke="hsl(var(--upsy-maroon))"
            strokeWidth="2"
            strokeDasharray="12 8"
          />
        ) : (
          <motion.path
            d="M0,100 C300,20 500,180 800,100 C1100,20 1300,160 1920,80"
            fill="none"
            stroke="hsl(var(--upsy-maroon))"
            strokeWidth="2"
            strokeDasharray="12 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
          />
        )}
      </svg>

      {/* Floating keywords (when mode = floating) */}
      {showFloating && <FloatingKeywords />}

      <div className="container-custom relative z-10 w-full py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Brand mark */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <BreathingOrb size={280} intensity="subtle" />
            </div>
            <img
              src={logo}
              alt="U.Psy"
              className="relative h-14 md:h-20 w-auto dark:brightness-110"
              style={{ filter: "drop-shadow(0 2px 8px hsl(var(--primary) / 0.15))" }}
              width={80}
              height={80}
              fetchPriority="high"
            />
          </motion.div>

          {/* Intent-reactive content with crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={intent}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              {/* Headline */}
              <h1 className="font-bold tracking-[-0.03em] leading-[1.1] text-foreground text-[clamp(2.2rem,6vw,4.5rem)]">
                <span className="block">
                  {useStagger ? (
                    <StaggeredHeadline text={variant.titlePrefix} />
                  ) : (
                    variant.titlePrefix
                  )}
                </span>
                <RotatingWord />
              </h1>

              {/* Subline */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                {useTypewriter ? (
                  <TypewriterSubtitle text={variant.subtitle} startDelay={800} />
                ) : (
                  variant.subtitle
                )}
              </p>

              {/* CTAs — one primary, one secondary. No third choice. */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: useTypewriter ? 1.2 : 0.3, duration: 0.5 }}
              >
                <MagneticButton strength={0.3}>
                  <Button variant="primary" size="lg" asChild className="gap-2 group h-12 px-7 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Link to="/psychologists">
                      Book your first session
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </Button>
                </MagneticButton>
                <Button variant="ghost" size="lg" asChild className="h-12 px-6 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Link to="/get-matched" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Take the 2-min match quiz
                  </Link>
                </Button>
              </motion.div>

              {/* Guarantee microcopy — the conversion trust lever */}
              <p className="text-sm text-muted-foreground/80 -mt-2">
                <ShieldCheck className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
                Not the right fit? Free rebook with another psychologist — guaranteed.
              </p>

              {/* Trust strip */}
              <div className="pt-10 mt-2 border-t border-border/60 max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-4 md:gap-12">
                  {variant.stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="text-center"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                    >
                      <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        {s.value}
                      </p>
                      <p className="text-[11px] md:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
                        {s.label}
                      </p>
                    </motion.div>
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
          {t("home.hero.scrollLabel")}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
