import { Shield, Video, Lock, Award } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";

const trustItems = [
  { icon: Award, labelKey: "trust.licensed" as const, fallback: "Licensed Psychologists" },
  { icon: Video, labelKey: "trust.telehealth" as const, fallback: "Secure Telehealth" },
  { icon: Lock, labelKey: "trust.confidential" as const, fallback: "100% Confidential" },
  { icon: Shield, labelKey: "trust.accredited" as const, fallback: "Accredited Platform" },
];

const TrustSection = () => {
  const { t } = useLocale();

  return (
    <section aria-label="Trust signals" className="py-10 bg-muted/30 border-y border-border/30">
      <div className="container mx-auto px-4">
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
      </div>
    </section>
  );
};

export default TrustSection;
