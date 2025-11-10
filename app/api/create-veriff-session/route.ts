import { NextRequest, NextResponse } from 'next/server'

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
      response = await fetch(veriffApiUrl, {
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
      
      // Try alternative approach using node-fetch style
      throw new Error(`Failed to connect to Veriff API: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}. This might be a network/firewall issue.`)
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

