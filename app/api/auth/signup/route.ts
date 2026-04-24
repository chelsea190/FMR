import { NextRequest, NextResponse } from 'next/server';
import { AppRole, mapSupabaseUser, supabase } from '@/lib/supabase';

const allowedRoles: AppRole[] = ['patient', 'pharmacist', 'doctor'];

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || req.nextUrl.origin;
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

    const normalizedEmail = String(email).trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirmed`,
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

    // Always send newly registered users to the verification screen.
    // This prevents an auto-session from taking them straight to the dashboard when email confirmation is enabled/disabled differently across Supabase environments.
    return NextResponse.json({
      message: 'Account created. Please verify your email before signing in.',
      user: mapSupabaseUser(data.user),
      requiresEmailVerification: true,
      verificationEmail: normalizedEmail,
    }, { status: 201 });
  } catch (error) {
    console.error('Error during sign-up:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
