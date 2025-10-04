import { CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-u-maroon/5 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-h1 text-foreground mb-6">About Dr. Mehdi Felji</h1>
            <p className="text-lead text-muted-foreground">
              Clinical Psychologist & Mental Performance Coach
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">Professional Background</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  Dr. Mehdi Felji is a licensed clinical psychologist specializing in mental performance, 
                  sport psychology, and evidence-based therapeutic interventions. With extensive experience 
                  working with athletes, professionals, and organizations, Dr. Felji combines rigorous 
                  scientific methodology with practical, results-oriented coaching.
                </p>
                <p>
                  His approach integrates cognitive-behavioral techniques, performance psychology principles, 
                  and mindfulness-based interventions to help clients overcome anxiety, build mental resilience, 
                  and perform at their highest level under pressure.
                </p>
              </div>
            </div>

            {/* Credentials */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">Qualifications & Credentials</h2>
              <div className="space-y-3">
                {[
                  "Licensed Clinical Psychologist",
                  "Certified Sport & Performance Psychology Consultant",
                  "Ph.D. in Clinical Psychology",
                  "Master's in Applied Sport Psychology",
                  "Registered with National Psychology Board",
                  "Member of International Society of Sport Psychology (ISSP)",
                ].map((credential, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-u-gold flex-shrink-0 mt-0.5" />
                    <span className="text-body text-muted-foreground">{credential}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">Philosophy & Approach</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  Dr. Felji's philosophy centers on <strong className="text-foreground">practical, 
                  evidence-based solutions</strong> tailored to each individual's unique challenges and goals. 
                  He believes that peak performance—whether in sports, business, or daily life—emerges 
                  from a foundation of mental clarity, emotional regulation, and disciplined habits.
                </p>
                <p>
                  His work emphasizes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Building sustainable mental health practices</li>
                  <li>Developing resilience under stress and pressure</li>
                  <li>Cultivating self-awareness and emotional intelligence</li>
                  <li>Implementing actionable strategies for immediate impact</li>
                  <li>Creating long-term behavioral change through consistent practice</li>
                </ul>
              </div>
            </div>

            {/* Specializations */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">Areas of Specialization</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-h3 text-foreground mb-3">Individual Work</h3>
                  <ul className="space-y-2 text-body text-muted-foreground">
                    <li>• Anxiety & Stress Management</li>
                    <li>• Performance Enhancement</li>
                    <li>• Mental Skills Training</li>
                    <li>• Confidence Building</li>
                    <li>• Career Transitions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-h3 text-foreground mb-3">Organizational Consulting</h3>
                  <ul className="space-y-2 text-body text-muted-foreground">
                    <li>• Leadership Development</li>
                    <li>• Team Performance</li>
                    <li>• Workplace Mental Health</li>
                    <li>• Executive Coaching</li>
                    <li>• Organizational Training</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">Professional Experience</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  Dr. Felji has worked with a diverse range of clients including national-level athletes, 
                  corporate executives, performing artists, and individuals seeking personal growth. He has 
                  served as a consultant for sports federations, multinational corporations, and educational 
                  institutions.
                </p>
                <p>
                  His training programs and workshops have been delivered across multiple countries, 
                  helping hundreds of professionals develop the mental skills necessary for sustained 
                  excellence in their respective fields.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;