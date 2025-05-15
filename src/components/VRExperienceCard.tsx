
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Co2Badge from '@/components/Co2Badge';

interface VRExperienceCardProps {
  image: string;
  title: string;
  duration: string;
  co2_kg?: number;
  co2_rating?: number;
}

const VRExperienceCard = ({ 
  image, 
  title, 
  duration,
  co2_kg,
  co2_rating
}: VRExperienceCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]">
      <AspectRatio ratio={16/9}>
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover" 
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{duration} experience</p>
        {co2_kg && co2_rating && <Co2Badge co2_kg={co2_kg} co2_rating={co2_rating} />}
      </div>
    </div>
  );
};

export default VRExperienceCard;
