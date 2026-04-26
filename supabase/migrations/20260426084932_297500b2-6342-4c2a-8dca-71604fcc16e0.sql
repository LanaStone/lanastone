-- Storage bucket for try-on results and uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('tryon', 'tryon', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for try-on images
CREATE POLICY "Public read tryon"
ON storage.objects FOR SELECT
USING (bucket_id = 'tryon');

-- Authenticated users can upload to their own folder
CREATE POLICY "Users upload own tryon"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tryon' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own tryon"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tryon' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own tryon"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tryon' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Try-on results gallery
CREATE TABLE public.tryon_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT,
  source_image_url TEXT NOT NULL,
  result_image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tryon_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tryon results"
ON public.tryon_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own tryon results"
ON public.tryon_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own tryon results"
ON public.tryon_results FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_tryon_results_user ON public.tryon_results(user_id, created_at DESC);