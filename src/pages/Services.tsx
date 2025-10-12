import { Brain, Clock, Flower2, TrendingUp, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MethodsMetricsBand } from "@/components/MethodsMetricsBand";
import { useLocale } from "@/contexts/LocaleContext";

const Services = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  const services = [
    {
      icon: Brain,
      title: "Initial Diagnostic",
      description: "90-min comprehensive assessment, goal setting, and personalized plan.",
      price: "700 MAD",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "Performance & Resilience Pack",
      description: "6×60-min sessions: visualization, pre-event routines, stress mastery.",
      price: "3,600 MAD",
      color: "text-secondary"
    },
    {
      icon: Flower2,
      title: "Therapy & Recovery Pack",
      description: "10×60-min CBT/Schema for anxiety, trauma, addiction.",
      price: "5,500 MAD",
      color: "text-accent"
    },
    {
      icon: Brain,
      title: "Personality & Serenity Tests",
      description: "Psychometric tools + 2×60-min feedback sessions.",
      price: "1,800 MAD",
      color: "text-secondary"
    },
    {
      icon: Clock,
      title: "Express Online Follow-up",
      description: "30-min tune-up session (returning clients only).",
      price: "300 MAD",
      color: "text-accent"
    }
  ];

  const expectations = [
    "Clear structure and measurable goals",
    "Evidence-based therapeutic approaches",
    "Bilingual sessions (English/French/Arabic)",
    "Complete confidentiality & ethics",
    "Flexible online and in-clinic options"
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Methods & Metrics Band */}
      <MethodsMetricsBand />

      {/* Intro Section */}
      <section className="container-custom section-spacing">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-h1 text-foreground mb-6">
            {t('services.intro.title')}
          </h1>
          <p className="text-h3 text-muted-foreground">
            {t('services.intro.subtitle')}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {(t('services.items') as any[]).map((service: any, index: number) => {
            const icons = [Brain, TrendingUp, Flower2, Brain, Clock];
            const colors = ["text-accent", "text-secondary", "text-accent", "text-secondary", "text-accent"];
            const Icon = icons[index];
            return (
              <Card key={index} className="border-2 hover:border-accent transition-all duration-300 hover:shadow-elegant">
                <CardHeader>
                  <Icon className={`w-12 h-12 mb-4 ${colors[index]}`} strokeWidth={1.5} aria-hidden="true" />
                  <CardTitle className="text-h3">{service.title}</CardTitle>
                  <CardDescription className="text-body mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {service.price}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What to Expect Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-h2 text-foreground mb-8 text-center">{t('services.expectations.title')}</h2>
          <div className="space-y-4">
            {(t('services.expectations.list') as string[]).map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="text-body text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-20">
          <Button 
            size="lg" 
            onClick={() => navigate('/contact')}
            className="hover-glow hover:scale-105 transition-transform"
          >
            {t('services.cta')}
          </Button>
        </div>
      </section>

      {/* Transition Banner to Institutional */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-background to-secondary py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 80%, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            color: 'var(--secondary)'
          }} />
        </div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-h2 text-white mb-6">
            {t('services.transition.title')}
          </h2>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/services/consulting-for-organizations')}
            className="hover:scale-105 transition-transform"
          >
            {t('services.transition.button')}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Services;