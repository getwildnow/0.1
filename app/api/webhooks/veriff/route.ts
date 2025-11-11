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
    logger.error('Veriff webhook signature verification failed', null, { signature });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  logger.info('Veriff webhook signature verified');

  // Use service role client to bypass RLS (webhooks have no user session)
  const supabase = createServiceRoleClient();
  const event = JSON.parse(body);

  // Veriff webhook events: verification.status.changed
  if (event.type === 'verification.status.changed') {
    const verification = event.verification;
    const userId = event.metadata?.user_id;

    if (!userId) {
      logger.error('Veriff webhook missing user_id in metadata', null, { verificationId: verification.id });
      return NextResponse.json({ error: 'No user ID in metadata' }, { status: 400 });
    }

    logger.info('Processing verification for user', { userId, verificationId: verification.id, status: verification.status });

    // Get full verification details
    let fullVerification;
    try {
      fullVerification = await veriff.getVerification(verification.id);
      logger.debug('Retrieved full verification details', { verificationId: verification.id });
    } catch (error) {
      logger.error('Error fetching verification details', error, { verificationId: verification.id });
      // Continue with basic verification data
      fullVerification = verification;
    }

    // Extract person data
    const person = fullVerification.person || fullVerification.additionalData || {};
    const address = fullVerification.address || {};
    
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

    // Extract all data
    const profileData = {
      veriff_verification_session_id: verification.id,
      verification_status: verification.status === 'success' ? 'verified' : verification.status,
      first_name: person.firstName || null,
      last_name: person.lastName || null,
      dob: dob,
      gender: person.gender || null,
      id_number: person.idNumber || fullVerification.document?.number || null,
      document_type: fullVerification.document?.type || null,
      address_line1: street || null,
      address_line2: null, // Veriff doesn't always provide line2
      city: city || null,
      state: state || null,
      postal_code: zipCode || null,
      country: country || person.nationality || null,
      veriff_data: fullVerification as any,
      verified_at: verification.status === 'success' ? new Date().toISOString() : null,
    };

    // Save to user_profiles
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      user_id: userId,
      ...profileData,
    });
    
    if (profileError) {
      logger.dbError('user_profiles', 'upsert', profileError);
      throw profileError;
    }
    
    logger.info('User profile updated', { userId, status: profileData.verification_status });

    // Update conversation state if verified
    if (verification.status === 'success') {
      const { error: convError } = await supabase.from('onboarding_conversations').upsert({
        user_id: userId,
        veriff_verified: true,
        veriff_data: profileData,
        status: 'verified',
      });
      
      if (convError) {
        logger.dbError('onboarding_conversations', 'upsert', convError);
        throw convError;
      }
      
      logger.info('Onboarding conversation updated to verified', { userId });
    }
  }

  return NextResponse.json({ received: true });
}

