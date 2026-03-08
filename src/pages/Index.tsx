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
const CommunitySection = lazy(() => import("@/components/home/CommunitySection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTASection = lazy(() => import("@/components/home/FinalCTASection"));

// Conversion-optimised order
const sections: ComponentType[] = [
  HeroSection,
  TrustSection,
  SelfAssessmentSection,
  FeaturedPsychologistsSection,
  HowItWorksSection,
  PillarsSection,
  ProgramsSection,
  LearningSection,
  OrganizationsSection,
  ResearchSection,
  CommunitySection,
  TestimonialsSection,
  FinalCTASection,
];

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const Index = () => {
  return (
    <main className="flex-1">
      {sections.map((Section, index) => (
        <Suspense key={index} fallback={<SectionFallback />}>
          <Section />
          {index < sections.length - 1 && <MaroonDivider />}
        </Suspense>
      ))}
    </main>
  );
};

export default Index;
