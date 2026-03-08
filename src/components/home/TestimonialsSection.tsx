import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amina B.",
    role: "Client",
    text: "NafsiCare helped me find the right psychologist in just a few days. The process was seamless and confidential.",
    rating: 5,
  },
  {
    name: "Dr. Youssef K.",
    role: "Psychologist",
    text: "The platform gave me visibility and connected me with clients who truly needed my expertise in cognitive therapy.",
    rating: 5,
  },
  {
    name: "Sara M.",
    role: "Client",
    text: "I was hesitant about online therapy, but the experience was incredibly professional and comfortable.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { t } = useLocale();

  return (
    <section aria-label="Testimonials" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("testimonials.title", "What Our Community Says")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.subtitle", "Real stories from clients and psychologists on the platform.")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6">
                "{item.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: item.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
