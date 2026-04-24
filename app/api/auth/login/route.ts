import { NextRequest, NextResponse } from 'next/server';
import { mapSupabaseUser, supabase } from '@/lib/supabase';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password,
    });

    if (error || !data.session || !data.user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({
      message: 'Login successful',
      user: mapSupabaseUser(data.user),
    });

    response.cookies.set('auth_token', data.session.access_token, {
      ...cookieOptions,
      maxAge: data.session.expires_in || 60 * 60,
    });

    response.cookies.set('refresh_token', data.session.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
