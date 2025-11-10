import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    // Get employee verification status
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('veriff_status, veriff_decision_time, verification_completed_at')
      .eq('user_id', user.id)
      .single()

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: 'Employee record not found' },
        { status: 404 }
      )
    }

    const employeeData = employee as any

    return NextResponse.json({
      status: employeeData.veriff_status || 'not_started',
      decisionTime: employeeData.veriff_decision_time,
      completedAt: employeeData.verification_completed_at,
    })
  } catch (error: any) {
    console.error('[Veriff] Error checking status:', error)
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    )
  }
}

