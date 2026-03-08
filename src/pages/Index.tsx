import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, BookOpen, Activity, Building2, ArrowRight, CheckCircle2, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import MaroonDivider from "@/components/ui/maroon-divider";
import { useLocale } from "@/contexts/LocaleContext";
import mehdiFeljiPhoto from "@/assets/mehdi-felji.png";

const Index = () => {
  const { t } = useLocale();

  const pillars = [
    {
      icon: Heart,
      title: "Care",
      description: "Evidence-based therapy and clinical support for anxiety, depression, trauma, and personal growth.",
      color: "hsl(348, 82%, 26%)",
    },
    {
      icon: BookOpen,
      title: "Learning",
      description: "Psychoeducation, professional training, and certification programs for individuals and practitioners.",
      color: "#FFB300",
    },
    {
      icon: Activity,
      title: "Performance",
      description: "Mental toughness, competition readiness, and resilience coaching for athletes and high performers.",
      color: "#F4A300",
    },
    {
      icon: Building2,
      title: "Organizations",
      description: "Corporate wellbeing, NGO mental health programs, and sports organization consulting.",
      color: "hsl(348, 82%, 26%)",
    },
  ];

  const steps = [
    { number: "01", title: "Assess", description: "Complete a brief self-assessment or describe your needs." },
    { number: "02", title: "Match", description: "Get matched with the right psychologist or program for you." },
    { number: "03", title: "Grow", description: "Start sessions and track your progress with evidence-based tools." },
  ];
  
  return (
    <main className="flex-1">
      {/* ── Hero Section ── */}
      <section className="hero-neural-bg relative min-h-screen flex items-center">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left pt-10">
              <h1 className="text-display mb-6 leading-tight">
                Your Personal<br />
                <span className="text-u-gold">Psychologist</span>
              </h1>
              
              <p className="text-body text-u-gray-200 mb-8 max-w-xl font-normal">
                {t('home.hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
                <Button variant="primary" size="hero" asChild>
                  <Link to="/psychologists">Find a Psychologist</Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to="/services">Explore Programs</Link>
                </Button>
              </div>
              
              {/* Trust Strip */}
              <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-small text-u-gray-400 mb-6 font-medium">{t('home.hero.trustStrip')}</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {["UFC Gym Morocco", "UIC", "LSSPM"].map((partner) => (
                    <div
                      key={partner}
                      className="glass-card px-6 py-3 !shadow-none !transform-none hover:!transform-none"
                    >
                      <span className="text-xs text-u-gray-300 font-semibold">{partner}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div 
                  className="aspect-[4/5] rounded-u-lg overflow-hidden glass-card"
                >
                  <img 
                    src={mehdiFeljiPhoto} 
                    alt={t('home.hero.drName')}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="animate-bounce">
              <ChevronDown className="text-u-gray-400 w-6 h-6 mx-auto" />
            </div>
          </div>
        </div>
      </section>
      
      <MaroonDivider />
      
      {/* ── 4 Pillars Section ── */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-4">Built on Four Pillars</h2>
              <p className="text-body text-u-gray-300 max-w-2xl mx-auto">
                A comprehensive mental-health ecosystem — from clinical care to organizational transformation.
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <div className="glass-card p-7 h-full">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                      style={{ 
                        background: `${pillar.color}15`,
                        border: `2px solid ${pillar.color}40`,
                      }}
                    >
                      <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="text-h3 mb-3">{pillar.title}</h3>
                    <p className="text-body text-u-gray-300 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      <MaroonDivider />

      {/* ── How It Works ── */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-4">How It Works</h2>
              <p className="text-body text-u-gray-300">Three simple steps to start your journey.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number}>
                <div className="glass-card p-7 text-center relative">
                  <div className="text-5xl font-bold text-u-gold/20 mb-4">{step.number}</div>
                  <h3 className="text-h3 mb-3">{step.title}</h3>
                  <p className="text-body text-u-gray-300 text-sm">{step.description}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight className="w-5 h-5 text-u-gold/30" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* ── Self-Assessment Teaser ── */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <div className="glass-card p-10 md:p-14 max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}>
                <BarChart3 className="w-8 h-8 text-u-gold" />
              </div>
              <h2 className="text-h2 mb-4">Not Sure Where to Start?</h2>
              <p className="text-body text-u-gray-300 max-w-xl mx-auto mb-8">
                Take a quick self-assessment to understand your mental health needs. Get personalized recommendations and connect with the right support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <Link to="/get-matched">Take Self-Assessment</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/psychologists">Browse Psychologists</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* ── Evidence-Based Methods ── */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-h2 mb-4">Evidence-Based & Measurable</h2>
              <p className="text-body text-u-gray-300">Rooted in research, tracked with precision.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Methods */}
            <div className="glass-card p-7">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-u-gold" />
                <h3 className="font-semibold text-u-white">Methods We Use</h3>
              </div>
              <div className="space-y-4">
                {["CBT — Restructure thought patterns, build coping skills", "Schema Therapy — Deep-rooted patterns & long-term change", "Sport Psychology — Mental skills for high-pressure moments"].map((method) => (
                  <div key={method} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-u-gold mt-2.5 shrink-0" />
                    <p className="text-sm text-u-gray-300">{method}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="glass-card p-7">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-u-gold" />
                <h3 className="font-semibold text-u-white">How We Measure</h3>
              </div>
              <div className="space-y-4">
                {["GAD-7 — Standardized anxiety severity measurement", "PHQ-9 — Depression severity and treatment tracking", "Return-to-Performance KPIs — Recovery milestones"].map((metric) => (
                  <div key={metric} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-u-burgundy mt-2.5 shrink-0" />
                    <p className="text-sm text-u-gray-300">{metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* ── Testimonials ── */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-h2 text-center mb-12">{t('home.testimonials.sectionTitle')}</h2>
          </ScrollReveal>
          
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { role: t('home.testimonials.testimonial1Role'), quote: t('home.testimonials.testimonial1Quote'), icon: Activity },
                { role: t('home.testimonials.testimonial2Role'), quote: t('home.testimonials.testimonial2Quote'), icon: Building2 },
                { role: t('home.testimonials.testimonial3Role'), quote: t('home.testimonials.testimonial3Quote'), icon: Heart },
              ].map((testimonial, i) => (
                <StaggerItem key={i}>
                  <div className="glass-card p-7">
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}
                      >
                        <testimonial.icon className="w-6 h-6 text-u-gold" />
                      </div>
                      <p className="text-u-white font-semibold">{testimonial.role}</p>
                    </div>
                    <p className="text-u-gray-300 italic">"{testimonial.quote}"</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      <MaroonDivider />

      {/* ── Closing CTA ── */}
      <section className="section-spacing relative overflow-hidden liquid-bg">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(122,12,32,0.2), transparent 70%)' }} />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h2 mb-4">{t('home.cta.title')}</h2>
            <p className="text-body text-u-gray-300 mb-8">
              {t('home.transition.text')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="hero" asChild>
                <Link to="/contact">{t('home.cta.button')}</Link>
              </Button>
              <Button variant="secondary" size="hero" asChild>
                <Link to="/services">{t('home.transition.button')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
