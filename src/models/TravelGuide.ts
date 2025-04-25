import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";

/* ---------- AI generator (mock) ---------- */
export async function generateAIGuide(prompt: string): Promise<TravelGuide | null> {
  try {
    const guideTitle =
      `Guide for: ${prompt.slice(0, 30)}${prompt.length > 30 ? "…" : ""}`;

    // simplified: always Los Angeles logic omitted for brevity …

    /* --- build content object (like before) --- */
    const contentObj = {/* ... same as before ... */};
    const newGuide: TravelGuide = {
      slug: null,                 // custom guides have no slug
      title: guideTitle,
      prompt,
      content: JSON.stringify(contentObj),
      is_premade: false,
      description: `Personalized eco-friendly itinerary based on: “${prompt}”`
    };

    const { data, error } = await supabase
      .from("travel_guides")
      .insert(newGuide)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("generateAIGuide:", e);
    return null;
  }
}

/* ---------- premade guides ---------- */
export async function fetchPremadeGuides(): Promise<TravelGuide[]> {
  try {
    // try cache
    const { data: existing, error } = await supabase
      .from("travel_guides")
      .select("*")
      .eq("is_premade", true);
    if (error) throw error;
    return existing || [];
  } catch (e) {
    console.error("fetchPremadeGuides:", e);
    return [];
  }
}

/* ---------- download by id or slug ---------- */
export async function downloadGuide(idOrSlug: string): Promise<TravelGuide | null> {
  try {
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const { data, error } = await supabase
      .from("travel_guides")
      .select("*")
      .or(uuidRe.test(idOrSlug)
           ? `id.eq.${idOrSlug}`
           : `slug.eq.${idOrSlug}`)
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error("downloadGuide:", e);
    return null;
  }
}

