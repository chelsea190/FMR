import { NextRequest, NextResponse } from 'next/server';
import { generateOtp } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    const normalizedEmail = String(email).trim().toLowerCase();
    const otp = generateOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({ message: 'If an account with that email exists, an OTP has been sent.' });
  } catch (error) {
    console.error('Error during forgot password request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
