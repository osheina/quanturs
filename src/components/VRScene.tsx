
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Sky, 
  OrbitControls, 
  useTexture 
} from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { VRButton, ARButton, XR, XRStore, XRSessionMode } from '@react-three/xr';

interface PanoramaProps {
  texture: string;
}

const Panorama: React.FC<PanoramaProps> = ({ texture }) => {
  const map = useTexture(texture);
  
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={map} side={2} />
    </mesh>
  );
};

interface VRSceneProps {
  children?: React.ReactNode;
  enableControls?: boolean;
  enableXR?: boolean;
}

export const DefaultVRScene: React.FC<{ 
  panoramaUrl: string;
  enableControls?: boolean;
  enableXR?: boolean;
}> = ({ 
  panoramaUrl, 
  enableControls = true, 
  enableXR = false 
}) => {
  return (
    <div className="relative w-full h-full">
      <Canvas className="w-full h-full">
        {enableXR ? (
          <XR mode="VR">
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
            <Panorama texture={panoramaUrl} />
            <Sky />
            <Environment preset="sunset" />
          </XR>
        ) : (
          <>
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
            <Panorama texture={panoramaUrl} />
            <Sky />
            <Environment preset="sunset" />
            {enableControls && <OrbitControls enableZoom={false} />}
          </>
        )}
      </Canvas>
      
      {enableXR && (
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          <VRButton mode="VR" />
          <ARButton mode="AR" />
        </div>
      )}
    </div>
  );
};

const VRScene: React.FC<VRSceneProps> = ({ children, enableControls = true, enableXR = false }) => {
  return (
    <div className="relative w-full h-full bg-black">
      {children || (
        <DefaultVRScene 
          panoramaUrl="/placeholder.svg"
          enableControls={enableControls}
          enableXR={enableXR}
        />
      )}
    </div>
  );
};

export default VRScene;
