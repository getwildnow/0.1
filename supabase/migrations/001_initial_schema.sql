-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'employee',
  company_id UUID,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  dob DATE,
  address TEXT,
  phone TEXT,
  emergency_contact JSONB,
  profile_photo_url TEXT,
  income_range TEXT,
  occupation TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health records
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  medications TEXT[],
  allergies TEXT[],
  chronic_conditions TEXT[],
  surgeries TEXT[],
  family_history JSONB,
  smoking TEXT,
  drinking TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health goals
CREATE TABLE IF NOT EXISTS health_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goals_text TEXT,
  daily_routine TEXT,
  health_concerns TEXT,
  dream_scenario TEXT,
  what_makes_best TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lifestyle data
CREATE TABLE IF NOT EXISTS lifestyle_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_frequency TEXT,
  diet_type TEXT,
  sleep_quality TEXT,
  stress_level TEXT,
  work_type TEXT,
  screen_time TEXT,
  caffeine_use TEXT,
  work_life_balance TEXT,
  social_support TEXT,
  mental_health_interest BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT,
  oauth_token TEXT,
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  connection_status TEXT DEFAULT 'pending',
  oauth_token TEXT,
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wearables
CREATE TABLE IF NOT EXISTS wearables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_type TEXT,
  connection_status TEXT DEFAULT 'pending',
  shipping_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consents
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  given_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding progress
CREATE TABLE IF NOT EXISTS onboarding_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

