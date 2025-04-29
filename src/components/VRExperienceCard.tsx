
import { Box } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VRExperienceCardProps {
  image: string;
  title: string;
  duration: string;
}

const VRExperienceCard = ({ image, title, duration }: VRExperienceCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Box className="mr-2 h-4 w-4" />
          <span>{duration} experience</span>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button className="w-full">Experience in VR</Button>
      </CardFooter>
    </Card>
  );
};

export default VRExperienceCard;
