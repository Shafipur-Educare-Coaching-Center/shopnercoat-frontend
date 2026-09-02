'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeCharacterCanvasProps {
  isMoving: boolean;
  isAtFinish?: boolean;
  burstCount?: number;
}

function CandidateModel({
  isMoving,
  isAtFinish,
}: {
  isMoving: boolean;
  isAtFinish?: boolean;
}) {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const walkPhaseRef = useRef(0);

  const colors = useMemo(
    () => ({
      skin: '#FCD34D',
      hair: '#1E293B',
      whiteCoat: '#F8FAFC',
      scrubs: '#0D9488',
      pants: '#0F172A',
      shoes: '#FFFFFF',
      stethoscope: '#14B8A6',
      tablet: '#0F766E',
      screen: '#38BDF8',
      goldHalo: '#F59E0B',
    }),
    []
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (isAtFinish) {
      // VICTORY CELEBRATION POSE AT FINISH LINE
      walkPhaseRef.current += dt * 3.5;
      const t = walkPhaseRef.current;

      // Celebrate with arms raised high!
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI * 0.75 + Math.sin(t * 4) * 0.15;
        leftArmRef.current.rotation.z = -0.3 + Math.cos(t * 3) * 0.1;

        rightArmRef.current.rotation.x = -Math.PI * 0.75 + Math.cos(t * 4) * 0.15;
        rightArmRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.1;
      }

      // Small joyful victory jumping bob
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.06;
        bodyRef.current.rotation.y = Math.sin(t * 2) * 0.1;
      }

      // Neutral standing legs
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    } else {
      // WALKING STRIDE KINEMATICS
      const walkSpeed = isMoving ? 14 : 3;
      walkPhaseRef.current += dt * walkSpeed;
      const phase = walkPhaseRef.current;

      const strideAmp = isMoving ? 0.55 : 0.08;
      const armAmp = isMoving ? 0.45 : 0.06;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(phase) * strideAmp;
        rightLegRef.current.rotation.x = -Math.sin(phase) * strideAmp;
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(phase) * armAmp;
        leftArmRef.current.rotation.z = 0;
        rightArmRef.current.rotation.x = Math.sin(phase) * armAmp;
        rightArmRef.current.rotation.z = 0;
      }

      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(phase * 2)) * 0.035;
        bodyRef.current.rotation.y = Math.sin(phase) * 0.04;
      }
    }
  });

  return (
    <group position={[0, -0.1, 0]} rotation={[0.18, 0, 0]}>
      {/* Ground Aura Ring beneath Candidate */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, isAtFinish ? 0.55 : 0.42, 32]} />
        <meshBasicMaterial
          color={isAtFinish ? colors.goldHalo : '#14B8A6'}
          transparent
          opacity={isAtFinish ? 0.6 : 0.35}
        />
      </mesh>

      <group ref={bodyRef}>
        {/* Head */}
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial color={colors.skin} roughness={0.4} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.56, -0.03]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={colors.hair} roughness={0.6} />
        </mesh>

        {/* Torso: Medical White Coat */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.3, 0.42, 0.18]} />
          <meshStandardMaterial color={colors.whiteCoat} roughness={0.3} />
        </mesh>

        {/* Inner Teal Scrubs */}
        <mesh position={[0, 0.22, 0.095]}>
          <planeGeometry args={[0.12, 0.15]} />
          <meshStandardMaterial color={colors.scrubs} roughness={0.4} />
        </mesh>

        {/* Stethoscope */}
        <mesh position={[0, 0.2, 0.1]}>
          <torusGeometry args={[0.09, 0.015, 12, 24, Math.PI]} />
          <meshStandardMaterial color={colors.stethoscope} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Left Arm with Notebook / Tablet */}
        <group ref={leftArmRef} position={[-0.2, 0.24, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.04, 0.3, 12]} />
            <meshStandardMaterial color={colors.whiteCoat} roughness={0.3} />
          </mesh>
          {/* Medical Tablet / Clipboard */}
          <mesh position={[-0.03, -0.24, 0.06]} rotation={[0.4, 0.2, 0]}>
            <boxGeometry args={[0.03, 0.17, 0.12]} />
            <meshStandardMaterial color={colors.tablet} roughness={0.2} />
          </mesh>
          <mesh position={[-0.01, -0.24, 0.06]} rotation={[0.4, 0.2, 0]}>
            <planeGeometry args={[0.005, 0.14]} />
            <meshStandardMaterial color={colors.screen} emissive={colors.screen} emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.2, 0.24, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.04, 0.3, 12]} />
            <meshStandardMaterial color={colors.whiteCoat} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color={colors.skin} roughness={0.4} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.09, -0.12, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.38, 12]} />
            <meshStandardMaterial color={colors.pants} roughness={0.5} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.44, 0.04]}>
            <boxGeometry args={[0.07, 0.055, 0.13]} />
            <meshStandardMaterial color={colors.shoes} roughness={0.3} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.09, -0.12, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.38, 12]} />
            <meshStandardMaterial color={colors.pants} roughness={0.5} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.44, 0.04]}>
            <boxGeometry args={[0.07, 0.055, 0.13]} />
            <meshStandardMaterial color={colors.shoes} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 3D Confetti Particle Popper Explosion System
