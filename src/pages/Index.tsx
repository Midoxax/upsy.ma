import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Award, Activity } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import MaroonDivider from "@/components/ui/maroon-divider";

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
              <h1 className="text-h1 text-u-gray-100 mb-6 leading-tight font-bold">
                U.Psy — Your Personal & Trusted Psychologist.
              </h1>
              
              <p className="text-body text-u-gray-300 mb-8 max-w-2xl font-medium">
                Evidence-based psychology to unlock resilience, elevate performance, and foster healing — in clinic, online, and on the field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-[60px]">
                <Button variant="primary" size="hero" asChild className="hover-glow">
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to="/get-matched">Get Matched</Link>
                </Button>
              </div>
              
              {/* Trust Strip - Partner Logos */}
              <div className="mt-12 pt-8 border-t border-u-gray-700/50">
                <p className="text-small text-u-gray-300 mb-6 font-medium">Trusted by professionals and organizations</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {[
                    { name: "UFC Gym Morocco", width: "w-40" },
                    { name: "UIC", width: "w-24" },
                    { name: "LSSPM", width: "w-32" },
                  ].map((partner) => (
                    <div
                      key={partner.name}
                      className={`${partner.width} h-[60px] rounded-lg 
                        bg-gradient-to-br from-u-surface to-u-gray-700/30
                        backdrop-blur-sm border border-u-gray-700/50 flex items-center justify-center
                        transition-all duration-300 hover:border-u-teal/40 hover:shadow-[0_0_20px_rgba(0,139,139,0.2)]
                        group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-u-teal/5 to-u-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-center text-u-gray-300 group-hover:text-u-gray-100 transition-colors px-3 relative z-10 font-semibold">
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Media */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div 
                  className="aspect-[4/5] bg-gradient-to-br from-u-surface/80 to-u-gray-700/40 backdrop-blur-sm rounded-u-lg shadow-u-card border border-u-gray-700 flex items-center justify-center hover-lift"
                >
                  {/* Placeholder for professional photo or video intro */}
                  <div className="text-center px-8">
                    <div className="relative w-32 h-32 mb-6 mx-auto">
                      {/* Premium gold circular frame with teal neural glow */}
                      <div className="absolute inset-0 rounded-full border-4 border-u-gold shadow-[0_0_40px_rgba(0,139,139,0.4),0_0_20px_rgba(255,195,0,0.3)]"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-u-gold/10 to-u-teal/5 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-gold-glow text-6xl font-light" style={{ fontFamily: 'Georgia, serif' }}>Ψ</span>
                      </div>
                    </div>
                    <p className="text-u-gray-100 text-xl font-bold mb-2">Dr. Mehdi Felji</p>
                    <p className="text-u-gray-300 text-base">Professional Photo Coming Soon</p>
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
      
      <MaroonDivider />
      
      {/* Feature Section */}
      <section className="section-spacing bg-u-bg">
        <div className="container-custom">
          <StaggerContainer>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Individual Guidance */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface to-u-gray-700/30 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover:border-u-teal/40 transition-all duration-300 hover-lift">
                  <div className="w-16 h-16 bg-u-teal/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-teal/30 shadow-[0_0_20px_rgba(0,139,139,0.2)]">
                    <Brain className="w-8 h-8 text-u-teal" />
                  </div>
                  <h3 className="text-h3 text-u-gray-100 mb-4">Individual Guidance</h3>
                  <p className="text-body text-u-gray-300">
                    Therapy, performance, personality & serenity assessments.
                  </p>
                </div>
              </StaggerItem>

              {/* Institutional Solutions */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface to-u-gray-700/30 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover:border-u-gold/40 transition-all duration-300 hover-lift">
                  <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-gold/30 shadow-[0_0_20px_rgba(255,195,0,0.2)]">
                    <Building2 className="w-8 h-8 text-u-gold" />
                  </div>
                  <h3 className="text-h3 text-u-gray-100 mb-4">Institutional Solutions</h3>
                  <p className="text-body text-u-gray-300">
                    Programs for federations, companies, and universities.
                  </p>
                </div>
              </StaggerItem>

              {/* U.Psy Accreditation */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface to-u-gray-700/30 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover:border-u-teal/40 transition-all duration-300 hover-lift">
                  <div className="w-16 h-16 bg-u-teal/10 rounded-full flex items-center justify-center mb-6 border-2 border-u-teal/30 shadow-[0_0_20px_rgba(0,139,139,0.2)]">
                    <Award className="w-8 h-8 text-u-teal" />
                  </div>
                  <h3 className="text-h3 text-u-gray-100 mb-4">U.Psy Accreditation</h3>
                  <p className="text-body text-u-gray-300">
                    Get certified, listed, and matched with clients.
                  </p>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      <MaroonDivider />

      {/* Testimonials Section */}
      <section className="section-spacing bg-gradient-to-br from-u-surface/30 to-u-bg">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-h2 text-u-gray-100 text-center mb-12 font-bold">What Our Clients Say</h2>
          </ScrollReveal>
          
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface/80 to-u-gray-700/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center border-2 border-u-gold/30 shadow-[0_0_20px_rgba(255,195,0,0.2)]">
                      <Activity className="w-8 h-8 text-u-gold" />
                    </div>
                    <div>
                      <p className="text-u-gray-100 font-semibold">National Sprinter</p>
                    </div>
                  </div>
                  <p className="text-u-gray-300 italic">
                    "I finally compete calm and focused. My pre-race anxiety is under control."
                  </p>
                </div>
              </StaggerItem>

              {/* Testimonial 2 */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface/80 to-u-gray-700/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-u-gold/10 rounded-full flex items-center justify-center border-2 border-u-gold/30 shadow-[0_0_20px_rgba(255,195,0,0.2)]">
                      <Building2 className="w-8 h-8 text-u-gold" />
                    </div>
                    <div>
                      <p className="text-u-gray-100 font-semibold">Marketing Director</p>
                    </div>
                  </div>
                  <p className="text-u-gray-300 italic">
                    "Burnout down, clarity up. Practical tools I still use every day."
                  </p>
                </div>
              </StaggerItem>

              {/* Testimonial 3 */}
              <StaggerItem>
                <div className="bg-gradient-to-br from-u-surface/80 to-u-gray-700/40 backdrop-blur-sm rounded-u-lg p-8 border border-u-gray-700 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-u-teal/10 rounded-full flex items-center justify-center border-2 border-u-teal/30 shadow-[0_0_20px_rgba(0,139,139,0.2)]">
                      <Brain className="w-8 h-8 text-u-teal" />
                    </div>
                    <div>
                      <p className="text-u-gray-100 font-semibold">Recovery Client</p>
                    </div>
                  </div>
                  <p className="text-u-gray-300 italic">
                    "I felt seen without judgment. The structure helped me rebuild."
                  </p>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      <MaroonDivider />

      {/* Closing CTA Banner - Strategic Maroon Background */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-u-maroon/40 via-u-bg to-u-maroon/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--teal)_/_0.1),_transparent_70%)]"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h2 text-u-gray-100 mb-8 font-bold">Ready to strengthen your mind?</h2>
            <Button variant="primary" size="hero" asChild className="hover-glow shadow-[0_0_30px_rgba(255,195,0,0.3)]">
              <Link to="/contact">Get Started</Link>
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