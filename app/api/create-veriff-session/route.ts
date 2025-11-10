import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import { URL } from 'url'

// Helper function to make HTTP request using Node's native https module
async function makeVeriffRequest(url: string, body: string, headers: Record<string, string>): Promise<{ status: number; statusText: string; text: () => Promise<string> }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    }

    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          status: res.statusCode || 500,
          statusText: res.statusMessage || 'Unknown',
          text: async () => data,
        })
      })
    })

    req.on('error', (error) => {
      console.error('HTTPS request error:', error)
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.write(body)
    req.end()
  })
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
    
    const requestBodyString = JSON.stringify(requestBody)
    let response: { status: number; statusText: string; text: () => Promise<string> } | null = null
    let responseText: string | null = null
    
    // Try with retry logic
    const maxRetries = 3
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxRetries} to connect to Veriff API`)
        response = await makeVeriffRequest(veriffApiUrl, requestBodyString, {
          'X-AUTH-CLIENT': 'bc193001-958f-45ca-931f-c6a040a59ff9',
          'Content-Type': 'application/json',
          'User-Agent': 'Next.js-Veriff-Integration',
          'Accept': 'application/json',
        })
        responseText = await response.text()
        break // Success, exit retry loop
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.error(`Attempt ${attempt} failed:`, lastError.message)
        
        if (attempt === maxRetries) {
          console.error('All retry attempts failed:', {
            message: lastError.message,
            name: lastError.name,
            stack: lastError.stack,
          })
          
          return NextResponse.json(
            { 
              error: `Failed to connect to Veriff API after ${maxRetries} attempts: ${lastError.message}`,
              details: 'This might be a Railway network configuration issue. Check Railway network settings.',
              suggestion: 'Verify that Railway allows outbound HTTPS connections to api.veriff.com'
            },
            { status: 503 }
          )
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
    
    if (!response || !responseText) {
      return NextResponse.json(
        { error: 'No response received from Veriff API' },
        { status: 500 }
      )
    }
    console.log('Veriff API Response Status:', response.status)
    console.log('Veriff API Response:', responseText)

    if (response.status < 200 || response.status >= 300) {
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

