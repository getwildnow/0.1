import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripeClient } from '@/lib/stripe'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not configured')
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured' },
      { status: 500 }
    )
  }

  const stripe = getStripeClient()

  if (!stripe) {
    console.error('Stripe secret key is not configured')
    return NextResponse.json(
      { error: 'Stripe secret key is not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature header' },
      { status: 400 }
    )
  }

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createAdminSupabaseClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { companyId, employeeCount } = session.metadata

      // Update company with Stripe customer ID and subscription status
      await (supabase
        .from('companies')
        .update as any)({
          stripe_customer_id: session.customer as string,
          subscription_status: 'active',
          employee_count: parseInt(employeeCount),
        })
        .eq('id', companyId)

      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object
      
      // Create invoice record
      await (supabase.from('invoices').insert as any)({
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_paid / 100, // Convert from cents
        status: 'paid',
        paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
        invoice_url: invoice.hosted_invoice_url,
      })

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer

      // Update company subscription status
      const status = subscription.status === 'active' ? 'active' : 
                     subscription.status === 'past_due' ? 'past_due' : 
                     'canceled'

      await (supabase
        .from('companies')
        .update as any)({ subscription_status: status })
        .eq('stripe_customer_id', customerId)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer

      // Mark subscription as canceled
      await (supabase
        .from('companies')
        .update as any)({ subscription_status: 'canceled' })
        .eq('stripe_customer_id', customerId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
