# Get Wild Health Insurance Platform

Modern health insurance platform for startups with 20+ employees, featuring zero deductibles, 59-minute claim processing, and comprehensive coverage.

## Features

- **Landing Page**: Beautiful marketing site with company branding
- **Employer Dashboard**: Employee management, billing, and company settings
- **Employee Dashboard**: Coverage details, claim submission, and profile management
- **Internal Admin Dashboard**: Claim processing, analytics, and system administration
- **Stripe Integration**: Automated billing and payment processing
- **Supabase Backend**: Secure authentication and real-time database

## Tech Stack

- **Language**: TypeScript
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **Payment**: Stripe
- **Hosting**: Render
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
ADMIN_PASSWORD=Getwild45real!?
```

## Deployment

This application is configured for deployment on Render. Push to the main branch to trigger automatic deployment.

## License

© 2025 Get Wild. All rights reserved.
