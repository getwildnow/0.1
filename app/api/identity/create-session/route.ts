/**
 * Create Veriff verification session
 */

import { NextRequest, NextResponse } from 'next/server';
import { veriff } from '@/lib/veriff';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    logger.serviceCall('veriff', 'create_session');

    // Get authenticated user from Supabase session
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized session creation attempt', { error: authError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Generate callback URL for webhook
    const baseUrl = env.railway.externalUrl || request.headers.get('origin') || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/webhooks/veriff`;

    logger.info('Creating Veriff session', { userId, callbackUrl });

    // Create Veriff session with sessionId in vendorData
    const session = await veriff.createSession(callbackUrl, {
      session_id: userId,
    });

    // Store Veriff session ID in user_profiles
    const { error: dbError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        veriff_verification_session_id: session.id,
        verification_status: 'pending',
      });

    if (dbError) {
      logger.dbError('user_profiles', 'upsert', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    logger.info('Veriff session created', { userId, veriffSessionId: session.id });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error('Error creating Veriff session', error instanceof Error ? error : null);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

