import { Canvas } from "@react-three/fiber";
import { VRButton, XR, XRProvider, createXRStore } from "@react-three/xr";
import { Environment, OrbitControls } from "@react-three/drei";

const VRScene = () => {
  // Create an XR store instance
  const store = createXRStore();

  return (
    <div className="h-[500px] w-full relative">
      <VRButton />
      <Canvas>
        <XRProvider value={store}>
          <XR store={store} mode="immersive-vr">
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            <mesh position={[0, 0, -5]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="blue" />
            </mesh>
            <Environment preset="sunset" />
            <OrbitControls />
          </XR>
        </XRProvider>
      </Canvas>
    </div>
  );
};

export default VRScene;