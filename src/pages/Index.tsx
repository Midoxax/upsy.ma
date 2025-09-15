import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import neuralNetworkBg from "@/assets/neural-network-bg.jpg";

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
                U.Psy — Your Trusted Psychologist & Mental Performance Coach
              </h1>
              
              <p className="text-body text-u-gray-300 mb-8 max-w-2xl">
                Evidence-based tools to reduce anxiety, build discipline, and perform under pressure — in clinic, online, and on the field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="hero" asChild>
                  <Link to="/book-a-call">Start Free</Link>
                </Button>
                <Button variant="secondary" size="hero" asChild>
                  <Link to="/book-a-call">Book a Call</Link>
                </Button>
              </div>
              
              {/* Trust Strip */}
              <div className="mt-12 pt-8 border-t border-u-gray-500">
                <p className="text-small text-u-gray-300 mb-4">Trusted by professionals and organizations</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60">
                  {/* Placeholder for trust logos - will be replaced with actual logos */}
                  <div className="bg-u-gray-300 rounded px-4 py-2 text-u-bg text-xs font-medium">
                    Organization 1
                  </div>
                  <div className="bg-u-gray-300 rounded px-4 py-2 text-u-bg text-xs font-medium">
                    Organization 2
                  </div>
                  <div className="bg-u-gray-300 rounded px-4 py-2 text-u-bg text-xs font-medium">
                    Organization 3
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Media */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div 
                  className="aspect-[4/5] bg-u-surface rounded-u-lg shadow-u-card border border-u-gray-500 flex items-center justify-center"
                >
                  {/* Placeholder for portrait/video - will be replaced with actual media */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-u-indigo rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-u-white text-2xl font-bold">MF</span>
                    </div>
                    <p className="text-u-gray-300 text-sm">Dr. Mehdi Felji</p>
                    <p className="text-u-gray-300 text-xs">Portrait/Video Coming Soon</p>
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