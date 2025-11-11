import { NextResponse } from 'next/server';
import { vital } from '@/lib/vital';

// Get list of available providers
export async function GET(request: Request) {
  try {
    const providers = await vital.getProviders();

    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error: any) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}


