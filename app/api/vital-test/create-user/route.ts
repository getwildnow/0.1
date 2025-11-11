import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';

// Test-only route: Create Vital user without auth
export async function POST(request: Request) {
  try {
    // Create a test user ID
    const testUserId = `test-${Date.now()}`;
    
    const vitalUser = await vital.createUser(testUserId);

    return NextResponse.json({
      success: true,
      data: vitalUser,
    });
  } catch (error: any) {
    console.error('Error creating Vital user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Vital user' },
      { status: 500 }
    );
  }
}


