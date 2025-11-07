-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  employee_count INTEGER NOT NULL CHECK (employee_count >= 20),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'trial',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
-- Company admins can view their own company
CREATE POLICY "Companies can view own data" ON public.companies
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.employees 
      WHERE company_id = companies.id 
      AND role IN ('admin', 'owner')
    )
  );

-- Company admins can update their own company
CREATE POLICY "Companies can update own data" ON public.companies
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.employees 
      WHERE company_id = companies.id 
      AND role IN ('admin', 'owner')
    )
  );

-- Internal dashboard can view all companies (admin users)
CREATE POLICY "Admin users can view all companies" ON public.companies
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Admin users can manage all companies
CREATE POLICY "Admin users can manage all companies" ON public.companies
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Grant permissions
GRANT ALL ON public.companies TO authenticated;
GRANT SELECT ON public.companies TO anon;
