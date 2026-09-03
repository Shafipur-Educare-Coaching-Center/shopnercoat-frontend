'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Holographic Admit Ticket Mesh
function HolographicTicket3D() {
  const cardGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.9;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.9;
      targetRotation.current = { x: y, y: x };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (cardGroupRef.current) {
      // Gentle floating animation + cursor tilt
      const time = state.clock.getElapsedTime();
      cardGroupRef.current.position.y = Math.sin(time * 1.5) * 0.08;
      
      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.x,
        targetRotation.current.x * 0.4,
        0.06
      );
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.y,
        targetRotation.current.y * 0.6 + Math.sin(time * 0.8) * 0.1,
        0.06
      );
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      ringRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group ref={cardGroupRef}>
      {/* 3D Ticket Slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial
          color="#00594D"
          emissive="#004D40"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Holographic Border Foil */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.1, 1.3]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </mesh>

      {/* Holographic Seal Core */}
      <mesh position={[-0.6, 0, 0.05]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#F59E0B"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* QR Gyro Verification Ring */}
      <mesh ref={ringRef} position={[0.55, 0, 0.06]}>
        <torusGeometry args={[0.38, 0.025, 16, 48]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

export function Enrollment3DTicketVisualizer() {
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
        <directionalLight position={[4, 6, 5]} intensity={1.8} />
        <pointLight position={[-4, -3, -2]} color="#06B6D4" intensity={1.5} />
        <pointLight position={[4, -2, 2]} color="#10B981" intensity={1.2} />

        <HolographicTicket3D />
      </Canvas>
    </div>
  );
}

export default Enrollment3DTicketVisualizer;
