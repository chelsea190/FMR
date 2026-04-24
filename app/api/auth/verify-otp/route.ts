import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'email and otp required' }, { status: 400 });

    const ok = verifyOtp(String(email).trim().toLowerCase(), String(otp).trim());
    if (!ok) return NextResponse.json({ ok: false, error: 'invalid_or_expired' }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('verify-otp error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
