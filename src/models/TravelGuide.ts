
export interface TravelGuide {
  id?: string;
  title: string;
  prompt: string;
  content: string;
  created_at?: string;
  is_premade: boolean;
  image_url?: string;
  description?: string;
}
