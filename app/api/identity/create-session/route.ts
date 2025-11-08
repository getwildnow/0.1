import { createServiceRoleClient } from '@/lib/supabase/service';
import { veriff } from '@/lib/veriff';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    logger.apiRequest('POST', '/api/identity/create-session');
    
    // Generate a unique session ID for tracking (no auth required)
    const sessionId = randomBytes(16).toString('hex');
    
    logger.info('Creating Veriff session', { sessionId });

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
    const returnUrl = `${origin}/onboard/chat?session=${sessionId}&verified=true`;
    
    const session = await veriff.createSession(callbackUrl, returnUrl, {
      session_id: sessionId,
    });
    
    logger.info('Veriff session created', { sessionId, veriffSessionId: session.id });

    // Store temporary session mapping (no user needed yet)
    const supabase = createServiceRoleClient();
    const { error: dbError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: sessionId, // Use sessionId as temporary user_id
        veriff_verification_session_id: session.id,
        verification_status: 'pending',
      });
      
    if (dbError) {
      logger.dbError('user_profiles', 'insert', dbError);
      // Continue anyway - we can still verify
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

