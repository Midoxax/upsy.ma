import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOpsWorkspaces } from "../hooks/useOps";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "Summarize all active operations and flag risks",
  "Which tasks are overdue or need escalation?",
  "Draft a psychological safety briefing for the team",
  "Suggest a tighter timeline for our next event",
];

export const Director = () => {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const { current } = useOpsWorkspaces(slug);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || !current) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("ops-director", {
        body: { workspace_id: current.id, messages: next },
      });
      if (error) throw error;
      const payload = data as any;
      const reply = payload?.message ?? payload?.reply ?? "(no reply)";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: `Error: ${e instanceof Error ? e.message : "failed"}` }]);
    } finally { setBusy(false); }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <div className="ops-mono text-xs tracking-[0.3em] text-white/40">/ AI OPERATIONS DIRECTOR</div>
      <h1 className="ops-display text-4xl mt-1 mb-6 flex items-center gap-3">
        <Sparkles className="h-7 w-7 ops-accent" /> Director
      </h1>

      <div className="ops-glass flex-1 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="text-white/40 text-sm">
              Ask the Director to generate, adjust, or analyze operations.
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-2 rounded-full border border-[hsl(var(--ops-accent)/0.3)] bg-[hsl(var(--ops-accent)/0.06)] hover:bg-[hsl(var(--ops-accent)/0.14)] text-white/80 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-xl ${m.role === "user" ? "bg-[hsl(var(--ops-accent)/0.12)] border border-[hsl(var(--ops-accent)/0.3)]" : "bg-white/[0.03] border border-white/5"}`}>
              <div className="ops-mono text-[10px] tracking-[0.2em] text-white/40 mb-1">{m.role === "user" ? "OPERATOR" : "DIRECTOR"}</div>
              <div className="text-sm text-white/90 whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {busy && <div className="text-white/40 ops-mono text-xs"><Loader2 className="h-3 w-3 inline animate-spin" /> Director thinking…</div>}
      </div>

      <div className="mt-4 flex gap-2">
        <input className="ops-input flex-1" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !busy && send()}
          placeholder="Ask the Director…" />
        <button className="ops-btn" onClick={() => send()} disabled={busy || !input.trim()}>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Director;