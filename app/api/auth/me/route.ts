import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequestToken, mapSupabaseUser, supabase } from '@/lib/supabase';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function GET(req: NextRequest) {
  let token = req.cookies.get('auth_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  let user = await getUserFromRequestToken(token);
  let nextAccessToken: string | undefined;
  let nextRefreshToken: string | undefined;
  let nextMaxAge: number | undefined;

  if (!user && refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (!error && data.session && data.user) {
      user = data.user;
      nextAccessToken = data.session.access_token;
      nextRefreshToken = data.session.refresh_token;
      nextMaxAge = data.session.expires_in;
    }
  }

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ user: mapSupabaseUser(user) });

  if (nextAccessToken) {
    response.cookies.set('auth_token', nextAccessToken, { ...cookieOptions, maxAge: nextMaxAge || 60 * 60 });
  }
  if (nextRefreshToken) {
    response.cookies.set('refresh_token', nextRefreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
  }

  return response;
}
