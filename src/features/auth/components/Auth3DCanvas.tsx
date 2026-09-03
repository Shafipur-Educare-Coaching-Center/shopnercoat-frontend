'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Refined, delicate 3D DNA Helix with tiny glowing micro-nodes
function SubtleMedicalHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsCount = 48;

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1: [number, number, number][] = [];
    const s2: [number, number, number][] = [];
    const r: { start: [number, number, number]; end: [number, number, number] }[] = [];

    const radius = 2.2;
    const height = 9.0;
    const turns = 2.8;

    for (let i = 0; i < pointsCount; i++) {
      const t = i / pointsCount;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      s1.push([x1, y, z1]);
      s2.push([x2, y, z2]);

      if (i % 2 === 0) {
        r.push({
          start: [x1, y, z1],
          end: [x2, y, z2],
        });
      }
    }
    return { strand1: s1, strand2: s2, rungs: r };
  }, [pointsCount]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth ambient rotation
      groupRef.current.rotation.y += delta * 0.2;
      // Gentle cursor parallax tracking
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.pointer.y * 0.15,
        0.04
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -state.pointer.x * 0.15,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef} position={[-2.5, 0, -2]}>
      {/* Primary Strand Nodes (Delicate Emerald Glow) */}
      {strand1.map((pos, idx) => (
        <mesh key={`s1-${idx}`} position={pos}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#0D9488"
            emissive="#14B8A6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}

      {/* Secondary Strand Nodes (Delicate Cyan Glow) */}
      {strand2.map((pos, idx) => (
        <mesh key={`s2-${idx}`} position={pos}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#22D3EE"
            emissiveIntensity={0.8}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}

      {/* Micro-connecting Rungs */}
      {rungs.map((rung, idx) => {
        const start = new THREE.Vector3(...rung.start);
        const end = new THREE.Vector3(...rung.end);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);

        return (
          <group key={`rung-${idx}`} position={mid}>
            <mesh
              rotation={[
                Math.atan2(end.y - start.y, Math.sqrt((end.x - start.x) ** 2 + (end.z - start.z) ** 2)),
                Math.atan2(end.x - start.x, end.z - start.z),
                0,
              ]}
            >
              <cylinderGeometry args={[0.008, 0.008, length, 6]} />
              <meshStandardMaterial
                color="#5EEAD4"
                emissive="#0D9488"
                emissiveIntensity={0.3}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Ambient Floating Bio-Constellation Particle Cloud
function AmbientParticleField({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const tealColor = new THREE.Color('#0D9488');
    const cyanColor = new THREE.Color('#06B6D4');
    const emeraldColor = new THREE.Color('#10B981');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

      const rand = Math.random();
      const chosenColor = rand < 0.4 ? tealColor : rand < 0.7 ? cyanColor : emeraldColor;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export function Auth3DCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full h-full fixed inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-45">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} color="#FFFFFF" />
        <pointLight position={[-4, -3, -1]} intensity={0.8} color="#2DD4BF" />
        
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <SubtleMedicalHelix />
        </Float>
        
        <AmbientParticleField count={45} />
      </Canvas>
    </div>
  );
}

export default Auth3DCanvas;
