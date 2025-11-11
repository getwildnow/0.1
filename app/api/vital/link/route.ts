import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';
import { createClient } from '@/lib/supabase/server';

// Create a link token for connecting health providers
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { vital_user_id, redirect_url } = body;

    if (!vital_user_id) {
      return NextResponse.json(
        { error: 'vital_user_id is required' },
        { status: 400 }
      );
    }

    // Create a link token
    const linkToken = await vital.createLinkToken(vital_user_id, redirect_url);

    return NextResponse.json({
      success: true,
      data: linkToken,
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}



