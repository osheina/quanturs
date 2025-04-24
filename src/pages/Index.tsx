import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import VRExperienceCard from "@/components/VRExperienceCard";
import AIGuideSection from "@/components/AIGuideSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, UtensilsCrossed, MapPin, Star } from "lucide-react";

const Index = () => {
  const hotels = [
    {
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      name: "Eco Mountain Resort",
      location: "Swiss Alps",
      ecoScore: 4.8,
      price: 299,
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      name: "Lakeside Eco Lodge",
      location: "Canadian Rockies",
      ecoScore: 4.9,
      price: 399,
    },
    {
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
      name: "Forest Haven",
      location: "Black Forest, Germany",
      ecoScore: 4.7,
      price: 259,
    },
  ];

  const vrExperiences = [
    {
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      title: "Alpine Adventure",
      duration: "45-minute",
    },
    {
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
      title: "Rainforest Explorer",
      duration: "30-minute",
    },
    {
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
      title: "Northern Lights",
      duration: "60-minute",
    },
  ];

  const restaurants = [
    {
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      name: "Verde - Plant-Based Kitchen",
      cuisine: "Vegan Fine Dining",
      rating: 4.8,
      priceRange: "$$$",
      description: "Innovative vegan cuisine in an elegant setting with seasonal ingredients",
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      name: "Bistro Moderne",
      cuisine: "Contemporary French",
      rating: 4.9,
      priceRange: "$$$$",
      description: "Classic French dishes with a modern twist in an art deco atmosphere",
    },
    {
      image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
      name: "Sky Lounge",
      cuisine: "International Fusion",
      rating: 4.7,
      priceRange: "$$$$",
      description: "Panoramic city views with innovative fusion cuisine",
    },
    {
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      name: "Rustic & Raw",
      cuisine: "Mediterranean",
      rating: 4.6,
      priceRange: "$$$",
      description: "Farm-to-table Mediterranean dishes in a cozy atmosphere",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Quanturs Branding */}
      <section className="relative h-[70vh] flex items-center justify-center bg-cover bg-center" 
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e)' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold animate-fade-down">
            Quanturs: Travel Intelligently
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-up">
            Sustainable, AI-powered travel experiences tailored to your values and lifestyle
          </p>
          <div className="animate-fade-up">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* AI Guide Section */}
      <section className="py-16 px-4 container mx-auto">
        <AIGuideSection />
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 px-4 container mx-auto">
        <Tabs defaultValue="stays" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="stays" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Eco Stays
            </TabsTrigger>
            <TabsTrigger value="dining" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Dining
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stays" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <HotelCard key={index} {...hotel} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dining" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>{restaurant.cuisine}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                    <p className="text-sm font-semibold text-primary">{restaurant.priceRange}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activities" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vrExperiences.map((experience, index) => (
                <VRExperienceCard key={index} {...experience} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 container mx-auto bg-primary/5 rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">What Our Travelers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "The AI-powered recommendations were spot-on! Found amazing vegan restaurants I wouldn't have discovered otherwise."
            </p>
            <p className="font-semibold">- Sarah M.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "Virtual tours helped me plan my trip better. It's like being there before actually going!"
            </p>
            <p className="font-semibold">- James R.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 italic mb-4">
              "Love how easy it is to find eco-friendly accommodations. Makes sustainable travel so much simpler."
            </p>
            <p className="font-semibold">- Emma L.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
