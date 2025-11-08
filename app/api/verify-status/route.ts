import { createServiceRoleClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    // Use service role client to bypass RLS
    const supabase = createServiceRoleClient();
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('verification_status')
      .eq('user_id', sessionId)
      .single();

    if (error) {
      // Profile might not exist yet (webhook hasn't processed)
      return NextResponse.json({ 
        verification_status: 'pending',
        exists: false 
      });
    }

    return NextResponse.json({ 
      verification_status: profile?.verification_status || 'pending',
      exists: true
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      verification_status: 'pending' 
    }, { status: 500 });
  }
}

