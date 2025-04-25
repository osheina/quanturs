
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { OrbitControls, Text } from '@react-three/drei';
import { TravelGuide } from '@/models/TravelGuide';

interface VRSceneProps {
  children?: React.ReactNode;
  title?: string;
  guides?: TravelGuide[];
}

const VRScene: React.FC<VRSceneProps> = ({ children, title = "Virtual Reality Experience", guides = [] }) => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <VRContent title={title} guides={guides}>
            {children}
          </VRContent>
        </XR>
      </Canvas>
    </>
  );
};

// This component handles the VR content to ensure proper context
const VRContent: React.FC<{ children?: React.ReactNode; title: string; guides: TravelGuide[] }> = ({ children, title, guides }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <OrbitControls />
      
      {/* Main title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Featured Guides Section */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Featured Guides
      </Text>

      {/* Display guides in a circular arrangement */}
      {guides.map((guide, index) => {
        const angle = (index / guides.length) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={guide.id || index} position={[x, 0, z]}>
            <mesh>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial color="skyblue" />
            </mesh>
            <Text
              position={[0, 1, 0]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
            >
              {guide.title}
            </Text>
          </group>
        );
      })}
      
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
