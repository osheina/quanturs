
import HeroSection from "@/components/HeroSection";
import AIGuideSection from "@/components/AIGuideSection";
import MainContent from "@/components/MainContent";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <AIGuideSection />
      <MainContent />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
