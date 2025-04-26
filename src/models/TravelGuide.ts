
import { Database } from "@/integrations/supabase/types";

export type TravelGuide = {
  id?: string;
  title: string;
  prompt: string;
  content: string;
  is_premade?: boolean;
  description?: string;
  image_url?: string;
  slug?: string | null;
  created_at?: string;
};
