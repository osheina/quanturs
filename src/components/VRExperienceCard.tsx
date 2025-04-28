
import { Box } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VRScene from "./VRScene";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@react-three/drei";
import { vrExperiences } from "@/data/vrExperiences";

interface VRExperienceCardProps {
  image: string;
  title: string;
  duration: string;
}

const VRExperienceCard = ({ image, title, duration }: VRExperienceCardProps) => {
  const [showVR, setShowVR] = useState(false);

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0 relative">
          <img src={image} alt={title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Button 
              variant="secondary" 
              className="gap-2"
            >
              <Box className="w-4 h-4" />
              Preview in VR
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{duration} experience</p>
        </CardFooter>
      </Card>

      <Dialog open={showVR} onOpenChange={setShowVR}>
        <DialogContent className="max-w-4xl h-[600px] p-0">
          <VRScene 
            title={title}
            experiences={vrExperiences}
          >
            <mesh>
              <sphereGeometry args={[5, 64, 64]} />
              <meshStandardMaterial color="#336699" side={2} />
            </mesh>
            <Text
              position={[0, 0, -4]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {title}
            </Text>
          </VRScene>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VRExperienceCard;
