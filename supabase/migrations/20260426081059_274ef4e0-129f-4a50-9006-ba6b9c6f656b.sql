DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.lead_requests;
CREATE POLICY "Public can submit valid leads" ON public.lead_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 100
    AND char_length(btrim(contact)) BETWEEN 1 AND 200
    AND (message IS NULL OR char_length(message) <= 2000)
    AND (product_ref IS NULL OR char_length(product_ref) <= 200)
    AND (channel IS NULL OR channel IN ('whatsapp','telegram','phone','email','any'))
  );