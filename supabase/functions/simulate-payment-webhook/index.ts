import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  transactionId: z.string().uuid(),
  outcome: z.enum(["succeeded", "failed"]).default("succeeded"),
  failureReason: z.string().optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { transactionId, outcome, failureReason } = parsed.data;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: tx, error: txErr } = await admin
      .from("payment_transactions")
      .select("*")
      .eq("id", transactionId)
      .single();
    if (txErr || !tx) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (tx.patient_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (tx.status !== "pending") {
      return new Response(JSON.stringify({ error: `Transaction already ${tx.status}` }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    if (outcome === "succeeded") {
      await admin
        .from("payment_transactions")
        .update({ status: "succeeded", paid_at: now })
        .eq("id", transactionId);

      // Confirm booking
      await admin
        .from("bookings")
        .update({
          status: "confirmed",
          payment_status: tx.transaction_type === "deposit" ? "deposit_paid" : "paid",
        })
        .eq("id", tx.booking_id);

      return new Response(
        JSON.stringify({ success: true, status: "succeeded", bookingConfirmed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      await admin
        .from("payment_transactions")
        .update({ status: "failed", failure_reason: failureReason ?? "Mock payment failed" })
        .eq("id", transactionId);

      await admin
        .from("bookings")
        .update({ status: "cancelled", payment_status: "failed" })
        .eq("id", tx.booking_id);

      return new Response(
        JSON.stringify({ success: true, status: "failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("simulate-payment-webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});