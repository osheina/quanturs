
import React from "react";
import { vrExperiences } from "@/data/vrExperiences";
import VRExperienceCard from "@/components/VRExperienceCard";

// Function to determine image URL based on experience type
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

const VRExperiences = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Immersive VR Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vrExperiences.map((experience, index) => (
          <VRExperienceCard
            key={index}
            image={getImageUrl(experience.type)}
            title={experience.title}
            duration={experience.duration}
          />
        ))}
      </div>
      
      <section className="container mx-auto text-center py-16 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sustainability Impact</h2>
        <p className="text-gray-600 text-lg">
          CO₂-Footprint Estimator —{' '}
          <span className="text-green-500 font-bold">Coming Soon</span> 🌱
        </p>
      </section>
    </div>
  );
};

export default VRExperiences;
