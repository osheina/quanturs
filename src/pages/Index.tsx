import HeroSection from "@/components/HeroSection";
import AIGuideSection from "@/components/AIGuideSection";
import MainContent from "@/components/MainContent";
import TestimonialsSection from "@/components/TestimonialsSection";
import { vrExperiences } from "@/data/vrExperiences";
import VRExperienceCard from "@/components/VRExperienceCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <AIGuideSection />
      <MainContent />
      
      {/* VR Experiences Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Immersive VR Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vrExperiences.slice(0, 3).map((experience, index) => (
            <VRExperienceCard
              key={index}
              image={experience.image}
              title={experience.title}
              duration={experience.duration}
            />
          ))}
        </div>
      </div>
      
      {/* Sustainability Impact Section */}
      <div className="container mx-auto text-center py-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sustainability Impact</h2>
        <p className="text-gray-600 text-lg">
          CO₂-Footprint Estimator — <span className="text-primary font-bold">Coming Soon</span> 🌱
        </p>
      </div>
      
      <TestimonialsSection />
    </div>
  );
};

export default Index;
