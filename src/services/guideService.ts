
import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";

export async function generateAIGuide(prompt: string): Promise<TravelGuide | null> {
  try {
    // In a real application, there would be a request to an Edge Function
    // that uses the OpenAI API or another AI service
    
    // Simulating an AI response for testing without API keys
    const guideTitle = `Guide for: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`;
    
    // Determine if the request includes Los Angeles
    const isLosAngeles = prompt.toLowerCase().includes('los angeles') || prompt.toLowerCase().includes('la ');
    
    // Create basic guide content
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
      // Add specific places for Los Angeles
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

    // Create entry in database
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
    let premadeGuides: TravelGuide[] = [
      {
        id: "vegan-la-tour",
        title: "Vegan Tour in Los Angeles",
        prompt: "3-day vegan culinary experience in LA",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at Cafe Gratitude",
                  location: "Venice",
                  notes: "Known for their plant-based cuisine and positive atmosphere"
                },
                {
                  time: "12:00 PM",
                  activity: "Lunch at Crossroads Kitchen",
                  location: "Melrose",
                  notes: "Upscale vegan dining with celebrity chef Tal Ronnen"
                },
                {
                  time: "3:00 PM",
                  activity: "Visit The Butcher's Daughter",
                  location: "Abbot Kinney, Venice",
                  notes: "Plant-based cafe and juice bar with gorgeous design"
                }
              ]
            },
            {
              title: "Day 2",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Brunch at Plant Food + Wine",
                  location: "Venice",
                  notes: "Beautiful outdoor garden setting with gourmet vegan cuisine"
                },
                {
                  time: "2:00 PM",
                  activity: "Visit Erewhon Market",
                  location: "Various Locations",
                  notes: "High-end organic market with amazing vegan prepared foods"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: ["Crossroads Kitchen", "Plant Food + Wine", "Gracias Madre"],
            accommodations: ["1 Hotel West Hollywood", "Terranea Resort", "Shore Hotel Santa Monica"],
            transportation: [
              "Tesla Rental Services",
              "Waymo Autonomous Taxis",
              "Cruise Self-Driving Vehicles",
              "Metro Rail System",
              "Bird/Lime Electric Scooters"
            ]
          }
        }),
        is_premade: true,
        description: "3-day culinary journey through the best vegan spots"
      },
      {
        id: "hollywood-tour",
        title: "Hollywood & Beverly Hills",
        prompt: "Eco-friendly tour of LA landmarks",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Visit Hollywood Walk of Fame",
                  location: "Hollywood Boulevard",
                  notes: "Iconic sidewalk featuring entertainment stars"
                },
                {
                  time: "1:00 PM",
                  activity: "Tour of Grauman's Chinese Theatre",
                  location: "Hollywood Boulevard",
                  notes: "Historic cinema palace with celebrity handprints"
                },
                {
                  time: "4:00 PM",
                  activity: "Visit Griffith Observatory",
                  location: "Griffith Park",
                  notes: "Panoramic views of Los Angeles and the Hollywood Sign"
                }
              ]
            },
            {
              title: "Day 2",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Explore Rodeo Drive",
                  location: "Beverly Hills",
                  notes: "Luxury shopping and celebrity spotting"
                },
                {
                  time: "2:00 PM",
                  activity: "Visit The Grove",
                  location: "Fairfax District",
                  notes: "Upscale outdoor shopping center with eco-friendly options"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: ["Gracias Madre", "Nic's on Beverly", "Crossroads Kitchen"],
            accommodations: ["The London West Hollywood", "Waldorf Astoria Beverly Hills", "1 Hotel West Hollywood"],
            transportation: [
              "Tesla Rental Services",
              "Waymo Autonomous Taxis",
              "Cruise Self-Driving Vehicles",
              "Metro Rail System",
              "Bird/Lime Electric Scooters"
            ]
          }
        }),
        is_premade: true,
        description: "Eco-friendly tour of LA's iconic landmarks"
      }
    ];

    const { data: existingGuides, error } = await supabase
      .from('travel_guides')
      .select('*')
      .eq('is_premade', true);

    if (error) throw error;
    
    // If no premade guides exist in the database, insert them
    if (!existingGuides || existingGuides.length === 0) {
      const { error: insertError } = await supabase
        .from('travel_guides')
        .insert(premadeGuides);
      
      if (insertError) throw insertError;
    }

    return existingGuides && existingGuides.length > 0 ? existingGuides : premadeGuides;
  } catch (error) {
    console.error("Error fetching premade guides:", error);
    return [];
  }
}

export async function downloadGuide(id: string): Promise<TravelGuide | null> {
  try {
    // If UUID format, query from database
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const { data, error } = await supabase
        .from('travel_guides')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } else {
      // For hardcoded IDs like "vegan-la-tour" or "hollywood-tour"
      const guides = await fetchPremadeGuides();
      const guide = guides.find(g => g.id === id);
      return guide || null;
    }
  } catch (error) {
    console.error("Error downloading guide:", error);
    return null;
  }
}
