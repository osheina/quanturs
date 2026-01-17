import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log("generate-guide-images: Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Verify user token
    const userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.log("generate-guide-images: Invalid token:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid session. Please sign in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("generate-guide-images: Authenticated user:", userId);

    // Use service role for database operations (admin access for premade guides)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch premade guides without images
    const { data: guides, error: fetchError } = await supabase
      .from('travel_guides')
      .select('*')
      .is('image_url', null)
      .eq('is_premade', true);

    if (fetchError) {
      console.error('Error fetching guides:', fetchError);
      throw fetchError;
    }

    if (!guides || guides.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No guides need images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating images for ${guides.length} guides`);

    const results = [];

    for (const guide of guides) {
      try {
        const imagePrompt = `Create a beautiful, modern travel poster illustration for: ${guide.title}. ${guide.description || ''}. Style: vibrant colors, minimalist, professional travel photography aesthetic, high quality, 16:9 aspect ratio`;
        
        console.log(`Generating image for guide: ${guide.title}`);

        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error for guide ${guide.id}:`, errorText);
          results.push({ guide_id: guide.id, success: false, error: errorText });
          continue;
        }

        const data = await response.json();
        const base64Image = data.data[0].b64_json;
        const imageDataUrl = `data:image/png;base64,${base64Image}`;

        const { error: updateError } = await supabase
          .from('travel_guides')
          .update({ image_url: imageDataUrl })
          .eq('id', guide.id);

        if (updateError) {
          console.error(`Error updating guide ${guide.id}:`, updateError);
          results.push({ guide_id: guide.id, success: false, error: updateError.message });
        } else {
          console.log(`Successfully generated image for guide: ${guide.title}`);
          results.push({ guide_id: guide.id, title: guide.title, success: true });
        }
      } catch (error) {
        console.error(`Error processing guide ${guide.id}:`, error);
        results.push({ 
          guide_id: guide.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Image generation completed',
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-guide-images function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
