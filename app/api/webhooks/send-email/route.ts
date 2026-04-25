import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        
        // Supabase passes an authentication header for HTTP Hooks. We could verify it, 
        // but for now we'll trust the payload structure.
        const { user, email_data } = payload;
        
        if (!user || !email_data) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const email = user.email;
        const token = email_data.token;
        const actionType = email_data.email_action_type; // e.g. "signup", "recovery", "magiclink"
        const redirectTo = email_data.redirect_to || email_data.site_url;

        // Try to extract the business slug or domain
        let slug = null;
        let host = null;
        try {
            const url = new URL(redirectTo);
            host = url.host;
            const match = url.pathname.match(/\/sites\/([^\/]+)/);
            if (match) slug = match[1];
        } catch (e) {}

        const db = createServiceClient();
        let business = null;

        if (slug) {
            const { data } = await db.from("businesses").select("*").eq("slug", slug).single();
            business = data;
        } else if (host) {
            const { data } = await db.from("businesses").select("*").eq("custom_domain", host).single();
            business = data;
        }

        // Default platform styling if no specific business found
        const bName = business?.name || "Our Platform";
        const bTagline = business?.tagline || "";
        const bColor = business?.primary_color || "#6366F1";
        const bBg = business?.secondary_color ? `${business.secondary_color}15` : "#F9FAFB";

        // Construct HTML Template
        let title = "Your Verification Code";
        let message = `We received a request to verify your email. Use the code below to proceed.`;

        if (actionType === "signup") {
            title = "Verify Your Email";
            message = `Welcome to ${bName}! Use the code below to complete your registration.`;
        } else if (actionType === "recovery") {
            title = "Reset Your Password \uD83D\uDD10";
            message = `We received a request to reset your password. Use the code below to proceed.`;
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
        </head>
        <body style="margin:0; padding:0; font-family:'Segoe UI', Arial, sans-serif; background-color:#f9fafb;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
            <tr>
              <td align="center">
                <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:${bBg}; padding:30px; text-align:center; border-bottom: 2px solid ${bColor};">
                      <h2 style="margin:0; color:${bColor}; font-size: 24px; font-weight: 800;">
                        ${bName}
                      </h2>
                      ${bTagline ? `<p style="margin:5px 0 0; color:#4B5563; font-size:14px;">${bTagline}</p>` : ''}
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 30px; text-align:center;">
                      <h3 style="color:#111827; margin-top:0; margin-bottom:15px; font-size: 20px;">
                        ${title}
                      </h3>
                      <p style="color:#4B5563; font-size:15px; margin-bottom:30px; line-height: 1.5;">
                        ${message}
                      </p>

                      <!-- Code Box -->
                      <div style="display:inline-block; padding:15px 30px; border-radius:8px; background:${bBg}; color:${bColor}; font-size:28px; font-weight:bold; letter-spacing:4px; border: 1px solid ${bColor}40;">
                        ${token}
                      </div>

                      <p style="color:#6B7280; font-size:13px; margin-top:30px;">
                        This code will expire shortly. Please do not share it with anyone.
                      </p>
                      <p style="color:#9CA3AF; font-size:12px; margin-top:15px;">
                        If you did not request this email, you can safely ignore it.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#F3F4F6; padding:20px; text-align:center; font-size:12px; color:#9CA3AF;">
                      © ${new Date().getFullYear()} ${bName} • All rights reserved
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

        // Send via Resend API
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        
        if (!RESEND_API_KEY) {
            console.error("Missing RESEND_API_KEY environment variable. Logging email to console instead.");
            console.log("--- MOCK EMAIL ---");
            console.log("To:", email);
            console.log("Subject:", `${bName} - ${title}`);
            console.log("Code:", token);
            console.log("------------------");
            return NextResponse.json({ success: true, warning: "RESEND_API_KEY not set. Check console." });
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `${bName} <auth@${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'yourdomain.com'}>`,
                to: email,
                subject: `${bName} - ${title}`,
                html: html
            })
        });

        if (!resendResponse.ok) {
            const err = await resendResponse.text();
            console.error("Resend API Error:", err);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
        
    } catch (e: any) {
        console.error("Webhook error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
