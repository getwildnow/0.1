// Veriff Webhook Handler
// This Supabase Edge Function receives verification results from Veriff

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hmac-signature, x-signature',
}

interface VeriffWebhookPayload {
  status: 'success' | 'fail'
  verification: {
    id: string
    code: number
    person?: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      gender?: string
      nationality?: string
      idNumber?: string
    }
    document?: {
      number?: string
      type?: string
      country?: string
    }
    status: 'approved' | 'declined' | 'resubmission_requested' | 'expired'
    vendorData?: string
    decisionTime?: string
    acceptanceTime?: string
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get webhook signature
    const signature = req.headers.get('x-hmac-signature') || req.headers.get('x-signature')
    
    // Get request body
    const body = await req.text()
    const payload: VeriffWebhookPayload = JSON.parse(body)

    console.log('[Veriff Webhook] Received:', {
      sessionId: payload.verification.id,
      status: payload.verification.status,
      vendorData: payload.verification.vendorData,
    })

    // Verify signature (recommended for production)
    const veriffSecret = Deno.env.get('VERIFF_API_SECRET')
    if (veriffSecret && signature) {
      const encoder = new TextEncoder()
      const data = encoder.encode(body)
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(veriffSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, data)
      const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      if (calculatedSignature.toLowerCase() !== signature.toLowerCase()) {
        console.error('[Veriff Webhook] Invalid signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get employee ID from vendorData
    const employeeId = payload.verification.vendorData

    if (!employeeId) {
      console.error('[Veriff Webhook] No vendorData (employee ID) provided')
      return new Response(
        JSON.stringify({ error: 'Missing employee ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update employee record
    const updateData: any = {
      veriff_session_id: payload.verification.id,
      veriff_status: payload.verification.status,
      veriff_decision_time: payload.verification.decisionTime || new Date().toISOString(),
    }

    // Store person data if verification was approved
    if (payload.verification.status === 'approved' && payload.verification.person) {
      updateData.veriff_person = payload.verification.person
      updateData.verification_completed_at = new Date().toISOString()
      updateData.status = 'verified' // Update employee status to verified
    }

    console.log('[Veriff Webhook] Updating employee:', employeeId)

    const { data: employee, error: updateError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', employeeId)
      .select()
      .single()

    if (updateError) {
      console.error('[Veriff Webhook] Failed to update employee:', updateError)
      return new Response(
        JSON.stringify({ error: 'Database update failed', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[Veriff Webhook] Successfully updated employee:', {
      employeeId,
      status: payload.verification.status,
    })

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification processed',
        employeeId,
        status: payload.verification.status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('[Veriff Webhook] Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

