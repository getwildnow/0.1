import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Debug endpoint to check Vital configuration
export async function GET(request: Request) {
  try {
    const apiKey = env.vital.apiKey;
    const environment = env.vital.environment;
    const region = env.vital.region;
    const baseUrl = environment === 'production' 
      ? 'https://api.tryvital.io' 
      : 'https://api.sandbox.tryvital.io';

    // Test a simple API call
    const testUserId = `test-debug-${Date.now()}`;
    const url = `${baseUrl}/v2/user`;
    
    console.log('Testing Vital API...');
    console.log('URL:', url);
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vital-api-key': apiKey,
      },
      body: JSON.stringify({ client_user_id: testUserId }),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      config: {
        baseUrl,
        environment,
        region,
        apiKeyPrefix: apiKey.substring(0, 15) + '...',
      },
      response: responseText,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

