import { Shield, Video, Lock, Award } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";

const trustItems = [
  { icon: Award, labelKey: "trust.licensed" as const, fallback: "Licensed Psychologists" },
  { icon: Video, labelKey: "trust.telehealth" as const, fallback: "Secure Telehealth" },
  { icon: Lock, labelKey: "trust.confidential" as const, fallback: "100% Confidential" },
  { icon: Shield, labelKey: "trust.accredited" as const, fallback: "Accredited Platform" },
];

const stats = [
  { value: "50+", labelKey: "trust.statExperts" as const, fallback: "Verified Experts" },
  { value: "2,000+", labelKey: "trust.statSessions" as const, fallback: "Sessions Completed" },
  { value: "98%", labelKey: "trust.statSatisfaction" as const, fallback: "Client Satisfaction" },
];

const partnerLogos = [
  { name: "Ministry of Health", initials: "MoH" },
  { name: "WHO", initials: "WHO" },
  { name: "UNICEF", initials: "UNICEF" },
  { name: "Moroccan Federation", initials: "FRMPS" },
  { name: "African Union", initials: "AU" },
];

const TrustSection = () => {
  const { t } = useLocale();

  return (
    <section aria-label="Trust signals" className="py-12 bg-muted/30 border-y border-border/20">
      <div className="container mx-auto px-4">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">
                {t(item.labelKey) || item.fallback}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Social proof numbers */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mt-8 pt-8 border-t border-border/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                {t(stat.labelKey) || stat.fallback}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Partner logos */}
        <motion.div
          className="mt-8 pt-8 border-t border-border/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-center text-xs text-muted-foreground/60 uppercase tracking-widest mb-6">
            {t("trust.partnersLabel") || "Trusted Partners & Affiliations"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partnerLogos.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center w-20 h-12 md:w-24 md:h-14 rounded-lg bg-background/60 border border-border/30 text-muted-foreground/50 text-xs md:text-sm font-semibold tracking-wide hover:text-muted-foreground/80 hover:border-border/50 transition-colors duration-300"
                title={partner.name}
              >
                {partner.initials}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reassurance */}
        <motion.p
          className="text-center text-sm text-muted-foreground/80 mt-8 italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {t("trust.reassurance") || "You're in safe hands. Every session is private, secure, and judgment-free."}
        </motion.p>
      </div>
    </section>
  );
};

export default TrustSection;
