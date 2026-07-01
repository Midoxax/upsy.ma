// src/components/home/HeroSection.tsx — "Geometric Monolith" hero
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="relative min-h-[92vh] w-full bg-[#1E080E] flex items-center justify-center overflow-hidden">
      {/* Ambient gold aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(45 96% 52% / 0.18), transparent 70%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background z-[1]" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-24 md:py-28 flex flex-col lg:flex-row items-center gap-14 lg:gap-8">
        {/* Left — Frosted glass content column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 1, 0.3, 1] }}
          className="relative w-full lg:w-3/5"
        >
          <div
            className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -30px rgba(0,0,0,0.6)" }}
          >
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}
              className="block font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#F2B705] mb-6"
            >
              Institutional Psychology System
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
              className="font-display text-[#FFF8F0] leading-[1.05] tracking-[-0.02em] text-[clamp(2.5rem,6.5vw,5.5rem)] mb-8"
            >
              The Infrastructure<br />
              <span className="italic font-light opacity-90">of Peak Human<br />Performance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="font-sans font-light text-lg md:text-xl text-[#FFF8F0]/70 max-w-xl leading-relaxed mb-10"
            >
              Moving beyond therapy into precision architecture. U.Psy builds the cognitive
              frameworks elite athletes, founders, and operators need to sustain pressure — without compromise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/free-score"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F2B705] text-[#1E080E] font-sans font-bold text-sm tracking-wide rounded-sm transition-shadow hover:shadow-[0_0_40px_rgba(242,183,5,0.35)]"
              >
                <span className="relative z-10">Get Your Performance Score</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                to="/psychologists"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#FFF8F0]/20 text-[#FFF8F0] font-sans font-medium text-sm tracking-wide rounded-sm hover:bg-[#FFF8F0]/5 hover:border-[#F2B705]/60 transition-colors"
              >
                <Sparkles className="h-4 w-4 text-[#F2B705]" />
                Book a session
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.6 }}
              className="mt-14 pt-6 border-t border-[#FFF8F0]/10"
            >
              <p className="text-[#FFF8F0]/40 text-[9px] uppercase tracking-[0.3em] font-sans font-bold mb-5">
                Deployed across high-stakes environments
              </p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-50">
                <span className="font-display text-lg font-bold text-white tracking-tight">OLYMPIC</span>
                <span className="font-sans text-sm font-light text-white tracking-[0.3em]">EQUITY.H</span>
                <span className="font-display text-xl font-black text-white italic">CORE</span>
                <span className="font-sans text-sm font-medium text-white underline underline-offset-4 decoration-1">STRATOS</span>
                <span className="font-mono text-xs text-white/80 tabular-nums">4.9 ★ · 240+ sessions</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right — Geometric lattice */}
        <div className="relative w-full lg:w-2/5 h-[360px] lg:h-[600px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.1, ease: [0.2, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full max-w-md stroke-[#F2B705]/50 fill-none drop-shadow-[0_0_20px_rgba(242,183,5,0.12)]">
                <path d="M100 10 L180 50 L180 150 L100 190 L20 150 L20 50 Z" strokeWidth="0.5" />
                <path d="M100 10 L100 190 M20 50 L180 150 M180 50 L20 150" strokeWidth="0.3" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="30" strokeWidth="0.3" />
                <path d="M100 40 L160 100 L100 160 L40 100 Z" strokeWidth="0.5" />
                <path d="M100 40 L100 10 M160 100 L180 50 M160 100 L180 150 M100 160 L100 190 M40 100 L20 150 M40 100 L20 50" strokeWidth="0.4" />
                <circle cx="100" cy="10" r="2" fill="#F2B705" className="animate-pulse" />
                <circle cx="180" cy="50" r="1.5" fill="#F2B705" />
                <circle cx="180" cy="150" r="1.5" fill="#F2B705" />
                <circle cx="100" cy="190" r="2" fill="#F2B705" className="animate-pulse" />
                <circle cx="20" cy="150" r="1.5" fill="#F2B705" />
                <circle cx="20" cy="50" r="1.5" fill="#F2B705" />
                <circle cx="100" cy="100" r="3" fill="#F2B705" />
              </svg>
            </motion.div>
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-3xl opacity-60"
              style={{ background: "radial-gradient(closest-side, hsl(45 96% 52% / 0.15), transparent 70%)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
