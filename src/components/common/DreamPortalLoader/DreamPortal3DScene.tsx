'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. Realistic Grand Architectural "Doors of Dream"
// -------------------------------------------------------------
function DreamDoors({ isOpen, progress }: { isOpen: boolean; progress: number }) {
  const leftHingeRef = useRef<THREE.Group>(null);
  const rightHingeRef = useRef<THREE.Group>(null);
  const seamLightRef = useRef<THREE.Mesh>(null);
  const currentAngle = useRef(0);

  useFrame((_, delta) => {
    // Majestic door opening physics: smooth ease-out with soft inertia
    const targetAngle = isOpen ? Math.PI * 0.46 : 0;
    currentAngle.current = THREE.MathUtils.lerp(
      currentAngle.current,
      targetAngle,
      delta * 2.8
    );

    if (leftHingeRef.current) {
      leftHingeRef.current.rotation.y = -currentAngle.current;
    }
    if (rightHingeRef.current) {
      rightHingeRef.current.rotation.y = currentAngle.current;
    }

    // Seam light expands then fades as doors part
    if (seamLightRef.current) {
      const seamMat = seamLightRef.current.material as THREE.MeshBasicMaterial;
      if (isOpen) {
        seamMat.opacity = THREE.MathUtils.lerp(seamMat.opacity, 0, delta * 3);
      } else {
        seamMat.opacity = 0.85 + Math.sin(Date.now() * 0.003) * 0.15;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      
      {/* Central Seam Glowing Light-Crack (before opening) */}
      <mesh ref={seamLightRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[0.04, 3.4]} />
        <meshBasicMaterial
          color="#5EEAD4"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ========================================================= */}
      {/* LEFT DOOR HINGE (Pivoted at x = -1.65) */}
      {/* ========================================================= */}
      <group ref={leftHingeRef} position={[-1.65, 0, 0]}>
        <group position={[0.825, 0, 0]}>
          
          {/* Main Frosted Smart-Glass Door Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.62, 3.42, 0.08]} />
            <meshStandardMaterial
              color="#032622"
              emissive="#0D9488"
              emissiveIntensity={0.22}
              roughness={0.12}
              metalness={0.65}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Outer Metallic Bevel Frame */}
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[1.56, 3.36]} />
            <meshBasicMaterial
              color="#2DD4BF"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>

          {/* Vertical Architectural LED Light Strip */}
          <mesh position={[0.74, 0, 0.046]}>
            <boxGeometry args={[0.02, 3.3, 0.01]} />
            <meshStandardMaterial
              color="#5EEAD4"
              emissive="#2DD4BF"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Modern Long Vertical Handle (Stainless Chrome) */}
          <group position={[0.68, 0, 0.08]}>
            {/* Main Bar */}
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
              <meshStandardMaterial
                color="#E2E8F0"
                metalness={0.95}
                roughness={0.08}
              />
            </mesh>
            {/* Top Mount */}
            <mesh position={[-0.04, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Bottom Mount */}
            <mesh position={[-0.04, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Medical Cross Embossed Inlay */}
          <group position={[-0.15, 0.4, 0.045]}>
            <mesh>
              <boxGeometry args={[0.05, 0.5, 0.01]} />
              <meshStandardMaterial
                color="#99F6E4"
                emissive="#2DD4BF"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 0.05, 0.01]} />
              <meshStandardMaterial
                color="#99F6E4"
                emissive="#2DD4BF"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>

        </group>
      </group>

      {/* ========================================================= */}
      {/* RIGHT DOOR HINGE (Pivoted at x = 1.65) */}
      {/* ========================================================= */}
      <group ref={rightHingeRef} position={[1.65, 0, 0]}>
        <group position={[-0.825, 0, 0]}>
          
          {/* Main Frosted Smart-Glass Door Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.62, 3.42, 0.08]} />
            <meshStandardMaterial
              color="#032622"
              emissive="#0D9488"
              emissiveIntensity={0.22}
              roughness={0.12}
              metalness={0.65}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Outer Metallic Bevel Frame */}
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[1.56, 3.36]} />
            <meshBasicMaterial
              color="#2DD4BF"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>

          {/* Vertical Architectural LED Light Strip */}
          <mesh position={[-0.74, 0, 0.046]}>
            <boxGeometry args={[0.02, 3.3, 0.01]} />
            <meshStandardMaterial
              color="#5EEAD4"
              emissive="#2DD4BF"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Modern Long Vertical Handle (Stainless Chrome) */}
          <group position={[-0.68, 0, 0.08]}>
            {/* Main Bar */}
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
              <meshStandardMaterial
                color="#E2E8F0"
                metalness={0.95}
                roughness={0.08}
              />
            </mesh>
            {/* Top Mount */}
            <mesh position={[0.04, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Bottom Mount */}
            <mesh position={[0.04, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Medical Cross Embossed Inlay */}
          <group position={[0.15, 0.4, 0.045]}>
            <mesh>
              <boxGeometry args={[0.05, 0.5, 0.01]} />
              <meshStandardMaterial
                color="#99F6E4"
                emissive="#2DD4BF"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 0.05, 0.01]} />
              <meshStandardMaterial
                color="#99F6E4"
                emissive="#2DD4BF"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>

        </group>
      </group>

      {/* Heavy Titanium Outer Archway Frame */}
      <group position={[0, 0, -0.06]}>
        {/* Top Header */}
        <mesh position={[0, 1.78, 0]}>
          <boxGeometry args={[3.6, 0.16, 0.18]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
        {/* Left Pillar */}
        <mesh position={[-1.76, 0, 0]}>
          <boxGeometry args={[0.16, 3.56, 0.18]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[1.76, 0, 0]}>
          <boxGeometry args={[0.16, 3.56, 0.18]} />
          <meshStandardMaterial
            color="#0F766E"
            emissive="#14B8A6"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
      </group>

    </group>
  );
}

