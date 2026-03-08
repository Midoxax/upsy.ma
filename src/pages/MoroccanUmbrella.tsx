import ScrollReveal from "@/components/ScrollReveal";
import { useLocale } from "@/contexts/LocaleContext";
import umbrellaLogo from "@/assets/moroccan-umbrella-logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Award, Heart, Globe } from "lucide-react";

const MoroccanUmbrella = () => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <img 
                  src={umbrellaLogo} 
                  alt="The Moroccan Umbrella of Psychology" 
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h1 className="text-h1 mb-6 text-foreground">
                The Moroccan Umbrella of Psychology
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Uniting psychology professionals across Morocco under one collaborative network. 
                Building bridges between practice, research, and community impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary" asChild>
                  <Link to="/apply" className="inline-flex items-center gap-2">
                    Join Our Network <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                To create a unified platform that empowers Moroccan psychologists, 
                fosters professional development, and advances mental health awareness 
                throughout the Kingdom of Morocco.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Professional Unity",
                description: "Connecting psychologists from all regions and specialties across Morocco"
              },
              {
                icon: Award,
                title: "Excellence Standards",
                description: "Promoting best practices and continuous professional development"
              },
              {
                icon: Heart,
                title: "Community Impact",
                description: "Advancing mental health awareness and accessibility nationwide"
              },
              {
                icon: Globe,
                title: "Cultural Integration",
                description: "Bridging modern psychology with Moroccan cultural values"
              }
            ].map((pillar, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="glass-card p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <pillar.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h3 mb-3">{pillar.title}</h3>
                  <p className="text-body text-muted-foreground">{pillar.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <ScrollReveal>
            <div className="glass-card p-10 md:p-14">
              <div className="text-center mb-12">
                <h2 className="text-h2 mb-4">Our Growing Network</h2>
                <p className="text-body text-muted-foreground">
                  Building a stronger psychology community across Morocco
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "300+", label: "Registered Psychologists" },
                  { value: "12", label: "Regions Covered" },
                  { value: "50+", label: "Partner Institutions" },
                  { value: "25", label: "Training Programs" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-spacing">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-h2 mb-6">Join The Movement</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Be part of Morocco's largest psychology professional network. 
                Together, we're shaping the future of mental health in our country.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary" asChild>
                  <Link to="/apply" className="inline-flex items-center gap-2">
                    Become a Member <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default MoroccanUmbrella;