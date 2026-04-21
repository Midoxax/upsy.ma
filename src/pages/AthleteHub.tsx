import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScrollReveal from "@/components/ScrollReveal";
import MaroonDivider from "@/components/ui/maroon-divider";
import {
  Target, Zap, Eye, Shield, Brain, TrendingUp, Medal,
  Dumbbell, Wind, Timer, BarChart3,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";

const AthleteHub = () => {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const [profile, setProfile] = useState<any>(null);
  const [trainingSessions, setTrainingSessions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profRes, sessRes] = await Promise.all([
        supabase.from("athlete_profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("athlete_training_sessions").select("*").eq("athlete_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      if (profRes.data) setProfile(profRes.data);
      if (sessRes.data) setTrainingSessions(sessRes.data);
    };
    load();
  }, [user]);

  const scores = {
    readiness: profile?.mental_readiness_score || 75,
    focus: profile?.focus_score || 68,
    confidence: profile?.confidence_score || 82,
    resilience: profile?.resilience_score || 71,
  };

  const overallScore = Math.round((scores.readiness + scores.focus + scores.confidence + scores.resilience) / 4);
  const radialData = [{ name: "Score", value: overallScore, fill: "hsl(42,100%,50%)" }];

  const TRAINING_PROGRAMS = [
    { icon: Wind, title: t('athleteHubPage.mindfulnessTraining'), desc: t('athleteHubPage.mindfulnessDesc'), duration: "10 min/day" },
    { icon: Eye, title: t('athleteHubPage.visualizationProtocol'), desc: t('athleteHubPage.visualizationDesc'), duration: "15 min" },
    { icon: Timer, title: t('athleteHubPage.preCompetitionRoutine'), desc: t('athleteHubPage.preCompetitionDesc'), duration: "20 min" },
    { icon: Brain, title: t('athleteHubPage.recoveryPsychology'), desc: t('athleteHubPage.recoveryDesc'), duration: "12 min" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Medal className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-h2 mb-2">{t('athleteHubPage.signInRequired')}</h2>
          <p className="text-muted-foreground mb-6">{t('athleteHubPage.signInDesc')}</p>
          <Button variant="primary" asChild><Link to={addLocalePrefix("/auth", locale)}>{t('athleteHubPage.signIn')}</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-neural-bg relative py-12">
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="w-6 h-6 text-primary" />
              <Badge className="bg-primary/10 text-primary border-primary/20">{t('athleteHubPage.badge')}</Badge>
            </div>
            <h1 className="text-h1">{t('athleteHubPage.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('athleteHubPage.subtitle')}</p>
          </ScrollReveal>
        </div>
      </section>

      <MaroonDivider />

      <section className="section-spacing liquid-bg">
        <div className="container-custom space-y-8">
          {/* Readiness Score + Metrics */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            <div className="glass-card p-6 text-center">
              <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">{t('athleteHubPage.mentalReadiness')}</h3>
              <div className="w-48 h-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="75%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" angleAxisId={0} cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-4xl font-bold text-primary -mt-28 mb-20">{overallScore}%</p>
              <p className="text-xs text-muted-foreground">{t('athleteHubPage.overallScore')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('athleteHubPage.mentalReadiness'), value: scores.readiness, icon: Target, color: "bg-primary" },
                { label: t('athleteHubPage.focusCapacity'), value: scores.focus, icon: Eye, color: "bg-u-clinical" },
                { label: t('athleteHubPage.confidence'), value: scores.confidence, icon: Shield, color: "bg-u-turquoise" },
                { label: t('athleteHubPage.resilience'), value: scores.resilience, icon: Zap, color: "bg-u-lavender" },
              ].map((metric) => (
                <div key={metric.label} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-2">{metric.value}%</p>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Training Programs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                {t('athleteHubPage.mentalTraining')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRAINING_PROGRAMS.map((program) => (
                <div key={program.title} className="glass-card p-6 group hover:shadow-glass-hover transition-all cursor-pointer">
                  <program.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{program.desc}</p>
                  <Badge variant="outline" className="text-xs">{program.duration}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Training Sessions */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> {t('athleteHubPage.trainingHistory')}</h3>
            </div>
            {trainingSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">{t('athleteHubPage.noTrainingSessions')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trainingSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "var(--glass-border)" }}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.session_type} · {s.duration_minutes} min</p>
                    </div>
                    <Badge variant={s.completed ? "default" : "outline"}>
                      {s.completed ? t('athleteHubPage.completed') : t('athleteHubPage.scheduled')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <ContinueLearningCard path="performance" />
            </div>
            <Link to={addLocalePrefix("/assessments", locale)} className="glass-card p-6 text-center group hover:shadow-glass-hover transition-all">
              <BarChart3 className="w-8 h-8 text-u-clinical mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-foreground">{t('athleteHubPage.takeAssessment')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('athleteHubPage.takeAssessmentDesc')}</p>
            </Link>
            <Link to={addLocalePrefix("/psychologists", locale)} className="glass-card p-6 text-center group hover:shadow-glass-hover transition-all">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-foreground">{t('athleteHubPage.findSportPsych')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('athleteHubPage.findSportPsychDesc')}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AthleteHub;
