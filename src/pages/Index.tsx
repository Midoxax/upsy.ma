import { lazy, Suspense, ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/home/HeroSection";
import { useIntentSignals } from "@/hooks/useIntentSignals";
import { useDynamicSections } from "@/hooks/useDynamicSections";
import type { UserIntent } from "@/stores/intentStore";
import SectionDivider from "@/components/home/SectionDivider";
import type { DividerVariant, DividerColor } from "@/components/home/SectionDivider";
import SEOHead from "@/components/SEOHead";
import { Chapter } from "@/lib/motion";

// Lazy-loaded sections (all except Hero to reduce initial bundle)
const TrustSection = lazy(() => import("@/components/home/TrustSection"));
const SelfAssessmentSection = lazy(() => import("@/components/home/SelfAssessmentSection"));
const FeaturedPsychologistsSection = lazy(() => import("@/components/home/FeaturedPsychologistsSection"));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection"));
const FounderSection = lazy(() => import("@/components/home/FounderSection"));
const PillarsSection = lazy(() => import("@/components/home/PillarsSection"));
const WhyUsSection = lazy(() => import("@/components/home/WhyUsSection"));
const PathwaysSection = lazy(() => import("@/components/home/PathwaysSection"));
const ProgramsSection = lazy(() => import("@/components/home/ProgramsSection"));
const LearningSection = lazy(() => import("@/components/home/LearningSection"));
const OrganizationsSection = lazy(() => import("@/components/home/OrganizationsSection"));
const ResearchSection = lazy(() => import("@/components/home/ResearchSection"));
const PsfSection = lazy(() => import("@/components/home/PsfSection"));
const CommunitySection = lazy(() => import("@/components/home/CommunitySection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTASection = lazy(() => import("@/components/home/FinalCTASection"));

// ─── Section Configuration System ───

export interface SectionConfig {
  /** Unique key for React reconciliation and tracking */
  key: string;
  /** The section component */
  component: ComponentType;
  /** Analytics tracking ID */
  trackingId: string;
  /** Priority scores per intent (1 = highest priority, 0 = pinned/ignored) */
  priorityByIntent: Record<UserIntent, number>;
  /** Narrative ordering constraints */
  narrativeConstraints: {
    /** Section keys that MUST appear before this one (soft — within ±2 only) */
    mustAppearAfter?: string[];
    /** Section keys that MUST appear after this one (soft — within ±2 only) */
    mustAppearBefore?: string[];
    /** Pin to fixed position — exempt from reordering */
    pinPosition?: "first" | "second" | "third" | "last";
  };
  /** Default position index (used for maxPositionShift = ±2 calculation) */
  defaultIndex: number;
  /** Skeleton variant for progressive disclosure (Phase 3) */
  skeletonVariant?: "hero" | "cards" | "text";
}

/**
 * ANCHOR SECTIONS (non-movable):
 * - Hero → pinned 1st
 * - Trust → pinned 2nd
 * - How It Works (Patient Pathway) → pinned 3rd
 * - Final CTA → pinned last
 *
 * ADAPTIVE SECTIONS (positions 3–12, indices in adaptive zone 0–9):
 * Sorted by intent priority. maxPositionShift = ±2 (hard limit).
 *
 * PRIORITY TABLE (1 = highest):
 * ┌─────────────────────┬────────────┬──────────────┬─────────────┬──────────┐
 * │ Section             │ EXPLORING  │ READY_TO_ACT │ RESEARCHING │ SKEPTICAL│
 * ├─────────────────────┼────────────┼──────────────┼─────────────┼──────────┤
 * │ Hero                │ pinned 1st │ pinned 1st   │ pinned 1st  │pinned 1st│
 * │ Trust               │ pinned 2nd │ pinned 2nd   │ pinned 2nd  │pinned 2nd│
 * │ How It Works        │ pinned 3rd │ pinned 3rd   │ pinned 3rd  │pinned 3rd│
 * │ Self-Assessment     │ 1          │ 1            │ 4           │ 5        │
 * │ Psychologists       │ 2          │ 2            │ 5           │ 6        │
 * │ Pillars             │ 3          │ 5            │ 3           │ 7        │
 * │ Programs            │ 4          │ 3            │ 6           │ 8        │
 * │ Learning            │ 5          │ 7            │ 2           │ 9        │
 * │ Organizations       │ 6          │ 8            │ 7           │ 10       │
 * │ Research            │ 7          │ 9            │ 1           │ 4        │
 * │ PSF                 │ 8          │ 10           │ 8           │ 3        │
 * │ Community           │ 9          │ 6            │ 9           │ 2        │
 * │ Testimonials        │ 10         │ 4            │ 10          │ 1        │
 * │ Final CTA           │ pinned last│ pinned last  │ pinned last │pinned last│
 * └─────────────────────┴────────────┴──────────────┴─────────────┴──────────┘
 */
const sections: SectionConfig[] = [
  {
    key: "hero",
    component: HeroSection,
    trackingId: "hero",
    defaultIndex: 0,
    skeletonVariant: "hero",
    priorityByIntent: { EXPLORING: 0, READY_TO_ACT: 0, RESEARCHING: 0, SKEPTICAL: 0 },
    narrativeConstraints: { pinPosition: "first" },
  },
  {
    key: "trust",
    component: TrustSection,
    trackingId: "trust",
    defaultIndex: 1,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 0, READY_TO_ACT: 0, RESEARCHING: 0, SKEPTICAL: 0 },
    narrativeConstraints: { pinPosition: "second" },
  },
  {
    key: "pathways",
    component: PathwaysSection,
    trackingId: "pathways",
    defaultIndex: 2,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 0, READY_TO_ACT: 0, RESEARCHING: 0, SKEPTICAL: 0 },
    narrativeConstraints: { pinPosition: "third" },
  },
  {
    key: "how-it-works",
    component: HowItWorksSection,
    trackingId: "how_it_works",
    defaultIndex: 3,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 1, READY_TO_ACT: 1, RESEARCHING: 1, SKEPTICAL: 1 },
    narrativeConstraints: { mustAppearAfter: ["pathways"] },
  },
  {
    key: "self-assessment",
    component: SelfAssessmentSection,
    trackingId: "self_assessment",
    defaultIndex: 3,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 1, READY_TO_ACT: 1, RESEARCHING: 4, SKEPTICAL: 5 },
    narrativeConstraints: {},
  },
  {
    key: "featured-psychologists",
    component: FeaturedPsychologistsSection,
    trackingId: "featured_psychologists",
    defaultIndex: 4,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 2, READY_TO_ACT: 2, RESEARCHING: 5, SKEPTICAL: 6 },
    narrativeConstraints: { mustAppearAfter: ["self-assessment"] },
  },
  {
    key: "pillars",
    component: PillarsSection,
    trackingId: "pillars",
    defaultIndex: 5,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 3, READY_TO_ACT: 5, RESEARCHING: 3, SKEPTICAL: 7 },
    narrativeConstraints: {},
  },
  {
    key: "why-us",
    component: WhyUsSection,
    trackingId: "why_us",
    defaultIndex: 6,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 4, READY_TO_ACT: 6, RESEARCHING: 2, SKEPTICAL: 1 },
    narrativeConstraints: {},
  },
  {
    key: "programs",
    component: ProgramsSection,
    trackingId: "programs",
    defaultIndex: 6,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 4, READY_TO_ACT: 3, RESEARCHING: 6, SKEPTICAL: 8 },
    narrativeConstraints: {},
  },
  {
    key: "learning",
    component: LearningSection,
    trackingId: "learning",
    defaultIndex: 7,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 5, READY_TO_ACT: 7, RESEARCHING: 2, SKEPTICAL: 9 },
    narrativeConstraints: {},
  },
  {
    key: "organizations",
    component: OrganizationsSection,
    trackingId: "organizations",
    defaultIndex: 8,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 6, READY_TO_ACT: 8, RESEARCHING: 7, SKEPTICAL: 10 },
    narrativeConstraints: {},
  },
  {
    key: "research",
    component: ResearchSection,
    trackingId: "research",
    defaultIndex: 9,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 7, READY_TO_ACT: 9, RESEARCHING: 1, SKEPTICAL: 4 },
    narrativeConstraints: {},
  },
  {
    key: "psf",
    component: PsfSection,
    trackingId: "psf",
    defaultIndex: 10,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 8, READY_TO_ACT: 10, RESEARCHING: 8, SKEPTICAL: 3 },
    narrativeConstraints: {},
  },
  {
    key: "founder",
    component: FounderSection,
    trackingId: "founder",
    defaultIndex: 11,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 6, READY_TO_ACT: 7, RESEARCHING: 5, SKEPTICAL: 2 },
    narrativeConstraints: {},
  },
  {
    key: "community",
    component: CommunitySection,
    trackingId: "community",
    defaultIndex: 12,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 9, READY_TO_ACT: 6, RESEARCHING: 9, SKEPTICAL: 2 },
    narrativeConstraints: {},
  },
  {
    key: "testimonials",
    component: TestimonialsSection,
    trackingId: "testimonials",
    defaultIndex: 13,
    skeletonVariant: "cards",
    priorityByIntent: { EXPLORING: 10, READY_TO_ACT: 4, RESEARCHING: 10, SKEPTICAL: 1 },
    narrativeConstraints: { mustAppearBefore: ["final-cta"] },
  },
  {
    key: "final-cta",
    component: FinalCTASection,
    trackingId: "final_cta",
    defaultIndex: 14,
    skeletonVariant: "text",
    priorityByIntent: { EXPLORING: 0, READY_TO_ACT: 0, RESEARCHING: 0, SKEPTICAL: 0 },
    narrativeConstraints: { pinPosition: "last" },
  },
];

