-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES public.founders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for companies
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Companies RLS Policies
CREATE POLICY "Founders can view own company" ON public.companies
  FOR SELECT
  USING (founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Founders can create own company" ON public.companies
  FOR INSERT
  WITH CHECK (founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Founders can update own company" ON public.companies
  FOR UPDATE
  USING (founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  wearable VARCHAR(100),
  status VARCHAR(50) DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'inactive')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, email)
);

-- Enable RLS on employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for employees
CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Employees RLS Policies
CREATE POLICY "Company founders can view their employees" ON public.employees
  FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Company founders can insert employees" ON public.employees
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Company founders can update their employees" ON public.employees
  FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE founder_id = (SELECT id FROM public.founders WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Employees can view own record" ON public.employees
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Employees can update own record" ON public.employees
  FOR UPDATE
  USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON public.companies TO authenticated;
GRANT SELECT, INSERT ON public.companies TO anon;

GRANT ALL ON public.employees TO authenticated;
GRANT SELECT, INSERT ON public.employees TO anon;

-- Create indexes for performance
CREATE INDEX idx_companies_founder_id ON public.companies(founder_id);
CREATE INDEX idx_employees_company_id ON public.employees(company_id);
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_employees_email ON public.employees(email);
