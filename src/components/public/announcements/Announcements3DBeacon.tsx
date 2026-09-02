'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BeaconModelProps {
  isUrgent?: boolean;
}

function HolographicBeacon({ isUrgent = false }: BeaconModelProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const signalWavesRef = useRef<THREE.Group>(null);

  const colors = useMemo(
    () => ({
      core: isUrgent ? '#EF4444' : '#0D9488',
      coreEmissive: isUrgent ? '#F87171' : '#2DD4BF',
      goldRing: '#F59E0B',
      cyanRing: '#38BDF8',
      wave: isUrgent ? '#FCA5A5' : '#99F6E4',
    }),
    [isUrgent]
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // 1. Central Core Pulsing
    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.8;
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // 2. Orbiting Notification Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += dt * 0.9;
      ring1Ref.current.rotation.y += dt * 0.6;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= dt * 1.1;
      ring2Ref.current.rotation.z += dt * 0.7;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= dt * 0.5;
      ring3Ref.current.rotation.z -= dt * 0.8;
    }

    // 3. Expanding Signal Waves
    if (signalWavesRef.current) {
      signalWavesRef.current.rotation.z += dt * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Holographic Dispatch Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.65, 2]} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.coreEmissive}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.5}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting Ring 1 (Gold) */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.1, 0.03, 16, 48]} />
          <meshStandardMaterial
            color={colors.goldRing}
            emissive={colors.goldRing}
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Floating Signal Bead */}
        <mesh position={[1.1, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Orbiting Ring 2 (Cyan) */}
      <group ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.35, 0.025, 16, 48]} />
          <meshStandardMaterial
            color={colors.cyanRing}
            emissive={colors.cyanRing}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Floating Signal Bead */}
        <mesh position={[-1.35, 0, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#FCD34D" />
        </mesh>
      </group>

      {/* Orbiting Ring 3 (Teal Outer Orbit) */}
      <group ref={ring3Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[1.6, 0.02, 16, 48]} />
          <meshStandardMaterial
            color="#2DD4BF"
            emissive="#14B8A6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Ambient Signal Aura */}
      <mesh>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshBasicMaterial color={colors.wave} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

interface Announcements3DBeaconProps {
  isUrgent?: boolean;
  className?: string;
}

export function Announcements3DBeacon({
  isUrgent = false,
  className = 'w-24 h-24 sm:w-28 sm:h-28',
}: Announcements3DBeaconProps) {
  return (
    <div className={`relative shrink-0 pointer-events-none ${className}`}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-3, -3, -3]} intensity={0.6} color="#99F6E4" />

        <HolographicBeacon isUrgent={isUrgent} />
      </Canvas>
    </div>
  );
}
