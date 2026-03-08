import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const CommunitySection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <div className="glass-card p-10 md:p-14 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 border-2 border-primary/30">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-h2 mb-4">Join the U.Psy Community</h2>
            <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
              Connect with psychologists and peers for live sessions, discussions, and shared growth.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link to="/skool" className="inline-flex items-center gap-2">
                Join Community <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
