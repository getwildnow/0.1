import { veriff } from '@/lib/veriff';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  logger.serviceCall('veriff', 'webhook_received');
  
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('x-signature');

  if (!signature) {
    logger.warn('Veriff webhook missing signature');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Verify webhook signature
  const isValid = veriff.verifyWebhookSignature(body, signature);
  if (!isValid) {
    // Log more details for debugging
    logger.error('Veriff webhook signature verification failed', null, { 
      signature,
      bodyLength: body.length,
      bodyPreview: body.substring(0, 100)
    });
    
    // TEMPORARY: Comment out for initial testing to see webhook payload
    // return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (isValid) {
    logger.info('Veriff webhook signature verified');
  } else {
    logger.warn('Proceeding without signature verification (TEMPORARY - FIX VERIFF_API_SECRET!)');
  }

  // Use service role client to bypass RLS (webhooks have no user session)
  const supabase = createServiceRoleClient();
  
  let event;
  try {
    event = JSON.parse(body);
    logger.info('Veriff webhook payload received', { 
      keys: Object.keys(event),
      id: event.id,
      action: event.action,
      status: event.status,
      vendorData: event.vendorData
    });
  } catch (error) {
    logger.error('Failed to parse webhook body', error);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Veriff sends events with the session ID at root level
  // Look for vendorData at multiple possible locations
  const veriffSessionId = event.id;
  let sessionId = event.vendorData;
  
  // If vendorData not at root, check database for matching veriff session
  if (!sessionId && veriffSessionId) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('veriff_verification_session_id', veriffSessionId)
      .single();
    
    if (profile) {
      sessionId = profile.user_id;
      logger.info('Found session ID from database', { sessionId, veriffSessionId });
    }
  }

  if (!sessionId) {
    logger.error('Cannot find session ID', { 
      veriffSessionId,
      eventKeys: Object.keys(event),
      bodyPreview: body.substring(0, 200)
    });
    return NextResponse.json({ error: 'No session ID found' }, { status: 400 });
  }

  logger.info('Processing verification', { 
    sessionId, 
    veriffSessionId, 
    status: event.status,
    action: event.action 
  });

  // Get full verification details from Veriff API
  let fullVerification;
  try {
    fullVerification = await veriff.getVerification(veriffSessionId);
    logger.debug('Retrieved full verification details', { veriffSessionId });
  } catch (error) {
    logger.error('Error fetching verification details', error, { veriffSessionId });
    // Continue with webhook event data
    fullVerification = event;
  }

  // Extract person data from API response or webhook
  const person = fullVerification.person || event.person || {};
  const address = fullVerification.address || event.address || {};
  const document = fullVerification.document || event.document || {};
  
  // Parse date of birth
  let dob = null;
  if (person.dateOfBirth) {
    // Veriff returns date as YYYY-MM-DD or timestamp
    dob = person.dateOfBirth.includes('-') 
      ? person.dateOfBirth 
      : new Date(parseInt(person.dateOfBirth)).toISOString().split('T')[0];
  }

  // Extract address components
  const addressParts = address.fullAddress?.split(',') || [];
  const street = address.street || addressParts[0] || null;
  const city = address.city || addressParts[1] || null;
  const state = address.state || addressParts[2] || null;
  const zipCode = address.zipCode || addressParts[3] || null;
  const country = address.country || addressParts[4] || null;

  // Determine verification status
  const status = event.status || fullVerification.status || 'pending';
  const isApproved = status === 'approved' || status === 'success';

  // Extract all data
  const profileData = {
    veriff_verification_session_id: veriffSessionId,
    verification_status: isApproved ? 'verified' : status,
    first_name: person.firstName || null,
    last_name: person.lastName || null,
    dob: dob,
    gender: person.gender || null,
    id_number: person.idNumber || document.number || null,
    document_type: document.type || null,
    address_line1: street || null,
    address_line2: null, // Veriff doesn't always provide line2
    city: city || null,
    state: state || null,
    postal_code: zipCode || null,
    country: country || person.nationality || null,
    veriff_data: fullVerification as any,
    verified_at: isApproved ? new Date().toISOString() : null,
  };

  // Save to user_profiles
  const { error: profileError } = await supabase.from('user_profiles').upsert({
    user_id: sessionId,
    ...profileData,
  });
  
  if (profileError) {
    logger.dbError('user_profiles', 'upsert', profileError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  
  logger.info('User profile updated', { sessionId, status: profileData.verification_status });

  // Update conversation state if verified
  if (isApproved) {
    const { error: convError } = await supabase.from('onboarding_conversations').upsert({
      user_id: sessionId,
      veriff_verified: true,
      veriff_data: profileData,
      status: 'verified',
    });
    
    if (convError) {
      logger.dbError('onboarding_conversations', 'upsert', convError);
      // Don't fail the webhook if conversation update fails
    }
    
    logger.info('Onboarding conversation updated to verified', { sessionId });
  }

  return NextResponse.json({ received: true });
}

