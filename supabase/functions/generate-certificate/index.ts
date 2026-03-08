import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CertificateRequest {
  certificate_type: "course_completion" | "assessment_completion" | "psychologist_accreditation" | "mooc_training";
  reference_id?: string;
  title: string;
  description?: string;
}

const TYPE_LABELS: Record<string, string> = {
  course_completion: "Course Completion",
  assessment_completion: "Assessment Completion",
  psychologist_accreditation: "Professional Accreditation",
  mooc_training: "MOOC Training",
};

function generateCertificateHTML(
  recipientName: string,
  title: string,
  certificateType: string,
  certificateNumber: string,
  issuedAt: string,
  description?: string
): string {
  const typeLabel = TYPE_LABELS[certificateType] || certificateType;
  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:680px;margin:40px auto;border:3px solid #8B1A1A;padding:0;background:#ffffff;">
  <!-- Gold top bar -->
  <div style="height:8px;background:linear-gradient(90deg,#DAA520,#FFD700,#DAA520);"></div>
  
  <div style="padding:50px 60px;text-align:center;">
    <!-- Logo area -->
    <div style="margin-bottom:10px;">
      <span style="font-size:32px;font-weight:bold;color:#8B1A1A;letter-spacing:2px;">U.Psy</span>
    </div>
    <p style="color:#DAA520;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 30px;">
      ${typeLabel}
    </p>
    
    <!-- Decorative line -->
    <div style="width:60px;height:2px;background:#DAA520;margin:0 auto 30px;"></div>
    
    <p style="color:#666;font-size:14px;margin:0 0 10px;">This is to certify that</p>
    
    <h1 style="color:#1a1a1a;font-size:36px;margin:10px 0 20px;font-weight:normal;font-style:italic;">
      ${recipientName}
    </h1>
    
    <div style="width:60px;height:2px;background:#DAA520;margin:0 auto 20px;"></div>
    
    <p style="color:#666;font-size:14px;margin:0 0 10px;">has successfully completed</p>
    
    <h2 style="color:#8B1A1A;font-size:22px;margin:10px 0 20px;font-weight:bold;">
      ${title}
    </h2>
    
    ${description ? `<p style="color:#888;font-size:13px;margin:0 0 30px;max-width:480px;margin-left:auto;margin-right:auto;">${description}</p>` : ""}
    
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px;border-top:1px solid #eee;padding-top:25px;">
      <div style="text-align:left;flex:1;">
        <p style="color:#1a1a1a;font-size:13px;margin:0;font-weight:bold;">Mehdi Felji</p>
        <p style="color:#888;font-size:11px;margin:2px 0 0;">Founder, U.Psy</p>
      </div>
      <div style="text-align:center;flex:1;">
        <p style="color:#888;font-size:11px;margin:0;">Certificate No.</p>
        <p style="color:#1a1a1a;font-size:12px;margin:2px 0 0;font-weight:bold;">${certificateNumber}</p>
      </div>
      <div style="text-align:right;flex:1;">
        <p style="color:#888;font-size:11px;margin:0;">Date of Issue</p>
        <p style="color:#1a1a1a;font-size:12px;margin:2px 0 0;font-weight:bold;">${formattedDate}</p>
      </div>
    </div>
  </div>
  
  <!-- Gold bottom bar -->
  <div style="height:8px;background:linear-gradient(90deg,#DAA520,#FFD700,#DAA520);"></div>
</div>
</body>
</html>`;
}

function generateEmailHTML(
  recipientName: string,
  title: string,
  certificateType: string,
  certificateNumber: string
): string {
  const typeLabel = TYPE_LABELS[certificateType] || certificateType;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:40px auto;padding:40px 30px;">
  <div style="text-align:center;margin-bottom:30px;">
    <span style="font-size:28px;font-weight:bold;color:#8B1A1A;">U.Psy</span>
  </div>
  
  <h1 style="color:#1a1a1a;font-size:22px;text-align:center;margin-bottom:10px;">
    🎉 Congratulations, ${recipientName}!
  </h1>
  
  <p style="color:#555;font-size:15px;text-align:center;line-height:1.6;">
    You have earned your <strong>${typeLabel}</strong> certificate for completing:
  </p>
  
  <div style="background:#f8f5f0;border-left:4px solid #DAA520;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0;">
    <p style="margin:0;font-size:16px;font-weight:bold;color:#1a1a1a;">${title}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#888;">Certificate #${certificateNumber}</p>
  </div>
  
  <p style="color:#555;font-size:14px;line-height:1.6;">
    Your certificate is now available in your <strong>Dashboard</strong> under the Certificates section. 
    You can download it as a PDF at any time.
  </p>
  
  <div style="text-align:center;margin:30px 0;">
    <a href="https://u-psy.com/dashboard" style="display:inline-block;background:#8B1A1A;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
      View My Certificates
    </a>
  </div>
  
  <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />
  
  <p style="color:#aaa;font-size:11px;text-align:center;">
    U.Psy — Your Personal Psychologist<br/>
    Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles.
  </p>
</div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Auth client to get user
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service client for inserts
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body: CertificateRequest = await req.json();
    const { certificate_type, reference_id, title, description } = body;

    // Get user's profile name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const recipientName = profile?.full_name || user.user_metadata?.full_name || user.email || "Participant";

    // Check for existing certificate (avoid duplicates)
    if (reference_id) {
      const { data: existing } = await supabaseAdmin
        .from("certificates")
        .select("id")
        .eq("user_id", user.id)
        .eq("certificate_type", certificate_type)
        .eq("reference_id", reference_id)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Certificate already exists",
          certificate_id: existing.id 
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Create certificate record
    const { data: cert, error: insertError } = await supabaseAdmin
      .from("certificates")
      .insert({
        user_id: user.id,
        certificate_type,
        title,
        description: description || null,
        recipient_name: recipientName,
        reference_id: reference_id || null,
        metadata: {
          email: user.email,
          certificate_html: true,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create certificate", details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email notification via Resend
    if (resendApiKey && user.email) {
      try {
        const emailHtml = generateEmailHTML(recipientName, title, certificate_type, cert.certificate_number);
        
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "U.Psy Certificates <onboarding@resend.dev>",
            to: [user.email],
            subject: `🎓 Your ${TYPE_LABELS[certificate_type]} Certificate — ${title}`,
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          console.error("Email send failed:", await emailRes.text());
        }
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        // Don't fail the whole request if email fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      certificate: cert,
      certificate_html: generateCertificateHTML(
        recipientName,
        title,
        certificate_type,
        cert.certificate_number,
        cert.issued_at,
        description
      ),
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Certificate generation error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
