import { useParams } from "react-router-dom";
import { useOpsEvent, updateTaskState, type OpsTaskState } from "../hooks/useOps";
import StateBadge from "../components/StateBadge";
import { ShieldAlert } from "lucide-react";

const NEXT: Partial<Record<OpsTaskState, OpsTaskState>> = {
  pending: "active", active: "completed", blocked: "active", delayed: "active", escalated: "active",
};

export const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, phases, tasks, loading } = useOpsEvent(eventId);

  if (loading) return <div className="p-8 text-white/40">Loading…</div>;
  if (!event) return <div className="p-8 text-white/40">Event not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ {event.event_type.replace(/_/g," ").toUpperCase()}</div>
      <h1 className="ops-display text-4xl mt-1">{event.title}</h1>
      <div className="ops-mono text-[11px] text-white/40 mt-2">STATUS · {event.status.toUpperCase()}</div>

      <div className="mt-10 space-y-8">
        {phases.length === 0 && <p className="text-white/40">No phases generated.</p>}
        {phases.map((p, i) => {
          const phaseTasks = tasks.filter(t => t.phase_id === p.id);
          return (
            <section key={p.id} className="ops-glass p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="ops-mono text-[10px] tracking-[0.3em] ops-accent">PHASE {String(i+1).padStart(2,"0")}</div>
                  <h2 className="ops-display text-2xl mt-1">{p.title}</h2>
                  {p.description && <p className="text-white/55 text-sm mt-2 max-w-2xl">{p.description}</p>}
                </div>
              </div>
              <ul className="mt-5 divide-y divide-white/5">
                {phaseTasks.map(t => (
                  <li key={t.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white/90 text-sm">{t.title}</span>
                        {t.psych_safety_flag && <ShieldAlert className="h-3.5 w-3.5 text-orange-300" />}
                      </div>
                      <div className="ops-mono text-[10px] text-white/40 mt-1 flex gap-3">
                        {t.owner_role && <span>OWNER · {t.owner_role}</span>}
                        {t.deadline && <span>DUE · {new Date(t.deadline).toLocaleDateString()}</span>}
                      </div>
                      {t.description && <p className="text-white/50 text-xs mt-1.5">{t.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <StateBadge state={t.state} />
                      {NEXT[t.state] && (
                        <button className="ops-btn ops-btn-ghost text-[10px] py-1 px-2" onClick={() => updateTaskState(t.id, NEXT[t.state]!)}>
                          → {NEXT[t.state]}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {phaseTasks.length === 0 && <li className="py-2 text-white/30 text-xs">No tasks in this phase.</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default EventDetail;