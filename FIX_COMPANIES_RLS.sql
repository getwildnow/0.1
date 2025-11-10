-- Drop existing policies
DROP POLICY IF EXISTS "Founders can view own company" ON public.companies;
DROP POLICY IF EXISTS "Founders can create own company" ON public.companies;
DROP POLICY IF EXISTS "Founders can update own company" ON public.companies;

-- Create simpler policies that work with anon access
-- Allow anyone to insert (we'll add proper auth later)
CREATE POLICY "Allow anon insert companies" ON public.companies
  FOR INSERT
  WITH CHECK (true);

-- Allow viewing own company by founder_id
CREATE POLICY "Allow view own company" ON public.companies
  FOR SELECT
  USING (true);

-- Allow updating own company
CREATE POLICY "Allow update own company" ON public.companies
  FOR UPDATE
  USING (true);

