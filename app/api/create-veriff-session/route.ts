import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = await fetch('https://api.veriff.com/v1/sessions', {
      method: 'POST',
      headers: {
        'X-AUTH-CLIENT': process.env.VERIFF_API_KEY || 'bc193001-958f-45ca-931f-c6a040a59ff9',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verification: {
          vendorData: 'user_12345',
          callback: 'https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook',
          redirect: 'https://open.spotify.com/intl-de/track/4TeIrimd2REmDGGeAAEUog',
          document: { type: 'ID_CARD', country: 'DE' },
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      return NextResponse.json(
        { error: `Veriff API error: ${response.status} ${response.statusText}. Details: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(data.verification.url)

    if (!data.verification?.url) {
      return NextResponse.json(
        { error: 'No verification URL in response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      verificationUrl: data.verification.url,
    })
  } catch (error) {
    // Log detailed error for debugging
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      code: (error as any).code,
      cause: (error as any).cause,
    } : { message: String(error) }
    
    console.error('Error creating Veriff session:', JSON.stringify(errorDetails, null, 2))
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      const errorCause = (error as any).cause
      const causeMessage = errorCause instanceof Error ? errorCause.message.toLowerCase() : ''
      const causeCode = errorCause?.code || (error as any).code
      
      // DNS resolution error (check both main error and cause)
      if (errorMessage.includes('enotfound') || errorMessage.includes('getaddrinfo') || 
          causeMessage.includes('enotfound') || causeMessage.includes('getaddrinfo') ||
          causeCode === 'ENOTFOUND') {
        return NextResponse.json(
          { 
            error: 'Cannot connect to Veriff API',
            details: 'DNS resolution failed. Railway cannot resolve api.veriff.com',
            suggestion: 'This is a Railway network configuration issue. Please check Railway network settings or contact Railway support.'
          },
          { status: 503 }
        )
      }
      
      // Network/fetch errors
      if (errorMessage.includes('fetch failed') || errorMessage.includes('econnrefused') ||
          causeMessage.includes('fetch failed') || causeMessage.includes('econnrefused') ||
          causeCode === 'ECONNREFUSED') {
        return NextResponse.json(
          { 
            error: 'Network connection failed',
            details: 'Unable to reach Veriff API. This might be a network or firewall issue.',
            suggestion: 'Verify Railway allows outbound HTTPS connections to api.veriff.com'
          },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create verification session',
        details: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    )
  }
}

