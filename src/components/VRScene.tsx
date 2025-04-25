
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, Controllers, VRButton, ARButton } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';

const VRScene = () => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <Controllers />
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
};

export default VRScene;
