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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables');
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Получаем места без изображений
    const { data: places, error: fetchError } = await supabase
      .from('quanturs_places')
      .select('*')
      .is('image_url', null)
      .limit(20);

    if (fetchError) {
      console.error('Error fetching places:', fetchError);
      throw fetchError;
    }

    if (!places || places.length === 0) {
      return new Response(
        JSON.stringify({ message: 'All places already have images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating images for ${places.length} places`);

    const results = [];

    for (const place of places) {
      try {
        // Создаем детальный промпт для каждого типа места
        const typeDescriptions: Record<string, string> = {
          gallery: 'art gallery interior with modern exhibition space',
          market: 'vibrant farmers market with fresh produce and local goods',
          cafe: 'cozy cafe interior with warm lighting',
          restaurant: 'elegant restaurant dining space',
          hotel: 'luxury hotel room with modern design',
          hike: 'scenic hiking trail through nature',
          park: 'beautiful park with green spaces',
          trail: 'outdoor trail surrounded by nature',
          spa: 'tranquil spa interior with wellness atmosphere',
          wellness: 'peaceful wellness center',
        };

        const vibeDescriptions: Record<string, string> = {
          boho: 'bohemian style',
          artsy: 'artistic and creative vibe',
          eco: 'eco-friendly and sustainable',
          retro: 'retro vintage aesthetic',
          minimalist: 'clean minimalist design',
          cozy: 'warm and cozy atmosphere',
          industrial: 'modern industrial design',
          mountain: 'mountain views',
          oceanview: 'ocean views',
          hidden: 'hidden gem atmosphere',
        };

        const typeDesc = typeDescriptions[place.type] || place.type;
        const vibeWords = (place.vibe || '').split(',').map((v: string) => v.trim());
        const vibeDesc = vibeWords.map((v: string) => vibeDescriptions[v] || v).join(', ');

        const imagePrompt = `Professional photography of a ${typeDesc} in ${place.location || place.city || 'California'}. Style: ${vibeDesc}. High quality, vibrant colors, inviting atmosphere, 16:9 aspect ratio, realistic, no text or logos`;
        
        console.log(`Generating image for place: ${place.name} (${place.type})`);

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: imagePrompt
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI Gateway error for place ${place.id}:`, response.status, errorText);
          
          // Handle rate limits gracefully
          if (response.status === 429) {
            results.push({ place_id: place.id, success: false, error: 'Rate limit exceeded, try again later' });
            break; // Stop generating to avoid hitting rate limits repeatedly
          }
          
          results.push({ place_id: place.id, success: false, error: errorText });
          continue;
        }

        const data = await response.json();
        console.log('AI Gateway response:', JSON.stringify(data).substring(0, 200));
        
        // Extract base64 image from response
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!imageUrl) {
          console.error(`No image generated for place ${place.id}`);
          results.push({ place_id: place.id, success: false, error: 'No image in response' });
          continue;
        }

        // Update the database with the image
        const { error: updateError } = await supabase
          .from('quanturs_places')
          .update({ image_url: imageUrl })
          .eq('id', place.id);

        if (updateError) {
          console.error(`Error updating place ${place.id}:`, updateError);
          results.push({ place_id: place.id, success: false, error: updateError.message });
        } else {
          console.log(`Successfully generated image for place: ${place.name}`);
          results.push({ place_id: place.id, name: place.name, success: true });
        }

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing place ${place.id}:`, error);
        results.push({ 
          place_id: place.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(
      JSON.stringify({ 
        message: `Image generation completed: ${successCount}/${totalCount} successful`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-place-images function:', error);
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
