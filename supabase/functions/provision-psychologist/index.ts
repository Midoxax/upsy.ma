import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProvisionRequest {
  applicationId: string;
  adminUserId: string;
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

    const { applicationId, adminUserId }: ProvisionRequest = await req.json();

    console.log("Starting provisioning for application:", applicationId);

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

    // 3. Generate temporary password
    const tempPassword = crypto.randomUUID().substring(0, 16);

    // 4. Create auth user
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: application.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: application.full_name,
      },
    });

    if (authError || !authUser.user) {
      console.error("Auth user creation error:", authError);
      throw new Error(`Failed to create auth user: ${authError?.message}`);
    }

    console.log("Auth user created:", authUser.user.id);

    try {
      // 5. Assign psychologist role
      const { error: roleInsertError } = await supabaseClient
        .from("user_roles")
        .insert({
          user_id: authUser.user.id,
          role: "psychologist",
        });

      if (roleInsertError) {
        console.error("Role assignment error:", roleInsertError);
        throw roleInsertError;
      }

      // 6. Create psychologist profile
      const { error: profileError } = await supabaseClient
        .from("psychologist_profiles")
        .insert({
          id: authUser.user.id,
          full_name: application.full_name,
          is_accredited: !!application.accreditation_number,
          is_published: false,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }

      // 7. Create free subscription
      const { error: subError } = await supabaseClient
        .from("subscriptions")
        .insert({
          psychologist_id: authUser.user.id,
          plan_type: "free",
          status: "active",
        });

      if (subError) {
        console.error("Subscription creation error:", subError);
        throw subError;
      }

      // 8. Update application status
      const { error: updateError } = await supabaseClient
        .from("psychologist_applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminUserId,
        })
        .eq("id", applicationId);

      if (updateError) {
        console.error("Application update error:", updateError);
        throw updateError;
      }

      // 9. Send welcome email
      const loginUrl = `${Deno.env.get("SUPABASE_URL")?.replace("https://", "https://")}/auth`;
      
      const { error: emailError } = await resend.emails.send({
        from: "Psychologie <onboarding@resend.dev>",
        to: [application.email],
        subject: "Welcome to Psychologie - Your Account is Ready",
        html: `
          <h1>Welcome, ${application.full_name}!</h1>
          <p>Congratulations! Your application has been approved.</p>
          <p>Your account is ready. Use these credentials to log in:</p>
          <ul>
            <li><strong>Email:</strong> ${application.email}</li>
            <li><strong>Temporary Password:</strong> ${tempPassword}</li>
          </ul>
          <p><a href="${loginUrl}">Click here to log in</a></p>
          <h3>Next Steps:</h3>
          <ol>
            <li>Complete your profile (bio, photo, specialties, languages)</li>
            <li>Set your availability and Calendly booking link</li>
            <li>Configure your hourly rate</li>
            <li>Publish your profile to appear in the directory</li>
          </ol>
          <p>Welcome to the team!</p>
        `,
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        // Don't throw - account is created, just log the error
      }

      console.log("Provisioning completed successfully for:", authUser.user.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Psychologist provisioned successfully",
          userId: authUser.user.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (provisionError) {
      // Rollback: Delete auth user if provisioning fails
      console.error("Provisioning error, rolling back:", provisionError);
      await supabaseClient.auth.admin.deleteUser(authUser.user.id);
      throw provisionError;
    }
  } catch (error: any) {
    console.error("Error in provision-psychologist:", error);
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
