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

    const data = await response.json()
    console.log(data.verification.url)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Veriff API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

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
    console.error('Error creating Veriff session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

