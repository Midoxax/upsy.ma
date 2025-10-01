import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import neuralNetworkBg from "@/assets/neural-network-bg.webp";

const Index = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center bg-u-hero"
        style={{
          backgroundImage: `url(${neuralNetworkBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-u-bg/90 to-u-surface/80"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-h1 text-u-white mb-6 leading-tight">
                U.Psy — Your Personal & Trusted Psychologist.
              </h1>
              
              <p className="text-body text-u-gray-300 mb-8 max-w-2xl">
                Evidence-based psychology to unlock resilience, elevate performance, and foster healing — in clinic, online, and on the field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="hero" asChild>
                  <Link to="/book-a-call">Get Started</Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to="/book-a-call">Book a Call</Link>
                </Button>
              </div>
              
              {/* Trust Strip */}
              <div className="mt-12 pt-8 border-t border-u-gold/20">
                <p className="text-small text-u-gray-300 mb-6">Trusted by professionals and organizations</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                  {/* Space for partner logos */}
                  {["UFC Gym Morocco", "UIC", "LSSPM"].map((org) => (
                    <div 
                      key={org}
                      className="bg-u-white/5 backdrop-blur-sm rounded-lg px-6 py-4 border border-u-gold/20 hover:border-u-gold/40 transition-all duration-300"
                    >
                      <p className="text-u-gray-300 text-sm font-medium">{org}</p>
                      <p className="text-u-gray-500 text-xs mt-1">Logo Coming Soon</p>
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
                    <div className="w-20 h-20 bg-u-gold/10 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-u-gold/30">
                      <span className="text-u-gold text-3xl font-bold">MF</span>
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
      
      {/* Future sections will be added in subsequent prompts */}
    </main>
  );
};

export default Index;