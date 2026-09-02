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

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;
    group.current.rotation.y += dt * 0.32;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.015;
    group.current.scale.setScalar(pulse);
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
          />
        </mesh>
      ))}
      {rungs.map((r, i) => (
        <mesh key={`r-${i}`} position={[0, r.y, 0]} rotation={[0, -r.angle, Math.PI / 2]}>
          <cylinderGeometry args={[0.048, 0.048, 2.8, 10]} />
          <meshStandardMaterial color={PALE} roughness={0.4} metalness={0.1} />
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
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color={PALE} />
      <Environment>
        <Lightformer intensity={1.6} position={[0, 6, 2]} scale={[8, 8, 1]} />
        <Lightformer
          intensity={0.9}
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
