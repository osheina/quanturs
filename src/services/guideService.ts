import { supabase } from "@/integrations/supabase/client";
import { TravelGuide } from "@/models/TravelGuide";
import { Database } from "@/integrations/supabase/types";

type Place = Database['public']['Tables']['quanturs_places']['Row'];

/* ----------  get filtered recommendations ---------- */
async function getFilteredRecommendations(tags: string[]): Promise<Place[]> {
  try {
    if (!tags.length) {
      console.warn("No tags provided for filtering recommendations");
      return [];
    }

    // Build the filter conditions for each tag
    const filterConditions = tags.map(tag => `diet_tags.ilike.%${tag}%`).join(',');
    
    // Query places with matching tags
    const { data, error } = await supabase
      .from("quanturs_places")
      .select("*")
      .or(filterConditions);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.warn("No places found matching the provided tags:", tags);
      return [];
    }

    // Shuffle the results and take up to 3 random places
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, shuffled.length));
  } catch (e) {
    console.error("Error getting filtered recommendations:", e);
    return [];
  }
}

/* ----------  AI generator (mock) ---------- */
export async function generateAIGuide(prompt: string, selectedTags: string[] = ['eco', 'stylish', 'vegan']): Promise<TravelGuide | null> {
  try {
    // Simulated AI response (no API keys needed for now)
    const guideTitle = `Guide for: ${prompt.slice(0, 30)}${prompt.length > 30 ? "…" : ""}`;

    const isSupportedCity =
      prompt.toLowerCase().includes("los angeles") ||
      /\bla\b/i.test(prompt) ||
      prompt.toLowerCase().includes("california") ||
      prompt.toLowerCase().includes("san francisco") ||
      /\bsf\b/i.test(prompt) ||
      prompt.toLowerCase().includes("san diego");

    if (!isSupportedCity) {
      throw new Error("Sorry, only Los Angeles, LA, California, San Francisco, SF, and San Diego are supported at the moment.");
    }

    // Extract number of days from prompt
    const daysMatch = prompt.match(/(\d+)\s*day/i);
    const numDays = daysMatch ? parseInt(daysMatch[1]) : 2;

    // Определяем город
    const city = (() => {
      if (prompt.toLowerCase().includes("los angeles") || /\bla\b/i.test(prompt)) return "la";
      if (prompt.toLowerCase().includes("san francisco") || /\bsf\b/i.test(prompt)) return "sf";
      if (prompt.toLowerCase().includes("san diego")) return "sd";
      if (prompt.toLowerCase().includes("california")) return "ca";
      return "other";
    })();

    // Можно добавить уникальные активности для каждого города
    const cityActivities = {
      la: [], // LA-specific activities (можно добавить позже)
      sf: [], // SF-specific activities (можно добавить позже)
      sd: []  // SD-specific activities (можно добавить позже)
    };

    // Get filtered recommendations based on selected tags
    const recommendations = await getFilteredRecommendations(selectedTags);

    // Генерируем дни
    const content = {
      days: Array.from({ length: numDays }, (_, i) => ({
        title: `Day ${i + 1}`,
        activities:
          cityActivities[city] && cityActivities[city][i]
            ? cityActivities[city][i]
            : [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at a local eco-friendly café",
                  location: "Downtown",
                  notes: "Try their organic coffee and vegan options"
                },
                {
                  time: "11:00 AM",
                  activity: "Visit the local farmers market",
                  location: "Main Square",
                  notes: "Great place to meet locals and buy fresh produce"
                },
                {
                  time: "2:00 PM",
                  activity: "City sustainability tour",
                  location: "City Center",
                  notes: "Learn about local eco-friendly initiatives"
                }
              ]
      })),
      recommendations: {
        restaurants: recommendations.map(place => `${place.name} – ${place.location}`),
        accommodations: ["Eco Lodge", "Green Hotel", "Sustainable Resort"],
        transportation: ["Public transit", "Bike rentals", "Walking tours"]
      }
    };

    // Add more specific activities for LA if it's a longer stay
    if (isSupportedCity && numDays > 2) {
      const additionalActivities = [
        {
          time: "9:30 AM",
          activity: "Stroll the Venice Canals",
          location: "Venice",
          notes: "Picturesque walkways inspired by Venice, Italy"
        },
        {
          time: "1:00 PM",
          activity: "Lunch at Sage Plant-Based Bistro",
          location: "Echo Park",
          notes: "Delicious plant-based menu with outdoor seating"
        },
        {
          time: "4:00 PM",
          activity: "Sunset at Griffith Observatory",
          location: "2800 E Observatory Rd",
          notes: "Spectacular city views and free telescopes"
        },
        {
          time: "10:00 AM",
          activity: "Visit The Broad Museum",
          location: "Downtown LA",
          notes: "Contemporary art museum with free admission"
        },
        {
          time: "2:00 PM",
          activity: "Explore The Last Bookstore",
          location: "Downtown LA",
          notes: "Unique bookstore with art installations"
        },
        {
          time: "4:00 PM",
          activity: "Walk through Grand Central Market",
          location: "Downtown LA",
          notes: "Historic food hall with diverse vendors"
        }
      ];

      // Distribute additional activities across remaining days
      for (let i = 2; i < numDays; i++) {
        const dayActivities = additionalActivities.slice((i - 2) * 3, (i - 1) * 3);
        if (dayActivities.length > 0) {
          content.days[i].activities = dayActivities;
        }
      }
    }

    /* --- write to DB --- */
    const newGuide: TravelGuide = {
      title: guideTitle,
      prompt,
      content: JSON.stringify(content),
      is_premade: false,
      description: `Personalized eco-friendly itinerary based on: "${prompt}"`
    };

    const { data, error } = await supabase
      .from("travel_guides")
      .insert(newGuide)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error("Error generating AI guide:", e);
    return null;
  }
}

