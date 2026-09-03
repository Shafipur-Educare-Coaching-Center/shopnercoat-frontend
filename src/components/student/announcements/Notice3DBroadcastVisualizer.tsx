'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Holographic Broadcast Beacon with Pulsing Wave Rings
function BroadcastBeacon3D() {
  const beaconRef = useRef<THREE.Group>(null);
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
    if (beaconRef.current) {
      beaconRef.current.position.y = Math.sin(time * 1.5) * 0.07;
      beaconRef.current.rotation.x = THREE.MathUtils.lerp(
        beaconRef.current.rotation.x,
        targetRotation.current.x * 0.4,
        0.06
      );
      beaconRef.current.rotation.y = THREE.MathUtils.lerp(
        beaconRef.current.rotation.y,
        targetRotation.current.y * 0.6 + Math.sin(time * 0.8) * 0.1,
        0.06
      );
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.8;
      const s1 = 1 + Math.sin(time * 2) * 0.12;
      ring1Ref.current.scale.set(s1, s1, s1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6;
      ring2Ref.current.rotation.y += delta * 0.4;
      const s2 = 1 + Math.cos(time * 2) * 0.1;
      ring2Ref.current.scale.set(s2, s2, s2);
    }
  });

  return (
    <group ref={beaconRef}>
      {/* Central Glowing Megaphone/Beacon Base */}
      <mesh position={[0, -0.1, 0]}>
        <coneGeometry args={[0.7, 1.3, 32, 1, true]} />
        <meshStandardMaterial
          color="#00594D"
          emissive="#004D40"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Central Pulsing Beacon Orb */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Pulsing Cyan Radio Wave Ring 1 */}
      <mesh ref={ring1Ref} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Pulsing Amber Broadcast Ring 2 */}
      <mesh ref={ring2Ref} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.6, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#D97706"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export function Notice3DBroadcastVisualizer() {
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
        <pointLight position={[4, -2, 2]} color="#F59E0B" intensity={1.2} />

        <BroadcastBeacon3D />
      </Canvas>
    </div>
  );
}

export default Notice3DBroadcastVisualizer;
