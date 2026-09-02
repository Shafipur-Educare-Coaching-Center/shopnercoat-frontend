'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  color: THREE.Color;
  size: number;
  aspect: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'rect' | 'circle' | 'star';
}

interface RankingPopperParticlesProps {
  triggerKey?: string | number;
}

const CONFETTI_COLORS = [
  '#F59E0B', // Gold
  '#0D9488', // Emerald/Teal
  '#38BDF8', // Cyan
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EF4444', // Red/Coral
  '#10B981', // Green
  '#FBBF24', // Yellow
  '#FFFFFF', // White
];

// Origin points matching the tops of the 3 podium pillars
const EMITTER_ORIGINS = [
  new THREE.Vector3(0, 1.1, 0),       // Top of 1st pillar
  new THREE.Vector3(-1.52, 0.45, 0),  // Top of 2nd pillar
  new THREE.Vector3(1.52, -0.05, 0),  // Top of 3rd pillar
];

export function RankingPopperParticles({ triggerKey }: RankingPopperParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particlesRef = useRef<Particle[]>([]);
  const count = 180;

  // Initialize burst particles
  const spawnBurst = () => {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      // Pick emitter origin (1st pillar gets slightly more particles)
      const originIndex = i % 5 === 0 ? 1 : i % 5 === 1 ? 2 : 0;
      const origin = EMITTER_ORIGINS[originIndex];

      // Upward cone velocity with slight spread
      const angle = Math.random() * Math.PI * 2;
      const upwardSpeed = 4.5 + Math.random() * 4.5;
      const horizontalSpeed = 1.2 + Math.random() * 2.2;

      const vx = Math.cos(angle) * horizontalSpeed * (originIndex === 1 ? -0.8 : originIndex === 2 ? 0.8 : 1);
      const vy = upwardSpeed;
      const vz = (Math.sin(angle) * horizontalSpeed * 0.7) + (Math.random() - 0.5) * 1.5;

      const colorHex = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const maxLife = 2.8 + Math.random() * 1.5;

      particles.push({
        position: origin.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.4
        )),
        velocity: new THREE.Vector3(vx, vy, vz),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        color: new THREE.Color(colorHex),
        size: 0.08 + Math.random() * 0.06,
        aspect: 0.4 + Math.random() * 1.6,
        alpha: 1,
        life: 0,
        maxLife,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
      });
    }

    particlesRef.current = particles;
  };

  // Trigger burst on initial mount and when triggerKey changes
  useEffect(() => {
    spawnBurst();
  }, [triggerKey]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const gravity = -6.5;
    const drag = 0.965;

    particlesRef.current.forEach((p, idx) => {
      p.life += dt;

      if (p.life < p.maxLife) {
        // Apply physics
        p.velocity.y += gravity * dt;
        p.velocity.x *= Math.pow(drag, dt * 60);
        p.velocity.z *= Math.pow(drag, dt * 60);
        p.velocity.y *= Math.pow(drag, dt * 60);

        // Flutter oscillation
        p.velocity.x += Math.sin(p.life * 8 + idx) * 0.03;

        p.position.addScaledVector(p.velocity, dt);

        p.rotation.x += p.rotationSpeed.x * dt;
        p.rotation.y += p.rotationSpeed.y * dt;
        p.rotation.z += p.rotationSpeed.z * dt;

        // Fading scale towards the end of life
        const lifeRatio = p.life / p.maxLife;
        const scaleProgress = lifeRatio > 0.7 ? 1 - ((lifeRatio - 0.7) / 0.3) : Math.min(p.life * 6, 1);
        const scale = p.size * Math.max(0, scaleProgress);

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.set(scale, scale * p.aspect, scale);
        dummy.updateMatrix();

        meshRef.current?.setMatrixAt(idx, dummy.matrix);
        meshRef.current?.setColorAt(idx, p.color);
      } else {
        // Hide dead particle
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(idx, dummy.matrix);
      }
    });

    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  );
}
