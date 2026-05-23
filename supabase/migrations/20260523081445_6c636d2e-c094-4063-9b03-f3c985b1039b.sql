-- Make tryon bucket private
UPDATE storage.buckets SET public = false WHERE id = 'tryon';

-- Drop overly permissive public read policy
DROP POLICY IF EXISTS "Public read tryon" ON storage.objects;

-- Restrict reads to the owner (folder name = user id), matching insert/update/delete policies
CREATE POLICY "Users read own tryon"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tryon'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);