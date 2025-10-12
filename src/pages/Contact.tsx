import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import NeuralConnector from "@/components/ui/neural-connector";
import { useLocale } from "@/contexts/LocaleContext";

const Contact = () => {
  const { t } = useLocale();
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h1 className="text-h1 text-foreground mb-6">{t('contact.hero.title')}</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              {t('contact.hero.subtitle')}
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
                  <CardTitle>{t('contact.form.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.form.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.nameLabel')} {t('contact.form.required')}</Label>
                      <Input id="name" placeholder={t('contact.form.namePlaceholder')} required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.emailLabel')} {t('contact.form.required')}</Label>
                      <Input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phoneLabel')}</Label>
                      <Input id="phone" type="tel" placeholder={t('contact.form.phonePlaceholder')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.messageLabel')} {t('contact.form.required')}</Label>
                      <Textarea 
                        id="message" 
                        placeholder={t('contact.form.messagePlaceholder')}
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full hover-glow">
                      {t('contact.form.submitButton')}
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
                    <CardTitle>{t('contact.info.title')}</CardTitle>
                    <CardDescription>
                      {t('contact.info.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{t('contact.info.email')}</p>
                        <a href="mailto:contact@upsy.ma" className="text-muted-foreground hover:text-primary transition-colors link-underline">
                          {t('contact.info.emailValue')}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">{t('contact.info.phone')}</p>
                        <a href="tel:+212600000000" className="text-muted-foreground hover:text-secondary transition-colors link-underline">
                          {t('contact.info.phoneValue')}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{t('contact.info.location')}</p>
                        <p className="text-muted-foreground">
                          {t('contact.info.locationValue')}<br />
                          <span className="text-sm">{t('contact.info.locationExtra')}</span>
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
                    <CardTitle>{t('contact.booking.title')}</CardTitle>
                    <CardDescription>
                      {t('contact.booking.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="lg" className="w-full hover-glow">
                      <a href="https://calendly.com/dr-mehdi-felji" target="_blank" rel="noopener noreferrer">
                        {t('contact.booking.button')}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.6}>
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>{t('contact.matching.title')}</CardTitle>
                    <CardDescription>
                      {t('contact.matching.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="secondary" size="lg" className="w-full">
                      <Link to="/get-matched">
                        {t('contact.matching.button')}
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
            <h2 className="text-h2 text-center mb-12">{t('contact.faq.title')}</h2>
          </ScrollReveal>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {(t('contact.faq.questions') as any[]).map((faq: any, index: number) => (
              <ScrollReveal key={index} delay={0.1 * (index + 1)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;