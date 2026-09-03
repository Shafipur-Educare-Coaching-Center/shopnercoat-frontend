'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Holographic Aspirant Medical Core with Orbiting Helix Rings
function AspirantCore3D() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
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
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.07;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x * 0.4,
        0.06
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y * 0.6 + Math.sin(time * 0.8) * 0.08,
        0.06
      );
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.7;
      ring1Ref.current.rotation.x += delta * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.8;
      ring2Ref.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Medical Icosahedron Hologram */}
      <mesh>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#00594D"
          emissive="#004D40"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.85}
          wireframe={true}
        />
      </mesh>

      {/* Glowing Inner Soul Core */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Orbiting Emerald Helix Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.4, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Cyan Identity Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.6, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export function Profile3DAvatarVisualizer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="size-24 rounded-full bg-teal-50/50 animate-pulse border border-teal-200/50" />
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
        <directionalLight position={[5, 7, 5]} intensity={1.8} />
        <pointLight position={[-4, -3, -2]} color="#06B6D4" intensity={1.5} />
        <pointLight position={[4, -2, 2]} color="#10B981" intensity={1.2} />

        <AspirantCore3D />
      </Canvas>
    </div>
  );
}

export default Profile3DAvatarVisualizer;
