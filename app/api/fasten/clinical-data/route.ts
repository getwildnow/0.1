import { NextResponse } from 'next/server';
import { fasten } from '@/lib/fasten';
import { createClient } from '@/lib/supabase/server';

// Get clinical data for a user
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
        { error: 'Fasten user not found. Please connect your account first.' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type'); // medications, labs, conditions, procedures, allergies, immunizations, care_plans
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const status = searchParams.get('status');

    if (!dataType) {
      return NextResponse.json(
        { error: 'type parameter required (medications, labs, conditions, procedures, allergies, immunizations, care_plans)' },
        { status: 400 }
      );
    }

    const fastenUserId = fastenUserRecord.fasten_user_id;
    let data;

    // Handle different data types
    switch (dataType) {
      case 'medications':
        data = await fasten.getMedications(fastenUserId, {
          status: status as any,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        break;
      
      case 'labs':
        data = await fasten.getLabResults(fastenUserId, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        break;
      
      case 'conditions':
        data = await fasten.getConditions(fastenUserId, {
          status: status as any,
        });
        break;
      
      case 'procedures':
        data = await fasten.getProcedures(fastenUserId, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        break;
      
      case 'allergies':
        data = await fasten.getAllergies(fastenUserId);
        break;
      
      case 'immunizations':
        data = await fasten.getImmunizations(fastenUserId);
        break;
      
      case 'care_plans':
        data = await fasten.getCarePlans(fastenUserId);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: medications, labs, conditions, procedures, allergies, immunizations, care_plans' },
          { status: 400 }
        );
    }

    // Optionally cache in Supabase
    if (data && data.length > 0) {
      await supabase.from('fasten_clinical_data').upsert({
        fasten_user_id: fastenUserId,
        data_type: dataType,
        data: data,
        synced_at: new Date().toISOString(),
      }, {
        onConflict: 'fasten_user_id,data_type',
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching clinical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clinical data' },
      { status: 500 }
    );
  }
}



