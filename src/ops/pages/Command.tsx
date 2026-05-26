import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useOpsWorkspaces, useOpsEvents, useOpsWorkspaceTasks } from "../hooks/useOps";
import { motion } from "framer-motion";
import StateBadge from "../components/StateBadge";
import { Activity, AlertTriangle, CheckCircle2, Clock, Sparkles } from "lucide-react";
import gsap from "gsap";

export const Command = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { current } = useOpsWorkspaces(slug);
  const { events } = useOpsEvents(current?.id);
  const { tasks } = useOpsWorkspaceTasks(current?.id);

  const open = tasks.filter(t => !["completed","archived","validated"].includes(t.state)).length;
  const blocked = tasks.filter(t => ["blocked","delayed"].includes(t.state)).length;
  const escalated = tasks.filter(t => t.state === "escalated").length;
  const done = tasks.filter(t => ["completed","validated"].includes(t.state)).length;

  // Counter animation for KPI tiles
  const kpiRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prevKpi = useRef<number[]>([0, 0, 0, 0]);
  useEffect(() => {
    const next = [open, blocked, escalated, done];
    next.forEach((v, i) => {
      const el = kpiRefs.current[i];
      if (!el) return;
      const from = prevKpi.current[i] ?? 0;
      const obj = { n: from };
      gsap.to(obj, {
        n: v, duration: 0.7, ease: "power2.out",
        onUpdate: () => { el.textContent = String(Math.round(obj.n)); },
      });
    });
    prevKpi.current = next;
  }, [open, blocked, escalated, done]);

  // Flash recently-updated task rows
  const seen = useRef<Map<string, string>>(new Map());
  const [flash, setFlash] = useState<Set<string>>(new Set());
  useEffect(() => {
    const fresh = new Set<string>();
    for (const t of tasks) {
      const prev = seen.current.get(t.id);
      if (prev && prev !== t.updated_at) fresh.add(t.id);
      seen.current.set(t.id, t.updated_at);
    }
    if (fresh.size === 0) return;
    setFlash(fresh);
    const tm = setTimeout(() => setFlash(new Set()), 1300);
    return () => clearTimeout(tm);
  }, [tasks]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="flex items-end justify-between mb-8">
        <div>
          <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ {current?.name ?? "WORKSPACE"} / COMMAND</div>
          <h1 className="ops-display text-4xl mt-1">Realtime Command Center</h1>
        </div>
        <div className="ops-mono text-xs text-white/40 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 ops-pulse" /> LIVE
        </div>
      </header>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "OPEN TASKS", value: open, icon: Activity, color: "ops-accent" },
          { label: "BLOCKED / DELAYED", value: blocked, icon: Clock, color: "text-orange-300" },
          { label: "ESCALATED", value: escalated, icon: AlertTriangle, color: "text-red-300" },
          { label: "COMPLETED", value: done, icon: CheckCircle2, color: "text-emerald-300" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="ops-glass p-5"
          >
            <div className="flex items-center justify-between">
              <div className="ops-label">{k.label}</div>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </div>
            <div className="ops-display text-4xl mt-3 tabular-nums">
              <span ref={el => (kpiRefs.current[i] = el)}>0</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Events */}
        <div className="lg:col-span-2 ops-glass p-6">
          <div className="ops-label mb-4">/ ACTIVE OPERATIONS</div>
          {events.length === 0 ? (
            <p className="text-white/40 text-sm">No events yet. Generate a protocol to begin.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {events.slice(0, 8).map(e => (
                <li key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <a href={`/ops/${slug}/events/${e.id}`} className="text-white hover:ops-accent transition">{e.title}</a>
                    <div className="ops-mono text-[11px] text-white/40 mt-0.5">{e.event_type}</div>
                  </div>
                  <span className="ops-mono text-[11px] uppercase text-white/40">{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity feed */}
        <div className="ops-glass p-6">
          <div className="ops-label mb-4">/ TASK FLOW</div>
          {tasks.length === 0 ? (
            <p className="text-white/40 text-sm">No tasks yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {tasks.slice(0, 20).map(t => (
                <li
                  key={t.id}
                  className={`flex items-start justify-between gap-3 pb-3 border-b border-white/5 px-2 -mx-2 ${flash.has(t.id) ? "ops-flash" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white/85 truncate">{t.title}</div>
                    <div className="ops-mono text-[10px] text-white/40 truncate">{t.event_title}</div>
                  </div>
                  <StateBadge state={t.state} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pinned Director quick-prompt */}
      <Link to={`/ops/${slug}/director`} className="ops-fab">
        <Sparkles className="h-4 w-4" /> Ask Director
      </Link>
    </div>
  );
};

export default Command;