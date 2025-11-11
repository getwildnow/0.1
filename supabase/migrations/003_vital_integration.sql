-- Vital Health Data Integration
-- This migration adds tables for storing Vital user connections and health data

-- Table: vital_users
-- Links Supabase users to their Vital user IDs
CREATE TABLE IF NOT EXISTS vital_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vital_user_id TEXT NOT NULL UNIQUE,
  vital_user_key TEXT,
  team_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table: vital_connections
-- Stores connected health providers (Fitbit, Apple Health, etc.)
CREATE TABLE IF NOT EXISTS vital_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vital_user_id TEXT NOT NULL,
  source_id INTEGER NOT NULL,
  provider_name TEXT NOT NULL,
  provider_slug TEXT NOT NULL,
  status TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (vital_user_id) REFERENCES vital_users(vital_user_id) ON DELETE CASCADE,
  UNIQUE(vital_user_id, source_id)
);

-- Table: vital_health_data
-- Cached health data from Vital API
CREATE TABLE IF NOT EXISTS vital_health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vital_user_id TEXT NOT NULL,
  data_type TEXT NOT NULL, -- activity, sleep, body, workouts, etc.
  date DATE NOT NULL,
  data JSONB NOT NULL,
  source_provider TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (vital_user_id) REFERENCES vital_users(vital_user_id) ON DELETE CASCADE,
  UNIQUE(vital_user_id, data_type, date)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vital_users_user_id ON vital_users(user_id);
CREATE INDEX IF NOT EXISTS idx_vital_users_vital_user_id ON vital_users(vital_user_id);
CREATE INDEX IF NOT EXISTS idx_vital_connections_vital_user_id ON vital_connections(vital_user_id);
CREATE INDEX IF NOT EXISTS idx_vital_health_data_vital_user_id ON vital_health_data(vital_user_id);
CREATE INDEX IF NOT EXISTS idx_vital_health_data_date ON vital_health_data(date);
CREATE INDEX IF NOT EXISTS idx_vital_health_data_type ON vital_health_data(data_type);

-- RLS Policies
ALTER TABLE vital_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_health_data ENABLE ROW LEVEL SECURITY;

-- Users can only see their own Vital data
CREATE POLICY "Users can view their own Vital user"
  ON vital_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Vital user"
  ON vital_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Vital user"
  ON vital_users FOR UPDATE
  USING (auth.uid() = user_id);

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON vital_connections FOR SELECT
  USING (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own connections"
  ON vital_connections FOR INSERT
  WITH CHECK (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own connections"
  ON vital_connections FOR UPDATE
  USING (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

-- Health data policies
CREATE POLICY "Users can view their own health data"
  ON vital_health_data FOR SELECT
  USING (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own health data"
  ON vital_health_data FOR INSERT
  WITH CHECK (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own health data"
  ON vital_health_data FOR UPDATE
  USING (
    vital_user_id IN (
      SELECT vital_user_id FROM vital_users WHERE user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on vital_users
CREATE TRIGGER update_vital_users_updated_at
  BEFORE UPDATE ON vital_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



