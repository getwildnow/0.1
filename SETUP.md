# Get Wild - Setup Instructions

## Complete Application Structure
This is a unified Next.js application containing:
- **Landing Page** (`/`)
- **Sign Up Flow** (`/signup`)
- **Founder Dashboard** (`/employer/dashboard`)
- **Employee Dashboard** (`/employee/dashboard`)
- **Admin Dashboard** (`/admin/dashboard`)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Database

Go to your Supabase SQL Editor:
https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/sql/new

Run this SQL to create the founders table:

```sql
-- Create founders table
CREATE TABLE public.founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER founders_updated_at
  BEFORE UPDATE ON public.founders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
CREATE POLICY "Anyone can sign up" ON public.founders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Founders can view own data" ON public.founders
  FOR SELECT
  USING (true);

CREATE POLICY "Founders can update own data" ON public.founders
  FOR UPDATE
  USING (true);

-- Grant permissions
GRANT ALL ON public.founders TO authenticated;
GRANT SELECT, INSERT ON public.founders TO anon;
```

### 3. Environment Variables

The `.env.local` file is already configured with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL`

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## User Flow

1. **Landing Page** → Click "Sign Up"
2. **Step 1**: Enter email
3. **Step 2**: Enter name + company name
4. **Dashboard**: Redirected to founder dashboard

## Current Branch

**`getwild-app`** - Contains the complete application

## Notes

- No email verification yet (coming later with magic links)
- Dashboard access uses localStorage (temporary auth)
- All dashboards are accessible at:
  - `/employer/dashboard` - Founder/Employer view
  - `/employee/dashboard` - Employee view
  - `/admin/dashboard` - Admin view

