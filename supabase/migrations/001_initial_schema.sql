-- User profiles (Veriff Identity data)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  veriff_verification_session_id TEXT,
  verification_status TEXT,
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

-- Onboarding config (admin's markdown list)
CREATE TABLE IF NOT EXISTS onboarding_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data_points TEXT[],
  integrations TEXT[],
  actions TEXT[],
  consent_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation state
CREATE TABLE IF NOT EXISTS onboarding_conversations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  veriff_verified BOOLEAN DEFAULT FALSE,
  veriff_data JSONB,
  consent_agreed BOOLEAN DEFAULT FALSE,
  data_points_collected TEXT[],
  integrations_connected TEXT[],
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Collected answers
CREATE TABLE IF NOT EXISTS user_onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_point TEXT NOT NULL,
  value JSONB NOT NULL,
  extracted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connected integrations
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL,
  oauth_token TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration_name)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Consents
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  agreed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO onboarding_config (data_points, integrations, actions, consent_text)
VALUES (
  ARRAY[
    'health goals', 'medications', 'allergies', 'chronic conditions',
    'past surgeries', 'family health history', 'health concerns',
    'exercise frequency', 'diet type', 'sleep quality', 'stress level',
    'work type', 'screen time', 'caffeine use', 'smoking habits',
    'drinking habits', 'work-life balance', 'social support',
    'mental health interest', 'life goals', 'motivation', 'daily routine',
    'income range', 'occupation'
  ],
  ARRAY[
    'apple health', 'google workspace', 'instagram', 'linkedin',
    'strava', 'myfitnesspal', 'spotify', 'twitter'
  ],
  ARRAY['wearable selection'],
  'I agree to the getwild Terms of Service and Privacy Policy and understand how my health data will be used.'
)
ON CONFLICT DO NOTHING;