function ConfettiPopperSystem({ active, burstCount }: { active: boolean; burstCount: number }) {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      z: 0,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      vz: (Math.random() - 0.5) * 2.5,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      vRotX: (Math.random() - 0.5) * 10,
      vRotY: (Math.random() - 0.5) * 10,
      vRotZ: (Math.random() - 0.5) * 10,
      scale: Math.random() * 0.06 + 0.04,
      color: new THREE.Color(['#F59E0B', '#10B981', '#0D9488', '#F43F5E', '#38BDF8', '#8B5CF6'][Math.floor(Math.random() * 6)]),
      life: 0,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const triggerBurst = () => {
    particles.forEach((p) => {
      const isLeft = Math.random() > 0.5;
      p.x = isLeft ? -0.8 : 0.8;
      p.y = -0.3;
      p.z = (Math.random() - 0.5) * 1;
      p.vx = (isLeft ? 1 : -1) * (Math.random() * 2.5 + 1) + (Math.random() - 0.5) * 1.5;
      p.vy = Math.random() * 4 + 2.5;
      p.vz = (Math.random() - 0.5) * 1.5;
      p.life = 1.0;
    });
  };

  useEffect(() => {
    if (active || burstCount > 0) {
      triggerBurst();
    }
  }, [active, burstCount]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      if (p.life > 0) {
        p.vy -= 9.8 * dt * 0.45;
        p.vx *= 0.98;
        p.vz *= 0.98;

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        p.rotX += p.vRotX * dt;
        p.rotY += p.vRotY * dt;
        p.rotZ += p.vRotZ * dt;

        p.life -= dt * 0.4;

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
        const currentScale = p.scale * Math.max(0, Math.min(1, p.life * 2));
        dummy.scale.set(currentScale, currentScale * 1.6, currentScale * 0.2);
        dummy.updateMatrix();

        meshRef.current?.setMatrixAt(i, dummy.matrix);
        meshRef.current?.setColorAt(i, p.color);
      } else {
        dummy.position.set(0, -50, 0);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.3} metalness={0.2} />
    </instancedMesh>
  );
}

export function ThreeCharacterCanvas({
  isMoving,
  isAtFinish = false,
  burstCount = 0,
}: ThreeCharacterCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.1, 2.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-3, -2, -2]} intensity={0.5} color="#99F6E4" />

        <CandidateModel isMoving={isMoving} isAtFinish={isAtFinish} />
        <ConfettiPopperSystem active={isAtFinish} burstCount={burstCount} />
      </Canvas>
    </div>
  );
}
