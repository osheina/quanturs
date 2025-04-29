
import { Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VRExperienceCardProps {
  image: string;
  title: string;
  duration: string;
}

const VRExperienceCard = ({ image, title, duration }: VRExperienceCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-gray-600">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-purple-400 px-4 py-2 text-white rounded-md flex items-center">
            <Box className="mr-2 h-4 w-4" />
            <span>Coming Soon</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{duration} experience</p>
      </CardContent>
    </Card>
  );
};

export default VRExperienceCard;
