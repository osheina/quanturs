
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR, useXR } from '@react-three/xr';
import { OrbitControls, Text } from '@react-three/drei';

interface VRSceneProps {
  children?: React.ReactNode;
  title?: string;
}

const VRScene: React.FC<VRSceneProps> = ({ children, title = "Virtual Reality Experience" }) => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <VRContent title={title}>
            {children}
          </VRContent>
        </XR>
      </Canvas>
    </>
  );
};

// This component handles the VR content to ensure proper context
const VRContent: React.FC<{ children?: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <OrbitControls />
      
      {/* Text label floating above */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      
      {children || (
        <>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Interactive Object
          </Text>
        </>
      )}
    </>
  );
};

export default VRScene;
