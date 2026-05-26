import { useParams } from "react-router-dom";
import { useOpsWorkspaces, useOpsWorkspaceTasks, updateTaskState, type OpsTaskState } from "../hooks/useOps";
import StateBadge from "../components/StateBadge";

const COLUMNS: OpsTaskState[] = ["pending","active","blocked","escalated","completed"];

export const Tasks = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { current } = useOpsWorkspaces(slug);
  const { tasks, loading } = useOpsWorkspaceTasks(current?.id);

  return (
    <div className="p-8">
      <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ TASK BOARD</div>
      <h1 className="ops-display text-4xl mt-1 mb-8">Accountability</h1>

      {loading ? <p className="text-white/40">Loading…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {COLUMNS.map(col => {
            const items = tasks.filter(t => t.state === col);
            return (
              <div key={col} className="ops-glass p-4 min-h-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <StateBadge state={col} />
                  <span className="ops-mono text-[11px] text-white/40">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[hsl(var(--ops-accent)/0.4)] transition">
                      <div className="text-sm text-white/85">{t.title}</div>
                      <div className="ops-mono text-[10px] text-white/40 mt-1">{t.event_title}</div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {col !== "completed" && (
                          <button className="ops-btn ops-btn-ghost text-[10px] py-0.5 px-2" onClick={() => updateTaskState(t.id, "completed")}>✓ done</button>
                        )}
                        {col === "active" && (
                          <button className="ops-btn ops-btn-ghost text-[10px] py-0.5 px-2" onClick={() => updateTaskState(t.id, "blocked")}>blocked</button>
                        )}
                        {col === "blocked" && (
                          <button className="ops-btn ops-btn-ghost text-[10px] py-0.5 px-2" onClick={() => updateTaskState(t.id, "escalated")}>escalate</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-white/20 text-xs ops-mono py-4 text-center">empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;