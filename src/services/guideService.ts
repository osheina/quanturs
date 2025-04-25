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
    // Define two premade guides for Los Angeles
    const premadeGuides: TravelGuide[] = [
      {
        id: "la-vegan-weekend",
        title: "Vegan Weekend in Los Angeles",
        prompt: "Weekend plan in Los Angeles with vegan restaurants",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1 - Venice and Santa Monica",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at Cafe Gratitude",
                  location: "Venice, Los Angeles",
                  notes: "Start your day with organic, plant-based breakfast"
                },
                {
                  time: "11:00 AM",
                  activity: "Santa Monica Farmers Market",
                  location: "Arizona Avenue, Santa Monica",
                  notes: "Shop for fresh local produce and artisanal goods"
                },
                {
                  time: "2:00 PM",
                  activity: "Lunch at Plant Food + Wine",
                  location: "Venice, Los Angeles",
                  notes: "Upscale vegan dining with a beautiful garden"
                }
              ]
            },
            {
              title: "Day 2 - Hollywood and Beverly Hills",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Hike at Runyon Canyon",
                  location: "Hollywood",
                  notes: "Morning hike with city views"
                },
                {
                  time: "1:00 PM",
                  activity: "Lunch at Crossroads Kitchen",
                  location: "Melrose, Los Angeles",
                  notes: "Celebrity chef Tal Ronnen's upscale vegan restaurant"
                },
                {
                  time: "4:00 PM",
                  activity: "Shopping at Erewhon Market",
                  location: "Beverly Hills",
                  notes: "Luxury health food market with prepared foods"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: [
              "Cafe Gratitude - Venice",
              "Crossroads Kitchen - Melrose",
              "Plant Food + Wine - Venice",
              "Gracias Madre - West Hollywood"
            ],
            accommodations: [
              "1 Hotel West Hollywood - Eco-luxury",
              "Shore Hotel Santa Monica - Ocean view, LEED certified"
            ],
            transportation: [
              "Metro Expo Line",
              "Bird/Lime Electric Scooters",
              "Walking in Venice/Santa Monica"
            ]
          }
        }),
        is_premade: true,
        description: "Perfect weekend exploring LA's best vegan spots and eco-friendly activities"
      },
      {
        id: "la-eco-adventure",
        title: "Sustainable Los Angeles Adventure",
        prompt: "Eco-friendly weekend in Los Angeles",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1 - Sustainability Tour",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at Little Pine Restaurant",
                  location: "Silver Lake, Los Angeles",
                  notes: "100% vegan restaurant owned by Moby, donates all profits to animal rights organizations"
                },
                {
                  time: "11:00 AM",
                  activity: "LA River Bike Path Exploration",
                  location: "Elysian Park",
                  notes: "Eco-friendly bike tour highlighting urban sustainability efforts"
                },
                {
                  time: "2:00 PM",
                  activity: "Visit Tongva Park",
                  location: "Santa Monica",
                  notes: "Sustainable urban park design showcasing environmental conservation"
                }
              ]
            },
            {
              title: "Day 2 - Green Living Experience",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Community Farmers Market",
                  location: "Hollywood Farmers' Market",
                  notes: "Support local, organic farmers and sustainable agriculture"
                },
                {
                  time: "1:00 PM",
                  activity: "Zero Waste Shopping at Refill Madness",
                  location: "Mar Vista",
                  notes: "Shop for eco-friendly, package-free household and personal care items"
                },
                {
                  time: "4:00 PM",
                  activity: "Sunset at Ballona Wetlands",
                  location: "Playa Del Rey",
                  notes: "Learn about local ecosystem conservation and enjoy nature"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: [
              "Little Pine Restaurant - Silver Lake",
              "Sage Plant Based Bistro - Echo Park",
              "The Organic Vault - Venice",
              "Ramen Hood - Arts District"
            ],
            accommodations: [
              "1 Hotel West Hollywood - Sustainable luxury",
              "The Kinney Venice Beach - Eco-friendly boutique hotel"
            ],
            transportation: [
              "Metro Bike Share",
              "Electric Scooter Rentals",
              "Walking tours",
              "Hybrid/Electric Vehicle Rentals"
            ]
          }
        }),
        is_premade: true,
        description: "An immersive eco-friendly journey through Los Angeles' sustainable hotspots"
      }
    ];

    // First try to get guides from Supabase
    const { data: existingGuides, error } = await supabase
      .from('travel_guides')
      .select('*')
      .eq('is_premade', true);

    if (error) throw error;
    
    // If no guides in database, insert the premade ones
    if (!existingGuides || existingGuides.length === 0) {
      const { error: insertError } = await supabase
        .from('travel_guides')
        .insert(premadeGuides);
      
      if (insertError) throw insertError;
      
      return premadeGuides;
    }
    
    return existingGuides;
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
