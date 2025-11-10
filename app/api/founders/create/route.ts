import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, name, company_name } = await request.json()

    if (!email || !name || !company_name) {
      return NextResponse.json(
        { error: 'Email, name, and company name are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create founder
    const { data: founder, error: founderError } = await supabase
      .from('founders')
      .insert({ email, name, company_name })
      .select()
      .single()

    if (founderError) {
      return NextResponse.json({ error: founderError.message }, { status: 400 })
    }

    // Create company for the founder
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({ 
        founder_id: founder.id, 
        name: company_name 
      })
      .select()
      .single()

    if (companyError) {
      // Rollback: delete the founder if company creation fails
      await supabase.from('founders').delete().eq('id', founder.id)
      return NextResponse.json({ error: companyError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      founder, 
      company 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create founder' },
      { status: 500 }
    )
  }
}

