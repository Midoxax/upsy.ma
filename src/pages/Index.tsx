import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Award, Activity } from "lucide-react";
import neuralNetworkBg from "@/assets/neural-network-bg.webp";

const Index = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section 
        className="hero-neural-bg relative min-h-screen flex items-center bg-u-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-u-bg/90 to-u-surface/80"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left pt-10">
              <h1 className="text-h1 text-u-white mb-6 leading-tight">
                U.Psy — Your Personal & Trusted Psychologist.
              </h1>
              
              <p className="text-body text-u-gray-300 mb-8 max-w-2xl">
                Evidence-based psychology to unlock resilience, elevate performance, and foster healing — in clinic, online, and on the field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-[60px]">
                <Button variant="primary" size="hero" asChild>
                  <Link to="/book-a-call">Get Started</Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to="/book-a-call">Book a Call</Link>
                </Button>
              </div>
              
              {/* Trust Strip - Partner Logos */}
              <div className="mt-12 pt-8 border-t border-u-gold/20">
                <p className="text-small text-u-gray-300 mb-6">Trusted by professionals and organizations</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {["UFC Gym Morocco", "UIC", "LSSPM"].map((org) => (
                    <div 
                      key={org}
                      className="h-[60px] px-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                      style={{ filter: 'invert(1) grayscale(1)' }}
                    >
                      <span className="text-u-white text-sm font-medium tracking-wide">{org}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Media */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div 
                  className="aspect-[4/5] bg-gradient-to-br from-u-maroon/20 to-u-bg/40 backdrop-blur-sm rounded-u-lg shadow-u-card border border-u-gold/20 flex items-center justify-center"
                >
                  {/* Placeholder for professional photo or video intro */}
                  <div className="text-center px-8">
                    <div className="relative w-32 h-32 mb-6 mx-auto">
                      {/* Gold circular frame with teal glow */}
                      <div className="absolute inset-0 rounded-full border-4 border-u-gold/80 shadow-[0_0_30px_rgba(0,139,139,0.5)]"></div>
                      <div className="absolute inset-0 rounded-full bg-u-gold/5 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-u-gold text-6xl font-light" style={{ fontFamily: 'Georgia, serif' }}>Ψ</span>
                      </div>
                    </div>
                    <p className="text-u-white text-xl font-semibold mb-2">Dr. Mehdi Felji</p>
                    <p className="text-u-gray-300 text-base font-light">Professional Photo Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="animate-bounce">
              <ChevronDown className="text-u-gray-300 w-6 h-6 mx-auto" />
            </div>
            <p className="text-small text-u-gray-300 mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="section-spacing bg-u-bg">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Individual Guidance */}
            <div className="bg-u-surface/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20 hover:border-u-gold/40 transition-all duration-300">
              <div className="w-16 h-16 bg-u-teal/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-teal/30">
                <Brain className="w-8 h-8 text-u-teal" />
              </div>
              <h3 className="text-h3 text-u-white mb-4">Individual Guidance</h3>
              <p className="text-body text-u-gray-300">
                Therapy, performance, personality & serenity assessments.
              </p>
            </div>

            {/* Institutional Solutions */}
            <div className="bg-u-surface/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20 hover:border-u-gold/40 transition-all duration-300">
              <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-gold/30">
                <Building2 className="w-8 h-8 text-u-gold" />
              </div>
              <h3 className="text-h3 text-u-white mb-4">Institutional Solutions</h3>
              <p className="text-body text-u-gray-300">
                Programs for federations, companies, and universities.
              </p>
            </div>

            {/* U.Psy Accreditation */}
            <div className="bg-u-surface/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20 hover:border-u-gold/40 transition-all duration-300">
              <div className="w-16 h-16 bg-u-teal/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-teal/30">
                <Award className="w-8 h-8 text-u-teal" />
              </div>
              <h3 className="text-h3 text-u-white mb-4">U.Psy Accreditation</h3>
              <p className="text-body text-u-gray-300">
                Get certified, listed, and matched with clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing bg-gradient-to-br from-u-maroon/20 to-u-bg">
        <div className="container-custom">
          <h2 className="text-h2 text-u-white text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-u-white/5 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center border-2 border-u-gold/30">
                  <Activity className="w-8 h-8 text-u-gold" />
                </div>
                <div>
                  <p className="text-u-white font-semibold">National Sprinter</p>
                </div>
              </div>
              <p className="text-u-gray-300 italic">
                "I finally compete calm and focused. My pre-race anxiety is under control."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-u-white/5 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center border-2 border-u-gold/30">
                  <Building2 className="w-8 h-8 text-u-gold" />
                </div>
                <div>
                  <p className="text-u-white font-semibold">Marketing Director</p>
                </div>
              </div>
              <p className="text-u-gray-300 italic">
                "Burnout down, clarity up. Practical tools I still use every day."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-u-white/5 backdrop-blur-sm rounded-u-lg p-8 border border-u-gold/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center border-2 border-u-gold/30">
                  <Brain className="w-8 h-8 text-u-gold" />
                </div>
                <div>
                  <p className="text-u-white font-semibold">Recovery Client</p>
                </div>
              </div>
              <p className="text-u-gray-300 italic">
                "I felt seen without judgment. The structure helped me rebuild."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Banner */}
      <section className="section-spacing bg-u-surface/60 backdrop-blur-sm">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h2 text-u-white mb-8">Ready to strengthen your mind?</h2>
            <Button variant="primary" size="hero" asChild>
              <Link to="/book-a-call">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Page Transition to Services */}
      <section className="section-spacing bg-u-bg">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-body text-u-gray-300 mb-8">
              Discover how our personalized guidance can help you perform, heal, and grow.
            </p>
            <Button variant="secondary" size="hero" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;