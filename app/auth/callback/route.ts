/**
 * Supabase Auth callback handler for magic links
 * Exchanges auth code for session and redirects to verification
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/onboard/verify';

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        logger.error('Error exchanging code for session', error);
        return NextResponse.redirect(new URL(`/onboard/verify?error=auth_failed`, requestUrl.origin));
      }

      if (data.user) {
        logger.info('User authenticated via magic link', { userId: data.user.id });
        
        // Create user profile record if it doesn't exist
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: data.user.id,
            verification_status: 'pending',
          }, {
            onConflict: 'user_id',
          });

        if (profileError) {
          logger.dbError('user_profiles', 'upsert', profileError);
          // Continue anyway - profile might already exist
        }

        // Create conversation record if it doesn't exist
        const { error: convError } = await supabase
          .from('onboarding_conversations')
          .upsert({
            user_id: data.user.id,
            status: 'pending',
          }, {
            onConflict: 'user_id',
          });

        if (convError) {
          logger.dbError('onboarding_conversations', 'upsert', convError);
          // Continue anyway
        }

        // Redirect to verification page
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch (error) {
      logger.error('Unexpected error in auth callback', error instanceof Error ? error : null);
      return NextResponse.redirect(new URL(`/onboard/verify?error=unexpected`, requestUrl.origin));
    }
  }

  // No code provided, redirect to verification page
  return NextResponse.redirect(new URL('/onboard/verify', requestUrl.origin));
}

