import { NextRequest, NextResponse } from 'next/server';
import { AppRole, mapSupabaseUser, supabase } from '@/lib/supabase';

const allowedRoles: AppRole[] = ['patient', 'pharmacist', 'doctor'];
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, userType } = await req.json();

    if (!firstName || !lastName || !email || !password || !userType) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (!allowedRoles.includes(userType)) {
      return NextResponse.json({ message: 'Please choose a valid account type' }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim().toLowerCase(),
      password,
      options: {
        data: {
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          role: userType,
        },
      },
    });

    if (error) {
      const status = error.message.toLowerCase().includes('already') ? 409 : 400;
      return NextResponse.json({ message: error.message }, { status });
    }

    if (!data.user) {
      return NextResponse.json({ message: 'Unable to create account' }, { status: 400 });
    }

    const response = NextResponse.json({
      message: data.session ? 'Account created successfully' : 'Account created. Please verify your email before signing in.',
      user: mapSupabaseUser(data.user),
      requiresEmailVerification: !data.session,
    }, { status: 201 });

    if (data.session) {
      response.cookies.set('auth_token', data.session.access_token, {
        ...cookieOptions,
        maxAge: data.session.expires_in || 60 * 60,
      });
      response.cookies.set('refresh_token', data.session.refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error('Error during sign-up:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
