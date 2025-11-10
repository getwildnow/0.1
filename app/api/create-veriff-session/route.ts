import { NextRequest, NextResponse } from 'next/server'

// Helper function to make HTTP request with retry logic
async function makeVeriffRequest(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    let timeoutId: NodeJS.Timeout | null = null
    try {
      console.log(`Attempt ${attempt} of ${retries} to connect to Veriff API`)
      
      // Add timeout using AbortController
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        // Ensure proper headers for Railway/Node.js environment
        headers: {
          ...options.headers,
          'User-Agent': 'Next.js-Veriff-Integration',
          'Accept': 'application/json',
        },
      })
      
      if (timeoutId) clearTimeout(timeoutId)
      return response
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`Attempt ${attempt} failed:`, errorMessage)
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        // Check if it's a timeout or connection error
        if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
          throw new Error(`Connection timeout: Veriff API did not respond within 30 seconds`)
        }
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
          throw new Error(`DNS/Connection error: Cannot reach Veriff API. Check network configuration.`)
        }
        throw new Error(`Failed to connect to Veriff API after ${retries} attempts: ${errorMessage}`)
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  
  throw new Error('Unexpected error in retry logic')
}

export async function POST(request: NextRequest) {
  try {
    const veriffApiUrl = 'https://api.veriff.com/v1/sessions'
    
    const requestBody = {
      verification: {
        vendorData: 'user_12345',
        callback: 'https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook',
        redirect: 'https://open.spotify.com/intl-de/track/4TeIrimd2REmDGGeAAEUog',
        document: {
          type: 'ID_CARD',
          country: 'DE',
        },
      },
    }

    console.log('Making request to Veriff API:', veriffApiUrl)
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    let response
    try {
      response = await makeVeriffRequest(veriffApiUrl, {
        method: 'POST',
        headers: {
          'X-AUTH-CLIENT': 'bc193001-958f-45ca-931f-c6a040a59ff9',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    } catch (fetchError) {
      console.error('Fetch error details:', {
        message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        name: fetchError instanceof Error ? fetchError.name : 'Unknown',
        stack: fetchError instanceof Error ? fetchError.stack : undefined,
        cause: fetchError instanceof Error ? fetchError.cause : undefined,
      })
      
      return NextResponse.json(
        { 
          error: fetchError instanceof Error ? fetchError.message : 'Failed to connect to Veriff API',
          details: 'Please check Railway logs for more information. This might be a network configuration issue.'
        },
        { status: 503 }
      )
    }

    const responseText = await response.text()
    console.log('Veriff API Response Status:', response.status)
    console.log('Veriff API Response:', responseText)

    if (!response.ok) {
      console.error('Veriff API error:', responseText)
      return NextResponse.json(
        { error: `Veriff API error: ${response.status} ${response.statusText}. Details: ${responseText}` },
        { status: response.status }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse Veriff response as JSON:', responseText)
      return NextResponse.json(
        { error: 'Invalid response from Veriff API' },
        { status: 500 }
      )
    }

    // Veriff API returns the URL in different possible formats
    const verificationUrl = data.verification?.url || data.url || data.data?.url

    if (!verificationUrl) {
      console.error('No verification URL found in response. Full response:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'No verification URL in response. Response structure: ' + JSON.stringify(data) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      verificationUrl: verificationUrl,
    })
  } catch (error) {
    console.error('Error creating Veriff session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

