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
-- Allow anyone to insert (sign up)
CREATE POLICY "Anyone can sign up" ON public.founders
  FOR INSERT
  WITH CHECK (true);

-- Founders can view their own data
CREATE POLICY "Founders can view own data" ON public.founders
  FOR SELECT
  USING (true);

-- Founders can update their own data
CREATE POLICY "Founders can update own data" ON public.founders
  FOR UPDATE
  USING (true);

-- Grant permissions
GRANT ALL ON public.founders TO authenticated;
GRANT SELECT, INSERT ON public.founders TO anon;

