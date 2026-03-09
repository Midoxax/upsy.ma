import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Headphones, Video, Download, ArrowRight, Search, Filter, Clock, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const featuredResources = [
  { title: "Understanding Cognitive Behavioral Therapy", type: "Guide", readTime: "12 min", rating: 4.8, category: "Therapy" },
  { title: "Mindfulness Meditation for Beginners", type: "Audio", readTime: "20 min", rating: 4.9, category: "Wellbeing" },
  { title: "Managing Workplace Stress", type: "Article", readTime: "8 min", rating: 4.7, category: "Workplace" },
  { title: "Building Emotional Resilience", type: "Video", readTime: "15 min", rating: 4.8, category: "Self-Help" },
  { title: "Sport Psychology Fundamentals", type: "Guide", readTime: "18 min", rating: 4.9, category: "Sport" },
  { title: "Parenting and Child Psychology", type: "Article", readTime: "10 min", rating: 4.6, category: "Family" },
];

const topics = [
  "Anxiety", "Depression", "Stress Management", "Resilience", "Sport Psychology",
  "Burnout", "Relationships", "Self-Esteem", "Mindfulness", "Trauma Recovery",
  "Child Psychology", "Workplace Wellbeing",
];

const Resources = () => {
  const { t } = useLocale();

  const categories = [
    { icon: FileText, title: t('resourcesPage.articlesGuides'), count: "120+", description: t('resourcesPage.articlesGuidesDesc') },
    { icon: Video, title: t('resourcesPage.videoLibrary'), count: "45+", description: t('resourcesPage.videoLibraryDesc') },
    { icon: Headphones, title: t('resourcesPage.podcasts'), count: "30+", description: t('resourcesPage.podcastsDesc') },
    { icon: Download, title: t('resourcesPage.toolkitsWorksheets'), count: "60+", description: t('resourcesPage.toolkitsWorksheetsDesc') },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-primary/10 py-20 lg:py-28">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              {t('resourcesPage.badge')}
            </div>
            <h1 className="text-h1 text-foreground mb-6">{t('resourcesPage.title')}</h1>
            <p className="text-h3 text-muted-foreground mb-8 max-w-2xl mx-auto">{t('resourcesPage.subtitle')}</p>
            <div className="flex items-center gap-3 max-w-xl mx-auto bg-card border border-border rounded-xl p-2">
              <Search className="w-5 h-5 text-muted-foreground ml-3" />
              <input type="text" placeholder={t('resourcesPage.searchPlaceholder')} className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
              <Button size="sm" variant="default"><Filter className="w-4 h-4 mr-2" /> {t('resourcesPage.filter')}</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Topics */}
      <section className="border-y border-border bg-card/50 py-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {topics.map((topic) => (
              <button key={topic} className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors">
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom section-spacing">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-h2 text-foreground mb-4">{t('resourcesPage.browseByFormat')}</h2>
            <p className="text-body text-muted-foreground">{t('resourcesPage.browseByFormatDesc')}</p>
          </div>
        </ScrollReveal>
        <StaggerContainer staggerDelay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <StaggerItem key={cat.title}>
                <Card className="h-full text-center hover:border-secondary/30 border-2 transition-colors cursor-pointer">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-secondary/10">
                      <cat.icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
                    <div className="text-2xl font-bold text-primary mb-2">{cat.count}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Featured Resources */}
      <section className="bg-card/50 border-y border-border py-16 lg:py-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">{t('resourcesPage.featuredResources')}</h2>
              <p className="text-body text-muted-foreground">{t('resourcesPage.featuredResourcesDesc')}</p>
            </div>
          </ScrollReveal>
          <StaggerContainer staggerDelay={0.08}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredResources.map((resource) => (
                <StaggerItem key={resource.title}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{resource.category}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{resource.type}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-3 leading-snug">{resource.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{resource.readTime}</span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" />{resource.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom section-spacing text-center">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-h2 text-foreground mb-4">{t('resourcesPage.personalizedCTA')}</h2>
            <p className="text-body text-muted-foreground mb-8">{t('resourcesPage.personalizedCTADesc')}</p>
            <Button size="lg" variant="default" asChild>
              <Link to="/auth" className="inline-flex items-center gap-2">
                {t('resourcesPage.createFreeAccount')} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default Resources;
