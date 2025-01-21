import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import VRExperienceCard from "@/components/VRExperienceCard";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-cover bg-center" 
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e)' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white space-y-6 px-4">
          <h1 className="text-5xl font-bold animate-fade-down">
            Discover Eco-Friendly Destinations
          </h1>
          <p className="text-xl max-w-2xl mx-auto animate-fade-up">
            Experience sustainable travel with virtual tours and eco-conscious accommodations
          </p>
          <div className="animate-fade-up">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Eco Hotels */}
      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-primary">Featured Eco Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <HotelCard key={index} {...hotel} />
          ))}
        </div>
      </section>

      {/* VR Experiences */}
      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-primary">Virtual Reality Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vrExperiences.map((experience, index) => (
            <VRExperienceCard key={index} {...experience} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;