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

// Reduced motion check
const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ── Rotating word pairs (problem → solution) ─────────────────────────────────

const wordPairs = [
  { problem: "Burnout", solution: "Recovery" },
  { problem: "Anxiety", solution: "Clarity" },
  { problem: "Stress", solution: "Balance" },
  { problem: "Self-doubt", solution: "Confidence" },
  { problem: "Overwhelm", solution: "Focus" },
  { problem: "Disconnection", solution: "Resilience" },
];

const WORD_INTERVAL = 3000;

// ── Animation modes ──────────────────────────────────────────────────────────

type AnimMode = "rotating" | "stagger" | "typewriter" | "floating";
const ANIM_MODES: AnimMode[] = ["rotating", "stagger", "typewriter", "floating"];

// ── Floating keyword pills ───────────────────────────────────────────────────

const floatingKeywords = [
  { label: "CBT", x: "8%", y: "18%", duration: 7, delay: 0 },
  { label: "EMDR", x: "85%", y: "22%", duration: 8, delay: 1.2 },
  { label: "Schema", x: "12%", y: "72%", duration: 9, delay: 0.5 },
  { label: "Resilience", x: "78%", y: "68%", duration: 6.5, delay: 2 },
  { label: "ACT", x: "92%", y: "45%", duration: 7.5, delay: 1.8 },
  { label: "Mindfulness", x: "5%", y: "48%", duration: 8.5, delay: 0.8 },
  { label: "Peak Performance", x: "70%", y: "85%", duration: 10, delay: 1.5 },
  { label: "Well-being", x: "25%", y: "88%", duration: 7, delay: 2.5 },
];

// ── Rotating Word component ──────────────────────────────────────────────────

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setShowSolution((prev) => {
        if (prev) {
          setIndex((i) => (i + 1) % wordPairs.length);
          return false;
        }
        return true;
      });
    }, WORD_INTERVAL / 2);
    return () => clearInterval(timer);
  }, []);

  const pair = wordPairs[index];
  const word = showSolution ? pair.solution : pair.problem;
  const color = showSolution ? "text-primary" : "text-primary/70";

  if (prefersReducedMotion) {
    return (
      <span className="block w-full mt-1 text-center italic font-serif text-primary" aria-live="polite">
        {pair.problem} → {pair.solution}
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
          className={`absolute inset-x-0 text-center italic font-serif ${color}`}
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
  if (prefersReducedMotion) return null;
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
      {floatingKeywords.map((kw) => (
        <motion.div
          key={kw.label}
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
          {kw.label}
        </motion.div>
      ))}
    </div>
  );
}

// ── Preview cards under hero ─────────────────────────────────────────────────

const previewCards = [
  {
    title: "Services",
    description: "Individual therapy, performance coaching, and structured clinical protocols.",
    href: "/services",
    icon: "🧠",
  },
  {
    title: "Resources",
    description: "Self-paced courses, assessments, and tools designed by licensed psychologists.",
    href: "/resources",
    icon: "📚",
  },
  {
    title: "Community",
    description: "Join the Skool community for peer support, live events, and expert Q&A.",
    href: "/skool",
    icon: "🤝",
  },
];

// ── Intent-reactive hero configurations ───────────────────────────────────────

interface HeroVariant {
  titlePrefix: string;
  subtitle: string;
  primaryCta: { label: string; to: string; icon: React.ReactNode };
  secondaryCta: { label: string; to: string; icon: React.ReactNode };
  stats: { value: string; label: string }[];
}

const heroVariants: Record<UserIntent, HeroVariant> = {
  EXPLORING: {
    titlePrefix: "Psychology, Built for",
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
    titlePrefix: "Your match for",
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
    titlePrefix: "Evidence-based tools for",
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
    titlePrefix: "Trusted protection from",
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

// ── Main component ───────────────────────────────────────────────────────────

const HeroSection = () => {
  const intent = useIntentStore((s) => s.intent);
  const variant = heroVariants[intent];

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
            className="flex justify-center"
          >
            <img
              src={logo}
              alt="U.Psy"
              className="h-14 md:h-20 w-auto dark:brightness-110"
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

              {/* CTAs — now includes Book a Call */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: useTypewriter ? 1.2 : 0.3, duration: 0.5 }}
              >
                <Button variant="primary" size="lg" asChild className="gap-2 group h-12 px-7 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Link to={variant.primaryCta.to}>
                    {variant.primaryCta.label}
                    {variant.primaryCta.icon}
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="gap-2 h-12 px-6 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Link to="/book-a-call">
                    <Phone className="h-4 w-4" />
                    Book a Call
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="h-12 px-6 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Link to={variant.secondaryCta.to} className="inline-flex items-center gap-2">
                    {variant.secondaryCta.icon}
                    {variant.secondaryCta.label}
                  </Link>
                </Button>
              </motion.div>

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

          {/* ── Preview Cards ── */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-4xl mx-auto"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {previewCards.map((card) => (
              <Link
                key={card.title}
                to={card.href}
                className="group glass-card p-5 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
              >
                <span className="text-2xl mb-2 block" aria-hidden="true">{card.icon}</span>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </Link>
            ))}
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
