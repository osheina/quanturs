
import React from "react";
import { vrExperiences } from "@/data/vrExperiences";
import VRExperienceCard from "@/components/VRExperienceCard";

const VRExperiences = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Reality Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default VRExperiences;
