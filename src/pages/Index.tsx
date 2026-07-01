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
  { key: "pricing", Component: HomePricingSection },
  { key: "testimonials", Component: TestimonialsSection },
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
    <main className="flex-1">
      <SEOHead
        path="/"
        title="U.Psy — Book an accredited psychologist in Morocco"
        description="Book a 50-min session with an accredited psychologist in Morocco. Video or in-person, in Arabic, French, or English. Free rebook if not the right fit."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "U.Psy",
          url: "https://upsy.ma",
          logo: "https://upsy.ma/favicon.png",
          description:
            "Book accredited psychologists in Morocco. Video or in-person sessions with a free rebook guarantee.",
          founder: { "@type": "Person", name: "Mehdi Felji", jobTitle: "Founder" },
          areaServed: "Morocco",
        }}
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
