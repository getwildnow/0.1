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
    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    console.log('[Veriff] Creating session for user:', user.id)

    // Get employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (employeeError || !employee) {
      throw new Error('Employee record not found')
    }

    // Check verification attempts
    if (employee.veriff_attempts >= 3) {
      throw new Error('Maximum verification attempts exceeded')
    }

    // Call Veriff API to create session
    const VERIFF_API_KEY = Deno.env.get('VERIFF_API_KEY')
    const VERIFF_API_SECRET = Deno.env.get('VERIFF_API_SECRET')
    
    if (!VERIFF_API_KEY || !VERIFF_API_SECRET) {
      throw new Error('Veriff credentials not configured')
    }

    const veriffPayload = {
      verification: {
        callback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/veriff_webhook`,
        person: {
          firstName: employee.name.split(' ')[0],
          lastName: employee.name.split(' ').slice(1).join(' ') || employee.name.split(' ')[0],
        },
        vendorData: employee.id,
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

    // Update employee record with session info
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        veriff_session_id: veriffData.verification.id,
        veriff_status: 'started',
        veriff_attempts: employee.veriff_attempts + 1,
      })
      .eq('id', employee.id)

    if (updateError) {
      console.error('[Veriff] Failed to update employee:', updateError)
    }

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

