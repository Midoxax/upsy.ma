import { lazy, Suspense, ComponentType } from "react";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import SelfAssessmentSection from "@/components/home/SelfAssessmentSection";
import FeaturedPsychologistsSection from "@/components/home/FeaturedPsychologistsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PillarsSection from "@/components/home/PillarsSection";

// Lazy-loaded below-the-fold sections
const ProgramsSection = lazy(() => import("@/components/home/ProgramsSection"));
const LearningSection = lazy(() => import("@/components/home/LearningSection"));
const OrganizationsSection = lazy(() => import("@/components/home/OrganizationsSection"));
const ResearchSection = lazy(() => import("@/components/home/ResearchSection"));
const PsfSection = lazy(() => import("@/components/home/PsfSection"));
const CommunitySection = lazy(() => import("@/components/home/CommunitySection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTASection = lazy(() => import("@/components/home/FinalCTASection"));

interface SectionConfig {
  key: string;
  component: ComponentType;
  /** Narrative act — controls background tone transitions */
  act: "welcome" | "trust" | "engage" | "solutions" | "proof" | "action";
}

// Conversion-optimised narrative order
const sections: SectionConfig[] = [
  { key: "hero", component: HeroSection, act: "welcome" },
  { key: "trust", component: TrustSection, act: "trust" },
  { key: "self-assessment", component: SelfAssessmentSection, act: "engage" },
  { key: "featured-psychologists", component: FeaturedPsychologistsSection, act: "solutions" },
  { key: "how-it-works", component: HowItWorksSection, act: "solutions" },
  { key: "pillars", component: PillarsSection, act: "solutions" },
  { key: "programs", component: ProgramsSection, act: "solutions" },
  { key: "learning", component: LearningSection, act: "solutions" },
  { key: "organizations", component: OrganizationsSection, act: "proof" },
  { key: "research", component: ResearchSection, act: "proof" },
  { key: "psf", component: PsfSection, act: "proof" },
  { key: "community", component: CommunitySection, act: "proof" },
  { key: "testimonials", component: TestimonialsSection, act: "proof" },
  { key: "final-cta", component: FinalCTASection, act: "action" },
];

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-6 w-6 motion-breathe rounded-full bg-primary/20" />
  </div>
);

/** Soft visual connector between sections — replaces harsh dividers */
const NarrativeConnector = () => (
  <div className="relative h-16 md:h-24 overflow-hidden" aria-hidden="true">
    <div
      className="absolute inset-x-0 top-0 h-full"
      style={{
        background:
          "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.03) 50%, transparent)",
      }}
    />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
  </div>
);

const Index = () => {
  return (
    <main className="flex-1">
      {sections.map((section, index) => {
        const Section = section.component;
        return (
          <Suspense key={section.key} fallback={<SectionFallback />}>
            <Section />
            {index < sections.length - 1 && <NarrativeConnector />}
          </Suspense>
        );
      })}
    </main>
  );
};

export default Index;
