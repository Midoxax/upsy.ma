// src/components/home/HeroSection.tsx — Marketing hero, deep-night cinematic
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Star } from "lucide-react";
import { MagneticButton } from "@/lib/motion";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="aurora-layer" />
        {!prefersReducedMotion && (
          <div className="absolute inset-0 opacity-90">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 50%, hsl(348 40% 4% / 0.85) 0%, hsl(348 40% 4% / 0.3) 50%, transparent 80%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-custom relative z-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-primary/90 font-medium">
                Now booking · Casablanca · Rabat · Online
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-normal leading-[0.95] tracking-[-0.02em] text-[clamp(2.75rem,7.5vw,6rem)] text-foreground"
            >
              The psychology<br />
              <span className="italic accent-italic text-gold-gradient">infrastructure</span>{" "}
              behind<br />people who perform.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Book an accredited psychologist in under 2 minutes. Video or in-person, in Arabic, French, or English —
              with a free rebook if the fit isn't right.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton strength={0.3}>
                <Button
                  size="lg"
                  asChild
                  className="group h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_20px_50px_-15px_hsl(45_96%_60%/0.55)]"
                >
                  <Link to="/psychologists" className="inline-flex items-center gap-2">
                    Book your first session
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="h-14 px-6 text-base text-foreground/90 hover:bg-white/5 border border-white/10"
              >
                <Link to="/get-matched" className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Take the 2-min match quiz
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2"
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Free rebook guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground/90">4.9</span>
                <span>· 240+ sessions</span>
              </span>
            </motion.div>
          </div>

          <div className="lg:col-span-5 hidden lg:flex justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative w-full max-w-sm space-y-4"
            >
              {[
                { k: "MAD 600", v: "Transparent per-session pricing" },
                { k: "< 2 min", v: "From landing to booked slot" },
                { k: "5-tier", v: "Accreditation system for every psychologist" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="glass-card !p-5 flex items-center gap-4 border border-primary/15"
                >
                  <div className="font-mono text-2xl text-primary tabular-nums whitespace-nowrap">
                    {s.k}
                  </div>
                  <div className="text-sm text-muted-foreground leading-tight">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/60">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
