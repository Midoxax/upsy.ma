import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BarChart, ArrowRight, User } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const courses = [
  { title: "Understanding Anxiety", duration: "6 weeks", level: "Beginner", instructor: "Dr. Sarah Ahmed" },
  { title: "Stress Management", duration: "4 weeks", level: "All Levels", instructor: "Dr. Karim Benali" },
  { title: "Mental Resilience", duration: "8 weeks", level: "Intermediate", instructor: "Dr. Amina Tazi" },
  { title: "Sport Psychology", duration: "10 weeks", level: "Advanced", instructor: "Dr. Mehdi Felji" },
];

const LearningSection = () => {
  return (
    <section className="section-spacing liquid-bg">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Learn Mental Health Skills</h2>
            <p className="text-body text-muted-foreground">Self-paced courses designed by licensed psychologists.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <StaggerItem key={course.title}>
                <div className="glass-card p-6 h-full flex flex-col">
                  <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center bg-primary/5 border border-primary/15">
                    <span className="text-primary/40 text-4xl font-bold">{course.title.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                    <span className="flex items-center gap-1"><BarChart className="w-3 h-3" />{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <User className="w-3 h-3" />
                    <span>{course.instructor}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-auto w-full">
                    Start Course
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button variant="primary" size="lg" asChild>
            <Link to="/resources" className="inline-flex items-center gap-2">
              Browse All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
