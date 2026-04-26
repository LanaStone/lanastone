CREATE TABLE public.lead_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  channel TEXT,
  message TEXT,
  product_ref TEXT
);
ALTER TABLE public.lead_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.lead_requests FOR INSERT TO anon, authenticated WITH CHECK (true);