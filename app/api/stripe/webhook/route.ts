import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

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
