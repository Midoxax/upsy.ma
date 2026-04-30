// Sends an email to the psychologist (and an optional confirmation to the
// patient) whenever a proposed session is accepted or declined.
// Best-effort — never throws back to the caller if email delivery fails.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  booking_id: string;
  action: "accept" | "decline";
  reason?: string | null;
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    if (!body?.booking_id || !["accept", "decline"].includes(body.action)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: booking, error: bErr } = await sb
      .from("bookings")
      .select(
        "id, scheduled_at, duration_minutes, session_type, status, video_room_id, patient_id, psychologist_id, patient_email, decline_reason",
      )
      .eq("id", body.booking_id)
      .maybeSingle();

    if (bErr || !booking) {
      console.warn("[notify-proposal-response] booking not found", bErr);
      return new Response(JSON.stringify({ ok: false, error: "booking_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve display info
    const [{ data: psy }, { data: patientProfile }] = await Promise.all([
      sb
        .from("psychologist_profiles")
        .select("id, full_name")
        .eq("id", booking.psychologist_id)
        .maybeSingle(),
      sb.from("profiles").select("id, full_name").eq("id", booking.patient_id).maybeSingle(),
    ]);

    // Emails: pull from auth.users for both parties
    const { data: psyAuth } = await sb.auth.admin.getUserById(booking.psychologist_id);
    const psyEmail = psyAuth?.user?.email ?? null;
    let patientEmail = booking.patient_email ?? null;
    if (!patientEmail && booking.patient_id) {
      const { data: pAuth } = await sb.auth.admin.getUserById(booking.patient_id);
      patientEmail = pAuth?.user?.email ?? null;
    }

    const startsAt = new Date(booking.scheduled_at);
    const whenStr = startsAt.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    });
    const psyName = psy?.full_name ?? "Your specialist";
    const patientName = patientProfile?.full_name ?? "Your client";
    const reason = body.reason?.trim() || booking.decline_reason || "";

    const baseUrl = Deno.env.get("PUBLIC_APP_URL") ?? "https://upsy.ma";
    const joinUrl = `${baseUrl}/session/${booking.id}`;

    const accepted = body.action === "accept";
    const subjectPsy = accepted
      ? `${patientName} accepted your session — ${whenStr}`
      : `${patientName} declined your session — ${whenStr}`;
    const subjectPatient = accepted
      ? `Your session with ${psyName} is confirmed — ${whenStr}`
      : `You declined the session with ${psyName} — ${whenStr}`;

    const psyHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#6B1F2A;margin:0 0 12px">${escape(subjectPsy)}</h2>
        <p style="margin:0 0 12px"><strong>When:</strong> ${escape(whenStr)} (Casablanca)</p>
        <p style="margin:0 0 12px"><strong>Type:</strong> ${escape(
          booking.session_type.replace("_", " "),
        )} · ${booking.duration_minutes} min</p>
        ${
          accepted
            ? `<p style="margin:0 0 16px">The room is now open. Join securely:</p>
               <p><a href="${joinUrl}" style="background:#6B1F2A;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Join session</a></p>`
            : reason
            ? `<p style="margin:0 0 12px"><strong>Reason given:</strong> ${escape(reason)}</p>`
            : `<p style="margin:0 0 12px;color:#666">No reason was provided.</p>`
        }
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:12px;color:#888">U.Psy · upsy.ma</p>
      </div>`;

    const patientHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#6B1F2A;margin:0 0 12px">${escape(subjectPatient)}</h2>
        <p style="margin:0 0 12px"><strong>When:</strong> ${escape(whenStr)} (Casablanca)</p>
        <p style="margin:0 0 12px"><strong>Type:</strong> ${escape(
          booking.session_type.replace("_", " "),
        )} · ${booking.duration_minutes} min</p>
        ${
          accepted
            ? `<p style="margin:0 0 16px">Save the link — the room opens 10 minutes before the start time:</p>
               <p><a href="${joinUrl}" style="background:#6B1F2A;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open session</a></p>`
            : `<p style="margin:0 0 12px">We've let your specialist know.</p>`
        }
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:12px;color:#888">Conformément à la loi 09-08, vos données personnelles sont protégées.</p>
      </div>`;

    let psyEmailSent = false;
    let patientEmailSent = false;

    if (RESEND_API_KEY) {
      const send = async (to: string, subject: string, html: string) => {
        try {
          const resp = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "U.Psy <onboarding@resend.dev>",
              to: [to],
              subject,
              html,
            }),
          });
          if (!resp.ok) console.warn("[notify-proposal-response] send failed", await resp.text());
          return resp.ok;
        } catch (e) {
          console.warn("[notify-proposal-response] send error", e);
          return false;
        }
      };
      if (psyEmail) psyEmailSent = await send(psyEmail, subjectPsy, psyHtml);
      if (patientEmail) patientEmailSent = await send(patientEmail, subjectPatient, patientHtml);
    } else {
      console.warn("[notify-proposal-response] RESEND_API_KEY not set — skipping email");
    }

    // Best-effort in-app notification for the psychologist
    try {
      await sb.from("notifications").insert({
        user_id: booking.psychologist_id,
        type: accepted ? "session_accepted" : "session_declined",
        title: subjectPsy,
        body: accepted ? "Your client accepted the session." : reason || "Your client declined the session.",
        data: { booking_id: booking.id, action: body.action },
      });
    } catch (e) {
      console.warn("[notify-proposal-response] in-app notification failed", e);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        psy_email_sent: psyEmailSent,
        patient_email_sent: patientEmailSent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("[notify-proposal-response] unhandled", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
