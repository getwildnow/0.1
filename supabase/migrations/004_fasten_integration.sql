-- Fasten Health Clinical Data Integration
-- This migration adds tables for storing Fasten user connections and clinical data

-- Table: fasten_users
-- Links Supabase users to their Fasten user IDs
CREATE TABLE IF NOT EXISTS fasten_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fasten_user_id TEXT NOT NULL UNIQUE,
  fasten_patient_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table: fasten_connections
-- Stores connected medical record sources (Epic, Cerner, etc.)
CREATE TABLE IF NOT EXISTS fasten_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fasten_user_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  status TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (fasten_user_id) REFERENCES fasten_users(fasten_user_id) ON DELETE CASCADE,
  UNIQUE(fasten_user_id, source_id)
);

-- Table: fasten_clinical_data
-- Cached clinical data from Fasten API
CREATE TABLE IF NOT EXISTS fasten_clinical_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fasten_user_id TEXT NOT NULL,
  data_type TEXT NOT NULL, -- medications, labs, conditions, procedures, etc.
  data JSONB NOT NULL,
  source_name TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (fasten_user_id) REFERENCES fasten_users(fasten_user_id) ON DELETE CASCADE,
  UNIQUE(fasten_user_id, data_type)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fasten_users_user_id ON fasten_users(user_id);
CREATE INDEX IF NOT EXISTS idx_fasten_users_fasten_user_id ON fasten_users(fasten_user_id);
CREATE INDEX IF NOT EXISTS idx_fasten_connections_fasten_user_id ON fasten_connections(fasten_user_id);
CREATE INDEX IF NOT EXISTS idx_fasten_clinical_data_fasten_user_id ON fasten_clinical_data(fasten_user_id);
CREATE INDEX IF NOT EXISTS idx_fasten_clinical_data_type ON fasten_clinical_data(data_type);

-- RLS Policies
ALTER TABLE fasten_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasten_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasten_clinical_data ENABLE ROW LEVEL SECURITY;

-- Users can only see their own Fasten data
CREATE POLICY "Users can view their own Fasten user"
  ON fasten_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Fasten user"
  ON fasten_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Fasten user"
  ON fasten_users FOR UPDATE
  USING (auth.uid() = user_id);

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON fasten_connections FOR SELECT
  USING (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own connections"
  ON fasten_connections FOR INSERT
  WITH CHECK (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own connections"
  ON fasten_connections FOR UPDATE
  USING (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

-- Clinical data policies
CREATE POLICY "Users can view their own clinical data"
  ON fasten_clinical_data FOR SELECT
  USING (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own clinical data"
  ON fasten_clinical_data FOR INSERT
  WITH CHECK (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own clinical data"
  ON fasten_clinical_data FOR UPDATE
  USING (
    fasten_user_id IN (
      SELECT fasten_user_id FROM fasten_users WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at on fasten_users
CREATE TRIGGER update_fasten_users_updated_at
  BEFORE UPDATE ON fasten_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



