import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Shield, Video, FlaskConical } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import mehdiFeljiPhoto from "@/assets/mehdi-felji.png";

const HeroSection = () => {
  const { t } = useLocale();

  return (
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
              A modern mental-health platform combining clinical care, education, performance psychology, and digital wellbeing tools.
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
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                {[
                  { icon: Shield, label: "Licensed Psychologists" },
                  { icon: Video, label: "Secure Telehealth" },
                  { icon: FlaskConical, label: "Evidence-Based Care" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-u-gold" />
                    <span className="text-xs text-u-gray-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="aspect-[4/5] rounded-u-lg overflow-hidden glass-card">
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
  );
};

export default HeroSection;
