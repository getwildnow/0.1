import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient, PRICE_PER_EMPLOYEE, CURRENCY } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { employeeCount, companyId } = body

    if (!employeeCount || employeeCount < 20) {
      return NextResponse.json(
        { error: 'Minimum 20 employees required' },
        { status: 400 }
      )
    }

    // Calculate amount
    const amount = PRICE_PER_EMPLOYEE * employeeCount

    const stripe = getStripeClient()

    if (!stripe) {
      console.error('Stripe secret key is not configured')
      return NextResponse.json(
        { error: 'Checkout is temporarily unavailable' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Get Wild Health Insurance',
              description: `Monthly coverage for ${employeeCount} employees`,
            },
            unit_amount: amount * 100, // Stripe expects cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/employer/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/employer/dashboard/billing?canceled=true`,
      metadata: {
        companyId,
        employeeCount: employeeCount.toString(),
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
