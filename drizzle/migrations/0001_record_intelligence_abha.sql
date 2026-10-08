-- AI record intelligence: OCR extraction + plain-language summaries
ALTER TABLE public.health_records
  ADD COLUMN IF NOT EXISTS extracted_data jsonb,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS summary_language text DEFAULT 'en';

-- ABDM/ABHA readiness: mock ABHA ID on the profile
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS abha_id text;

-- Users can only read/write their own documents (folder = their user id)
CREATE POLICY "Users can upload own health documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'health-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own health documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'health-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own health documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'health-documents' AND (storage.foldername(name))[1] = auth.uid()::text);