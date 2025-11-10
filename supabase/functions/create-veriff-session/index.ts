import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('[Veriff] Starting session creation...')

    // Call Veriff API to create session
    const VERIFF_API_KEY = Deno.env.get('VERIFF_API_KEY')
    
    if (!VERIFF_API_KEY) {
      throw new Error('Veriff API key not configured')
    }

    const veriffPayload = {
      verification: {
        callback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/veriff_webhook`,
        person: {
          firstName: 'Test',
          lastName: 'User',
        },
        vendorData: 'test-session',
      },
    }

    console.log('[Veriff] Calling Veriff API...')

    const veriffResponse = await fetch('https://stationapi.veriff.com/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': VERIFF_API_KEY,
      },
      body: JSON.stringify(veriffPayload),
    })

    if (!veriffResponse.ok) {
      const errorText = await veriffResponse.text()
      console.error('[Veriff] API error:', errorText)
      throw new Error(`Veriff API error: ${veriffResponse.status}`)
    }

    const veriffData = await veriffResponse.json()
    console.log('[Veriff] Session created:', veriffData.verification.id)

    return new Response(
      JSON.stringify({
        url: veriffData.verification.url,
        sessionId: veriffData.verification.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[Veriff] Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

