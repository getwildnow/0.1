-- Create invoices table for Stripe payments
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  period_start DATE,
  period_end DATE,
  employee_count INTEGER,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX invoices_company_id_idx ON public.invoices(company_id);
CREATE INDEX invoices_stripe_invoice_id_idx ON public.invoices(stripe_invoice_id);
CREATE INDEX invoices_status_idx ON public.invoices(status);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
-- Company admins can view their own invoices
CREATE POLICY "Company admins can view own invoices" ON public.invoices
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.employees
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Admin users can view all invoices
CREATE POLICY "Admin users can view all invoices" ON public.invoices
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Admin users can manage all invoices
CREATE POLICY "Admin users can manage all invoices" ON public.invoices
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Grant permissions
GRANT ALL ON public.invoices TO authenticated;
GRANT SELECT ON public.invoices TO anon;
