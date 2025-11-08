-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Config is readable by all authenticated users (for now)
CREATE POLICY "Authenticated users can view config"
  ON onboarding_config FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can update config (you'll need to add admin role check)
CREATE POLICY "Admin can update config"
  ON onboarding_config FOR UPDATE
  USING (true); -- TODO: Add admin check

-- Users can manage own conversation
CREATE POLICY "Users can manage own conversation"
  ON onboarding_conversations FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage own onboarding data
CREATE POLICY "Users can manage own onboarding data"
  ON user_onboarding_data FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage own integrations
CREATE POLICY "Users can manage own integrations"
  ON user_integrations FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage own chat messages
CREATE POLICY "Users can manage own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage own consents
CREATE POLICY "Users can manage own consents"
  ON consents FOR ALL
  USING (auth.uid() = user_id);

