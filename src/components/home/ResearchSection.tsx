import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const articles = [
  { title: "Mental Health in Sport", summary: "How elite athletes manage psychological pressure and build resilience.", category: "Sport Psychology" },
  { title: "Burnout Prevention", summary: "Evidence-based strategies for recognizing and preventing professional burnout.", category: "Workplace" },
  { title: "Psychological Resilience", summary: "Building mental toughness through structured cognitive-behavioral techniques.", category: "Research" },
];

const ResearchSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Mental Health Insights</h2>
            <p className="text-body text-u-gray-300">Research-backed articles and clinical insights.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {articles.map((article) => (
              <StaggerItem key={article.title}>
                <div className="glass-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-u-gold" />
                    <span className="text-xs text-u-gold font-medium">{article.category}</span>
                  </div>
                  <h3 className="font-semibold text-u-white mb-2">{article.title}</h3>
                  <p className="text-sm text-u-gray-300 leading-relaxed mb-4 flex-1">{article.summary}</p>
                  <Link to="/talent-innovation-hub" className="inline-flex items-center gap-1 text-sm text-u-gold font-medium hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/talent-innovation-hub" className="inline-flex items-center gap-2">
              Read Insights <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
