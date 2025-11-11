import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';

// Test-only route: Get health data without auth
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vitalUserId = searchParams.get('vital_user_id');
    const dataType = searchParams.get('type');
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
        { error: 'type parameter required (activity, sleep, body, workouts, profile, heartrate)' },
        { status: 400 }
      );
    }

    let data;

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
      
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error fetching health data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}


