import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What if I don't click with my psychologist?",
    a: "You get a free rebook with a different psychologist — no questions asked. The first session is about finding the right person, not paying twice to try again.",
  },
  {
    q: "How much does a session cost?",
    a: "MAD 600 for a single 50-min session. Packs of 4 sessions save you ~8%. Ongoing monthly care is MAD 2,400/month. The exact price is on each psychologist's profile.",
  },
  {
    q: "Is it confidential? What about my employer or insurance?",
    a: "Fully confidential. We follow Moroccan Law 09-08 on personal data. Nothing is shared with your employer, insurance, or family without your written consent. Sessions are encrypted end-to-end.",
  },
  {
    q: "In what language are sessions held?",
    a: "Arabic (Darija or Modern Standard), French, and English. You filter by language when choosing your psychologist.",
  },
  {
    q: "Video or in-person?",
    a: "Both. Most psychologists offer secure video sessions. Some also see clients in-person in Casablanca, Rabat, and Marrakech — filter by city.",
  },
  {
    q: "Do you take insurance (CNSS, CNOPS, private)?",
    a: "We give you a proper invoice you can submit to your insurance. Reimbursement depends on your plan — most private policies reimburse 40–70% of psychology sessions.",
  },
  {
    q: "How fast can I book?",
    a: "Most psychologists have slots within 48 hours. Some offer same-day sessions. Availability is shown live on each profile.",
  },
];

export default function HomeFAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-primary mb-4">Straight answers</p>
          <h2 className="text-h2 mb-4">The things people actually ask before booking</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-u-card border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-start p-5 md:p-6 hover:bg-muted/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-medium">{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <p className="px-5 md:px-6 pb-6 text-body text-muted-foreground max-w-none">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}