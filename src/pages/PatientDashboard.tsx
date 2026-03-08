import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import MaroonDivider from "@/components/ui/maroon-divider";
import {
  Heart, Brain, Calendar, TrendingUp, Smile, Frown, Meh,
  BarChart3, BookOpen, Plus, ChevronRight, Zap, Moon, Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface MoodEntry {
  id: string;
  mood_score: number;
  energy_level: number | null;
  stress_level: number | null;
  notes: string | null;
  recorded_at: string;
}

const MOOD_ICONS = [
  { score: 1, icon: Frown, label: "Very Low", color: "text-destructive" },
  { score: 2, icon: Frown, label: "Low", color: "text-orange-400" },
  { score: 3, icon: Meh, label: "Neutral", color: "text-muted-foreground" },
  { score: 4, icon: Smile, label: "Good", color: "text-u-turquoise" },
  { score: 5, icon: Smile, label: "Great", color: "text-primary" },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [moodScore, setMoodScore] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [notes, setNotes] = useState("");
  const [assessmentResults, setAssessmentResults] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [moodRes, assessRes, enrollRes] = await Promise.all([
      supabase.from("mood_entries").select("*").eq("user_id", user!.id).order("recorded_at", { ascending: false }).limit(30),
      supabase.from("assessment_results").select("*, assessment:assessments(title, category)").eq("user_id", user!.id).order("completed_at", { ascending: false }).limit(5),
      supabase.from("course_enrollments").select("*, course:courses(title, category, duration_hours)").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5),
    ]);
    if (moodRes.data) setEntries(moodRes.data);
    if (assessRes.data) setAssessmentResults(assessRes.data);
    if (enrollRes.data) setEnrollments(enrollRes.data);
  };

  const submitMood = async () => {
    if (!user || moodScore === 0) return;
    const { error } = await supabase.from("mood_entries").insert({
      user_id: user.id,
      mood_score: moodScore,
      energy_level: energyLevel || null,
      stress_level: stressLevel || null,
      notes: notes || null,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to save mood entry", variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Mood entry recorded" });
      setShowForm(false);
      setMoodScore(0);
      setEnergyLevel(0);
      setStressLevel(0);
      setNotes("");
      loadData();
    }
  };

  const chartData = [...entries].reverse().map((e) => ({
    date: new Date(e.recorded_at).toLocaleDateString("en", { month: "short", day: "numeric" }),
    mood: e.mood_score,
    energy: e.energy_level || 0,
    stress: e.stress_level || 0,
  }));

  const avgMood = entries.length > 0 ? (entries.reduce((s, e) => s + e.mood_score, 0) / entries.length).toFixed(1) : "—";
  const avgStress = entries.filter((e) => e.stress_level).length > 0
    ? (entries.filter((e) => e.stress_level).reduce((s, e) => s + (e.stress_level || 0), 0) / entries.filter((e) => e.stress_level).length).toFixed(1)
    : "—";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-h2 mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Button variant="primary" asChild><Link to="/auth">Sign In</Link></Button>
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
            <div className="space-y-2">
              <h1 className="text-h1">Welcome back 👋</h1>
              <p className="text-muted-foreground">Track your wellbeing and manage your mental health journey.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <MaroonDivider />

      <section className="section-spacing liquid-bg">
        <div className="container-custom space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg Mood", value: avgMood, icon: Smile, accent: "text-primary" },
              { label: "Avg Stress", value: avgStress, icon: Zap, accent: "text-u-crimson" },
              { label: "Entries", value: entries.length.toString(), icon: BarChart3, accent: "text-u-clinical" },
              { label: "Assessments", value: assessmentResults.length.toString(), icon: Brain, accent: "text-u-turquoise" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.accent}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mood Tracker + Chart */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Mood Trends
                </h2>
                <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Log Mood
                </Button>
              </div>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(42,100%,50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(42,100%,50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(0,0%,13%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="mood" stroke="hsl(42,100%,50%)" fill="url(#moodGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  Log at least 2 mood entries to see trends
                </div>
              )}
            </div>

            {/* Log Mood Form */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="text-h3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                {showForm ? "How are you feeling?" : "Quick Check-In"}
              </h3>

              {!showForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Tap to log how you're feeling right now.</p>
                  <div className="flex justify-between">
                    {MOOD_ICONS.map((m) => (
                      <button
                        key={m.score}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:bg-muted/30"
                        onClick={() => { setMoodScore(m.score); setShowForm(true); }}
                      >
                        <m.icon className={`w-8 h-8 ${m.color}`} />
                        <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected mood */}
                  <div className="flex justify-between">
                    {MOOD_ICONS.map((m) => (
                      <button
                        key={m.score}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${moodScore === m.score ? "ring-2 ring-primary bg-primary/10" : "opacity-40"}`}
                        onClick={() => setMoodScore(m.score)}
                      >
                        <m.icon className={`w-7 h-7 ${m.color}`} />
                      </button>
                    ))}
                  </div>

                  {/* Energy */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Sun className="w-3 h-3" /> Energy Level</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button key={v} className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${energyLevel === v ? "bg-u-turquoise text-white" : "bg-muted/30 text-muted-foreground"}`}
                          onClick={() => setEnergyLevel(v)}>{v}</button>
                      ))}
                    </div>
                  </div>

                  {/* Stress */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Stress Level</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button key={v} className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${stressLevel === v ? "bg-u-crimson text-white" : "bg-muted/30 text-muted-foreground"}`}
                          onClick={() => setStressLevel(v)}>{v}</button>
                      ))}
                    </div>
                  </div>

                  <Textarea placeholder="Any thoughts or notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                    <Button variant="primary" size="sm" onClick={submitMood} disabled={moodScore === 0} className="flex-1">Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assessments + Courses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Assessments */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h3 flex items-center gap-2"><Brain className="w-5 h-5 text-u-clinical" /> Assessments</h3>
                <Button variant="ghost" size="sm" asChild><Link to="/assessments">View All <ChevronRight className="ml-1 h-3 w-3" /></Link></Button>
              </div>
              {assessmentResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No assessments completed yet.</p>
                  <Button variant="secondary" size="sm" asChild><Link to="/assessments">Take Assessment</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessmentResults.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "var(--glass-border)" }}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.assessment?.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.completed_at).toLocaleDateString()}</p>
                      </div>
                      {r.total_score !== null && (
                        <span className="text-lg font-bold text-primary">{r.total_score}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Progress */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-u-turquoise" /> Courses</h3>
                <Button variant="ghost" size="sm" asChild><Link to="/resources">Browse <ChevronRight className="ml-1 h-3 w-3" /></Link></Button>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No courses enrolled yet.</p>
                  <Button variant="secondary" size="sm" asChild><Link to="/resources">Explore Courses</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((e: any) => (
                    <div key={e.id} className="p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "var(--glass-border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{e.course?.title}</p>
                        <span className="text-xs text-primary font-medium">{Math.round(e.progress_percent || 0)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${e.progress_percent || 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Take Assessment", icon: Brain, href: "/assessments", accent: "u-clinical" },
              { label: "AI Assistant", icon: Heart, href: "/ai-assistant", accent: "u-turquoise" },
              { label: "Find Psychologist", icon: Calendar, href: "/psychologists", accent: "primary" },
              { label: "Get Matched", icon: BarChart3, href: "/get-matched", accent: "u-lavender" },
            ].map((action) => (
              <Link key={action.label} to={action.href} className="glass-card p-5 text-center group hover:shadow-glass-hover transition-all">
                <action.icon className={`w-7 h-7 mx-auto mb-2 text-${action.accent} group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
