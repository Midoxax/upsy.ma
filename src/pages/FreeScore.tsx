import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureEvent } from "@/lib/analytics/posthog";

const QUESTIONS = [
  { key: "mood", q: { en: "How is your mood this week?", fr: "Comment est votre humeur cette semaine ?", ar: "كيف هو مزاجك هذا الأسبوع؟" } },
  { key: "sleep", q: { en: "How well are you sleeping?", fr: "Comment dormez-vous ?", ar: "كيف ينامك ؟" } },
  { key: "stress", q: { en: "How stressed do you feel?", fr: "À quel point êtes-vous stressé ?", ar: "ما مدى توترك؟" } },
  { key: "energy", q: { en: "Energy level today?", fr: "Niveau d'énergie aujourd'hui ?", ar: "مستوى طاقتك اليوم؟" } },
  { key: "focus", q: { en: "Ability to focus?", fr: "Capacité de concentration ?", ar: "قدرتك على التركيز؟" } },
  { key: "relationships", q: { en: "Quality of close relationships?", fr: "Qualité de vos relations proches ?", ar: "جودة علاقاتك القريبة؟" } },
  { key: "purpose", q: { en: "Sense of purpose?", fr: "Sentiment de sens ?", ar: "الإحساس بالهدف؟" } },
  { key: "anxiety", q: { en: "Frequency of anxious thoughts?", fr: "Fréquence des pensées anxieuses ?", ar: "وتيرة الأفكار القلقة؟" } },
  { key: "recovery", q: { en: "Ability to recover from setbacks?", fr: "Capacité à rebondir ?", ar: "القدرة على التعافي؟" } },
  { key: "growth", q: { en: "Feeling of growth lately?", fr: "Sentiment de progression ?", ar: "الإحساس بالنمو؟" } },
];

export default function FreeScore() {
  const { locale } = useLocale();
  const lang = (locale.startsWith("fr") ? "fr" : locale.startsWith("ar") ? "ar" : "en") as "en" | "fr" | "ar";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const total = QUESTIONS.length;
  const isFormStep = step >= total;
  const progress = Math.min((step / (total + 1)) * 100, 100);

  const t = {
    en: {
      title: "Free Mental Performance Score",
      subtitle: "10 questions • 2 minutes • Personalized result",
      next: "Next",
      back: "Back",
      almost: "Almost done",
      enterEmail: "Where should we send your result?",
      name: "Your name (optional)",
      email: "Email",
      consent: "I agree to receive my result and occasional wellbeing tips. I can unsubscribe anytime.",
      submit: "Get my score",
      yourScore: "Your Mental Performance Score",
      ctaMatch: "Find your psychologist",
      footnote: "Indicative only — does not replace a clinical assessment.",
      legal: "In accordance with Moroccan Law 09-08, your data is processed confidentially.",
      values: ["Very low", "Low", "Moderate", "High", "Very high"],
    },
    fr: {
      title: "Score de Performance Mentale gratuit",
      subtitle: "10 questions • 2 minutes • Résultat personnalisé",
      next: "Suivant",
      back: "Retour",
      almost: "Presque terminé",
      enterEmail: "Où envoyer votre résultat ?",
      name: "Votre prénom (optionnel)",
      email: "Email",
      consent: "J'accepte de recevoir mon résultat et des conseils ponctuels. Désinscription à tout moment.",
      submit: "Obtenir mon score",
      yourScore: "Votre Score de Performance Mentale",
      ctaMatch: "Trouver mon psychologue",
      footnote: "Indicatif seulement — ne remplace pas une évaluation clinique.",
      legal: "Conformément à la loi 09-08, vos données sont traitées confidentiellement.",
      values: ["Très bas", "Bas", "Modéré", "Élevé", "Très élevé"],
    },
    ar: {
      title: "نتيجة الأداء النفسي المجانية",
      subtitle: "10 أسئلة • دقيقتان • نتيجة شخصية",
      next: "التالي",
      back: "السابق",
      almost: "اقتربنا",
      enterEmail: "أين نرسل نتيجتك؟",
      name: "اسمك (اختياري)",
      email: "البريد الإلكتروني",
      consent: "أوافق على تلقي نتيجتي ونصائح عرضية للعافية. يمكنني إلغاء الاشتراك في أي وقت.",
      submit: "احصل على نتيجتي",
      yourScore: "نتيجة أدائك النفسي",
      ctaMatch: "اعثر على معالجك",
      footnote: "إرشادي فقط — لا يحل محل التقييم السريري.",
      legal: "وفقًا للقانون 09-08، تتم معالجة بياناتك بسرية.",
      values: ["منخفض جدًا", "منخفض", "متوسط", "مرتفع", "مرتفع جدًا"],
    },
  }[lang];

  const submit = async () => {
    if (!email || !consent) {
      toast.error(lang === "fr" ? "Email et consentement requis" : "Email and consent required");
      return;
    }
    setSubmitting(true);
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const computed = Math.round((sum / (total * 5)) * 100);
    try {
      const { error } = await supabase.from("growth_leads").insert({
        email: email.toLowerCase().trim(),
        full_name: name.trim() || null,
        source: "free_score",
        score_total: computed,
        score_breakdown: answers,
        locale: lang,
        consent_marketing: consent,
        nurture_stage: "d0",
      });
      if (error) throw error;
      captureEvent("free_score_completed", { score: computed });
      setScore(computed);
    } catch (e: any) {
      toast.error(e.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (score !== null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="max-w-lg w-full glass-card">
          <CardHeader>
            <CardTitle className="text-center font-display">{t.yourScore}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-7xl font-bold text-primary font-display">{score}</div>
            <Progress value={score} className="h-3" />
            <p className="text-sm text-muted-foreground">{t.footnote}</p>
            <Button asChild size="lg" className="w-full">
              <a href="/get-matched">{t.ctaMatch}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead path="/free-score" title={`${t.title} — U.Psy`} description={t.subtitle} />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="max-w-xl w-full glass-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            <Progress value={progress} className="h-2 mt-3" />
          </CardHeader>
          <CardContent className="space-y-6">
            {!isFormStep ? (
              <>
                <h3 className="text-lg font-medium">{QUESTIONS[step].q[lang]}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Button
                      key={v}
                      variant={answers[QUESTIONS[step].key] === v ? "default" : "outline"}
                      onClick={() => {
                        setAnswers({ ...answers, [QUESTIONS[step].key]: v });
                        setTimeout(() => setStep(step + 1), 200);
                      }}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {t.values[0]} → {t.values[4]}
                </p>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                    {t.back}
                  </Button>
                  <span className="text-xs text-muted-foreground self-center">
                    {step + 1} / {total}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium">{t.enterEmail}</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">{t.name}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.email}</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox id="consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} />
                    <Label htmlFor="consent" className="text-xs leading-relaxed">
                      {t.consent}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.legal}</p>
                </div>
                <Button onClick={submit} disabled={submitting} className="w-full" size="lg">
                  {submitting ? "…" : t.submit}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
