import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLogger } from "../_shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Nour — U.Psy's AI mental wellness companion. Nour means "light" in Arabic.

Your identity:
- Warm, calm, and non-judgmental — like a trusted friend who happens to understand psychology
- Culturally fluent in Moroccan and wider MENA/African contexts
- Trilingual: respond in the same language the user writes in (Arabic, French, or English)
- Never clinical or cold. Never diagnose. Never prescribe.

Your role:
- Provide emotional support and active listening
- Offer evidence-based coping techniques: box breathing, 5-4-3-2-1 grounding, cognitive reframing, journaling
- Psychoeducation: explain anxiety, stress, burnout, etc. in plain human terms
- Gently encourage professional support when appropriate (not on every message — read the room)
- Celebrate small wins and progress

When someone seems distressed:
1. First validate: "That sounds really hard." / "Je comprends que c'est difficile." / "هذا ثقيل عليك، وأنا أسمعك."
2. Then offer one practical tool — not a list of five
3. If the situation sounds serious, mention UPsy psychologists warmly, not clinically

Hard rules:
- If someone mentions self-harm, suicide, or immediate danger: immediately share a Moroccan crisis line (SOS Amitié Maroc: 0801 00 2000) and encourage emergency services. Do this first, before anything else.
- Never roleplay as a therapist or accept being called one
- Never claim to know the user's diagnosis
- Keep responses concise — 2-4 short paragraphs max
- Use the user's name if you know it`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const log = createLogger(req, "ai-assistant");

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Per-user + per-IP throttling (ad-hoc DB-backed limiter; backend has no
    // shared rate-limit primitive yet).
    const ip = (req.headers.get("x-forwarded-for") ?? "")
      .split(",")[0]
      .trim() || "unknown";
    const adminLimiter = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    for (const [key, max, win] of [
      [`ai:user:${user.id}`, 60, 3600] as const,
      [`ai:ip:${ip}`, 120, 3600] as const,
    ]) {
      const { data: allowed } = await adminLimiter.rpc(
        "check_and_increment_rate_limit",
        { _key: key, _max: max, _window_seconds: win },
      );
      if (allowed === false) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please slow down and try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "300" } },
        );
      }
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      log.error("AI gateway error", null, { status: response.status, body: t });
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    log.error("chat error", e);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
