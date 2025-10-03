import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RejectionRequest {
  applicationId: string;
  adminUserId: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { applicationId, adminUserId, reason }: RejectionRequest = await req.json();

    console.log("Processing rejection for application:", applicationId);

    // 1. Verify admin role
    const { data: adminRole, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUserId)
      .eq("role", "admin")
      .single();

    if (roleError || !adminRole) {
      throw new Error("Unauthorized: Admin role required");
    }

    // 2. Fetch application
    const { data: application, error: appError } = await supabaseClient
      .from("psychologist_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      throw new Error(`Application already ${application.status}`);
    }

    // 3. Update application status
    const { error: updateError } = await supabaseClient
      .from("psychologist_applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId,
        notes: reason || "Application rejected",
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Application update error:", updateError);
      throw updateError;
    }

    // 4. Send rejection email
    const { error: emailError } = await resend.emails.send({
      from: "Psychologie <onboarding@resend.dev>",
      to: [application.email],
      subject: "Update on Your Application - Psychologie",
      html: `
        <h1>Thank you for your interest, ${application.full_name}</h1>
        <p>Thank you for applying to join Psychologie's network of professionals.</p>
        <p>After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
        ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ""}
        <p>We encourage you to reapply in the future as our needs and requirements evolve.</p>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>The Psychologie Team</p>
      `,
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
      // Don't throw - status is updated, just log the error
    }

    console.log("Rejection processed successfully for:", applicationId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Application rejected and email sent",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-rejection-email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
