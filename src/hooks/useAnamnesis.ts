import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AnamnesisSection =
  | "identity"
  | "presenting_complaint"
  | "history_personal"
  | "history_family"
  | "medical"
  | "lifestyle"
  | "risk_screening"
  | "goals";

export interface AnamnesisData {
  id?: string;
  client_id: string;
  psychologist_id?: string | null;
  booking_id?: string | null;
  identity: Record<string, any>;
  presenting_complaint: Record<string, any>;
  history_personal: Record<string, any>;
  history_family: Record<string, any>;
  medical: Record<string, any>;
  lifestyle: Record<string, any>;
  risk_screening: Record<string, any>;
  goals: Record<string, any>;
  status: "draft" | "in_progress" | "completed" | "reviewed";
  consent_given: boolean;
  consent_at?: string | null;
  completed_at?: string | null;
  reviewed_at?: string | null;
}

const empty = (clientId: string): AnamnesisData => ({
  client_id: clientId,
  identity: {},
  presenting_complaint: {},
  history_personal: {},
  history_family: {},
  medical: {},
  lifestyle: {},
  risk_screening: {},
  goals: {},
  status: "draft",
  consent_given: false,
});

export const useAnamnesis = (clientId?: string, psychologistId?: string | null, bookingId?: string | null) => {
  const { user } = useAuth();
  const targetClient = clientId || user?.id;
  const [data, setData] = useState<AnamnesisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (!targetClient) return;
    setLoading(true);
    const { data: rows } = await supabase
      .from("client_anamneses")
      .select("*")
      .eq("client_id", targetClient)
      .order("updated_at", { ascending: false })
      .limit(1);
    if (rows && rows.length > 0) setData(rows[0] as any);
    else setData(empty(targetClient));
    setLoading(false);
  }, [targetClient]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (patch: Partial<AnamnesisData>) => {
    if (!targetClient) return null;
    setSaving(true);
    const merged: AnamnesisData = { ...(data || empty(targetClient)), ...patch };
    if (psychologistId && !merged.psychologist_id) merged.psychologist_id = psychologistId;
    if (bookingId && !merged.booking_id) merged.booking_id = bookingId;
    if (merged.status === "draft") merged.status = "in_progress";

    let result;
    if (merged.id) {
      const { id, ...rest } = merged;
      result = await supabase.from("client_anamneses").update(rest).eq("id", id).select().single();
    } else {
      const { id, ...rest } = merged as any;
      result = await supabase.from("client_anamneses").insert(rest).select().single();
    }
    setSaving(false);
    if (result.data) setData(result.data as any);
    return result;
  }, [data, targetClient, psychologistId, bookingId]);

  const autoSave = useCallback((patch: Partial<AnamnesisData>) => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => { save(patch); }, 800);
  }, [save]);

  const complete = useCallback(async () => {
    return save({ status: "completed", completed_at: new Date().toISOString() });
  }, [save]);

  const giveConsent = useCallback(async () => {
    return save({ consent_given: true, consent_at: new Date().toISOString() });
  }, [save]);

  const progress = (() => {
    if (!data) return 0;
    const sections: AnamnesisSection[] = [
      "identity", "presenting_complaint", "history_personal", "history_family",
      "medical", "lifestyle", "risk_screening", "goals",
    ];
    const filled = sections.filter((s) => Object.keys(data[s] || {}).length > 0).length;
    return Math.round((filled / sections.length) * 100);
  })();

  return { data, loading, saving, save, autoSave, complete, giveConsent, reload: load, progress };
};