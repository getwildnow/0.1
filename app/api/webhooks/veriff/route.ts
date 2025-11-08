/**
 * Veriff webhook handler
 * Processes verification results and extracts user data
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { veriff } from '@/lib/veriff';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

// Handle GET requests (user redirect from Veriff) - redirect to chat
export async function GET(request: NextRequest) {
  logger.warn('User redirected to webhook endpoint via GET - redirecting to chat');
  
  const url = new URL(request.url);
  const sessionParam = url.searchParams.get('session') || url.searchParams.get('vendorData');
  
  if (sessionParam) {
    return NextResponse.redirect(new URL(`/onboard/chat?session=${sessionParam}`, url.origin));
  }
  
  return NextResponse.redirect(new URL('/onboard/verify', url.origin));
}

export async function POST(request: NextRequest) {
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
    logger.error('Veriff webhook signature verification failed', null, { 
      signature,
      bodyLength: body.length,
      bodyPreview: body.substring(0, 100)
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  logger.info('Veriff webhook signature verified');

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
    logger.error('Failed to parse webhook body', error instanceof Error ? error : null);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Extract sessionId from vendorData
  const veriffSessionId = event.id;
  let sessionId = event.vendorData;
  
  // If vendorData not found, query database for matching veriff session
  if (!sessionId && veriffSessionId) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('veriff_verification_session_id', veriffSessionId)
      .single();
    
    if (profile) {
      sessionId = (profile as { user_id?: string } | null)?.user_id || null;
      if (sessionId) {
        logger.info('Found session ID from database', { sessionId, veriffSessionId });
      }
    }
  }

  if (!sessionId) {
    logger.error('Cannot find session ID', null, { 
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
    logger.error('Error fetching verification details', error instanceof Error ? error : null, { veriffSessionId });
    // Continue with webhook event data
    fullVerification = event;
  }

  // Extract person data from API response or webhook
  const person = fullVerification.person || event.person || {};
  const address = fullVerification.address || event.address || {};
  const document = fullVerification.document || event.document || {};
  
  logger.info('Extracted data structures', {
    personKeys: Object.keys(person),
    addressKeys: Object.keys(address),
    documentKeys: Object.keys(document)
  });
  
  // Parse date of birth
  let dob = null;
  if (person.dateOfBirth) {
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

  // Extract email and phone
  const email = person.email || fullVerification.email || event.email || null;
  const phone = person.phone || person.phoneNumber || fullVerification.phone || event.phone || null;

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
    email: email,
    phone: phone,
    id_number: person.idNumber || document.number || null,
    document_type: document.type || null,
    address_line1: street || null,
    address_line2: null,
    city: city || null,
    state: state || null,
    postal_code: zipCode || null,
    country: country || person.nationality || null,
    veriff_data: fullVerification as any,
    verified_at: isApproved ? new Date().toISOString() : null,
  };

  logger.info('Prepared profile data for database', { 
    sessionId,
    hasFirstName: !!profileData.first_name,
    hasLastName: !!profileData.last_name,
    hasEmail: !!profileData.email,
    hasPhone: !!profileData.phone,
    hasDOB: !!profileData.dob,
    hasAddress: !!profileData.address_line1,
    status: profileData.verification_status
  });

          // Save to user_profiles
          const { error: profileError } = await supabase.from('user_profiles').upsert({
            user_id: sessionId,
            ...profileData,
          } as any);
  
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

