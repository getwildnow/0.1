/**
 * Check verification status
 * Uses service role client to bypass RLS
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('verification_status')
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.dbError('user_profiles', 'select', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      verified: profile?.verification_status === 'verified',
      status: profile?.verification_status || 'pending',
    });
  } catch (error) {
    logger.error('Error checking verification status', error instanceof Error ? error : null);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

