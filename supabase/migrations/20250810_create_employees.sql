-- Create auth users profiles table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('employee', 'admin', 'owner')),
  phone VARCHAR(50),
  date_of_birth DATE,
  coverage_status VARCHAR(50) DEFAULT 'active' CHECK (coverage_status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, company_id)
);

-- Create indexes
CREATE INDEX employees_company_id_idx ON public.employees(company_id);
CREATE INDEX employees_user_id_idx ON public.employees(user_id);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
-- Employees can view their own data
CREATE POLICY "Employees can view own data" ON public.employees
  FOR SELECT
  USING (auth.uid() = user_id);

-- Employees can update their own basic info
CREATE POLICY "Employees can update own data" ON public.employees
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Company admins can view all employees in their company
CREATE POLICY "Company admins can view company employees" ON public.employees
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.employees
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Company admins can manage employees in their company
CREATE POLICY "Company admins can manage company employees" ON public.employees
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.employees
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Admin users can view all employees
CREATE POLICY "Admin users can view all employees" ON public.employees
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Admin users can manage all employees
CREATE POLICY "Admin users can manage all employees" ON public.employees
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Grant permissions
GRANT ALL ON public.employees TO authenticated;
GRANT SELECT ON public.employees TO anon;