// ─── UI Components ───

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-6 w-6 motion-breathe rounded-full bg-primary/20" />
  </div>
);

// ── Divider config per transition ──

const dividerSequence: { variant: DividerVariant; color: DividerColor; flip?: boolean }[] = [
  { variant: "wave", color: "primary" },
  { variant: "blob", color: "gold" },
  { variant: "curve", color: "maroon" },
  { variant: "wave", color: "beige", flip: true },
  { variant: "blob", color: "primary" },
  { variant: "curve", color: "gold" },
  { variant: "wave", color: "maroon" },
  { variant: "blob", color: "beige", flip: true },
  { variant: "curve", color: "primary" },
  { variant: "wave", color: "gold" },
  { variant: "blob", color: "maroon" },
  { variant: "curve", color: "beige", flip: true },
  { variant: "wave", color: "primary" },
  { variant: "blob", color: "gold" },
  { variant: "curve", color: "maroon" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // If the user just completed an OAuth round-trip, the SDK lands them back
  // on "/" with a fresh session. Forward them to /my-space once the session
  // is restored.
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

  // Phase 1: Collect signals → classify → lock intent
  useIntentSignals();

  // Phase 2: Dynamic section ordering based on intent
  const orderedSections = useDynamicSections(sections);

  return (
    <main className="flex-1">
      <SEOHead
        path="/"
        title="U.Psy — Performance Psychology Platform for Morocco"
        description="Find accredited psychologists, take clinical self-assessments (GAD-7, PHQ-9), and access tailored mental health programs across Morocco."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "U.Psy",
          url: "https://upsy.ma",
          logo: "https://upsy.ma/favicon.png",
          description: "Performance psychology platform connecting users with accredited psychologists in Morocco.",
          founder: { "@type": "Person", name: "Mehdi Felji", jobTitle: "Founder" },
          areaServed: "Morocco",
        }}
      />
      {orderedSections.map((section, index) => {
        const Section = section.component;
        const divider = dividerSequence[index % dividerSequence.length];
        const isHero = section.key === "hero";
        return (
          <Suspense key={section.key} fallback={<SectionFallback />}>
            {isHero ? (
              <Section />
            ) : (
              <Chapter amount={0.12}>
                <Section />
              </Chapter>
            )}
            {index < orderedSections.length - 1 && (
              <SectionDivider variant={divider.variant} color={divider.color} flip={divider.flip} />
            )}
          </Suspense>
        );
      })}
    </main>
  );
};

export default Index;
