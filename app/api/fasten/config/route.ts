import { NextResponse } from 'next/server';
import { fasten } from '@/lib/fasten';
import { createClient } from '@/lib/supabase/server';

// Get Fasten public configuration for frontend
export async function GET(request: Request) {
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

    // Return public ID for Fasten Connect widget
    return NextResponse.json({
      success: true,
      data: {
        publicId: fasten.getPublicId(),
      },
    });
  } catch (error) {
    console.error('Error fetching Fasten config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Fasten configuration' },
      { status: 500 }
    );
  }
}



