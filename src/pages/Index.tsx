import MaroonDivider from "@/components/ui/maroon-divider";
import HeroSection from "@/components/home/HeroSection";
import PillarsSection from "@/components/home/PillarsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import SelfAssessmentSection from "@/components/home/SelfAssessmentSection";
import FeaturedPsychologistsSection from "@/components/home/FeaturedPsychologistsSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import LearningSection from "@/components/home/LearningSection";
import OrganizationsSection from "@/components/home/OrganizationsSection";
import ResearchSection from "@/components/home/ResearchSection";
import CommunitySection from "@/components/home/CommunitySection";
import FinalCTASection from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <MaroonDivider />
      <PillarsSection />
      <MaroonDivider />
      <HowItWorksSection />
      <MaroonDivider />
      <SelfAssessmentSection />
      <MaroonDivider />
      <FeaturedPsychologistsSection />
      <MaroonDivider />
      <ProgramsSection />
      <MaroonDivider />
      <LearningSection />
      <MaroonDivider />
      <OrganizationsSection />
      <MaroonDivider />
      <ResearchSection />
      <MaroonDivider />
      <CommunitySection />
      <MaroonDivider />
      <FinalCTASection />
    </main>
  );
};

export default Index;
