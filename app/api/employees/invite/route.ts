import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'

interface EmployeeData {
  name: string
  role: string
  email: string
}

interface InviteResult {
  email: string
  success: boolean
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const { employees, companyId } = await request.json()

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json(
        { error: 'Employees array is required' },
        { status: 400 }
      )
    }

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Create admin client for inviting users
    const adminClient = createAdminClient()
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create regular client for inserting employee records
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    const results: InviteResult[] = []

    // Process each employee
    for (const employee of employees) {
      const { name, role, email } = employee

      // Validate employee data
      if (!name || !email) {
        results.push({
          email: email || 'unknown',
          success: false,
          error: 'Name and email are required'
        })
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        results.push({
          email,
          success: false,
          error: 'Invalid email format'
        })
        continue
      }

      try {
        // Check if employee already exists in this company
        const { data: existingEmployee } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId)
          .eq('email', email)
          .single()

        if (existingEmployee) {
          results.push({
            email,
            success: false,
            error: 'Employee already invited to this company'
          })
          continue
        }

        // Invite user via Supabase Auth
        // This creates a user in auth.users and sends an invitation email
        const { data: authData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(
          email,
          {
            data: {
              name,
              role,
              company_id: companyId,
              company_name: company.name
            },
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/employee/onboarding`
          }
        )

        // Check if error is because user already exists in Auth
        if (authError) {
          // If user already exists in Supabase Auth, that's okay - we can still create the employee record
          if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
            // User exists in Auth, try to get their ID and create employee record
            const { data: existingUser } = await adminClient.auth.admin.listUsers()
            const user = existingUser.users.find(u => u.email === email)
            
            if (user) {
              // Create employee record with existing user ID
              const { error: employeeError } = await supabase
                .from('employees')
                .insert({
                  user_id: user.id,
                  company_id: companyId,
                  name,
                  role: role || null,
                  email,
                  status: 'invited',
                  invited_at: new Date().toISOString()
                })

              if (employeeError) {
                results.push({
                  email,
                  success: false,
                  error: employeeError.message
                })
                continue
              }

              results.push({
                email,
                success: true
              })
              continue
            }
          }
          
          // Other auth errors
          results.push({
            email,
            success: false,
            error: authError.message
          })
          continue
        }

        // Create employee record in our database
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            user_id: authData.user?.id || null,
            company_id: companyId,
            name,
            role: role || null,
            email,
            status: 'invited',
            invited_at: new Date().toISOString()
          })

        if (employeeError) {
          results.push({
            email,
            success: false,
            error: employeeError.message
          })
          continue
        }

        results.push({
          email,
          success: true
        })

      } catch (err: any) {
        results.push({
          email,
          success: false,
          error: err.message || 'Failed to invite employee'
        })
      }
    }

    // Calculate summary
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      },
      results
    })

  } catch (error: any) {
    console.error('Employee invitation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process invitations' },
      { status: 500 }
    )
  }
}
