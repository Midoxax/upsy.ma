import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import NeuralConnector from "@/components/ui/neural-connector";

const Contact = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h1 className="text-h1 text-foreground mb-6">Get in Touch</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Ready to start your journey? Reach out to book your first session or ask any questions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <NeuralConnector variant="synapse" />

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal direction="left">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="Dr. Mehdi Felji" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" type="tel" placeholder="+212 6XX XX XX XX" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us what you're looking for..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full hover-glow">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Contact Info & Quick Actions */}
            <div className="space-y-6">
              <ScrollReveal direction="right" delay={0.2}>
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Reach out through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <a href="mailto:contact@upsy.ma" className="text-muted-foreground hover:text-primary transition-colors link-underline">
                          contact@upsy.ma
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <a href="tel:+212600000000" className="text-muted-foreground hover:text-secondary transition-colors link-underline">
                          +212 6XX XX XX XX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">
                          Casablanca & Rabat, Morocco<br />
                          <span className="text-sm">+ Online Sessions Available</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.4}>
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover-lift">
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-primary mb-2" />
                    <CardTitle>Book Directly</CardTitle>
                    <CardDescription>
                      Schedule your session with Dr. Mehdi Felji
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="lg" className="w-full hover-glow">
                      <a href="https://calendly.com/dr-mehdi-felji" target="_blank" rel="noopener noreferrer">
                        View Calendar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.6}>
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Not sure where to start?</CardTitle>
                    <CardDescription>
                      Try our matching service to find the perfect psychologist for your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="secondary" size="lg" className="w-full">
                      <Link to="/get-matched">
                        Get Matched with a Psychologist
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <NeuralConnector variant="wave" />

      {/* FAQ Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-h2 text-center mb-12">Common Questions</h2>
          </ScrollReveal>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">How quickly will I get a response?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">Do you offer online sessions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We offer both in-person sessions in Casablanca and Rabat, as well as online sessions via secure video conferencing for clients anywhere in Morocco or internationally.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">What languages do you speak?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our psychologists are fluent in English, French, and Arabic (Darija & Modern Standard). Sessions can be conducted in any of these languages.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;