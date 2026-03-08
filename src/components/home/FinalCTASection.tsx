import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="section-spacing relative overflow-hidden liquid-bg">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(122,12,32,0.2), transparent 70%)' }} />
      <div className="container-custom relative z-10">
        <div className="glass-card p-10 md:p-16 max-w-3xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Take the First Step Toward Better Mental Health</h2>
          <p className="text-body text-u-gray-300 mb-8">
            Whether you need therapy, coaching, or education — U.Psy connects you with the right support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="hero" asChild>
              <Link to="/psychologists">Find a Psychologist</Link>
            </Button>
            <Button variant="secondary" size="hero" asChild>
              <Link to="/get-matched">Start Self-Assessment</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
