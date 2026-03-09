import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageCircle, BookOpen, Video, Star, ArrowRight, Globe, Award, Calendar, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const communityFeatures = [
  { icon: MessageCircle, title: "Discussion Forums", description: "Engage in moderated peer-to-peer discussions on mental health topics, clinical techniques, and wellbeing strategies." },
  { icon: Video, title: "Live Workshops", description: "Weekly live sessions led by licensed psychologists covering evidence-based approaches and case studies." },
  { icon: BookOpen, title: "Resource Library", description: "Access curated articles, research papers, toolkits, and practical guides for personal and professional growth." },
  { icon: Users, title: "Peer Support Groups", description: "Join themed support circles — anxiety management, resilience building, sport psychology, and more." },
];

const upcomingEvents = [
  { title: "Mindfulness in Clinical Practice", date: "March 15, 2026", speaker: "Dr. Amina Tazi", type: "Workshop" },
  { title: "Burnout Prevention Strategies", date: "March 22, 2026", speaker: "Dr. Karim Benali", type: "Webinar" },
  { title: "Sport Psychology Roundtable", date: "March 29, 2026", speaker: "Dr. Mehdi Felji", type: "Discussion" },
];

const stats = [
  { value: "2,500+", label: "Community Members" },
  { value: "150+", label: "Expert-Led Sessions" },
  { value: "40+", label: "Countries Represented" },
  { value: "98%", label: "Satisfaction Rate" },
];

const Skool = () => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-28">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Learning Community
            </div>
            <h1 className="text-h1 text-foreground mb-6">
              The Mental Health Learning Community
            </h1>
            <p className="text-h3 text-muted-foreground mb-8 max-w-2xl mx-auto">
              A vibrant space where psychologists, students, and mental health advocates learn, connect, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link to="/auth">Join the Community</Link>
              </Button>
              <Button size="lg" variant="outline">
                Explore for Free
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Band */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom section-spacing">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-h2 text-foreground mb-4">What You'll Find Inside</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deepen your understanding of mental health and connect with like-minded professionals.
            </p>
          </div>
        </ScrollReveal>
        <StaggerContainer staggerDelay={0.12}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {communityFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <Card className="h-full border-2 hover:border-primary/30 transition-colors">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Upcoming Events */}
      <section className="bg-card/50 border-y border-border py-16 lg:py-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">Upcoming Events</h2>
              <p className="text-body text-muted-foreground">Reserve your spot in our next expert-led sessions.</p>
            </div>
          </ScrollReveal>
          <StaggerContainer staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {upcomingEvents.map((event) => (
                <StaggerItem key={event.title}>
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                        {event.type}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4" />
                        {event.speaker}
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
            <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-h2 text-foreground mb-4">Ready to Join?</h2>
            <p className="text-body text-muted-foreground mb-8">
              Whether you're a practicing psychologist, a student, or someone passionate about mental health — there's a place for you here.
            </p>
            <Button size="lg" variant="default" asChild>
              <Link to="/auth" className="inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default Skool;
