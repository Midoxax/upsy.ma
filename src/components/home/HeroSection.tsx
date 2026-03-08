import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const NeuralSphere = lazy(() => import("@/components/3d/NeuralSphere"));

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="hero-neural-bg relative min-h-screen flex items-center">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            className="text-center lg:text-left pt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-display mb-6 leading-tight">
              {t('hero.title')}<br />
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>

            <motion.p
              className="text-body text-muted-foreground mb-8 max-w-xl font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button variant="primary" size="hero" asChild>
                <Link to="/psychologists">{t('hero.findPsychologist')}</Link>
              </Button>
              <Button variant="secondary" size="hero" asChild>
                <Link to="/get-matched">Start Self-Assessment</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Neural Sphere */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-full max-w-md">
              <div className="aspect-square rounded-u-lg overflow-hidden">
                <Suspense fallback={<div className="w-full h-full bg-muted/20 rounded-u-lg animate-pulse" />}>
                  <NeuralSphere />
                </Suspense>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-muted-foreground w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
