# getwild Prime Care - Employee Onboarding System

Complete employee onboarding flow for health insurance platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

3. Run development server:
```bash
npm run dev
```

## Database Setup

Run the Supabase migrations in `/supabase/migrations/` to set up all tables and RLS policies.

## Features

- 12-step onboarding flow
- Data collection (health, lifestyle, integrations)
- OAuth integrations (Google, Instagram, LinkedIn, etc.)
- Chat-based dashboard
- Progress persistence
- Mobile-responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Database + Auth)
- Tailwind CSS
- React Hook Form + Zod

