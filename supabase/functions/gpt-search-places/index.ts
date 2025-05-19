
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Using the generally recommended import for supabase-js v2 in Deno
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

    // Updated prompt logic
    let gptPrompt = "";
    const lowerCaseQuery = query.trim().toLowerCase();

    if (lowerCaseQuery === "healthy") {
      gptPrompt = `You are a search keyword generator for a travel app. The user is searching for: "${query}".
The database has places with 'diet_tags' that can include "vegan", "keto", "organic".
The user's query is "healthy". Your goal is to help them find places with relevant dietary tags.
Generate a JSON array containing *one* of the following specific keyword arrays: ["vegan"], ["keto"], or ["organic"]. Choose the one most likely to yield results or cycle through them if this function were called repeatedly (but for a single call, pick one).
Example: ["vegan"] or ["keto"]. Return ONLY the JSON array.`;
    } else {
      gptPrompt = `You are a search keyword generator for a travel app. The user is searching for: "${query}".
The database has places with 'name', 'type', 'location', 'city', 'diet_tags', 'vibe', and 'notes' attributes. These attributes are primarily in English.
This search functionality ONLY supports English queries.
If the user's query is **not in English**, return an empty JSON array: [].
If the query **is in English** (and not just "healthy" which is handled by a different logic), generate a concise array of 2 to 4 specific and effective English search keywords.
The goal is to find relevant places. **Consider that database descriptions might use common related terms, broader categories, or handle common misspellings. For example, if a part of the query is 'healthy food spot', keywords might be ['healthy', 'food', 'restaurant', 'vegan options'].**
For example:
- Input: 'vegan brunch LA', keywords might be ['vegan', 'brunch', 'LA'].
- Input: 'eco hotel Malibu', keywords could be ['eco-friendly', 'hotel', 'Malibu'].
Return ONLY a JSON array of strings. e.g., ["keyword1", "keyword2", "keyword3"] or [] if not in English.`;
    }

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
        max_tokens: 60,
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
        const rawContent = gptData.choices[0].message.content.trim();
        // Ensure it's valid JSON and an array of strings
        const parsedContent = JSON.parse(rawContent);
        if (Array.isArray(parsedContent) && parsedContent.every(kw => typeof kw === 'string')) {
            keywords = parsedContent;
        } else {
            console.warn("gpt-search-places: GPT returned non-array or non-string array. Raw:", rawContent);
            // Fallback for non-healthy query if parsing failed for some reason
            if (lowerCaseQuery !== "healthy") {
                const isLikelyEnglish = /^[a-zA-Z0-9\s.,'-]+$/.test(query);
                if (isLikelyEnglish) {
                    keywords = query.split(/\s+/).filter(t => t.length >= 1).slice(0,5);
                } else {
                    keywords = [];
                }
            } else {
                keywords = []; // For "healthy" query, if parsing fails, return no keywords to avoid issues
            }
        }
      } catch (e) {
        console.warn("gpt-search-places: Failed to parse GPT keywords. Error:", e.message, "Raw content:", gptData.choices[0].message.content);
         // Fallback for non-healthy query
        if (lowerCaseQuery !== "healthy") {
            const isLikelyEnglish = /^[a-zA-Z0-9\s.,'-]+$/.test(query);
            if (isLikelyEnglish) {
               keywords = query.split(/\s+/).filter(t => t.length >= 1).slice(0,5);
            } else {
               keywords = [];
            }
        } else {
            keywords = []; // For "healthy" query, if parsing fails, return no keywords
        }
      }
    } else {
       console.warn("gpt-search-places: No content in GPT response.");
        // Fallback for non-healthy query
       if (lowerCaseQuery !== "healthy") {
           const isLikelyEnglish = /^[a-zA-Z0-9\s.,'-]+$/.test(query);
           if (isLikelyEnglish) {
              keywords = query.split(/\s+/).filter(t => t.length >= 1).slice(0,5);
           } else {
              keywords = [];
           }
       } else {
           keywords = []; // For "healthy" query, if no content, return no keywords
       }
    }
    
    console.log("gpt-search-places: Refined keywords from GPT:", keywords);

    if (keywords.length === 0) {
      console.log("gpt-search-places: No keywords generated, returning empty results.");
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    
    // Cleaned tokens are already handled by GPT generating an array of strings.
    // Ensure they are lowercase just in case.
    const cleanedTokens = keywords.map(token => String(token || "").trim().toLowerCase()).filter(token => token !== "");

    if (cleanedTokens.length === 0) {
      console.log("gpt-search-places: No valid cleaned tokens after final processing, returning empty results.");
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("gpt-search-places: Calling RPC search_places_by_keywords with tokens:", cleanedTokens);
    const { data: places, error: dbError } = await supabase.rpc(
      "search_places_by_keywords",
      { search_keywords: cleanedTokens }
    );

    if (dbError) {
      console.error("gpt-search-places: Supabase RPC error:", dbError);
      throw dbError;
    }
    
    console.log("gpt-search-places: Found places via RPC:", places?.length || 0);

    return new Response(JSON.stringify(places || []), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("gpt-search-places: Error in Edge Function:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
