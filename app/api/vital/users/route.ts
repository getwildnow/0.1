import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';
import { createClient } from '@/lib/supabase/server';

// Create a new Vital user linked to the current Supabase user
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

    // Create a Vital user using the Supabase user ID
    const vitalUser = await vital.createUser(user.id);

    return NextResponse.json({
      success: true,
      data: vitalUser,
    });
  } catch (error) {
    console.error('Error creating Vital user:', error);
    return NextResponse.json(
      { error: 'Failed to create Vital user' },
      { status: 500 }
    );
  }
}

// Get Vital user information
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

    // Get Vital user info (assuming vital_user_id is stored in user metadata)
    const { searchParams } = new URL(request.url);
    const vitalUserId = searchParams.get('vital_user_id');
    
    if (!vitalUserId) {
      return NextResponse.json(
        { error: 'vital_user_id parameter required' },
        { status: 400 }
      );
    }

    const vitalUser = await vital.getUser(vitalUserId);
    const connections = await vital.getUserConnections(vitalUserId);

    return NextResponse.json({
      success: true,
      data: {
        user: vitalUser,
        connections,
      },
    });
  } catch (error) {
    console.error('Error fetching Vital user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Vital user' },
      { status: 500 }
    );
  }
}



