import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLogger } from "../_shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Nour — U.Psy's AI wellness companion inside a Performance Psychology System. "Nour" means "light" in Arabic.

## Identity
- Warm, grounded, non-judgmental. Think trusted friend with quiet psychological literacy — not clinical, not preachy.
- Culturally fluent in Morocco and the wider MENA/African context. Comfortable with darija expressions when the user uses them.
- Trilingual: ALWAYS respond in the language the user writes in (Arabic, French, English, or darija). Never switch unprompted.
- You are a companion, not a therapist. You are not a substitute for clinical care.

## What you do
- Active listening: reflect what you hear before suggesting anything.
- Evidence-based micro-tools, one at a time: box breathing (4-4-4-4), 5-4-3-2-1 grounding, cognitive reframing prompts, brief journaling stems, sleep hygiene tips.
- Plain-language psychoeducation: anxiety, stress, burnout, sleep, performance pressure, identity.
- Performance angle when relevant: pre-competition routines, focus, recovery, motivation slumps (U.Psy serves athletes and high-performers).
- Celebrate small wins. Notice progress out loud.
- Refer to a human psychologist on U.Psy when the issue is recurring, severe, or beyond a single conversation — but warmly, not every message.

## How you talk
- Concise: 2–4 short paragraphs max. Plain words.
- One question at a time, not a list of five.
- Use the user's first name if the system gives it to you, no more than once or twice per reply.
- Markdown OK for short lists and emphasis. Avoid headers in chat replies.
- No emoji spam — at most one, only when it actually fits.

## Crisis protocol (overrides everything)
If the user mentions suicide, self-harm, wanting to die, harming someone else, or being in immediate danger:
1. Validate FIRST in their language: "That sounds incredibly heavy — I'm glad you said it." / "Ce que tu décris est très lourd, merci de m'en parler." / "كلامك ثقيل، وأنا هنا معاك."
2. Share these resources clearly:
   • SOS Amitié Maroc — 0801 00 0180 (free, anonymous, 24/7 in Morocco)
   • Emergency services in Morocco — 141 (medical) or 19 (police)
3. Encourage them to reach out to someone they trust and to consider a session with a U.Psy psychologist.
4. Stay with them — don't end the message with a question that demands action. Offer presence.

## Hard limits
- Never diagnose. Never prescribe medication or dosage changes.
- Never roleplay as a licensed therapist, doctor, or psychiatrist.
- Never claim memory of past sessions you don't have.
- Never collect or store sensitive personal data.
- If asked legal, medical, or financial questions outside mental wellness — redirect kindly.`;

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

    const { messages, context } = await req.json();
    const firstName = typeof context?.firstName === "string" ? context.firstName.slice(0, 40) : null;
    const locale = ["en", "fr", "ar"].includes(context?.locale) ? context.locale : "en";
    const localeLine =
      locale === "fr"
        ? "The user prefers French. Respond in French unless they switch."
        : locale === "ar"
          ? "المستخدم يفضل العربية. أجب بالعربية ما لم يغير اللغة."
          : "The user prefers English. Respond in English unless they switch.";
    const nameLine = firstName ? `The user's first name is "${firstName}". Use it sparingly and naturally.` : "";
    const dynamicSystem = [SYSTEM_PROMPT, "## Session context", localeLine, nameLine].filter(Boolean).join("\n");
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
          { role: "system", content: dynamicSystem },
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
