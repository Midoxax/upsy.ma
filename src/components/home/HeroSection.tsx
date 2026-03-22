import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import mehdiPhoto from "@/assets/mehdi-felji.png";
import upsyLogo from "@/assets/upsy-logo-hero.png";

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="hero-neural-bg relative min-h-[90vh] flex items-center">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Emotional copy */}
          <motion.div
            className="text-center lg:text-left pt-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Brand logo */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <img
                src={upsyLogo}
                alt="U.Psy"
                className="h-10 w-auto lg:mx-0 mx-auto"
                loading="eager"
              />
            </motion.div>

            <h1 className="text-display mb-6 leading-tight">
              {t("hero.title")}
              <br />
              <span className="text-primary">{t("hero.titleHighlight")}</span>
            </h1>

            <motion.p
              className="text-body text-muted-foreground mb-10 max-w-xl font-normal leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button variant="primary" size="hero" asChild>
                <Link to="/psychologists">{t("hero.findPsychologist")}</Link>
              </Button>
              <Button variant="secondary" size="hero" asChild>
                <Link to="/get-matched">
                  {t("hero.startAssessment") || "Start Self-Assessment"}
                </Link>
              </Button>
            </motion.div>

            {/* Trust whisper below CTA */}
            <motion.p
              className="text-xs text-muted-foreground/50 mt-6 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {t("hero.trustWhisper") || "No commitment required. Completely confidential."}
            </motion.p>
          </motion.div>

          {/* Right — Human presence */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="w-full max-w-md">
              <div className="aspect-square rounded-u-lg overflow-hidden shadow-glass">
                <img
                  src={mehdiPhoto}
                  alt="Mehdi Felji"
                  className="w-full h-full object-cover rounded-u-lg"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll invitation */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <ChevronDown className="text-muted-foreground/40 w-5 h-5 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
