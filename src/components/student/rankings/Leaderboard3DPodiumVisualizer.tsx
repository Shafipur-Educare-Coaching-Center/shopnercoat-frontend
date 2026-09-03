'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Golden Podium Pillars (1st, 2nd, 3rd Tier)
function PodiumGroup3D() {
  const groupRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Mesh>(null);
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
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.4) * 0.06;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x * 0.4,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y * 0.6 + Math.sin(time * 0.8) * 0.08,
        0.05
      );
    }
    if (crownRef.current) {
      crownRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1st Place Central Pillar (Gold) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 1.4, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Floating Crown on 1st Pillar */}
      <mesh ref={crownRef} position={[0, 1.15, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#FDE047"
          emissive="#EAB308"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* 2nd Place Left Pillar (Silver) */}
      <mesh position={[-0.9, -0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.95, 32]} />
        <meshStandardMaterial
          color="#94A3B8"
          emissive="#64748B"
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* 3rd Place Right Pillar (Bronze) */}
      <mesh position={[0.9, -0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.44, 0.65, 32]} />
        <meshStandardMaterial
          color="#D97706"
          emissive="#B45309"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ground Glow Ring */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 32]} />
        <meshBasicMaterial color="#00796B" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export function Leaderboard3DPodiumVisualizer() {
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
        camera={{ position: [0, 0.3, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <pointLight position={[-4, -2, -2]} color="#F59E0B" intensity={1.5} />
        <pointLight position={[4, -2, 2]} color="#00796B" intensity={1.2} />

        <PodiumGroup3D />
      </Canvas>
    </div>
  );
}

export default Leaderboard3DPodiumVisualizer;
