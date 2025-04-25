
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, UtensilsCrossed, MapPin } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import VRExperienceCard from "@/components/VRExperienceCard";
import RestaurantCard from "@/components/RestaurantCard";
import { hotels } from "@/data/hotels";
import { restaurants } from "@/data/restaurants";
import { vrExperiences } from "@/data/vrExperiences";

const MainContent = () => {
  return (
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
              <RestaurantCard key={index} {...restaurant} />
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
  );
};

export default MainContent;
