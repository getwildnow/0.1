import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Get OAuth URL for a specific provider
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vital_user_id, provider_slug } = body;

    if (!vital_user_id || !provider_slug) {
      return NextResponse.json(
        { error: 'vital_user_id and provider_slug are required' },
        { status: 400 }
      );
    }

    const baseUrl = env.vital.environment === 'production' 
      ? 'https://api.tryvital.io' 
      : 'https://api.sandbox.tryvital.io';

    // Use the correct Vital Link Token endpoint
    const apiUrl = `${baseUrl}/v2/link/token`;
    
    console.log('Generating Link Token for provider:', provider_slug);
    console.log('API URL:', apiUrl);
    console.log('Vital User ID:', vital_user_id);

    // Generate Link Token using Vital API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vital-api-key': env.vital.apiKey,
      },
      body: JSON.stringify({
        user_id: vital_user_id,
        filter: {
          providers: [provider_slug]
        }
      }),
    });

    console.log('Vital API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vital API Error Response:', errorText);
      return NextResponse.json(
        { 
          error: 'Failed to generate OAuth URL', 
          details: errorText,
          status: response.status 
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('OAuth URL generated:', data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}

