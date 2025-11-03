import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProposalNotificationRequest {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  organizationSize?: string;
  serviceInterest: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      organizationName,
      contactName,
      email,
      phone,
      organizationSize,
      serviceInterest,
      message,
    }: ProposalNotificationRequest = await req.json();

    console.log("Sending proposal notification for:", organizationName);

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "My Personal Psychologist <onboarding@resend.dev>",
      to: ["mypersonalpsychologist212@gmail.com"],
      subject: `New Proposal Request from ${organizationName}`,
      html: `
        <h1>New Proposal Request</h1>
        <h2>Organization Information</h2>
        <p><strong>Organization Name:</strong> ${organizationName}</p>
        <p><strong>Organization Size:</strong> ${organizationSize || "Not specified"}</p>
        
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        
        <h2>Request Details</h2>
        <p><strong>Service Interest:</strong> ${serviceInterest}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No additional message provided"}</p>
        
        <hr>
        <p><small>Submitted on ${new Date().toLocaleString()}</small></p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation to client
    const clientEmailResponse = await resend.emails.send({
      from: "My Personal Psychologist <onboarding@resend.dev>",
      to: [email],
      subject: "We received your proposal request!",
      html: `
        <h1>Thank you for your interest, ${contactName}!</h1>
        <p>We have received your proposal request for <strong>${organizationName}</strong> and will review it carefully.</p>
        <p>Our team will get back to you within 2-3 business days to discuss how we can support your organization.</p>
        
        <h2>What you requested:</h2>
        <p><strong>Service:</strong> ${serviceInterest}</p>
        ${message ? `<p><strong>Your message:</strong> ${message}</p>` : ""}
        
        <p>If you have any urgent questions, feel free to reach out:</p>
        <ul>
          <li>Email: mypersonalpsychologist212@gmail.com</li>
          <li>WhatsApp: +212 668-594699</li>
        </ul>
        
        <p>Best regards,<br>The My Personal Psychologist Team</p>
      `,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-proposal-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
