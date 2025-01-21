import { Cube } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VRExperienceCardProps {
  image: string;
  title: string;
  duration: string;
}

const VRExperienceCard = ({ image, title, duration }: VRExperienceCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" className="gap-2">
            <Cube className="w-4 h-4" />
            Preview in VR
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{duration} experience</p>
      </CardFooter>
    </Card>
  );
};

export default VRExperienceCard;