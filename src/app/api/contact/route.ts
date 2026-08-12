import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const targetEmail = process.env.CONTACT_EMAIL || 'rohanzstudios09@gmail.com';
const senderEmail = process.env.RESEND_FROM_EMAIL || 'Rohanz Studios <onboarding@resend.dev>';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function cleanErrorMessage(err: unknown): string {
  const msg = typeof err === 'string' ? err : (err as { message?: string })?.message || String(err);
  if (!msg) return 'Database request failed.';
  if (msg.includes('<!DOCTYPE') || msg.includes('<html') || msg.includes('404')) {
    return 'Invalid Supabase API URL in .env.local. NEXT_PUBLIC_SUPABASE_URL must be your Project API URL (e.g. https://<project-id>.supabase.co), NOT your Supabase Dashboard link.';
  }
  return msg;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || !name.trim() ||
        !email || typeof email !== 'string' || !email.trim() ||
        !message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Valid name, email, and message are required.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const timestamp = new Date().toISOString();

    let dbSaved = false;
    let dbError = '';

    // 2. Check for invalid Dashboard URL in env
    if (supabaseUrl.includes('/dashboard/') || supabaseUrl.includes('app.supabase.com')) {
      dbError = 'NEXT_PUBLIC_SUPABASE_URL in .env.local is set to your Supabase Dashboard URL instead of your API Project URL (https://<project-ref>.supabase.co). Please update your .env.local file.';
    } else if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { error } = await supabase.from('contact_messages').insert([
          {
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
            status: 'unread',
            created_at: timestamp,
          },
        ]);

        if (error) {
          const formattedErr = cleanErrorMessage(error.message);
          console.error('[Contact API] Supabase database insert error:', formattedErr);
          dbError = formattedErr;
        } else {
          dbSaved = true;
        }
      } catch (dbErr: unknown) {
        const formattedErr = cleanErrorMessage(dbErr);
        console.error('[Contact API] Supabase exception:', formattedErr);
        dbError = formattedErr;
      }
    } else {
      console.log('[Contact API] Local development mode - Simulated DB insertion:', {
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        timestamp,
      });
      dbSaved = true;
    }

    // 3. Send Notification Email via Resend if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    let emailError = '';

    if (resendApiKey && !resendApiKey.includes('your_resend_api_key')) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: senderEmail,
            to: targetEmail,
            subject: `🎮 New Transmission from ${cleanName} - Rohanz Studios Contact`,
            html: `
              <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background-color: #060709; color: #f1f5f9; padding: 28px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #06b6d4; text-transform: uppercase; font-size: 20px; font-weight: 900; letter-spacing: 2px; margin: 0;">ROHANZ STUDIOS</h1>
                  <span style="font-size: 11px; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase;">Direct Transmission Received</span>
                </div>
                
                <div style="background-color: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 20px;">
                  <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #06b6d4;">VISITOR NAME:</strong> ${cleanName}</p>
                  <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #06b6d4;">SENDER EMAIL:</strong> <a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: underline;">${cleanEmail}</a></p>
                  <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #06b6d4;">TIMESTAMP:</strong> ${new Date(timestamp).toLocaleString('en-US', { timeZoneName: 'short' })}</p>
                </div>

                <div style="margin-bottom: 24px;">
                  <h3 style="color: #f8fafc; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">MESSAGE TRANSMISSION</h3>
                  <blockquote style="background-color: #020617; border-left: 4px solid #06b6d4; padding: 16px; margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.6; border-radius: 0 12px 12px 0;">
                    ${cleanMessage.replace(/\n/g, '<br />')}
                  </blockquote>
                </div>

                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
                <div style="text-align: center;">
                  <a href="https://rohanzstudios.com/admin/messages" style="display: inline-block; background-color: #06b6d4; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Open Admin Control Panel</a>
                </div>
              </div>
            `,
          }),
        });

        const resendData = await resendRes.json();

        if (resendRes.ok) {
          emailSent = true;
          console.log('[Contact API] Resend email dispatched successfully:', resendData.id);
        } else {
          emailError = resendData.message || resendData.name || 'Resend API error';
          console.warn('[Contact API] Resend returned non-200 response:', resendData);
        }
      } catch (emailErr: unknown) {
        const msg = emailErr instanceof Error ? emailErr.message : 'Resend request failed.';
        emailError = msg;
        console.error('[Contact API] Failed to deliver notification email via Resend:', emailErr);
      }
    } else {
      console.log(`[Contact API] RESEND_API_KEY not configured in environment. Simulated email dispatch to ${targetEmail}`);
    }

    // 4. Return Contact Flow Consistency Status
    if (!dbSaved && dbError) {
      return NextResponse.json(
        { success: false, error: dbError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      dbSaved,
      emailSent,
      emailError: emailError || undefined,
      targetEmail,
    });
  } catch (err: unknown) {
    const errorMsg = cleanErrorMessage(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
