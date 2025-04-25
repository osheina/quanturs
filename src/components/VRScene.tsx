
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, Controllers } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';

interface VRSceneProps {
  children?: React.ReactNode;
}

const VRScene: React.FC<VRSceneProps> = ({ children }) => {
  return (
    <>
      <VRButton />
      <Canvas>
        <ambientLight intensity={0.5} />
        <XR>
          <Controllers />
          <OrbitControls />
          {children || (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          )}
        </XR>
      </Canvas>
    </>
  );
};

export default VRScene;
