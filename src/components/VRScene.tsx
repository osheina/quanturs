
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
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
        </XR>
      </Canvas>
    </>
  );
};

export default VRScene;
