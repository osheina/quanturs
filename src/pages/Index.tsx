
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AIGuideSection from '@/components/AIGuideSection';
import MainContent from '@/components/MainContent';
import TestimonialsSection from '@/components/TestimonialsSection';
import { vrExperiences } from '@/data/vrExperiences';
import VRExperienceCard from '@/components/VRExperienceCard';

const getImageUrl = (type: string) => {
  switch (type) {
    case 'cafe':
      return 'https://source.unsplash.com/800x600/?vegan,cafe,brunch';
    case 'hotel':
      return 'https://source.unsplash.com/800x600/?eco,hotel,retreat';
    case 'park':
      return 'https://source.unsplash.com/800x600/?hidden,trail,park';
    case 'market':
      return 'https://source.unsplash.com/800x600/?organic,market,local';
    default:
      return 'https://source.unsplash.com/800x600/?travel,nature';
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <HeroSection />
      <AIGuideSection />
      <MainContent />

      {/* VR Experiences Section */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Immersive VR Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vrExperiences.slice(0, 3).map((experience, index) => (
            <VRExperienceCard
              key={index}
              image={experience.image || getImageUrl(experience.type)}
              title={experience.title}
              duration={experience.duration}
              co2_kg={experience.co2_kg}
              co2_rating={experience.co2_rating}
            />
          ))}
        </div>
      </section>

      {/* Sustainability Impact Section */}
      <section className="container mx-auto text-center py-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sustainability Impact</h2>
        <p className="text-gray-600 text-lg">
          CO₂-Footprint Estimator —{' '}
          <span className="text-green-500 font-bold">Coming Soon</span> 🌱
        </p>
      </section>

      <TestimonialsSection />
    </div>
  );
};

export default Index;
