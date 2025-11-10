import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    console.log('[Profile API] Fetching profile for user:', user.id)

    // Get employee data from database
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (employeeError) {
      console.error('[Profile API] Error fetching employee:', employeeError)
      return NextResponse.json(
        { error: 'Failed to fetch employee data' },
        { status: 500 }
      )
    }

    console.log('[Profile API] Employee data:', employee)

    // Combine user metadata and employee data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      },
      employee
    })
  } catch (error: any) {
    console.error('[Profile API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[Profile API] Updating profile for user:', user.id)
    console.log('[Profile API] Update data:', body)

    // Split full name into first and last name
    const nameParts = body.name?.trim().split(' ') || []
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Update employee data
    const { data: employee, error: updateError } = await supabase
      .from('employees')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: body.phone || null,
        date_of_birth: body.dateOfBirth || null,
        address: body.address || null,
        emergency_contact_name: body.emergencyContact || null,
        emergency_contact_phone: body.emergencyPhone || null,
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('[Profile API] Error updating employee:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    console.log('[Profile API] Profile updated successfully')

    return NextResponse.json({
      success: true,
      employee
    })
  } catch (error: any) {
    console.error('[Profile API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

