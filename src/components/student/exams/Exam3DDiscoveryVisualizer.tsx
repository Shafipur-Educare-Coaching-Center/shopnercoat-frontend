'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Knowledge Core with Orbiting Subject Spheres
function KnowledgeCore3D() {
  const coreRef = useRef<THREE.Group>(null);
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
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x = THREE.MathUtils.lerp(
        coreRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );
      coreRef.current.rotation.z = THREE.MathUtils.lerp(
        coreRef.current.rotation.z,
        targetRotation.current.y * 0.5,
        0.05
      );
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.7;
      ring1Ref.current.rotation.y += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.6;
      ring2Ref.current.rotation.z += delta * 0.4;
    }
  });

  // 5 Orbiting Subject Token colors (Biology, Chemistry, Physics, English, GK)
  const subjectColors = ['#10B981', '#06B6D4', '#F59E0B', '#6366F1', '#F43F5E'];

  return (
    <group ref={coreRef}>
      {/* Central Rotating Icosahedron Core */}
      <mesh>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial
          color="#00796B"
          emissive="#00594D"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Inner Glowing Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* Orbiting Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#0891B2"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Orbiting Gyro Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.75, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 5 Orbiting Subject Nodes */}
      {subjectColors.map((color, idx) => {
        const angle = (idx / 5) * Math.PI * 2;
        const radius = 1.6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;
        const z = Math.sin(angle) * radius * 0.8;

        return (
          <group key={idx} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Background Floating Particles
function FloatingBioParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 45;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 5;
      pos[i + 1] = (Math.random() - 0.5) * 5;
      pos[i + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.08;
      particlesRef.current.rotation.x -= delta * 0.04;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#14B8A6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function Exam3DDiscoveryVisualizer() {
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
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -2]} color="#06B6D4" intensity={1.2} />
        <pointLight position={[5, -2, 2]} color="#10B981" intensity={1.0} />

        <KnowledgeCore3D />
        <FloatingBioParticles />
      </Canvas>
    </div>
  );
}

export default Exam3DDiscoveryVisualizer;
