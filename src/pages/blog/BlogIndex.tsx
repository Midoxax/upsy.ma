import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import SEOHead from "@/components/SEOHead";

interface BlogArticle {
  slug: string;
  titleKey: string;
  descKey: string;
  fallbackTitle: string;
  fallbackDesc: string;
  category: string;
  categoryKey: string;
  readTime: string;
  color: string;
}

const articles: BlogArticle[] = [
  {
    slug: "find-right-psychologist",
    titleKey: "blog.findPsych.title",
    descKey: "blog.findPsych.intro",
    fallbackTitle: "How to Find the Right Psychologist for You",
    fallbackDesc: "Finding the right psychologist can feel overwhelming. This guide breaks down the process into simple, actionable steps so you can make a confident choice.",
    category: "Guide",
    categoryKey: "blog.guide",
    readTime: "5 min",
    color: "bg-primary/10 text-primary",
  },
  {
    slug: "do-i-need-therapy",
    titleKey: "blog.therapy.title",
    descKey: "blog.therapy.intro",
    fallbackTitle: "Do I Need Therapy?",
    fallbackDesc: "If you're asking this question, you're already taking a brave step. Here's how to recognize when professional support could help.",
    category: "Mental Health",
    categoryKey: "blog.mentalHealth",
    readTime: "6 min",
    color: "bg-secondary/10 text-secondary",
  },
];

const BlogIndex = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <SEOHead path="/blog" />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-neural-bg py-20 md:py-28">
          <div className="container-custom max-w-3xl">
            <ScrollReveal>
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-primary/10 border-2 border-primary/20">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-display leading-tight">
                  {t("blog.indexTitle") || "Mental Health Blog"}
                </h1>
                <p className="text-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("blog.indexSubtitle") || "Practical guides, insights, and resources to help you understand your mental health and take meaningful action."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom max-w-4xl">
            <StaggerContainer staggerDelay={0.15}>
              <div className="grid md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <StaggerItem key={article.slug}>
                    <Link
                      to={addLocalePrefix(`/blog/${article.slug}`, locale)}
                      className="glass-card p-0 overflow-hidden group block h-full"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="h-48 flex items-center justify-center bg-primary/5 border-b border-border/30 relative overflow-hidden">
                        <span className="text-6xl font-bold text-primary/10 group-hover:scale-110 transition-transform duration-500">
                          {(t(article.titleKey) || article.fallbackTitle).charAt(0)}
                        </span>
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${article.color}`}>
                            {t(article.categoryKey) || article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {t(article.titleKey) || article.fallbackTitle}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {t(article.descKey) || article.fallbackDesc}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                            <Clock className="w-3.5 h-3.5" /> {article.readTime}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                            {t("research.readMore") || "Read more"} <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogIndex;
