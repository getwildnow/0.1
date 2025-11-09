import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export const getStripeClient = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return null
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-10-29.clover',
    })
  }

  return stripeClient
}

export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
}

// Product pricing - $750 per employee per month
export const PRICE_PER_EMPLOYEE = 750
export const CURRENCY = 'usd'
