import { NextResponse } from 'next/server';
import { fasten } from '@/lib/fasten';
import { createClient } from '@/lib/supabase/server';

// Create a new Fasten user linked to the current Supabase user
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

    // Create a Fasten user using the Supabase user ID
    const fastenUser = await fasten.createUser(user.id);

    // Store in Supabase
    await supabase.from('fasten_users').insert({
      user_id: user.id,
      fasten_user_id: fastenUser.user_id,
      fasten_patient_id: fastenUser.patient_id,
    });

    return NextResponse.json({
      success: true,
      data: fastenUser,
    });
  } catch (error) {
    console.error('Error creating Fasten user:', error);
    return NextResponse.json(
      { error: 'Failed to create Fasten user' },
      { status: 500 }
    );
  }
}

// Get Fasten user information
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

    // Get Fasten user from Supabase
    const { data: fastenUserRecord } = await supabase
      .from('fasten_users')
      .select('fasten_user_id')
      .eq('user_id', user.id)
      .single();

    if (!fastenUserRecord) {
      return NextResponse.json(
        { error: 'Fasten user not found' },
        { status: 404 }
      );
    }

    const fastenUser = await fasten.getUser(fastenUserRecord.fasten_user_id);
    const connections = await fasten.getUserConnections(fastenUserRecord.fasten_user_id);

    return NextResponse.json({
      success: true,
      data: {
        user: fastenUser,
        connections,
      },
    });
  } catch (error) {
    console.error('Error fetching Fasten user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Fasten user' },
      { status: 500 }
    );
  }
}



