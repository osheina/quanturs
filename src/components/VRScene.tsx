import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Environment, OrbitControls } from "@react-three/drei";

const VRScene = () => {
  return (
    <div className="h-[500px] w-full relative">
      <VRButton />
      <Canvas>
        <XR>
          <Controllers />
          <Hands />
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