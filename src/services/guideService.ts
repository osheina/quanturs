import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";

export const GUIDE_CITIES = ["Los Angeles", "San Francisco", "San Diego"] as const;
export type GuideCity = (typeof GUIDE_CITIES)[number];
export type GuidePace = "relaxed" | "balanced" | "packed";

export interface GuideRequestInput {
  city: GuideCity;
  days: number;
  pace: GuidePace;
  prompt: string;
  diet?: string | null;
  interests?: string[];
}

export class GuideError extends Error {
  constructor(message: string, public code: string = "error") {
    super(message);
  }
}

/** Calls the authenticated server-side generator. Throws GuideError with a user-facing message. */
export async function generateAIGuide(input: GuideRequestInput): Promise<TravelGuide> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new GuideError("Please sign in to create a personalized guide.", "unauthenticated");

  const { data, error } = await supabase.functions.invoke("generate-itinerary", { body: input });
  if (error) {
    let message = "Could not create your guide. Please try again.";
    let code = "error";
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = await ctx.json();
        if (body?.error) message = String(body.error);
        if (body?.code) code = String(body.code);
      } catch { /* ignore */ }
    }
    throw new GuideError(message, code);
  }
  if (!data?.guide) throw new GuideError("The server returned no guide. Please try again.");
  return data.guide as TravelGuide;
}

/** Read-only: returns premade guides stored in the database. Never inserts. */
export async function fetchPremadeGuides(): Promise<TravelGuide[]> {
  const { data, error } = await supabase
    .from("travel_guides")
    .select("*")
    .eq("is_premade", true)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching premade guides:", error);
    return [];
  }
  return (data ?? []) as TravelGuide[];
}

export async function downloadGuide(id: string): Promise<TravelGuide | null> {
  const { data, error } = await supabase.from("travel_guides").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Error downloading guide:", error);
    return null;
  }
  return (data as TravelGuide) ?? null;
}
