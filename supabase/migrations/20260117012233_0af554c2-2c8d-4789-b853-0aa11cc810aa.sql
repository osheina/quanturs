-- Add user_id column to travel_guides for ownership tracking
ALTER TABLE public.travel_guides ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.travel_guides;
DROP POLICY IF EXISTS "Allow insert access" ON public.travel_guides;

-- Create new RLS policies that protect user data while allowing premade guides to be public
-- Users can view their own guides OR premade guides
CREATE POLICY "Users can view own guides or premade" 
ON public.travel_guides 
FOR SELECT 
USING (auth.uid() = user_id OR is_premade = true);

-- Only authenticated users can insert their own guides
CREATE POLICY "Authenticated users can create guides" 
ON public.travel_guides 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own guides
CREATE POLICY "Users can update own guides" 
ON public.travel_guides 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own guides
CREATE POLICY "Users can delete own guides" 
ON public.travel_guides 
FOR DELETE 
USING (auth.uid() = user_id);