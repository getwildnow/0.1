import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if user has already verified
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('verification_status')
        .eq('user_id', user.id)
        .single();

      // If no profile exists, create one
      if (!profile) {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
          });
      }

      // If already verified, go to chat
      if (profile?.verification_status === 'verified') {
        return NextResponse.redirect(new URL('/onboard/chat', requestUrl.origin));
      }

      // Otherwise, go to verify (Veriff)
      return NextResponse.redirect(new URL('/onboard/verify', requestUrl.origin));
    }
  }

  // If no code or auth failed, redirect to homepage
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

