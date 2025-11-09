-- ============================================
-- COMPLETE DATABASE SCHEMA FOR EMPLOYEE ONBOARDING v2
-- ============================================
-- IMPORTANT: user_id is TEXT (not UUID) because we use sessionId from Supabase Auth
-- No foreign keys to auth.users - magic link users are managed by Supabase Auth

-- ============================================
-- 1. USER PROFILES (Veriff Identity Data)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  veriff_verification_session_id TEXT,
  verification_status TEXT DEFAULT 'pending',
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  id_number TEXT,
  document_type TEXT,
  veriff_data JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ONBOARDING CONFIG (Admin's Data Points)
-- ============================================
CREATE TABLE IF NOT EXISTS onboarding_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data_points TEXT[],
  integrations TEXT[],
  actions TEXT[],
  consent_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ONBOARDING CONVERSATIONS (State Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS onboarding_conversations (
  user_id TEXT PRIMARY KEY,
  veriff_verified BOOLEAN DEFAULT FALSE,
  veriff_data JSONB,
  consent_agreed BOOLEAN DEFAULT FALSE,
  data_points_collected TEXT[],
  integrations_connected TEXT[],
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- 4. USER ONBOARDING DATA (AI-Collected Answers)
-- ============================================
CREATE TABLE IF NOT EXISTS user_onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  data_point TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, data_point)
);

-- ============================================
-- 5. USER INTEGRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  integration_name TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, integration_name)
);

-- ============================================
-- 6. CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CONSENTS
-- ============================================
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  agreed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_veriff_session ON user_profiles(veriff_verification_session_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_data_user_id ON user_onboarding_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CONFIG TABLE: Allow anyone to read/write
-- (Admin panel needs this)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view config" ON onboarding_config;
CREATE POLICY "Anyone can view config"
  ON onboarding_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update config" ON onboarding_config;
CREATE POLICY "Anyone can update config"
  ON onboarding_config FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert config" ON onboarding_config;
CREATE POLICY "Anyone can insert config"
  ON onboarding_config FOR INSERT
  WITH CHECK (true);

-- ============================================
-- USER-SPECIFIC TABLES: Users can manage their own data
-- (Based on user_id matching auth.uid() or sessionId)
-- ============================================

-- User Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true))
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

-- Onboarding Conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON onboarding_conversations;
CREATE POLICY "Users can view own conversations"
  ON onboarding_conversations FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

DROP POLICY IF EXISTS "Users can insert own conversations" ON onboarding_conversations;
CREATE POLICY "Users can insert own conversations"
  ON onboarding_conversations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

DROP POLICY IF EXISTS "Users can update own conversations" ON onboarding_conversations;
CREATE POLICY "Users can update own conversations"
  ON onboarding_conversations FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true))
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

-- User Onboarding Data
DROP POLICY IF EXISTS "Users can manage own onboarding data" ON user_onboarding_data;
CREATE POLICY "Users can manage own onboarding data"
  ON user_onboarding_data FOR ALL
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

-- User Integrations
DROP POLICY IF EXISTS "Users can manage own integrations" ON user_integrations;
CREATE POLICY "Users can manage own integrations"
  ON user_integrations FOR ALL
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

-- Chat Messages
DROP POLICY IF EXISTS "Users can manage own chat messages" ON chat_messages;
CREATE POLICY "Users can manage own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

-- Consents
DROP POLICY IF EXISTS "Users can manage own consents" ON consents;
CREATE POLICY "Users can manage own consents"
  ON consents FOR ALL
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.session_id', true));

