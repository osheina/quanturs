
import { Interactive, useXR, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

const VRScene = ({ sceneName }: { sceneName: string }) => {
  const xr = useXR();

  return (
    <div className="relative h-full w-full">
      <Canvas>
        <XR>
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <mesh position={[0, 0, -5]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#00ff00" />
            </mesh>
            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
      {!xr.isPresenting && (
        <button
          onClick={() => xr.enterXR()}
          className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Enter VR
        </button>
      )}
    </div>
  );
};

export default VRScene;
