import { NextRequest, NextResponse } from 'next/server';

interface LeadMagnetPayload {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadMagnetPayload;
    const email = body?.email?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // In production, integrate with Resend / ConvertKit / Mailchimp here.
    // Example:
    //   await resend.emails.send({ to: email, subject: '...', ... });
    //
    // For now, log and return success.
    console.log('[lead-magnet] new subscriber:', email);

    return NextResponse.json({
      success: true,
      message: 'Subscription recorded',
      downloadUrl: '/downloads/awareness-be-7day-guide.pdf',
    });
  } catch (err) {
    console.error('[lead-magnet] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}