-- Create admin_users table for internal Get Wild team
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'support' CHECK (role IN ('support', 'manager', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
-- Admin users can view their own profile
CREATE POLICY "Admin users can view own profile" ON public.admin_users
  FOR SELECT
  USING (auth.uid() = id);

-- Super admins can view all admin users
CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
      WHERE role = 'super_admin'
    )
  );

-- Super admins can manage all admin users
CREATE POLICY "Super admins can manage all admin users" ON public.admin_users
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
      WHERE role = 'super_admin'
    )
  );

-- Create admin session tracking table
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users can view their own sessions
CREATE POLICY "Admin users can view own sessions" ON public.admin_sessions
  FOR SELECT
  USING (
    admin_user_id = auth.uid()
  );

-- Create password verification function for internal dashboard
CREATE OR REPLACE FUNCTION public.verify_admin_password(input_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Compare with the hardcoded password
  -- In production, this should be hashed and stored securely
  RETURN input_password = 'Getwild45real!?';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO authenticated;
