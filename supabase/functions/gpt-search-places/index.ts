
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { Database } from "../_shared/database.types.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    const { query } = await req.json();
    console.log("gpt-search-places: Received query:", query);

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Search query is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Use GPT-4 to get refined keywords
    const gptPrompt = `You are a search keyword generator for a travel app. The user is searching for: "${query}".
The database has places with 'name', 'type', 'location', 'diet_tags', and 'vibe' attributes.
Based on the user's input, generate a concise array of 2 to 4 specific and effective search keywords. These keywords will be used with OR logic within each keyword search against multiple fields, and AND logic between keywords.
For example:
- Input 'vegan brunch LA', keywords might be ['vegan', 'brunch', 'LA'].
- Input 'eco hotel Malibu', keywords could be ['eco-friendly', 'hotel', 'Malibu'].
- Input 'dog friendly parks downtown', keywords could be ['park', 'downtown', 'pet-friendly'].
Return ONLY a JSON array of strings. e.g., ["keyword1", "keyword2", "keyword3"]`;

    console.log("gpt-search-places: Sending prompt to OpenAI:", gptPrompt);

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: gptPrompt }],
        temperature: 0.2,
        max_tokens: 50,
      }),
    });

    if (!gptResponse.ok) {
      const errorBody = await gptResponse.text();
      console.error("gpt-search-places: OpenAI API error response:", errorBody);
      throw new Error(`OpenAI API error: ${gptResponse.status} ${errorBody}`);
    }

    const gptData = await gptResponse.json();
    console.log("gpt-search-places: OpenAI response data:", JSON.stringify(gptData));

    let keywords: string[] = [];
    if (gptData.choices && gptData.choices[0] && gptData.choices[0].message && gptData.choices[0].message.content) {
      try {
        keywords = JSON.parse(gptData.choices[0].message.content.trim());
        if (!Array.isArray(keywords) || !keywords.every(kw => typeof kw === 'string')) {
          console.warn("gpt-search-places: GPT returned non-array or non-string array, using original query as keyword:", gptData.choices[0].message.content);
          keywords = query.split(/\s+/).filter(t => t.length >= 2).slice(0,5); // Fallback
        }
      } catch (e) {
        console.warn("gpt-search-places: Failed to parse GPT keywords, using original query as keyword:", e.message);
        keywords = query.split(/\s+/).filter(t => t.length >= 2).slice(0,5); // Fallback
      }
    } else {
       console.warn("gpt-search-places: No content in GPT response, using original query as keyword.");
       keywords = query.split(/\s+/).filter(t => t.length >= 2).slice(0,5); // Fallback
    }
    
    console.log("gpt-search-places: Refined keywords from GPT:", keywords);

    if (keywords.length === 0) {
      console.log("gpt-search-places: No keywords generated or query too short, returning empty results.");
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Query Supabase with these keywords
    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    let queryBuilder = supabase.from("quanturs_places").select("*");

    const cleanedTokens = keywords
      .map(token => String(token || "").trim())
      .filter(token => token !== "");

    if (cleanedTokens.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // This creates an AND logic between different keyword-based filter groups.
    // Each group (for each keyword) searches the keyword across multiple fields using OR.
    // Example: (name~kw1 OR type~kw1 OR ...) AND (name~kw2 OR type~kw2 OR ...)
    for (const token of cleanedTokens) {
        const searchPattern = `%${token}%`;
        const orConditions = [
            `name.ilike.${searchPattern}`,
            `type.ilike.${searchPattern}`,
            `location.ilike.${searchPattern}`,
            `diet_tags.ilike.${searchPattern}`,
            `vibe.ilike.${searchPattern}`,
            `notes.ilike.${searchPattern}` // Added notes for broader search
        ].join(',');
        queryBuilder = queryBuilder.or(orConditions);
    }
    
    const { data: places, error: dbError } = await queryBuilder.limit(50);

    if (dbError) {
      console.error("gpt-search-places: Supabase query error:", dbError);
      throw dbError;
    }
    
    console.log("gpt-search-places: Found places:", places?.length || 0);

    return new Response(JSON.stringify(places || []), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("gpt-search-places: Error in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
