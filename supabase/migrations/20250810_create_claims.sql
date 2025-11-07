-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  claim_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'denied', 'paid')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.admin_users(id),
  processing_notes TEXT,
  payment_method VARCHAR(50),
  payment_details JSONB,
  documents JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX claims_employee_id_idx ON public.claims(employee_id);
CREATE INDEX claims_company_id_idx ON public.claims(company_id);
CREATE INDEX claims_status_idx ON public.claims(status);
CREATE INDEX claims_submitted_at_idx ON public.claims(submitted_at DESC);

-- Enable RLS
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
-- Employees can view their own claims
CREATE POLICY "Employees can view own claims" ON public.claims
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.employees
      WHERE user_id = auth.uid()
    )
  );

-- Employees can create their own claims
CREATE POLICY "Employees can create own claims" ON public.claims
  FOR INSERT
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees
      WHERE user_id = auth.uid()
    )
  );

-- Company admins can view all claims in their company
CREATE POLICY "Company admins can view company claims" ON public.claims
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.employees
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Admin users can view all claims
CREATE POLICY "Admin users can view all claims" ON public.claims
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Admin users can manage all claims
CREATE POLICY "Admin users can manage all claims" ON public.claims
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Grant permissions
GRANT ALL ON public.claims TO authenticated;
GRANT SELECT ON public.claims TO anon;
