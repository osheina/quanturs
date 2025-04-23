
import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";

export async function generateAIGuide(prompt: string): Promise<TravelGuide | null> {
  try {
    // В реальном приложении здесь был бы запрос к Edge Function, 
    // которая использует API OpenAI или другой AI сервис
    
    // Симуляция ответа AI для тестирования без API ключей
    const guideTitle = `Guide for: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`;
    
    // Создаем базовый контент путеводителя
    const content = {
      days: [
        {
          title: "Day 1",
          activities: [
            {
              time: "9:00 AM",
              activity: "Start your day with breakfast at a local eco-friendly cafe",
              location: "Downtown",
              notes: "Try their organic coffee and vegan options"
            },
            {
              time: "11:00 AM",
              activity: "Visit the local farmers market",
              location: "Central Park",
              notes: "Great place to meet locals and buy fresh produce"
            },
            {
              time: "2:00 PM",
              activity: "Sustainable city tour",
              location: "City Center",
              notes: "Learn about local eco-friendly initiatives"
            }
          ]
        },
        {
          title: "Day 2",
          activities: [
            {
              time: "10:00 AM",
              activity: "Hiking in nature reserve",
              location: "Outside city",
              notes: "Beautiful trails with diverse flora and fauna"
            },
            {
              time: "3:00 PM",
              activity: "Visit to sustainable businesses",
              location: "Various locations",
              notes: "See how local businesses implement eco-friendly practices"
            }
          ]
        }
      ],
      recommendations: {
        restaurants: ["Organic Delights", "Green Plate", "Nature's Kitchen"],
        accommodations: ["Eco Lodge", "Green Hotel", "Sustainable Resort"],
        transportation: ["Public transit", "Bike rentals", "Walking tours"]
      }
    };

    // Создаем запись в базе данных
    const newGuide: TravelGuide = {
      title: guideTitle,
      prompt: prompt,
      content: JSON.stringify(content),
      is_premade: false,
      description: `Personalized eco-friendly itinerary based on: "${prompt}"`
    };

    const { data, error } = await supabase
      .from('travel_guides')
      .insert(newGuide)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error generating AI guide:", error);
    return null;
  }
}

export async function fetchPremadeGuides(): Promise<TravelGuide[]> {
  try {
    const { data, error } = await supabase
      .from('travel_guides')
      .select('*')
      .eq('is_premade', true);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching premade guides:", error);
    return [];
  }
}

export async function downloadGuide(id: string): Promise<TravelGuide | null> {
  try {
    const { data, error } = await supabase
      .from('travel_guides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error downloading guide:", error);
    return null;
  }
}
