import { useState } from "react";
import { Info, CheckCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const MethodsMetricsBand = () => {
  const methods = [
    {
      name: "CBT",
      description: "Cognitive Behavioral Therapy — Restructure thought patterns, build coping skills, proven for anxiety & depression"
    },
    {
      name: "Schema Therapy",
      description: "Deep-rooted patterns & early experiences — Long-term change for personality & relationship issues"
    },
    {
      name: "Sport/Performance Psychology",
      description: "Mental skills for high-pressure moments — Focus, resilience, clutch performance under stress"
    }
  ];

  const metrics = [
    {
      name: "GAD-7",
      description: "Generalized Anxiety Disorder 7-item scale — Standardized anxiety severity measurement"
    },
    {
      name: "PHQ-9",
      description: "Patient Health Questionnaire — Depression severity and treatment response tracking"
    },
    {
      name: "Routine Adherence",
      description: "Training & therapy protocol compliance — Consistency and engagement metrics"
    },
    {
      name: "Return-to-Performance KPIs",
      description: "Sport & work readiness indicators — Competition/productivity recovery milestones"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-accent/5 border-y border-accent/10">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left: Heading */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full theme-accent theme-halo" />
              <h3 className="text-h3 font-bold">Evidence-based & measurable</h3>
            </div>
            <p className="text-body text-muted-foreground">
              Rooted in research, tracked with precision
            </p>
          </div>

          {/* Middle: Methods */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 theme-accent" strokeWidth={2} />
              <h4 className="font-semibold text-foreground">Methods We Use</h4>
            </div>
            <div className="space-y-3">
              {methods.map((method, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-2">
                    <Badge 
                      variant="outline" 
                      className="bg-background/50 border-accent/20 text-xs font-mono shrink-0"
                    >
                      {method.name}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="ml-auto">
                          <Info className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" strokeWidth={2} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-background">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {method.name}
                            </Badge>
                          </DialogTitle>
                          <DialogDescription className="text-body text-muted-foreground pt-2">
                            {method.description}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {method.description.split(' — ')[1] || method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 theme-accent" strokeWidth={2} />
              <h4 className="font-semibold text-foreground">How We Measure</h4>
            </div>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-2">
                    <Badge 
                      variant="outline" 
                      className="bg-background/50 border-accent/20 text-xs font-mono shrink-0"
                    >
                      {metric.name}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="ml-auto">
                          <Info className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" strokeWidth={2} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-background">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {metric.name}
                            </Badge>
                          </DialogTitle>
                          <DialogDescription className="text-body text-muted-foreground pt-2">
                            {metric.description}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {metric.description.split(' — ')[1] || metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
