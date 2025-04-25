
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';

interface VRSceneProps {
  children?: React.ReactNode;
}

const VRScene: React.FC<VRSceneProps> = ({ children }) => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight intensity={0.5} />
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
