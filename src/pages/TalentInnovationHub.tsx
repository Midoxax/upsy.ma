import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, FlaskConical, BarChart3, Globe, Users, ArrowRight, Microscope, Brain, TrendingUp, FileText, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const pillars = [
  { icon: FlaskConical, title: "Applied Research", description: "Collaborating with universities and institutions to advance mental health science in the MENA region." },
  { icon: Lightbulb, title: "Innovation Lab", description: "Developing digital tools, AI-powered assessments, and scalable mental health solutions." },
  { icon: BarChart3, title: "Data & Insights", description: "Producing regional mental health reports, workplace wellbeing indexes, and trend analyses." },
  { icon: Globe, title: "Global Partnerships", description: "Building bridges with international organizations to share knowledge and best practices." },
];

const researchAreas = [
  { title: "Workplace Mental Health in MENA", status: "Ongoing", year: "2025–2026", lead: "Dr. Karim Benali" },
  { title: "Digital Therapy Efficacy Study", status: "Published", year: "2024", lead: "Dr. Amina Tazi" },
  { title: "Athlete Mental Resilience Framework", status: "Ongoing", year: "2025", lead: "Mr. Mehdi Felji" },
  { title: "Cultural Adaptation of CBT in Morocco", status: "Published", year: "2024", lead: "Dr. Sarah Ahmed" },
  { title: "AI-Assisted Psychological Assessment", status: "Pilot", year: "2026", lead: "Research Team" },
];

const impactNumbers = [
  { value: "12", label: "Research Papers Published" },
  { value: "5", label: "University Partners" },
  { value: "3", label: "Countries Covered" },
  { value: "8,000+", label: "People Impacted" },
];

const TalentInnovationHub = () => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-primary/10 py-20 lg:py-28">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Research & Innovation
            </div>
            <h1 className="text-h1 text-foreground mb-6">
              Talent & Innovation Hub
            </h1>
            <p className="text-h3 text-muted-foreground mb-8 max-w-2xl mx-auto">
              Where research meets practice — advancing mental health through science, technology, and cross-cultural collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link to="/contact">Partner With Us</Link>
              </Button>
              <Button size="lg" variant="outline">
                View Publications
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactNumbers.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-custom section-spacing">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-h2 text-foreground mb-4">Our Four Pillars</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              A multidisciplinary approach to transforming mental health in the region.
            </p>
          </div>
        </ScrollReveal>
        <StaggerContainer staggerDelay={0.12}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Card className="h-full border-2 hover:border-accent/30 transition-colors">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent/10 shrink-0">
                      <pillar.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pillar.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Research Projects */}
      <section className="bg-card/50 border-y border-border py-16 lg:py-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">Research Projects</h2>
              <p className="text-body text-muted-foreground">Ongoing and published studies from our research team.</p>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-4">
            {researchAreas.map((project, index) => (
              <ScrollReveal key={project.title}>
                <div className="flex items-center justify-between p-5 rounded-xl bg-background border border-border hover:border-accent/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
                      <Microscope className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{project.lead} · {project.year}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Published' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    project.status === 'Pilot' ? 'bg-accent/10 text-accent' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call for Collaboration */}
      <section className="container-custom section-spacing text-center">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <Brain className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-h2 text-foreground mb-4">Collaborate With Us</h2>
            <p className="text-body text-muted-foreground mb-8">
              We're looking for researchers, institutions, and organizations to join us in advancing mental health science in the MENA region and beyond.
            </p>
            <Button size="lg" variant="default" asChild>
              <Link to="/contact" className="inline-flex items-center gap-2">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default TalentInnovationHub;
