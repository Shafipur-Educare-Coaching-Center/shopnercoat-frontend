"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export function Scene() {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <mesh rotation={[10, 10, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}
