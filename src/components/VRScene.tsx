
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  PerspectiveCamera, 
  Sky, 
  useTexture 
} from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { VRButton, ARButton, XR, Controllers, Hands } from '@react-three/xr';

interface PanoramaProps {
  texture: string;
}

const Panorama = ({ texture }: PanoramaProps) => {
  const map = useTexture(texture);
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={map} side={2} />
    </mesh>
  );
};

interface VRSceneProps {
  panoramaUrl: string;
  enableControls?: boolean;
  enableXR?: boolean;
}

const DefaultVRScene = ({ 
  panoramaUrl, 
  enableControls = true, 
  enableXR = false 
}: VRSceneProps) => {
  const [xrMode, setXRMode] = useState<'VR' | 'AR' | null>(null);
  
  return (
    <div className="w-full h-full relative">
      <Canvas className="w-full h-full">
        {enableXR ? (
          <XR>
            <Controllers />
            <Hands />
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
            <Panorama texture={panoramaUrl} />
            <Sky />
            <Environment preset="sunset" />
          </XR>
        ) : (
          <>
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
            <Panorama texture={panoramaUrl} />
            {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
            <Sky />
            <Environment preset="sunset" />
          </>
        )}
      </Canvas>
      
      {enableXR && (
        <div className="absolute bottom-4 left-4 flex flex-row gap-2">
          <VRButton />
          <ARButton />
        </div>
      )}
    </div>
  );
};

export default function VRScene({ children }: { children: React.ReactElement }) {
  return (
    <div className="w-full h-full">
      {children || <DefaultVRScene panoramaUrl="/placeholder.svg" />}
    </div>
  );
}
