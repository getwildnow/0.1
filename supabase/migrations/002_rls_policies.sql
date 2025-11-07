-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearables ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Health records
CREATE POLICY "Users can manage own health records"
  ON health_records FOR ALL
  USING (auth.uid() = user_id);

-- Health goals
CREATE POLICY "Users can manage own health goals"
  ON health_goals FOR ALL
  USING (auth.uid() = user_id);

-- Lifestyle data
CREATE POLICY "Users can manage own lifestyle data"
  ON lifestyle_data FOR ALL
  USING (auth.uid() = user_id);

-- Social media accounts
CREATE POLICY "Users can manage own social media"
  ON social_media_accounts FOR ALL
  USING (auth.uid() = user_id);

-- Integrations
CREATE POLICY "Users can manage own integrations"
  ON integrations FOR ALL
  USING (auth.uid() = user_id);

-- Wearables
CREATE POLICY "Users can manage own wearables"
  ON wearables FOR ALL
  USING (auth.uid() = user_id);

-- Documents
CREATE POLICY "Users can manage own documents"
  ON documents FOR ALL
  USING (auth.uid() = user_id);

-- Consents
CREATE POLICY "Users can manage own consents"
  ON consents FOR ALL
  USING (auth.uid() = user_id);

-- Chat messages
CREATE POLICY "Users can manage own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid() = user_id);

-- Onboarding progress
CREATE POLICY "Users can manage own onboarding progress"
  ON onboarding_progress FOR ALL
  USING (auth.uid() = user_id);

