import { Link, useParams } from "react-router-dom";
import { useOpsWorkspaces, useOpsEvents } from "../hooks/useOps";
import { Plus } from "lucide-react";

export const Events = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { current } = useOpsWorkspaces(slug);
  const { events, loading } = useOpsEvents(current?.id);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-end justify-between mb-8">
        <div>
          <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ EVENTS</div>
          <h1 className="ops-display text-4xl mt-1">Operations Registry</h1>
        </div>
        <Link to={`/ops/${slug}/events/new`} className="ops-btn"><Plus className="h-4 w-4" /> New protocol</Link>
      </header>

      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : events.length === 0 ? (
        <div className="ops-glass p-10 text-center">
          <p className="text-white/60">No operations yet.</p>
          <Link to={`/ops/${slug}/events/new`} className="ops-btn mt-6">Generate first protocol</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map(e => (
            <Link key={e.id} to={`/ops/${slug}/events/${e.id}`} className="ops-glass ops-glass-hover p-6 block">
              <div className="flex items-center justify-between">
                <span className="ops-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">{e.event_type}</span>
                <span className="ops-mono text-[10px] uppercase text-white/40">{e.status}</span>
              </div>
              <div className="ops-display text-2xl mt-3">{e.title}</div>
              <div className="ops-mono text-[11px] text-white/40 mt-4">
                Created {new Date(e.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;