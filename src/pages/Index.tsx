import { lazy, Suspense, ComponentType } from "react";
import MaroonDivider from "@/components/ui/maroon-divider";
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

/** Section configuration — each entry is an independent module */
interface SectionConfig {
  /** Unique key for React reconciliation */
  key: string;
  /** The section component */
  component: ComponentType;
  /** If true, user must be authenticated to see this section */
  requiresAuth?: boolean;
  /** Optional predicate — return false to hide the section */
  visible?: () => boolean;
}

// Conversion-optimised order
const sections: SectionConfig[] = [
  { key: "hero", component: HeroSection },
  { key: "trust", component: TrustSection },
  { key: "self-assessment", component: SelfAssessmentSection },
  { key: "featured-psychologists", component: FeaturedPsychologistsSection },
  { key: "how-it-works", component: HowItWorksSection },
  { key: "pillars", component: PillarsSection },
  { key: "programs", component: ProgramsSection },
  { key: "learning", component: LearningSection },
  { key: "organizations", component: OrganizationsSection },
  { key: "research", component: ResearchSection },
  { key: "psf", component: PsfSection },
  { key: "community", component: CommunitySection },
  { key: "testimonials", component: TestimonialsSection },
  { key: "final-cta", component: FinalCTASection },
];

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const Index = () => {
  const visibleSections = sections.filter(
    (s) => s.visible === undefined || s.visible()
  );

  return (
    <main className="flex-1">
      {visibleSections.map((section, index) => {
        const Section = section.component;
        return (
          <Suspense key={section.key} fallback={<SectionFallback />}>
            <Section />
            {index < visibleSections.length - 1 && <MaroonDivider />}
          </Suspense>
        );
      })}
    </main>
  );
};

export default Index;
