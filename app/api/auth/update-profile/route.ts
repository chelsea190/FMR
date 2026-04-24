import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequestToken, mapSupabaseUser, supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const currentUser = await getUserFromRequestToken(token);
    if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ message: 'Supabase service role key is required' }, { status: 500 });

    const { firstName, lastName, email } = await req.json();
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ message: 'firstName, lastName, and email are required' }, { status: 400 });
    }

    const trimmedFirstName = String(firstName).trim();
    const trimmedLastName = String(lastName).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(currentUser.id, {
      email: trimmedEmail,
      user_metadata: {
        ...currentUser.user_metadata,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        role: currentUser.user_metadata?.role || 'patient',
      },
    });

    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    return NextResponse.json({ message: 'Profile updated successfully', user: mapSupabaseUser(data.user) });
  } catch (error) {
    console.error('Error during update-profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
