import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";

const FinalCTASection = () => {
  const { t } = useLocale();

  return (
    <section className="section-spacing relative overflow-hidden liquid-bg">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, hsl(var(--secondary) / 0.2), transparent 70%)' }} />
      <div className="container-custom relative z-10">
        <motion.div
          className="glass-card p-10 md:p-16 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-h2 mb-4">
            {t("finalCta.title") || "Take the First Step Toward Better Mental Health"}
          </h2>
          <p className="text-body text-muted-foreground mb-4">
            {t("finalCta.subtitle") || "Whether you need therapy, coaching, or education — U.Psy connects you with the right support."}
          </p>
          <p className="text-sm text-muted-foreground/80 mb-8">
            {t("finalCta.reassurance") || "No commitment required. Start with a free 2-minute self-assessment."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="hero" asChild>
              <Link to="/psychologists">{t("hero.findPsychologist") || "Find a Psychologist"}</Link>
            </Button>
            <Button variant="secondary" size="hero" asChild>
              <Link to="/get-matched">{t("finalCta.assessment") || "Start Self-Assessment"}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