/* ----------  premade guides (EN) ---------- */
export async function fetchPremadeGuides(): Promise<TravelGuide[]> {
  try {
    const premadeGuides: TravelGuide[] = [
      {
        id: "la-vegan-weekend",
        title: "Vegan Weekend in Los Angeles",
        prompt: "Vegan food & eco highlights in LA",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1 – Venice & Santa Monica",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at Cafe Gratitude",
                  location: "Venice",
                  notes: "Organic, plant-based favorites"
                },
                {
                  time: "11:00 AM",
                  activity: "Santa Monica Farmers Market",
                  location: "Arizona Ave, Santa Monica",
                  notes: "Local produce and artisanal goods"
                },
                {
                  time: "2:00 PM",
                  activity: "Lunch at Plant Food + Wine",
                  location: "Venice",
                  notes: "Upscale vegan dining with garden patio"
                }
              ]
            },
            {
              title: "Day 2 – Hollywood & Beverly Hills",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Hike Runyon Canyon",
                  location: "Hollywood",
                  notes: "Morning hike with city views"
                },
                {
                  time: "1:00 PM",
                  activity: "Lunch at Crossroads Kitchen",
                  location: "Melrose",
                  notes: "Chef Tal Ronnen's iconic vegan restaurant"
                },
                {
                  time: "4:00 PM",
                  activity: "Shopping at Erewhon Market",
                  location: "Beverly Hills",
                  notes: "Luxury health-food market"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: [
              "Cafe Gratitude – Venice",
              "Crossroads Kitchen – Melrose",
              "Plant Food + Wine – Venice",
              "Gracias Madre – West Hollywood"
            ],
            accommodations: [
              "1 Hotel West Hollywood – Eco-luxury",
              "Shore Hotel Santa Monica – LEED Gold"
            ],
            transportation: ["Metro Expo Line", "Lime/Bird Scooters", "Walking"]
          }
        }),
        is_premade: true,
        description: "Two-day plant-based itinerary featuring LA's top vegan spots"
      },
      {
        id: "la-eco-adventure",
        title: "Sustainable Los Angeles Adventure",
        prompt: "Eco-friendly weekend in LA",
        content: JSON.stringify({
          days: [
            {
              title: "Day 1 – Urban Sustainability",
              activities: [
                {
                  time: "9:00 AM",
                  activity: "Breakfast at Little Pine",
                  location: "Silver Lake",
                  notes: "100% vegan; profits to animal rights"
                },
                {
                  time: "11:00 AM",
                  activity: "Visit Wasteland",
                  location: "Melrose Ave",
                  notes: "High-end vintage and second-hand fashion"
                },
                {
                  time: "2:00 PM",
                  activity: "Explore Buffalo Exchange",
                  location: "La Brea",
                  notes: "Popular second-hand clothing store with great finds"
                },
                {
                  time: "4:00 PM",
                  activity: "Shop at Squaresville Vintage",
                  location: "Los Feliz",
                  notes: "Local favorite for vintage clothing and accessories"
                }
              ]
            },
            {
              title: "Day 2 – Green Living",
              activities: [
                {
                  time: "10:00 AM",
                  activity: "Hollywood Farmers Market",
                  location: "Hollywood",
                  notes: "Support local organic farmers"
                },
                {
                  time: "1:00 PM",
                  activity: "Explore Crossroads Trading",
                  location: "Santa Monica",
                  notes: "Curated second-hand fashion store"
                },
                {
                  time: "3:00 PM",
                  activity: "Visit The RealReal",
                  location: "West Hollywood",
                  notes: "Luxury consignment shopping"
                },
                {
                  time: "5:00 PM",
                  activity: "Sunset at Ballona Wetlands",
                  location: "Playa Del Rey",
                  notes: "Learn about coastal ecosystem conservation"
                }
              ]
            }
          ],
          recommendations: {
            restaurants: [
              "Little Pine – Silver Lake",
              "Sage Plant-Based Bistro – Echo Park",
              "Ramen Hood – Arts District"
            ],
            secondHandStores: [
              "Wasteland – Melrose",
              "Buffalo Exchange – La Brea",
              "Crossroads Trading – Santa Monica",
              "Squaresville Vintage – Los Feliz",
              "The RealReal – West Hollywood",
              "American Vintage – Silver Lake"
            ],
            accommodations: [
              "1 Hotel West Hollywood – Sustainable luxury",
              "The Kinney Venice Beach – Eco-friendly boutique"
            ],
            transportation: [
              "Metro Bike Share",
              "Electric Scooters",
              "Hybrid/Electric Car Rental"
            ]
          }
        }),
        is_premade: true,
        description: "Eco-conscious highlights: second-hand fashion, zero-waste shops & wetlands"
      }
    ];

    /* --- fetch existing premades --- */
    const { data: existing, error } = await supabase
      .from("travel_guides")
      .select("*")
      .eq("is_premade", true);

    if (error) throw error;

    if (!existing || existing.length === 0) {
      /* insert premades only once */
      const { error: insertErr } = await supabase
        .from("travel_guides")
        .insert(premadeGuides);
      if (insertErr) throw insertErr;
      return premadeGuides;
    }
    return existing;
  } catch (e) {
    console.error("Error fetching premade guides:", e);
    return [];
  }
}

/* ----------  download guide (by id) ---------- */
export async function downloadGuide(id: string): Promise<TravelGuide | null> {
  try {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(id)) {
      /* fetch from DB */
      const { data, error } = await supabase
        .from("travel_guides")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }

    /* fallback → search premade array */
    const premades = await fetchPremadeGuides();
    return premades.find(g => g.id === id) || null;
  } catch (e) {
    console.error("Error downloading guide:", e);
    return null;
  }
}
