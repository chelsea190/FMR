import { NextResponse } from 'next/server';
import { hasVerifiedOtp } from '@/lib/otpStore';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase service role key is required for password reset' }, { status: 500 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!hasVerifiedOtp(normalizedEmail)) {
      return NextResponse.json({ error: 'OTP must be verified before resetting password' }, { status: 400 });
    }

    const { data: usersResult, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const user = usersResult.users.find((item) => item.email?.toLowerCase() === normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
    if (error) throw error;

    return NextResponse.json({ ok: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
