/**
 * Veriff API Helper Functions
 * Documentation: https://developers.veriff.com/
 */

import crypto from 'crypto'

const VERIFF_API_URL = 'https://stationapi.veriff.com/v1'
const VERIFF_API_KEY = process.env.VERIFF_API_KEY
const VERIFF_API_SECRET = process.env.VERIFF_API_SECRET

interface VeriffPerson {
  firstName?: string
  lastName?: string
  idNumber?: string
}

interface CreateSessionParams {
  personFirstName: string
  personLastName: string
  vendorData: string // Employee ID for tracking
  callbackUrl?: string
}

interface VeriffSession {
  status: string
  verification: {
    id: string
    url: string
    vendorData: string
    host: string
    status: string
    sessionToken: string
  }
}

/**
 * Create a new Veriff verification session
 */
export async function createVeriffSession(params: CreateSessionParams): Promise<VeriffSession> {
  if (!VERIFF_API_KEY) {
    throw new Error('VERIFF_API_KEY is not configured')
  }

  const callbackUrl = params.callbackUrl || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/veriff_webhook`

  const payload = {
    verification: {
      callback: callbackUrl,
      person: {
        firstName: params.personFirstName,
        lastName: params.personLastName,
      },
      vendorData: params.vendorData,
      timestamp: new Date().toISOString(),
    },
  }

  try {
    const response = await fetch(`${VERIFF_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': VERIFF_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Veriff API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('[Veriff] Failed to create session:', error)
    throw new Error(`Failed to create Veriff session: ${error.message}`)
  }
}

/**
 * Verify Veriff webhook signature
 * This ensures the webhook came from Veriff
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!VERIFF_API_SECRET) {
    console.error('[Veriff] VERIFF_API_SECRET is not configured')
    return false
  }

  try {
    const hmac = crypto.createHmac('sha256', VERIFF_API_SECRET)
    hmac.update(payload)
    const calculatedSignature = hmac.digest('hex').toLowerCase()
    
    return calculatedSignature === signature.toLowerCase()
  } catch (error) {
    console.error('[Veriff] Signature verification failed:', error)
    return false
  }
}

/**
 * Get verification decision from Veriff
 * Use this to manually check verification status if needed
 */
export async function getVerificationDecision(sessionId: string) {
  if (!VERIFF_API_KEY || !VERIFF_API_SECRET) {
    throw new Error('Veriff credentials are not configured')
  }

  try {
    const response = await fetch(`${VERIFF_API_URL}/sessions/${sessionId}/decision`, {
      method: 'GET',
      headers: {
        'X-AUTH-CLIENT': VERIFF_API_KEY,
        'X-HMAC-SIGNATURE': generateHmacSignature(sessionId),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get decision: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('[Veriff] Failed to get decision:', error)
    throw error
  }
}

/**
 * Generate HMAC signature for API requests
 */
function generateHmacSignature(data: string): string {
  if (!VERIFF_API_SECRET) {
    throw new Error('VERIFF_API_SECRET is not configured')
  }

  const hmac = crypto.createHmac('sha256', VERIFF_API_SECRET)
  hmac.update(data)
  return hmac.digest('hex')
}

/**
 * Parse Veriff webhook payload
 */
export interface VeriffWebhookPayload {
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

export function parseWebhookPayload(body: string): VeriffWebhookPayload {
  try {
    return JSON.parse(body)
  } catch (error) {
    throw new Error('Invalid webhook payload')
  }
}

