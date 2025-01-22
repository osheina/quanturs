import { Canvas } from "@react-three/fiber";
import { VRButton, XR, createXRStore } from "@react-three/xr";
import { Environment, OrbitControls } from "@react-three/drei";

const VRScene = () => {
  // Create an XR store instance
  const xrStore = createXRStore();

  return (
    <div className="h-[500px] w-full relative">
      <VRButton />
      <Canvas>
        <XR store={xrStore}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />
          <mesh position={[0, 0, -5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <Environment preset="sunset" />
        </XR>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default VRScene;