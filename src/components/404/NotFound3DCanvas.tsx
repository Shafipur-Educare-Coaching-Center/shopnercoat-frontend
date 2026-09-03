'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. Dual-Toned Medical Capsule Pill in Zero-G
// -------------------------------------------------------------
function MedicalCapsule({ shockTrigger }: { shockTrigger: number }) {
  const capsuleRef = useRef<THREE.Group>(null);
  const shockVelocity = useRef(0);

  useEffect(() => {
    if (shockTrigger > 0) {
      shockVelocity.current = 0.35;
    }
  }, [shockTrigger]);

  useFrame((state, delta) => {
    if (capsuleRef.current) {
      // Ambient slow rotation
      capsuleRef.current.rotation.x += delta * 0.4;
      capsuleRef.current.rotation.y += delta * 0.6;
      capsuleRef.current.rotation.z += delta * 0.2;

      // Cursor parallax tracking
      capsuleRef.current.position.x = THREE.MathUtils.lerp(
        capsuleRef.current.position.x,
        state.pointer.x * 0.6,
        0.05
      );
      capsuleRef.current.position.y = THREE.MathUtils.lerp(
        capsuleRef.current.position.y,
        state.pointer.y * 0.4 + (shockVelocity.current > 0 ? shockVelocity.current : 0),
        0.08
      );

      // Damp shock velocity
      if (shockVelocity.current > 0) {
        shockVelocity.current = THREE.MathUtils.lerp(shockVelocity.current, 0, 0.1);
      }
    }
  });

  return (
    <group ref={capsuleRef} position={[0, 0.4, 0]} scale={0.95}>
      {/* Top Half: Medical Emerald Green */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.7, 32]} />
        <meshStandardMaterial
          color="#0D9488"
          roughness={0.15}
          metalness={0.2}
          emissive="#00594D"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#0D9488"
          roughness={0.15}
          metalness={0.2}
          emissive="#00594D"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Bottom Half: Clinical Pure White */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.7, 32]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Middle Golden/Cyan Dividing Ring */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.43, 0.03, 16, 32]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#06B6D4"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 2. Sculpted Floating 3D "404" Number Meshes
// -------------------------------------------------------------
function FloatingNumbers({ shockTrigger }: { shockTrigger: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const shockScale = useRef(1);

  useEffect(() => {
    if (shockTrigger > 0) {
      shockScale.current = 1.25;
    }
  }, [shockTrigger]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating oscillation
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;

      // Return shock scale smoothly
      if (shockScale.current > 1) {
        shockScale.current = THREE.MathUtils.lerp(shockScale.current, 1, 0.08);
        groupRef.current.scale.setScalar(shockScale.current);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, -1.2]}>
      {/* Left 4 */}
      <group position={[-2.2, 0, 0]}>
        {/* Vertical stem */}
        <mesh position={[-0.3, 0.2, 0]}>
          <boxGeometry args={[0.22, 1.4, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Horizontal bar */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.8, 0.22, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Right long stem */}
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.22, 1.8, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right 4 */}
      <group position={[2.2, 0, 0]}>
        {/* Vertical stem */}
        <mesh position={[-0.3, 0.2, 0]}>
          <boxGeometry args={[0.22, 1.4, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Horizontal bar */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.8, 0.22, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Right long stem */}
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.22, 1.8, 0.22]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3. Pulsing Heartbeat / Stethoscope ECG Ring
// -------------------------------------------------------------
function HeartbeatRing({ shockTrigger }: { shockTrigger: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Simulate ECG double-beat pulse rhythm (lub-dub)
    const cycle = t % 1.2;
    let pulse = 1;
    if (cycle < 0.15) {
      pulse = 1 + Math.sin((cycle / 0.15) * Math.PI) * 0.18;
    } else if (cycle >= 0.2 && cycle < 0.35) {
      pulse = 1 + Math.sin(((cycle - 0.2) / 0.15) * Math.PI) * 0.12;
    }

    if (ringRef.current) {
      ringRef.current.scale.set(pulse, pulse, pulse);
      ringRef.current.rotation.z += 0.008;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= 0.005;
      outerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group position={[0, 0.2, -0.2]}>
      {/* Primary Cyan ECG Glow Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.35, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#22D3EE"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbiting Stethoscope Head / Outer Dashed Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.7, 0.015, 16, 48]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#34D399"
          emissiveIntensity={0.7}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 4. Interactive Bio-Particle Galaxy (Reacts to Shock & Cursor)
// -------------------------------------------------------------
function BioParticleConstellation({
  count = 90,
  shockTrigger,
}: {
  count?: number;
  shockTrigger: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return pos;
  }, [count]);

  const [positions, colors] = useMemo(() => {
    const col = new Float32Array(count * 3);
    const teal = new THREE.Color('#0D9488');
    const cyan = new THREE.Color('#22D3EE');
    const emerald = new THREE.Color('#34D399');

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      const chosen = rand < 0.4 ? teal : rand < 0.7 ? cyan : emerald;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return [new Float32Array(basePositions), col];
  }, [count, basePositions]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        state.pointer.y * 0.1,
        0.03
      );
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(
        pointsRef.current.rotation.z,
        -state.pointer.x * 0.1,
        0.03
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// -------------------------------------------------------------
// 5. Defibrillator Shockwave Ring (Triggers on Canvas Click)
// -------------------------------------------------------------
function DefibrillatorPulse({ trigger }: { trigger: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);
  const scaleRef = useRef(0.1);

  useEffect(() => {
    if (trigger > 0) {
      scaleRef.current = 0.2;
      opacityRef.current = 0.9;
    }
  }, [trigger]);

  useFrame((_, delta) => {
    if (meshRef.current && opacityRef.current > 0) {
      scaleRef.current += delta * 4.5;
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, delta * 3.5);

      meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = opacityRef.current;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.05, 48]} />
      <meshBasicMaterial
        color="#22D3EE"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// -------------------------------------------------------------
// Main Exported Interactive 3D Canvas
// -------------------------------------------------------------
interface NotFound3DCanvasProps {
  externalShockTrigger?: number;
  onShock?: () => void;
}

export function NotFound3DCanvas({
  externalShockTrigger = 0,
  onShock,
}: NotFound3DCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [localShock, setLocalShock] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentShock = externalShockTrigger + localShock;

  const handleClick = () => {
    setLocalShock((prev) => prev + 1);
    if (onShock) onShock();
  };

  if (!mounted) {
    // Ambient glowing placeholder while WebGL initializes
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-64 rounded-full bg-teal-400/10 blur-[90px] animate-pulse" />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="absolute inset-0 w-full h-full cursor-pointer select-none"
      title="Click anywhere in 3D to shock / defibrillate!"
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 6, 6]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-5, -4, -1]} intensity={1.0} color="#2DD4BF" />
        <pointLight position={[4, 3, 2]} intensity={0.8} color="#06B6D4" />

        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.5}>
          <FloatingNumbers shockTrigger={currentShock} />
          <MedicalCapsule shockTrigger={currentShock} />
          <HeartbeatRing shockTrigger={currentShock} />
        </Float>

        <DefibrillatorPulse trigger={currentShock} />
        <BioParticleConstellation count={80} shockTrigger={currentShock} />
      </Canvas>
    </div>
  );
}

export default NotFound3DCanvas;
