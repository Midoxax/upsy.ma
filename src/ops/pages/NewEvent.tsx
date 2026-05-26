import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOpsWorkspaces } from "../hooks/useOps";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const EVENT_TYPES = [
  "trauma_workshop",
  "national_conference",
  "athletic_camp",
  "corporate_offsite",
  "training_program",
  "public_lecture",
  "clinical_supervision",
  "humanitarian_mission",
];

export const NewEvent = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { current } = useOpsWorkspaces(slug);
  const { user } = useAuth();
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    event_type: "trauma_workshop",
    participants: 30,
    duration_days: 1,
    budget_mad: 50000,
    city: "Casablanca",
    overnight: false,
    media_exposure: false,
    vip_presence: false,
    public_event: false,
    psych_sensitivity: "high",
    risk_level: "medium",
    notes: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const generate = async () => {
    if (!current || !user) return;
    setBusy(true); setErr(null);
    try {
      const { data, error } = await supabase.functions.invoke("ops-generate-protocol", {
        body: { workspace_id: current.id, intake: form },
      });
      if (error) throw error;
      const eventId = (data as any)?.event_id;
      if (!eventId) throw new Error("No event returned");
      nav(`/ops/${slug}/events/${eventId}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Generation failed");
      setBusy(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ SOP ENGINE / INTAKE</div>
      <h1 className="ops-display text-4xl mt-1">Generate Operational Protocol</h1>
      <p className="text-white/50 mt-3 max-w-xl">
        Describe the operation. The AI Director will generate phases, tasks, dependencies, and escalation paths
        tailored to your context.
      </p>

      <div className="ops-glass p-7 mt-8 space-y-5">
        <div>
          <label className="ops-label">Operation title</label>
          <input className="ops-input" value={form.title} onChange={e => update("title", e.target.value)}
            placeholder="e.g. LSSPM Trauma Recovery Workshop — Rabat" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="ops-label">Event type</label>
            <select className="ops-select" value={form.event_type} onChange={e => update("event_type", e.target.value)}>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="ops-label">City</label>
            <input className="ops-input" value={form.city} onChange={e => update("city", e.target.value)} />
          </div>
          <div>
            <label className="ops-label">Participants</label>
            <input type="number" className="ops-input" value={form.participants} onChange={e => update("participants", +e.target.value)} />
          </div>
          <div>
            <label className="ops-label">Duration (days)</label>
            <input type="number" className="ops-input" value={form.duration_days} onChange={e => update("duration_days", +e.target.value)} />
          </div>
          <div>
            <label className="ops-label">Budget (MAD)</label>
            <input type="number" className="ops-input" value={form.budget_mad} onChange={e => update("budget_mad", +e.target.value)} />
          </div>
          <div>
            <label className="ops-label">Risk level</label>
            <select className="ops-select" value={form.risk_level} onChange={e => update("risk_level", e.target.value)}>
              {["low","medium","high","critical"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="ops-label">Psychological sensitivity</label>
            <select className="ops-select" value={form.psych_sensitivity} onChange={e => update("psych_sensitivity", e.target.value)}>
              {["low","medium","high","trauma-informed"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2 pt-6">
            {[
              ["overnight","Overnight stay"],
              ["media_exposure","Media exposure"],
              ["vip_presence","VIP presence"],
              ["public_event","Public event"],
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={(form as any)[k]} onChange={e => update(k as any, e.target.checked as any)} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="ops-label">Operational notes</label>
          <textarea className="ops-textarea" rows={3} value={form.notes} onChange={e => update("notes", e.target.value)}
            placeholder="Anything else the Director should know about this operation." />
        </div>

        {err && <div className="text-red-300 text-sm ops-mono">{err}</div>}

        <button className="ops-btn w-full justify-center" disabled={busy || !form.title} onClick={generate}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating protocol…</> : <><Sparkles className="h-4 w-4" /> Generate Protocol</>}
        </button>
      </div>
    </div>
  );
};

export default NewEvent;