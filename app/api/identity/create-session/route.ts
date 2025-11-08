import { createClient } from '@/lib/supabase/server';
import { veriff } from '@/lib/veriff';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    logger.apiRequest('POST', '/api/identity/create-session');
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      logger.warn('Unauthorized access to create-session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    logger.info('Creating Veriff session', { userId: user.id });

    // Get the base URL - prioritize RENDER_EXTERNAL_URL for production
    const baseUrl = process.env.RENDER_EXTERNAL_URL 
      || process.env.VERCEL_URL 
      || request.headers.get('origin') 
      || request.headers.get('host') 
      || 'http://localhost:3000';
    
    // Ensure we have https:// for production URLs
    const origin = baseUrl.startsWith('http') 
      ? baseUrl 
      : `https://${baseUrl}`;

    // Create Veriff verification session
    const callbackUrl = `${origin}/api/webhooks/veriff`;
    const returnUrl = `${origin}/onboard/chat?verified=true`;
    
    const session = await veriff.createSession(callbackUrl, returnUrl, {
      user_id: user.id,
    });
    
    logger.info('Veriff session created', { userId: user.id, sessionId: session.id });

    // Save session ID to user profile
    const { error: dbError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        veriff_verification_session_id: session.id,
        verification_status: 'pending',
      });
      
    if (dbError) {
      logger.dbError('user_profiles', 'upsert', dbError);
      throw dbError;
    }

    logger.apiSuccess('POST', '/api/identity/create-session');
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    logger.apiError('POST', '/api/identity/create-session', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create verification session' },
      { status: 500 }
    );
  }
}

