import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';
import { createClient } from '@/lib/supabase/server';

// Get health data for a user
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

    const { searchParams } = new URL(request.url);
    const vitalUserId = searchParams.get('vital_user_id');
    const dataType = searchParams.get('type'); // activity, sleep, body, workouts, profile
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!vitalUserId) {
      return NextResponse.json(
        { error: 'vital_user_id parameter required' },
        { status: 400 }
      );
    }

    if (!dataType) {
      return NextResponse.json(
        { error: 'type parameter required (activity, sleep, body, workouts, profile, heartrate, glucose, blood_pressure)' },
        { status: 400 }
      );
    }

    let data;

    // Handle different data types
    switch (dataType) {
      case 'activity':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for activity data' },
            { status: 400 }
          );
        }
        data = await vital.getActivity(vitalUserId, startDate, endDate);
        break;
      
      case 'sleep':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for sleep data' },
            { status: 400 }
          );
        }
        data = await vital.getSleep(vitalUserId, startDate, endDate);
        break;
      
      case 'body':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for body data' },
            { status: 400 }
          );
        }
        data = await vital.getBody(vitalUserId, startDate, endDate);
        break;
      
      case 'workouts':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for workouts data' },
            { status: 400 }
          );
        }
        data = await vital.getWorkouts(vitalUserId, startDate, endDate);
        break;
      
      case 'profile':
        data = await vital.getProfile(vitalUserId);
        break;
      
      case 'heartrate':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for heart rate data' },
            { status: 400 }
          );
        }
        data = await vital.getHeartRate(vitalUserId, startDate, endDate);
        break;
      
      case 'glucose':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for glucose data' },
            { status: 400 }
          );
        }
        data = await vital.getGlucose(vitalUserId, startDate, endDate);
        break;
      
      case 'blood_pressure':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'start_date and end_date required for blood pressure data' },
            { status: 400 }
          );
        }
        data = await vital.getBloodPressure(vitalUserId, startDate, endDate);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: activity, sleep, body, workouts, profile, heartrate, glucose, blood_pressure' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}



