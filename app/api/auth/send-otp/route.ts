import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    const normalizedEmail = String(email).trim().toLowerCase();
    const otp = generateOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('send-otp error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
