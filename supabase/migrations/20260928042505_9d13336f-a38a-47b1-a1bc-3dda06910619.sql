CREATE OR REPLACE FUNCTION public.reserve_guide_generation()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  uid uuid := auth.uid();
  n_hour int;
  n_day int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '28000';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('guide_gen:' || uid::text, 0));
  SELECT count(*) FILTER (WHERE created_at > now() - interval '1 hour'),
         count(*)
    INTO n_hour, n_day
    FROM public.guide_generation_requests
   WHERE user_id = uid AND created_at > now() - interval '1 day';
  IF n_hour >= 5 THEN RETURN 'hour_limit'; END IF;
  IF n_day >= 20 THEN RETURN 'day_limit'; END IF;
  INSERT INTO public.guide_generation_requests (user_id, created_at) VALUES (uid, now());
  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_guide_generation() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reserve_guide_generation() TO authenticated;

DROP POLICY IF EXISTS "Users insert own generation requests" ON public.guide_generation_requests;
REVOKE INSERT, UPDATE, DELETE ON public.guide_generation_requests FROM authenticated;

DROP POLICY IF EXISTS "Authenticated users can create guides" ON public.travel_guides;
DROP POLICY IF EXISTS "Users can update own guides" ON public.travel_guides;
CREATE POLICY "Users can create own private guides" ON public.travel_guides
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND coalesce(is_premade, false) = false);
CREATE POLICY "Users can update own private guides" ON public.travel_guides
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND coalesce(is_premade, false) = false)
  WITH CHECK (auth.uid() = user_id AND coalesce(is_premade, false) = false);