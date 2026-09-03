'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Gyro Calibration Rings around the core
function GyroRings() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.3;
      outerRingRef.current.rotation.y += delta * 0.2;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.4;
      innerRingRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group>
      {/* Outer Emerald Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#0D9488"
          emissive="#14B8A6"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner Cyan Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#22D3EE"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// 3D DNA Helix Core
function HelixCore() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsCount = 28;

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1: [number, number, number][] = [];
    const s2: [number, number, number][] = [];
    const r: { start: [number, number, number]; end: [number, number, number] }[] = [];

    const radius = 0.65;
    const height = 2.4;
    const turns = 2.0;

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
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.pointer.y * 0.3,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -state.pointer.x * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 (Emerald) */}
      {strand1.map((pos, idx) => (
        <mesh key={`s1-${idx}`} position={pos}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#0D9488"
            emissive="#10B981"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Strand 2 (Cyan) */}
      {strand2.map((pos, idx) => (
        <mesh key={`s2-${idx}`} position={pos}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#38BDF8"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Rung connectors */}
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
              <cylinderGeometry args={[0.012, 0.012, length, 6]} />
              <meshStandardMaterial
                color="#5EEAD4"
                emissive="#0D9488"
                emissiveIntensity={0.4}
                transparent
                opacity={0.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Surrounding floating particle cloud
function Particles({ count = 30 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const teal = new THREE.Color('#0D9488');
    const cyan = new THREE.Color('#06B6D4');
    const emerald = new THREE.Color('#10B981');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;

      const rand = Math.random();
      const color = rand < 0.4 ? teal : rand < 0.7 ? cyan : emerald;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function Student3DHeroVisualizer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-teal-500/5 rounded-2xl">
        <div className="size-12 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-3, -3, -1]} intensity={0.8} color="#2DD4BF" />

        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.35}>
          <HelixCore />
          <GyroRings />
        </Float>

        <Particles count={30} />
      </Canvas>
    </div>
  );
}

export default Student3DHeroVisualizer;
