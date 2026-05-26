import { NavLink, Outlet, useParams } from "react-router-dom";
import { Activity, Calendar, Compass, ListChecks, Sparkles, Plus } from "lucide-react";
import { useOpsWorkspaces } from "./hooks/useOps";
import { useEffect } from "react";
import "./ops-theme.css";

export const OpsLayout = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { workspaces, current } = useOpsWorkspaces(slug);

  useEffect(() => {
    document.title = current ? `UPSY OPS · ${current.name}` : "UPSY OPS";
  }, [current]);

  const base = `/ops/${slug ?? "_"}`;

  return (
    <div className="ops-theme min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-white/5 flex flex-col p-5 gap-6 sticky top-0 h-screen">
        <div>
          <div className="ops-mono text-[10px] tracking-[0.3em] text-white/40">U.PSY</div>
          <div className="ops-display text-2xl mt-1">
            UPSY <span className="ops-accent ops-glow">OPS</span>
          </div>
        </div>

        <div className="ops-glass p-3">
          <div className="ops-label">Workspace</div>
          <select
            className="ops-select mt-1"
            value={current?.slug ?? ""}
            onChange={(e) => { window.location.href = `/ops/${e.target.value}/command`; }}
          >
            {workspaces.map(w => (
              <option key={w.id} value={w.slug}>{w.name}</option>
            ))}
          </select>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink to={`${base}/command`} className={({isActive}) => `ops-nav-item ${isActive ? "active" : ""}`}>
            <Activity className="h-4 w-4" /> Command Center
          </NavLink>
          <NavLink to={`${base}/events`} className={({isActive}) => `ops-nav-item ${isActive ? "active" : ""}`}>
            <Calendar className="h-4 w-4" /> Events
          </NavLink>
          <NavLink to={`${base}/tasks`} className={({isActive}) => `ops-nav-item ${isActive ? "active" : ""}`}>
            <ListChecks className="h-4 w-4" /> Tasks
          </NavLink>
          <NavLink to={`${base}/director`} className={({isActive}) => `ops-nav-item ${isActive ? "active" : ""}`}>
            <Sparkles className="h-4 w-4" /> AI Director
          </NavLink>
        </nav>

        <NavLink to={`${base}/events/new`} className="ops-btn justify-center mt-auto">
          <Plus className="h-4 w-4" /> New Protocol
        </NavLink>

        <NavLink to="/ops" className="ops-nav-item">
          <Compass className="h-4 w-4" /> Exit Command
        </NavLink>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 relative">
        <div className="ops-grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OpsLayout;