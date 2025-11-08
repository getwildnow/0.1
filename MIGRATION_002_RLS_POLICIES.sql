-- ============================================
-- MIGRATION 002: Row Level Security (RLS)
-- ============================================
-- IMPORTANT: We use service role client for webhooks, so RLS is mainly for client-side protection

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Config table: Allow anyone to read/write
-- (Admin panel needs this)
-- ============================================
CREATE POLICY "Anyone can view config"
  ON onboarding_config FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update config"
  ON onboarding_config FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert config"
  ON onboarding_config FOR INSERT
  WITH CHECK (true);

-- ============================================
-- NOTE: Other tables don't need policies
-- because we use service role client (bypasses RLS)
-- in all API routes (/api/onboarding/chat, /api/webhooks/veriff, etc.)
-- ============================================

