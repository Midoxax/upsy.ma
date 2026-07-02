// src/components/home/HeroSection.tsx — Editorial magazine hero (v7) with 3D orb backdrop
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/lib/motion";
import { useLocale } from "@/contexts/LocaleContext";
import { getHomeCopy } from "@/lib/i18n/homeCopy";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const HeroSection = () => {
  const { locale } = useLocale();
  const c = getHomeCopy(locale).hero;
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0D0406] text-[#FAFAFA] font-body selection:bg-[hsl(var(--gold-accent))] selection:text-[#0D0406]">
      {/* --- Layer 1: existing 3D orb + starfield backdrop --- */}
      <div className="absolute inset-0" aria-hidden="true">
        {!prefersReducedMotion && (
          <div className="absolute inset-0 opacity-80">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        )}
        {/* Vignette so foreground stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 25% 50%, rgba(13,4,6,0.85) 0%, rgba(13,4,6,0.35) 55%, transparent 85%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0D0406]" />
      </div>

      {/* --- Layer 2: tactical wireframe grid overlay --- */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* --- Layer 3: scanlines --- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, rgba(242,183,5,0.03) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* --- Left vertical ticker (desktop) --- */}
      <div className="absolute left-4 top-0 bottom-0 w-8 hidden xl:flex flex-col overflow-hidden opacity-20 pointer-events-none border-x border-[hsl(var(--gold-accent))]/10 z-10">
        <div className="flex flex-col gap-8 py-4 animate-[ticker-vertical_22s_linear_infinite]">
          {[
            "Neural Status: Synchronized",
            "System Load: 12.4%",
            "Signal Latency: 0.02ms",
            "Neural Status: Synchronized",
          ].map((s, i) => (
            <span
              key={i}
              className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-mono text-[hsl(var(--gold-accent))] tracking-widest uppercase"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* --- Layer 4: content grid --- */}
      <div className="container-custom relative z-10 py-24 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — editorial headline column */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 uppercase tracking-[0.3em] text-[hsl(var(--gold-accent))] text-[10px] font-black"
            >
              <span className="w-12 h-[2px] bg-[hsl(var(--gold-accent))]" />
              <span>The Architecture of Dominance</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-5"
            >
              <h1 className="font-display font-semibold leading-[0.9] tracking-tight text-[clamp(2.75rem,7.5vw,6rem)] text-[#FAFAFA]">
                Are You Operating
                <br />
                <span className="relative italic font-bold text-gold-gradient">
                  At Your Ceiling?
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[hsl(var(--gold-accent))]/20" />
                </span>
              </h1>
              <p className="font-display italic text-xl md:text-2xl text-[#FAFAFA]/80">
                The 2ms difference between good and elite.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="max-w-lg text-lg text-[#FAFAFA]/70 leading-relaxed font-light"
            >
              Why do the world's most capable leaders and athletes fail at the finish line?
              U.Psy replaces clinical guesswork with neuro-performance infrastructure — designed for high-stakes decision cycles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <MagneticButton strength={0.3}>
                <Button
                  asChild
                  size="lg"
                  className="group h-14 px-8 text-[11px] tracking-[0.2em] font-bold bg-[hsl(var(--gold-accent))] text-[#0D0406] hover:bg-[hsl(var(--gold-accent))]/90 rounded-none shadow-[0_20px_50px_-15px_hsl(45_96%_60%/0.55)]"
                >
                  <Link to="/free-score" className="inline-flex items-center gap-2">
                    COMMENCE ASSESSMENT
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-14 px-8 text-[11px] tracking-[0.2em] font-bold text-[#FAFAFA] border border-white/20 hover:bg-white/5 rounded-none"
              >
                <Link to="/get-matched">MATCH WITH A SPECIALIST</Link>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT — floating metrics dashboard (desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 relative h-[620px] items-center justify-center">
            <div className="relative w-[480px] h-[480px]">
              {/* Central Sync Index core */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex flex-col items-center justify-center border border-[hsl(var(--gold-accent))]/50 z-20 backdrop-blur-md"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, hsl(348 60% 20% / 0.9), hsl(348 60% 6% / 0.9) 70%)",
                  boxShadow: "0 0 100px hsl(45 96% 50% / 0.3)",
                }}
              >
                <span className="font-mono text-5xl text-[#FAFAFA] font-bold tabular-nums tracking-tighter">
                  98.4
                </span>
                <span className="text-[10px] text-[hsl(var(--gold-accent))] font-black tracking-[0.3em] uppercase mt-1">
                  Sync Index
                </span>
                <div className="absolute -top-3 -left-3 text-[hsl(var(--gold-accent))] text-xs font-mono opacity-60">+</div>
                <div className="absolute -bottom-3 -right-3 text-[hsl(var(--gold-accent))] text-xs font-mono opacity-60">+</div>
              </motion.div>

              {/* Card — Adrenaline Buffer */}
              <MetricCard
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-52"
                label="Adrenaline Buffer"
                delay={0.6}
                anim="float-a"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] font-mono text-[hsl(var(--gold-accent))] uppercase tracking-wider">
                    Adrenaline Buffer
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--gold-accent))] animate-ping" />
                </div>
                <div className="text-xl font-bold text-white font-mono">ACTIVE</div>
                <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[hsl(var(--gold-accent))] h-full w-[88%]" />
                </div>
              </MetricCard>

              {/* Card — Decision Latency */}
              <MetricCard
                className="absolute top-1/2 -right-16 -translate-y-1/2 w-44"
                label="Decision Latency"
                delay={0.75}
                anim="float-b"
              >
                <span className="text-[8px] font-mono text-[#FAFAFA]/50 uppercase tracking-wider block mb-1">
                  Decision Latency
                </span>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  140<span className="text-xs text-[hsl(var(--gold-accent))] ml-0.5">ms</span>
                </div>
                <div className="text-[9px] text-emerald-400 font-bold mt-1 uppercase">
                  -12% · Optimal Range
                </div>
              </MetricCard>

              {/* Card — Cognitive Load */}
              <MetricCard
                className="absolute bottom-0 -left-12 w-52"
                label="Cognitive Load"
                delay={0.9}
                anim="float-c"
              >
                <span className="text-[8px] font-mono text-[#FAFAFA]/50 uppercase tracking-wider block mb-1">
                  Cognitive Load
                </span>
                <div className="flex items-end gap-1">
                  <div className="w-3 h-6 bg-[hsl(var(--gold-accent))]" />
                  <div className="w-3 h-4 bg-[hsl(var(--gold-accent))]/40" />
                  <div className="w-3 h-2 bg-[hsl(var(--gold-accent))]/20" />
                  <span className="ml-3 text-xl font-bold text-white font-mono">LOW</span>
                </div>
              </MetricCard>

              {/* Decorative rotating ring */}
              <div className="absolute inset-0 border border-[hsl(var(--gold-accent))]/10 rounded-full pointer-events-none animate-[spin_45s_linear_infinite]">
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[hsl(var(--gold-accent))] rounded-full -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-[hsl(var(--gold-accent))] rounded-full -translate-x-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom trust bar --- */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/5 py-6 bg-[#0D0406]/80 backdrop-blur-sm z-10">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-[#FAFAFA]/40 uppercase tracking-[0.4em] font-black">
            Performance Tiers
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
            {["Series A Founders", "Special Ops Teams", "F1 Strategists", "Chess Grandmasters"].map(
              (t) => (
                <span key={t} className="font-display italic text-[#FAFAFA]/45 text-sm">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes ticker-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes float-a { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -10px); } }
        @keyframes float-b { 0%,100% { transform: translateY(-50%); } 50% { transform: translateY(calc(-50% - 12px)); } }
        @keyframes float-c { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </section>
  );
};

function MetricCard({
  children,
  className = "",
  label,
  delay = 0,
  anim,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  delay?: number;
  anim: "float-a" | "float-b" | "float-c";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`group p-4 bg-[#0D0406]/60 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:border-[hsl(var(--gold-accent))]/60 hover:shadow-[0_0_30px_hsl(45_96%_50%/0.25)] ${className}`}
      style={{ animation: `${anim} 5s ease-in-out infinite ${delay}s` }}
      aria-label={label}
    >
      <div className="absolute -top-2 -left-2 w-2 h-2 border-t border-l border-[hsl(var(--gold-accent))]/40" />
      <div className="absolute -bottom-2 -right-2 w-2 h-2 border-b border-r border-[hsl(var(--gold-accent))]/40" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export default HeroSection;