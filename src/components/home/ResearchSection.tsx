import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const articles = [
  { titleKey: "research.article1.title" as const, summaryKey: "research.article1.summary" as const, categoryKey: "research.article1.category" as const, fallbackTitle: "Mental Health in Sport", fallbackSummary: "How elite athletes manage psychological pressure and build resilience.", fallbackCategory: "Sport Psychology" },
  { titleKey: "research.article2.title" as const, summaryKey: "research.article2.summary" as const, categoryKey: "research.article2.category" as const, fallbackTitle: "Burnout Prevention", fallbackSummary: "Evidence-based strategies for recognizing and preventing professional burnout.", fallbackCategory: "Workplace" },
  { titleKey: "research.article3.title" as const, summaryKey: "research.article3.summary" as const, categoryKey: "research.article3.category" as const, fallbackTitle: "Psychological Resilience", fallbackSummary: "Building mental toughness through structured cognitive-behavioral techniques.", fallbackCategory: "Research" },
];

const ResearchSection = () => {
  const { t } = useLocale();

  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">{t("research.title") || "Mental Health Insights"}</h2>
            <p className="text-body text-muted-foreground">
              {t("research.subtitle") || "Research-backed articles and clinical insights."}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {articles.map((article) => (
              <StaggerItem key={article.fallbackTitle}>
                <div className="glass-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-xs text-primary font-medium">{t(article.categoryKey) || article.fallbackCategory}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t(article.titleKey) || article.fallbackTitle}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t(article.summaryKey) || article.fallbackSummary}</p>
                  <Link to="/talent-innovation-hub" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
                    {t("research.readMore") || "Read more"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/talent-innovation-hub" className="inline-flex items-center gap-2">
              {t("research.cta") || "Read Insights"} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
