import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, GraduationCap, Target, Building2, ArrowRight, CheckCircle2, Users, BookOpen, Brain, Shield } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import mehdiFeljiPhoto from "@/assets/mehdi-felji.png";

const Index = () => {
  const { locale, t } = useLocale();

  const pillars = [
    {
      icon: Heart,
      title: "Care",
      description: "Online consultations and therapy with licensed psychologists. Evidence-based treatment tailored to you.",
      color: "u-lavender",
      lightColor: "u-lavender-light",
      href: "/psychologists",
    },
    {
      icon: GraduationCap,
      title: "Learning",
      description: "Psychoeducation, professional training, and certification programs for mental health skills.",
      color: "u-blue",
      lightColor: "u-blue-light",
      href: "/resources",
    },
    {
      icon: Target,
      title: "Performance",
      description: "Sport psychology, mental toughness training, and peak performance coaching for athletes.",
      color: "u-coral",
      lightColor: "u-coral-light",
      href: "/services",
    },
    {
      icon: Building2,
      title: "Organizations",
      description: "Corporate wellbeing, MHPSS programs, and institutional consulting for teams and NGOs.",
      color: "u-sage",
      lightColor: "u-sage-light",
      href: "/services/consulting-for-organizations",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us what you need",
      description: "Share your goals — therapy, coaching, training, or organizational support.",
    },
    {
      number: "02",
      title: "Get matched",
      description: "Our system connects you with the right psychologist or program for your needs.",
    },
    {
      number: "03",
      title: "Start your journey",
      description: "Book your first session, enroll in a course, or launch a team program.",
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="hero-gradient-bg min-h-[90vh] flex items-center py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div className="text-center lg:text-left">
              <div className="pill-badge bg-u-lavender-light text-u-lavender mb-6 inline-flex">
                <Shield className="w-4 h-4" />
                <span>Licensed & Confidential</span>
              </div>

              <h1 className="text-display mb-6">
                Your Personal{" "}
                <span className="bg-gradient-to-r from-u-lavender to-u-blue bg-clip-text text-transparent">
                  Psychologist
                </span>
              </h1>

              <p className="text-body text-u-gray-500 mb-10 max-w-xl text-lg leading-relaxed">
                Evidence-based psychology to unlock resilience, elevate performance, and foster healing — in clinic, online, and on the field.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="hero" asChild>
                  <Link to={addLocalePrefix("/psychologists", locale)}>
                    Find a Psychologist
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to={addLocalePrefix("/resources", locale)}>
                    Explore Programs
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                {[
                  { label: "Licensed Professionals", icon: CheckCircle2 },
                  { label: "Confidential & Secure", icon: Shield },
                  { label: "Online & In-Person", icon: Users },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-u-gray-400 text-sm">
                    <item.icon className="w-4 h-4 text-u-sage" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="aspect-[4/5] rounded-u-xl overflow-hidden shadow-u-elevated bg-u-gray-50">
                  <img
                    src={mehdiFeljiPhoto}
                    alt="Mr. Mehdi Felji — Clinical Psychologist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-semibold text-u-navy">Mehdi Felji</p>
                  <p className="text-sm text-u-gray-400">Clinical Psychologist & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-4">A complete mental health ecosystem</h2>
              <p className="text-body max-w-2xl mx-auto">
                From individual care to organizational wellbeing — U.Psy covers every dimension of psychological support.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <Link
                    to={addLocalePrefix(pillar.href, locale)}
                    className="glass-card p-8 block group h-full"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${pillar.lightColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <pillar.icon className={`w-7 h-7 text-${pillar.color}`} />
                    </div>
                    <h3 className="text-h3 mb-3">{pillar.title}</h3>
                    <p className="text-body text-sm leading-relaxed">{pillar.description}</p>
                    <div className={`mt-6 flex items-center gap-2 text-${pillar.color} text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing calm-gradient">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-4">How it works</h2>
              <p className="text-body max-w-xl mx-auto">
                Getting started is simple — three steps to the support you deserve.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number}>
                <div className="text-center">
                  <div className="text-5xl font-bold text-u-lavender/20 mb-4">{step.number}</div>
                  <h3 className="text-h3 mb-3">{step.title}</h3>
                  <p className="text-body text-sm">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" asChild>
              <Link to={addLocalePrefix("/get-matched", locale)}>
                Get Matched Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Self-Assessment Teaser */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <div className="glass-card p-12 md:p-16 text-center max-w-3xl mx-auto">
            <div className="pill-badge bg-u-blue-light text-u-blue mb-6 inline-flex mx-auto">
              <Brain className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-h2 mb-4">Check in with yourself</h2>
            <p className="text-body max-w-xl mx-auto mb-8">
              Quick, confidential self-assessment tools for anxiety, stress, and burnout. Get personalized recommendations instantly.
            </p>
            <Button variant="secondary" size="lg" disabled>
              <BookOpen className="mr-2 w-4 h-4" />
              Self-Assessment Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing calm-gradient">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-h2 text-center mb-12">{t('home.testimonials.sectionTitle')}</h2>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.12}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  role: t('home.testimonials.testimonial1Role'),
                  quote: t('home.testimonials.testimonial1Quote'),
                  color: "u-coral",
                },
                {
                  role: t('home.testimonials.testimonial2Role'),
                  quote: t('home.testimonials.testimonial2Quote'),
                  color: "u-blue",
                },
                {
                  role: t('home.testimonials.testimonial3Role'),
                  quote: t('home.testimonials.testimonial3Quote'),
                  color: "u-sage",
                },
              ].map((item) => (
                <StaggerItem key={item.role}>
                  <div className="glass-card p-8">
                    <div className={`w-10 h-10 rounded-full bg-${item.color}/10 flex items-center justify-center mb-4`}>
                      <Users className={`w-5 h-5 text-${item.color}`} />
                    </div>
                    <p className="text-u-gray-600 italic mb-6 leading-relaxed">"{item.quote}"</p>
                    <p className="text-sm font-semibold text-u-navy">{item.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Partners */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-small uppercase tracking-widest text-u-gray-400 mb-6">Trusted by professionals and organizations</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {["UFC Gym Morocco", "UIC", "LSSPM"].map((name) => (
                  <div key={name} className="px-8 py-4 rounded-xl border border-u-gray-100 bg-u-surface text-u-gray-400 text-sm font-medium">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-gradient-to-br from-u-lavender to-u-blue text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 text-white mb-6">{t('home.cta.title')}</h2>
            <p className="text-lg text-white/80 mb-10">
              Take the first step toward better mental health — book a session, explore our programs, or get matched with a psychologist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="hero" className="bg-white text-u-lavender hover:bg-white/90 rounded-full font-semibold px-10" asChild>
                <Link to={addLocalePrefix("/contact", locale)}>{t('home.cta.button')}</Link>
              </Button>
              <Button size="hero" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-full font-semibold px-10" asChild>
                <Link to={addLocalePrefix("/services", locale)}>Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
