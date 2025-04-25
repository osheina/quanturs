
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
          {vrExperiences.map((experience, index) => (
            <VRExperienceCard
              key={index}
              image={experience.image}
              title={experience.title}
              duration={experience.duration}
            />
          ))}
        </div>
      </div>
      
      <TestimonialsSection />
    </div>
  );
};

export default Index;
