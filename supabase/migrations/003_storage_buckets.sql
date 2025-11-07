-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('identity-documents', 'identity-documents', false),
  ('profile-photos', 'profile-photos', false),
  ('health-documents', 'health-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for identity-documents
CREATE POLICY "Users can upload own identity documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'identity-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own identity documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'identity-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for profile-photos
CREATE POLICY "Users can upload own profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own profile photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for health-documents
CREATE POLICY "Users can upload own health documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'health-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own health documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'health-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

