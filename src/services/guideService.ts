import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";

export async function generateAIGuide(prompt: string): Promise<TravelGuide | null> {
  try {
    // В реальном приложении здесь был бы запрос к Edge Function, 
    // которая использует API OpenAI или другой AI сервис
    
    // Симуляция ответа AI для тестирования без API ключей
    const guideTitle = `Guide for: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`;
    
    // Определяем, включает ли запрос Лос-Анджелес
    const isLosAngeles = prompt.toLowerCase().includes('los angeles') || prompt.toLowerCase().includes('la ');
    
    // Создаем базовый контент путеводителя
    let content = {
      days: [
        {
          title: "Day 1",
          activities: [
            {
              time: "9:00 AM",
              activity: isLosAngeles 
                ? "Start your day with breakfast at Cafe Gratitude" 
                : "Start your day with breakfast at a local eco-friendly cafe",
              location: isLosAngeles ? "Venice" : "Downtown",
              notes: isLosAngeles 
                ? "Known for their plant-based cuisine and positive atmosphere" 
                : "Try their organic coffee and vegan options"
            },
            {
              time: "11:00 AM",
              activity: isLosAngeles 
                ? "Visit the Santa Monica Farmers Market" 
                : "Visit the local farmers market",
              location: isLosAngeles ? "Arizona Avenue, Santa Monica" : "Central Park",
              notes: isLosAngeles 
                ? "One of LA's best markets with local produce and artisanal goods" 
                : "Great place to meet locals and buy fresh produce"
            },
            {
              time: "2:00 PM",
              activity: isLosAngeles 
                ? "Explore the Getty Center" 
                : "Sustainable city tour",
              location: isLosAngeles ? "1200 Getty Center Dr." : "City Center",
              notes: isLosAngeles 
                ? "Beautiful architecture, gardens, and stunning city views" 
                : "Learn about local eco-friendly initiatives"
            }
          ]
        },
        {
          title: "Day 2",
          activities: [
            {
              time: "10:00 AM",
              activity: isLosAngeles 
                ? "Hiking in Runyon Canyon Park" 
                : "Hiking in nature reserve",
              location: isLosAngeles ? "2000 N Fuller Ave, Hollywood" : "Outside city",
              notes: isLosAngeles 
                ? "Popular trail with spectacular views of the LA skyline" 
                : "Beautiful trails with diverse flora and fauna"
            },
            {
              time: "3:00 PM",
              activity: isLosAngeles 
                ? "Visit The Grove & Original Farmers Market" 
                : "Visit to sustainable businesses",
              location: isLosAngeles ? "189 The Grove Dr" : "Various locations",
              notes: isLosAngeles 
                ? "Shopping, dining and entertainment in an outdoor setting" 
                : "See how local businesses implement eco-friendly practices"
            }
          ]
        }
      ],
      recommendations: {
        restaurants: isLosAngeles 
          ? ["Crossroads Kitchen", "Plant Food + Wine", "Gracias Madre"] 
          : ["Organic Delights", "Green Plate", "Nature's Kitchen"],
        accommodations: isLosAngeles 
          ? ["1 Hotel West Hollywood", "Terranea Resort", "Shore Hotel Santa Monica"] 
          : ["Eco Lodge", "Green Hotel", "Sustainable Resort"],
        transportation: isLosAngeles 
          ? [
              "Tesla Rental Services",
              "Waymo Autonomous Taxis",
              "Cruise Self-Driving Vehicles",
              "Bird/Lime Electric Scooters",
              "Metro Rail System"
            ] 
          : ["Public transit", "Bike rentals", "Walking tours"]
      }
    };

    if (isLosAngeles) {
      // Добавляем специфичные места для Лос-Анджелеса
      content.days.push({
        title: "Day 3",
        activities: [
          {
            time: "9:30 AM",
            activity: "Visit the Venice Canals",
            location: "Venice",
            notes: "Scenic walkways along canals inspired by Venice, Italy"
          },
          {
            time: "1:00 PM",
            activity: "Lunch at Sage Plant Based Bistro",
            location: "Echo Park",
            notes: "Delicious plant-based food with outdoor seating"
          },
          {
            time: "4:00 PM",
            activity: "Sunset at Griffith Observatory",
            location: "2800 E Observatory Rd",
            notes: "Spectacular views of the city and stars"
          }
        ]
      });
    }

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
