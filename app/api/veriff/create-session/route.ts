import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createVeriffSession } from '@/lib/veriff'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(`[Veriff] Creating session for user: ${user.id}`)

    // Get employee record
    const adminClient = createAdminClient()
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const admin = adminClient as any

    const { data: employee, error: employeeError } = await admin
      .from('employees')
      .select('id, name, email, veriff_session_id, veriff_status, veriff_attempts')
      .eq('user_id', user.id)
      .single()

    if (employeeError || !employee) {
      console.error('[Veriff] Employee not found:', employeeError)
      return NextResponse.json(
        { error: 'Employee record not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (employee.veriff_status === 'approved') {
      console.log(`[Veriff] Employee ${employee.id} already verified`)
      return NextResponse.json(
        { error: 'Already verified', alreadyVerified: true },
        { status: 400 }
      )
    }

    // Check attempt limit (max 3 attempts)
    if (employee.veriff_attempts >= 3) {
      console.error(`[Veriff] Employee ${employee.id} exceeded attempt limit`)
      return NextResponse.json(
        { error: 'Maximum verification attempts exceeded. Please contact support.' },
        { status: 400 }
      )
    }

    // Parse employee name
    const nameParts = employee.name.trim().split(' ')
    const firstName = nameParts[0] || 'Employee'
    const lastName = nameParts.slice(1).join(' ') || 'User'

    console.log(`[Veriff] Creating session for: ${firstName} ${lastName}`)

    // Create Veriff session
    const veriffSession = await createVeriffSession({
      personFirstName: firstName,
      personLastName: lastName,
      vendorData: employee.id, // Use employee ID for tracking
    })

    console.log(`[Veriff] Session created: ${veriffSession.verification.id}`)

    // Update employee record with session ID
    const { error: updateError } = await admin
      .from('employees')
      .update({
        veriff_session_id: veriffSession.verification.id,
        veriff_status: 'pending',
        veriff_attempts: (employee.veriff_attempts || 0) + 1,
      })
      .eq('id', employee.id)

    if (updateError) {
      console.error('[Veriff] Failed to update employee:', updateError)
      // Don't fail the request, session was created
    }

    // Return session URL to frontend
    return NextResponse.json({
      success: true,
      sessionUrl: veriffSession.verification.url,
      sessionId: veriffSession.verification.id,
    })
  } catch (error: any) {
    console.error('[Veriff] Error creating session:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to create verification session',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

