import { CheckCircle2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const About = () => {
  const { t } = useLocale();
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-u-maroon/5 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-h1 text-foreground mb-6">{t('about.hero.title')}</h1>
            <p className="text-lead text-muted-foreground">
              {t('about.hero.subtitle')}
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
              <h2 className="text-h2 text-foreground mb-6">{t('about.background.title')}</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  {t('about.background.paragraph1')}
                </p>
                <p>
                  {t('about.background.paragraph2')}
                </p>
              </div>
            </div>

            {/* Credentials */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">{t('about.credentials.title')}</h2>
              <div className="space-y-3">
                {(t('about.credentials.list') as unknown as string[]).map((credential: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-u-gold flex-shrink-0 mt-0.5" />
                    <span className="text-body text-muted-foreground">{credential}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">{t('about.philosophy.title')}</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  {t('about.philosophy.paragraph1')}
                </p>
                <p>
                  {t('about.philosophy.paragraph2')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(t('about.philosophy.list') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specializations */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">{t('about.specializations.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-h3 text-foreground mb-3">{t('about.specializations.individual.title')}</h3>
                  <ul className="space-y-2 text-body text-muted-foreground">
                    {(t('about.specializations.individual.list') as unknown as string[]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-h3 text-foreground mb-3">{t('about.specializations.organizational.title')}</h3>
                  <ul className="space-y-2 text-body text-muted-foreground">
                    {(t('about.specializations.organizational.list') as unknown as string[]).map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="glass-card p-8">
              <h2 className="text-h2 text-foreground mb-6">{t('about.experience.title')}</h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  {t('about.experience.paragraph1')}
                </p>
                <p>
                  {t('about.experience.paragraph2')}
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