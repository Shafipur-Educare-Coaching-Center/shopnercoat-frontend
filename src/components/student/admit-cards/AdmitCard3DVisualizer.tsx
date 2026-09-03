'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Holographic Pass Shield with Gyro Rings
function HolographicShield3D() {
  const shieldRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
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
    if (shieldRef.current) {
      shieldRef.current.position.y = Math.sin(time * 1.6) * 0.07;
      shieldRef.current.rotation.x = THREE.MathUtils.lerp(
        shieldRef.current.rotation.x,
        targetRotation.current.x * 0.5,
        0.06
      );
      shieldRef.current.rotation.y = THREE.MathUtils.lerp(
        shieldRef.current.rotation.y,
        targetRotation.current.y * 0.7 + Math.sin(time * 0.9) * 0.1,
        0.06
      );
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.8;
      outerRingRef.current.rotation.x += delta * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.9;
      innerRingRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group ref={shieldRef}>
      {/* 3D Shield / Pass Base */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#00594D"
          emissive="#004D40"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          wireframe={true}
        />
      </mesh>

      {/* Glowing Medical Core Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Gold Outer Verification Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#D97706"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Cyan Inner Gyro Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.3, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export function AdmitCard3DVisualizer() {
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

        <HolographicShield3D />
      </Canvas>
    </div>
  );
}

export default AdmitCard3DVisualizer;
