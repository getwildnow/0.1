import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Simple test endpoint to check Vital API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'dda14657-1636-4c5d-a7c5-df7d4da17c1b';
    
    const apiKey = env.vital.apiKey;
    const environment = env.vital.environment;
    const baseUrl = environment === 'production' 
      ? 'https://api.tryvital.io' 
      : 'https://api.sandbox.tryvital.io';
    
    // Try different endpoint variations
    const endpoints = [
      `/v2/link/provider?user_id=${userId}`,
      `/v2/user/providers/${userId}`,
      `/v2/user/${userId}/providers`,
      `/v2/link/connected_sources?user_id=${userId}`,
      `/v2/user/connections/${userId}`,
      `/v2/user/${userId}`,
    ];
    
    console.log('=== VITAL API TEST - TRYING MULTIPLE ENDPOINTS ===');
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('Environment:', environment);
    console.log('User ID:', userId);
    
    const results = [];
    
    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint}`;
      console.log('\n--- Testing:', url);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-vital-api-key': apiKey,
          },
        });
        
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText.substring(0, 200));
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = responseText;
        }
        
        results.push({
          endpoint,
          status: response.status,
          ok: response.ok,
          response: responseData,
        });
      } catch (error: any) {
        results.push({
          endpoint,
          error: error.message,
        });
      }
    }
    
    return NextResponse.json({
      results,
      recommendation: results.find(r => r.ok)?.endpoint || 'None worked',
    });
  } catch (error: any) {
    console.error('=== ERROR ===');
    console.error('Error message:', error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// Keep old code below for reference
async function testOldEndpoint() {
  try {
    const apiKey = env.vital.apiKey;
    const environment = env.vital.environment;
    const baseUrl = environment === 'production' 
      ? 'https://api.tryvital.io' 
      : 'https://api.sandbox.tryvital.io';
    const userId = 'test';
    const url = `${baseUrl}/v2/user/${userId}/connections`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-vital-api-key': apiKey,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      url,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      environment,
      response: responseData,
    });
  } catch (error: any) {
    console.error('=== ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

