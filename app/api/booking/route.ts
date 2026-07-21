// Booking Form API Route
// Handles consultation requests and sends email confirmations via Resend

import { NextRequest, NextResponse } from 'next/server';
import { validateBookingForm, formatBookingPayload } from '@/lib/calcom';
import type { BookingFormData } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BookingFormData;

    // Validate form data
    const validationErrors = validateBookingForm(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    const formatted = formatBookingPayload(body);

    // Send confirmation email via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'appointments@awarenessbe.com',
          to: formatted.email,
          subject: 'Your Awareness Be Consultation Request',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF8F5;">
              <h1 style="color: #1C2B26; font-size: 32px; margin-bottom: 24px;">Welcome to Awareness Be</h1>
              <p style="color: #44403C; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                Thank you, ${formatted.name}, for taking the first step toward evidence-based wellness.
              </p>
              <p style="color: #44403C; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                We've received your consultation request and our team will reach out within 
                <strong>24 hours</strong> to confirm your appointment time and walk you through 
                what to expect.
              </p>
              <div style="background-color: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #1C2B26; margin: 0 0 12px 0;">Your Request Summary</h3>
                <p style="color: #44403C; font-size: 14px; line-height: 1.6; margin: 8px 0;">
                  <strong>Health Goals:</strong><br/>
                  ${body.primaryHealthGoals}
                </p>
                <p style="color: #44403C; font-size: 14px; line-height: 1.6; margin: 8px 0;">
                  <strong>Preferred Time:</strong><br/>
                  ${body.preferredTime}
                </p>
              </div>
              <p style="color: #44403C; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to explore our latest insights on metabolic health, 
                gut resilience, and conscious living.
              </p>
              <p style="color: #44403C; font-size: 16px; line-height: 1.6; margin-top: 32px;">
                With care,<br/>
                <strong>The Awareness Be Team</strong>
              </p>
              <hr style="border: none; border-top: 1px solid #E7E5E4; margin: 32px 0;" />
              <p style="color: #78716C; font-size: 12px; line-height: 1.5;">
                © 2026 Awareness Be. The information provided is for educational purposes only 
                and does not substitute professional medical advice.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.warn('[Booking] Email send failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    // In production, you would also:
    // - Save to Strapi database
    // - Create Cal.com booking
    // - Add to CRM

    return NextResponse.json({
      success: true,
      message: 'Consultation request received successfully',
      data: {
        name: formatted.name,
        email: formatted.email,
      },
    });
  } catch (error) {
    console.error('[Booking] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}