'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Golden Merit Laurels Core
function MeritLaurelCore3D() {
  const trophyRef = useRef<THREE.Group>(null);
  const goldRingRef = useRef<THREE.Mesh>(null);
  const emeraldRingRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.8;
      targetRotation.current = { x: y, y: x };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (trophyRef.current) {
      trophyRef.current.position.y = Math.sin(time * 1.5) * 0.08;
      trophyRef.current.rotation.x = THREE.MathUtils.lerp(
        trophyRef.current.rotation.x,
        targetRotation.current.x * 0.5,
        0.06
      );
      trophyRef.current.rotation.y = THREE.MathUtils.lerp(
        trophyRef.current.rotation.y,
        targetRotation.current.y * 0.7 + Math.sin(time * 0.7) * 0.1,
        0.06
      );
    }
    if (goldRingRef.current) {
      goldRingRef.current.rotation.z += delta * 0.7;
      goldRingRef.current.rotation.x += delta * 0.4;
    }
    if (emeraldRingRef.current) {
      emeraldRingRef.current.rotation.y -= delta * 0.8;
      emeraldRingRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={trophyRef}>
      {/* Central Rotating Golden Dodecahedron Core */}
      <mesh>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#B45309"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Glowing Star Nucleus */}
      <mesh>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#F59E0B"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* Orbiting Golden Gyro Ring */}
      <mesh ref={goldRingRef}>
        <torusGeometry args={[1.5, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#D97706"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* Orbiting Emerald Merit Ring */}
      <mesh ref={emeraldRingRef}>
        <torusGeometry args={[1.7, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

export function Result3DMeritVisualizer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="size-24 rounded-full bg-amber-50/50 animate-pulse border border-amber-200/50" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <pointLight position={[-4, -3, -2]} color="#F59E0B" intensity={1.5} />
        <pointLight position={[4, -2, 2]} color="#10B981" intensity={1.2} />

        <MeritLaurelCore3D />
      </Canvas>
    </div>
  );
}

export default Result3DMeritVisualizer;
