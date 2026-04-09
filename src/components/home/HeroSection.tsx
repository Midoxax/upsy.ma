// src/components/home/HeroSection.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Breathing orb ─────────────────────────────────────────────────────────────

const BreathingOrb = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const CYCLE = { inhale: 4000, hold: 2000, exhale: 6000 };
  const labels = { inhale: "Inspirez", hold: "Retenez", exhale: "Expirez" };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setPhase("inhale");
        await new Promise((r) => setTimeout(r, CYCLE.inhale));
        if (cancelled) break;
        setPhase("hold");
        await new Promise((r) => setTimeout(r, CYCLE.hold));
        if (cancelled) break;
        setPhase("exhale");
        await new Promise((r) => setTimeout(r, CYCLE.exhale));
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <motion.div
        className="absolute rounded-full border border-primary/8"
        animate={{ scale: phase === "exhale" ? 1 : 1.5, opacity: phase === "exhale" ? 0 : 0.5 }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.2 : 6, ease: "easeInOut" }}
        style={{ width: 320, height: 320 }}
      />
      <motion.div
        className="absolute rounded-full border border-primary/15"
        animate={{ scale: phase === "exhale" ? 1 : 1.3, opacity: phase === "exhale" ? 0.2 : 0.7 }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.2 : 6, ease: "easeInOut" }}
        style={{ width: 240, height: 240 }}
      />
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-primary/20 via-teal-500/10 to-primary/5 border border-primary/20"
        animate={{ scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 0.85, opacity: phase === "hold" ? 1 : 0.8 }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 6, ease: "easeInOut" }}
        style={{ width: 160, height: 160 }}
      />
      <motion.div
        className="absolute rounded-full bg-primary/15"
        animate={{ scale: phase === "inhale" ? 1 : phase === "hold" ? 1.05 : 0.6 }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 6, ease: "easeInOut" }}
        style={{ width: 80, height: 80 }}
      />
      <motion.p
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 text-xs font-medium text-primary/60 tracking-[0.2em] uppercase select-none"
      >
        {labels[phase]}
      </motion.p>
    </div>
  );
};

// ── Floating trust pills ───────────────────────────────────────────────────────

const TrustPills = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9, duration: 0.5 }}
    className="flex flex-wrap gap-2 justify-center lg:justify-start"
  >
    {[
      { icon: Shield, text: "100% confidentiel" },
      { icon: Clock, text: "Réponse en 2 min" },
      { icon: Sparkles, text: "Certifiés & accrédités" },
    ].map(({ icon: Icon, text }) => (
      <div
        key={text}
        className="flex items-center gap-1.5 bg-muted/60 border border-border/60 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
      >
        <Icon className="h-3 w-3 text-primary/60" />
        {text}
      </div>
    ))}
  </motion.div>
);

// ── Stat counter ──────────────────────────────────────────────────────────────

const StatItem = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="text-center lg:text-left"
  >
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </motion.div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 60% 40%, hsl(var(--primary) / 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, hsl(160 60% 32% / 0.03) 0%, transparent 60%)
          `,
        }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center py-20">
          {/* ── Left: Copy ── */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                {t("hero.eyebrow") || "Plateforme de santé mentale · Maroc"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-2"
            >
              <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-foreground">
                {t("hero.title")}
                <br />
                <span className="text-primary">{t("hero.titleHighlight")}</span>
              </h1>
            </motion.div>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg font-light"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Button variant="primary" size="lg" asChild className="gap-2 group">
                <Link to="/get-matched">
                  {t("hero.startAssessment")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/ai-assistant">
                  <Sparkles className="h-4 w-4 mr-2 text-teal-500" />
                  {t("hero.talkToNour") || "Parler à Nour · IA"}
                </Link>
              </Button>
            </motion.div>

            {/* Trust pills */}
            <TrustPills />

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex gap-8 justify-center lg:justify-start pt-2 border-t border-border/50"
            >
              <StatItem value="50+" label="Psychologues vérifiés" delay={1.05} />
              <StatItem value="2 min" label="Pour trouver votre match" delay={1.1} />
              <StatItem value="98%" label="Satisfaction patients" delay={1.15} />
            </motion.div>
          </div>

          {/* ── Right: Breathing orb ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative h-[420px] flex items-center justify-center"
          >
            <BreathingOrb />

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute top-8 left-0 bg-background border border-border rounded-2xl p-3 shadow-sm flex items-center gap-3 max-w-[180px]"
            >
              <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <p className="text-xs font-semibold">Séance confirmée</p>
                <p className="text-[11px] text-muted-foreground">Demain · 14h00</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-12 right-0 bg-background border border-border rounded-2xl p-3 shadow-sm max-w-[200px]"
            >
              <p className="text-[11px] text-muted-foreground mb-1.5">Comment vous sentez-vous ?</p>
              <div className="flex gap-1.5">
                {["😔", "😐", "🙂", "😊", "😄"].map((e, i) => (
                  <span key={i} className="text-base cursor-pointer hover:scale-125 transition-transform">{e}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="absolute bottom-0 left-4 bg-background border border-border rounded-2xl p-3 shadow-sm flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">N</div>
              <p className="text-xs text-muted-foreground italic">"Je suis là pour vous écouter."</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
