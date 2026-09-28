CREATE TABLE IF NOT EXISTS public.guide_generation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'started',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.guide_generation_requests TO authenticated;
GRANT ALL ON public.guide_generation_requests TO service_role;
ALTER TABLE public.guide_generation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own generation requests" ON public.guide_generation_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own generation requests" ON public.guide_generation_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS guide_generation_requests_user_time_idx
  ON public.guide_generation_requests (user_id, created_at DESC);