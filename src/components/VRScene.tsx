
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { TravelGuide } from '@/models/TravelGuide';
import { vrExperiences } from '@/data/vrExperiences';

interface VRSceneProps {
  children?: React.ReactNode;
  title?: string;
  guides?: TravelGuide[];
  experiences?: typeof vrExperiences;
}

const VRScene: React.FC<VRSceneProps> = ({ 
  children, 
  title = "Virtual Reality Experience", 
  guides = [],
  experiences = vrExperiences 
}) => {
  return (
    <>
      <div className="w-full h-full">
        <Canvas>
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
          
          {/* Display VR experiences */}
          {experiences.map((experience, index) => {
            const angle = (index / experiences.length) * Math.PI * 2;
            const radius = 3;  // Larger radius than guides
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <group key={index} position={[x, 0, z]}>
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="orange" />
                </mesh>
                <Text
                  position={[0, 1.2, 0]}
                  fontSize={0.2}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2}
                >
                  {experience.title}
                </Text>
                <Text
                  position={[0, 0.8, 0]}
                  fontSize={0.1}
                  color="lightblue"
                  anchorX="center"
                  anchorY="middle"
                >
                  {experience.duration}
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
        </Canvas>
      </div>
    </>
  );
};

export default VRScene;
