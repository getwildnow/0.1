import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface EmployeeData {
  name: string
  role?: string
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

    const adminClient = createAdminClient()
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const admin = adminClient as any

    const { data: company, error: companyError } = await admin
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .maybeSingle()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    const results: InviteResult[] = []

    for (const employee of employees as EmployeeData[]) {
      const name = employee?.name?.trim()
      const role = employee?.role?.trim()
      const email = employee?.email?.trim()

      if (!name || !email) {
        results.push({
          email: email || 'unknown',
          success: false,
          error: 'Name and email are required'
        })
        continue
      }

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
        const { data: existingEmployee } = await admin
          .from('employees')
          .select('id, user_id')
          .eq('company_id', companyId)
          .eq('email', email)
          .maybeSingle()

        const existingEmployeeRecord = (existingEmployee ?? null) as
          | { id: string; user_id: string | null }
          | null

        // Send invite with redirect to auth callback, which will then redirect to dashboard
        const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/employee/dashboard`
        console.log(`[Invite] Sending invitation to ${email} with redirect: ${redirectUrl}`)

        console.log(`[Invite] Creating user with metadata:`, { name, role, company_id: companyId, company_name: company.name })
        
        const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(
          email,
          {
            data: {
              name,
              role,
              company_id: companyId,
              company_name: company.name
            },
            redirectTo: redirectUrl
          }
        )
        
        console.log(`[Invite] User created/invited. User ID:`, authData?.user?.id)
        console.log(`[Invite] User metadata saved:`, authData?.user?.user_metadata)

        let userId = authData?.user?.id || existingEmployeeRecord?.user_id || null

        if (authError) {
          console.error(`[Invite] Auth error for ${email}:`, authError.message)
          const message = authError.message.toLowerCase()
          const alreadyRegistered =
            message.includes('already registered') || message.includes('already been registered')

          if (alreadyRegistered) {
            console.log(`[Invite] User ${email} already registered, re-inviting...`)
            const { data: existingUsers } = await admin.auth.admin.listUsers()
            const foundUser = existingUsers?.users?.find(
              (u: any) => u.email?.toLowerCase() === email.toLowerCase()
            )
            if (foundUser) {
              userId = foundUser.id
              console.log(`[Invite] Found existing user ${email} with ID: ${userId}`)
            }
          } else {
            results.push({
              email,
              success: false,
              error: authError.message
            })
            continue
          }
        } else {
          console.log(`[Invite] Successfully sent invitation to ${email}`)
        }

        const payload = {
          user_id: userId,
          company_id: companyId,
          name,
          role: role || null,
          email,
          status: 'invited',
          invited_at: new Date().toISOString()
        }

        if (existingEmployeeRecord) {
          const { error: updateError } = await admin
            .from('employees')
            .update(payload)
            .eq('id', existingEmployeeRecord.id)

          if (updateError) {
            results.push({
              email,
              success: false,
              error: updateError.message
            })
            continue
          }
        } else {
          const { error: insertError } = await admin
            .from('employees')
            .insert(payload)

          if (insertError) {
            results.push({
              email,
              success: false,
              error: insertError.message
            })
            continue
          }
        }

        results.push({ email, success: true })
      } catch (err: any) {
        results.push({
          email,
          success: false,
          error: err.message || 'Failed to invite employee'
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

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
