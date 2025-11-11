import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';

// Test-only route: Create link token without auth
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vital_user_id, redirect_url } = body;

    if (!vital_user_id) {
      return NextResponse.json(
        { error: 'vital_user_id is required' },
        { status: 400 }
      );
    }

    const linkToken = await vital.createLinkToken(vital_user_id, redirect_url);

    return NextResponse.json({
      success: true,
      data: linkToken,
    });
  } catch (error: any) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create link token' },
      { status: 500 }
    );
  }
}


