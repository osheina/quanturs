
import SearchBar from "@/components/SearchBar";

const HeroSection = () => {
  return (
    <section 
      className="relative h-[70vh] flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e)' }}
    >
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
  );
};

export default HeroSection;
