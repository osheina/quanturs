
import { useXR, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Vector3 } from "three";

// Компонент для отображения 3D модели
const Model = ({ sceneName, position = [0, 0, -5] }: { sceneName: string, position?: Vector3 | [number, number, number] }) => {
  // Маппинг названий сцен на пути к моделям
  const modelPaths: Record<string, string> = {
    "Alpine Adventure": "/models/alpine.glb",
    "Rainforest Explorer": "/models/rainforest.glb", 
    "Northern Lights": "/models/northern_lights.glb",
    // Fallback на стандартную модель, если соответствия не найдено
    "default": "/models/default.glb"
  };
  
  // Определяем путь к модели на основе названия сцены
  const modelPath = modelPaths[sceneName] || modelPaths.default;
  
  // Для демонстрационных целей используем простую геометрию, если модели нет
  return (
    <mesh position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={sceneName === "Alpine Adventure" ? "#0088ff" : 
              sceneName === "Rainforest Explorer" ? "#00ff88" : 
              sceneName === "Northern Lights" ? "#8800ff" : 
              "#00ff00"} 
      />
    </mesh>
  );
};

// Основной компонент VR-сцены
const VRScene = ({ sceneName }: { sceneName: string }) => {
  const xr = useXR();
  const [showIntro, setShowIntro] = useState(true);

  // Закрываем вводный экран после задержки
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas>
        <XR>
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <Model sceneName={sceneName} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <ambientLight intensity={0.5} />
            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
      
      {/* Вводный экран с названием опыта */}
      {showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{sceneName}</h2>
            <p className="animate-pulse">Загрузка VR-опыта...</p>
          </div>
        </div>
      )}
      
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
