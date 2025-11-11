import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';

// Test-only route: Get user connections without auth
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vitalUserId = searchParams.get('vital_user_id');

    console.log('Fetching connections for Vital user:', vitalUserId);

    if (!vitalUserId) {
      return NextResponse.json(
        { error: 'vital_user_id parameter required' },
        { status: 400 }
      );
    }

    console.log('Calling Vital API to get connections...');
    const response = await vital.getUserConnections(vitalUserId);
    console.log('Connections received:', JSON.stringify(response, null, 2));
    
    // Vital API returns { providers: [...] }
    const connections = (response as any).providers || response || [];
    console.log('Number of connections:', Array.isArray(connections) ? connections.length : 'not an array');

    return NextResponse.json({
      success: true,
      data: { 
        connections,
        providers: connections, // Also send as providers for backwards compatibility
      },
    });
  } catch (error: any) {
    console.error('Error fetching connections:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch connections',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

