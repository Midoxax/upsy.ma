import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/home/HeroSection";
import { useIntentSignals } from "@/hooks/useIntentSignals";
import SEOHead from "@/components/SEOHead";
import { Chapter } from "@/lib/motion";

// Conversion-focused funnel: one path, no dynamic reordering.
const TrustSection = lazy(() => import("@/components/home/TrustSection"));
const FeaturedPsychologistsSection = lazy(() => import("@/components/home/FeaturedPsychologistsSection"));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection"));
const WhyUsSection = lazy(() => import("@/components/home/WhyUsSection"));
const ProgramsSection = lazy(() => import("@/components/home/ProgramsSection"));
const FounderSection = lazy(() => import("@/components/home/FounderSection"));
const OrganizationsSection = lazy(() => import("@/components/home/OrganizationsSection"));
const HomePricingSection = lazy(() => import("@/components/home/HomePricingSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const HomeFAQSection = lazy(() => import("@/components/home/HomeFAQSection"));
const FinalCTASection = lazy(() => import("@/components/home/FinalCTASection"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-6 w-6 motion-breathe rounded-full bg-primary/20" />
  </div>
);

/**
 * Conversion-focused sequence:
 *  1. Hero (single primary CTA)
 *  2. Trust strip
 *  3. Featured psychologists (money section — earlier is better)
 *  4. How it works (3 steps → book)
 *  5. Pricing
 *  6. Testimonials
 *  7. FAQ (kill objections)
 *  8. Final CTA
 */
const homeSequence = [
  { key: "trust", Component: TrustSection },
  { key: "featured-psychologists", Component: FeaturedPsychologistsSection },
  { key: "how-it-works", Component: HowItWorksSection },
  { key: "why-us", Component: WhyUsSection },
  { key: "programs", Component: ProgramsSection },
  { key: "pricing", Component: HomePricingSection },
  { key: "organizations", Component: OrganizationsSection },
  { key: "testimonials", Component: TestimonialsSection },
  { key: "founder", Component: FounderSection },
  { key: "faq", Component: HomeFAQSection },
  { key: "final-cta", Component: FinalCTASection },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;
    let target: string | null = null;
    try {
      target = sessionStorage.getItem("upsy:post-oauth-redirect");
    } catch {}
    if (target) {
      try { sessionStorage.removeItem("upsy:post-oauth-redirect"); } catch {}
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Intent signals kept only for hero micro-copy variants.
  useIntentSignals();

  return (
    <main className="flex-1 marketing-night">
      <SEOHead
        path="/"
        title="U.Psy — Book an accredited psychologist. Worldwide, in any timezone."
        description="Book a 50-min session with an accredited psychologist — video anywhere in the world, or in-person in select cities. Arabic, French, English, Spanish or Portuguese. Free rebook if not the right fit."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "U.Psy",
            url: "https://upsy.ma",
            logo: "https://upsy.ma/favicon.png",
            description:
              "Book accredited psychologists worldwide. Video sessions in any timezone or in-person visits in select cities, with a free rebook guarantee.",
            founder: { "@type": "Person", name: "Mehdi Felji", jobTitle: "Founder" },
            areaServed: "Worldwide",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How do I improve my mental performance?", acceptedAnswer: { "@type": "Answer", text: "Measure a baseline, target the weakest link (focus, sleep, emotional regulation, recovery), train it for 6–8 weeks with a psychologist using validated protocols (CBT, ACT, EMDR, performance psychology), then re-measure." } },
              { "@type": "Question", name: "How do I build mental toughness?", acceptedAnswer: { "@type": "Answer", text: "Mental toughness is trained tolerance for discomfort plus a clean decision framework. In 4–6 sessions you learn cognitive defusion for intrusive thoughts and rehearse pressure situations — the same protocol used by athletes, founders, and executives." } },
              { "@type": "Question", name: "Can a psychologist help me focus and be more productive?", acceptedAnswer: { "@type": "Answer", text: "Yes when the root cause is psychological (anxiety, ADHD traits, burnout, perfectionism). We screen in session 1 with validated instruments (GAD-7, PHQ-9, adult ADHD), then build a daily focus protocol. Most clients report change within 3–4 weeks." } },
              { "@type": "Question", name: "What if I don't click with my psychologist?", acceptedAnswer: { "@type": "Answer", text: "You get a free rebook with a different psychologist — no questions asked. The first session is about finding the right person, not paying twice to try again." } },
              { "@type": "Question", name: "How much does a session cost?", acceptedAnswer: { "@type": "Answer", text: "From MAD 600 / EUR 55 / USD 60 for a single 50-min session. Packs of 4 save ~8%. Ongoing monthly care from MAD 2,400." } },
              { "@type": "Question", name: "Is it confidential?", acceptedAnswer: { "@type": "Answer", text: "Fully confidential. We follow Moroccan Law 09-08. Nothing is shared with your employer, insurance, or family without your written consent. Sessions are encrypted end-to-end." } },
              { "@type": "Question", name: "In what language are sessions held?", acceptedAnswer: { "@type": "Answer", text: "Arabic (Darija & MSA), French, English — and Spanish, Portuguese, or Italian with select specialists." } },
              { "@type": "Question", name: "Video or in-person?", acceptedAnswer: { "@type": "Answer", text: "Both. Every psychologist offers secure video sessions worldwide. In-person visits are available in select cities." } },
              { "@type": "Question", name: "Do you take insurance?", acceptedAnswer: { "@type": "Answer", text: "We issue a compliant invoice you can submit to CNSS/CNOPS or private health plans. Most private policies reimburse 40–70% of psychology sessions." } },
              { "@type": "Question", name: "How fast can I book?", acceptedAnswer: { "@type": "Answer", text: "Most psychologists have slots within 48 hours. Some offer same-day sessions. Availability is shown live on each profile." } },
            ],
          },
        ]}
      />
      <HeroSection />
      {homeSequence.map(({ key, Component }) => (
        <Suspense key={key} fallback={<SectionFallback />}>
          <Chapter amount={0.12}>
            <Component />
          </Chapter>
        </Suspense>
      ))}
    </main>
  );
};

export default Index;