// -------------------------------------------------------------
// 2. Swirling Stardust & Warp Bio-Particles
// -------------------------------------------------------------
function DreamParticleField({
  isOpen,
  count = 160,
}: {
  isOpen: boolean;
  count?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const teal = new THREE.Color('#0D9488');
    const cyan = new THREE.Color('#22D3EE');
    const emerald = new THREE.Color('#34D399');
    const gold = new THREE.Color('#FDE047');

    for (let i = 0; i < count; i++) {
      const radius = 0.4 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 8 - 0.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.6;
      pos[i * 3 + 2] = z;

      const rand = Math.random();
      const chosen =
        rand < 0.45 ? cyan : rand < 0.7 ? teal : rand < 0.88 ? emerald : gold;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;

      // Accelerated particle surge when doors open
      const speed = isOpen ? delta * 15.0 : delta * 0.75;

      for (let i = 0; i < count; i++) {
        arr[i * 3 + 2] += speed;

        if (arr[i * 3 + 2] > 4.8) {
          arr[i * 3 + 2] = -4.5;
        }

        // Ambient gentle vortex swirl
        if (!isOpen) {
          const x = arr[i * 3];
          const y = arr[i * 3 + 1];
          const rotSpeed = 0.25 * delta;
          arr[i * 3] = x * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);
          arr[i * 3 + 1] = x * Math.sin(rotSpeed) + y * Math.cos(rotSpeed);
        }
      }

      posAttr.needsUpdate = true;
      pointsRef.current.rotation.z += delta * 0.04;
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
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 3. Volumetric Core Portal Light & Smooth Camera Dolly
// -------------------------------------------------------------
function PortalLightingAndCamera({ isOpen }: { isOpen: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // Camera dolly push-forward through the doors
    if (isOpen) {
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        1.6,
        delta * 2.4
      );
    } else {
      // Natural responsive mouse tilt
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        state.pointer.x * 0.35,
        0.05
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        state.pointer.y * 0.25,
        0.05
      );
    }

    if (lightRef.current) {
      const targetIntensity = isOpen ? 15 : 2.5;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        delta * 3.5
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 5, 4]} intensity={0.9} color="#CCFBF1" />
      <pointLight position={[-3, 2, 2]} intensity={1.3} color="#0D9488" />
      <pointLight position={[3, -2, 2]} intensity={1.1} color="#06B6D4" />

      {/* Grand Radiance Spotlight from inside the portal */}
      <pointLight
        ref={lightRef}
        position={[0, 0, -1.0]}
        intensity={2.5}
        color="#2DD4BF"
        distance={14}
      />
    </>
  );
}

// -------------------------------------------------------------
// Main Exported 3D Scene
// -------------------------------------------------------------
interface DreamPortal3DSceneProps {
  isDoorsOpen: boolean;
  progress: number;
}

export function DreamPortal3DScene({
  isDoorsOpen,
  progress,
}: DreamPortal3DSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PortalLightingAndCamera isOpen={isDoorsOpen} />
        <DreamDoors isOpen={isDoorsOpen} progress={progress} />
        <DreamParticleField isOpen={isDoorsOpen} count={160} />
      </Canvas>
    </div>
  );
}

export default DreamPortal3DScene;
