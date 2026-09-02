'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TEAL = "#0e8f96";
const DEEP = "#075a63";
const PALE = "#bfe4e6";

function Helix() {
  const group = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const nodes = useMemo(() => {
    const items: { pos: [number, number, number]; strand: 0 | 1; t: number }[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = (t - 0.5) * 9.2; // Taller vertical height
      const angle = t * Math.PI * 4.8;
      items.push({ pos: [Math.cos(angle) * 1.4, y, Math.sin(angle) * 1.4], strand: 0, t });
      items.push({
        pos: [Math.cos(angle + Math.PI) * 1.4, y, Math.sin(angle + Math.PI) * 1.4],
        strand: 1,
        t,
      });
    }
    return items;
  }, []);

  const rungs = useMemo(() => {
    const items: { y: number; angle: number }[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      items.push({ y: (t - 0.5) * 9.2, angle: t * Math.PI * 4.8 });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;
    const t = timeRef.current;

    if (!group.current) return;

    // 1. Continuous smooth 3D rotation
    group.current.rotation.y += dt * 0.45;

    // 2. Dynamic multi-harmonic biological pulse (heartbeat contraction & expansion)
    const primaryPulse = Math.sin(t * 2.2) * 0.06;
    const secondaryPulse = Math.sin(t * 4.4) * 0.03;
    const scale = 1 + primaryPulse + secondaryPulse;
    group.current.scale.set(scale, scale, scale);

    // 3. Dynamic 3D floating and organic tilt motion
    group.current.position.y = Math.sin(t * 1.5) * 0.22;
    group.current.rotation.x = 0.1 + Math.sin(t * 0.9) * 0.05;
    group.current.rotation.z = 0.14 + Math.cos(t * 1.2) * 0.04;
  });

  return (
    <group ref={group} rotation={[0.1, 0, 0.14]}>
      {nodes.map((n, i) => (
        <mesh key={`n-${i}`} position={n.pos}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial
            color={n.strand === 0 ? TEAL : DEEP}
            roughness={0.25}
            metalness={0.35}
            emissive={n.strand === 0 ? "#0d9488" : "#0f766e"}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {rungs.map((r, i) => (
        <mesh key={`r-${i}`} position={[0, r.y, 0]} rotation={[0, -r.angle, Math.PI / 2]}>
          <cylinderGeometry args={[0.048, 0.048, 2.8, 10]} />
          <meshStandardMaterial
            color={PALE}
            roughness={0.4}
            metalness={0.1}
            emissive="#bfe4e6"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HelixScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 9.8], fov: 46 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color={PALE} />
      <Environment>
        <Lightformer intensity={1.8} position={[0, 6, 2]} scale={[8, 8, 1]} />
        <Lightformer
          intensity={1.0}
          color="#bfe4e6"
          position={[-6, 1, -2]}
          rotation-y={Math.PI / 2}
          scale={[14, 2, 1]}
        />
      </Environment>
      <Helix />
    </Canvas>
  );
}
