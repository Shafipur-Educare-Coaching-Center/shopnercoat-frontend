'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Crown } from 'lucide-react';
import { RankerDisplayItem } from '@/types/ranking.types';
import { RankingPopperParticles } from './RankingPopperParticles';

interface Ranking3DPodiumProps {
  topRankers: RankerDisplayItem[];
  examTitle?: string;
  triggerPopperKey?: string | number;
}

// Student Avatar Card: Name on top, Photo resting crisp and clear right on pillar rim
function StudentAvatarHtml({
  student,
  rankNumber,
}: {
  student?: RankerDisplayItem;
  rankNumber: number;
}) {
  const [imgError, setImgError] = useState(false);

  if (!student) {
    return (
      <div className="flex flex-col items-center select-none pointer-events-none">
        <div className="mb-1 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs">
          <p className="text-[9px] sm:text-[10px] font-heading font-medium text-slate-400 whitespace-nowrap">
            Awaiting Result
          </p>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/70 border border-dashed border-slate-300 shadow-xs flex items-center justify-center">
          <span className="text-slate-400 text-xs font-bold">#{rankNumber}</span>
        </div>
      </div>
    );
  }

  const isRank1 = rankNumber === 1;
  const isRank2 = rankNumber === 2;

  return (
    <div className="flex flex-col items-center select-none pointer-events-none transition-transform duration-200 hover:scale-105">
      {/* 1st Rank Royal Crown resting above name */}
      {isRank1 && (
        <div className="flex items-center justify-center -mb-0.5 z-20">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_8px_rgba(245,158,11,0.5)] flex items-center justify-center">
            <Crown className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
      )}

      {/* 1. Student Name Pill (Top) */}
      <div
        className={`mb-1 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs border flex items-center gap-1 z-20 ${
          isRank1
            ? 'bg-white/95 border-amber-300/90 text-slate-900 shadow-amber-200/40 ring-1 ring-amber-300/50'
            : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        <p className="text-[10px] sm:text-[11px] font-heading font-bold whitespace-nowrap">
          {student.fullName}
        </p>
      </div>

      {/* 2. Student Photo Avatar Box (Bottom, sits cleanly on top of pillar rim) */}
      <div
        className={`relative overflow-hidden bg-white flex items-center justify-center shrink-0 transition-all ${
          isRank1
            ? 'w-12 h-12 sm:w-13 sm:h-13 rounded-xl ring-3 ring-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)] z-10'
            : isRank2
            ? 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl ring-2 ring-sky-300 shadow-xs z-10'
            : 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl ring-2 ring-rose-300 shadow-xs z-10'
        }`}
      >
        {student.photoUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={student.photoUrl}
            alt={student.fullName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full font-bold flex items-center justify-center text-xs ${
              isRank1
                ? 'bg-amber-100 text-amber-800'
                : isRank2
                ? 'bg-sky-100 text-sky-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {student.initials || 'ST'}
          </div>
        )}
      </div>
    </div>
  );
}

// 1st Rank Royal Champion Pillar Component
function RoyalChampionPillar({
  position,
  student,
}: {
  position: [number, number, number];
  student?: RankerDisplayItem;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 0.68;
  const height = 2.1;
  const topY = height / 2; // 1.05

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.025;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Main Golden Cylinder Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 48]} />
        <meshStandardMaterial
          color="#F6D060"
          roughness={0.22}
          metalness={0.25}
          emissive="#F59E0B"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* 2. Top Royal Gold Rim Cap */}
      <mesh position={[0, topY, 0]}>
        <cylinderGeometry args={[radius * 0.99, radius * 0.99, 0.035, 48]} />
        <meshStandardMaterial
          color="#FFEBB0"
          roughness={0.15}
          metalness={0.35}
        />
      </mesh>

      {/* 3. Upper Royal Torus Bevel Ring */}
      <mesh position={[0, topY - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.015, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.2}
          metalness={0.45}
        />
      </mesh>

      {/* 4. Lower Tiered Royal Plinth Base */}
      <mesh position={[0, -topY + 0.07, 0]}>
        <cylinderGeometry args={[radius * 1.06, radius * 1.12, 0.14, 48]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>

      {/* 5. Center Rank 1 Number (Centered Billboard) */}
      <Html
        position={[0, -0.05, radius + 0.02]}
        center
        distanceFactor={7.5}
        className="pointer-events-none"
      >
        <div className="select-none font-black text-5xl sm:text-6xl font-sans text-white/95 drop-shadow-[0_3px_10px_rgba(180,83,9,0.35)] flex items-center justify-center">
          1
        </div>
      </Html>

      {/* 6. Floating Avatar & Name on top (Floats cleanly right above rim) */}
      <Html
        position={[0, topY + 0.94, 0]}
        center
        distanceFactor={7.0}
        className="pointer-events-none"
      >
        <StudentAvatarHtml student={student} rankNumber={1} />
      </Html>
    </group>
  );
}

// 2nd Rank Silver / Platinum Elite Pillar Component
function SilverElitePillar({
  position,
  student,
}: {
  position: [number, number, number];
  student?: RankerDisplayItem;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 0.60;
  const height = 1.5;
  const topY = height / 2; // 0.75

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime() + 0.6;
    groupRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.022;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Main Silver-Sky Cylinder */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 48]} />
        <meshStandardMaterial
          color="#B8D5F0"
          roughness={0.25}
          metalness={0.18}
          emissive="#60A5FA"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* 2. Top Rim Cap */}
      <mesh position={[0, topY, 0]}>
        <cylinderGeometry args={[radius * 0.99, radius * 0.99, 0.03, 48]} />
        <meshStandardMaterial
          color="#E1EFFF"
          roughness={0.2}
          metalness={0.25}
        />
      </mesh>

      {/* 3. Upper Silver Torus Ring */}
      <mesh position={[0, topY - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.012, 0.025, 16, 48]} />
        <meshStandardMaterial
          color="#93C5FD"
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>

      {/* 4. Lower Tiered Silver Plinth */}
      <mesh position={[0, -topY + 0.06, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 1.1, 0.12, 48]} />
        <meshStandardMaterial
          color="#93C5FD"
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* 5. Center Rank 2 Number (Centered Billboard) */}
      <Html
        position={[0, -0.05, radius + 0.02]}
        center
        distanceFactor={7.5}
        className="pointer-events-none"
      >
        <div className="select-none font-black text-4xl sm:text-5xl font-sans text-white/95 drop-shadow-[0_3px_10px_rgba(30,64,175,0.25)] flex items-center justify-center">
          2
        </div>
      </Html>

      {/* 6. Floating Avatar on top (Floats cleanly right above rim) */}
      <Html
        position={[0, topY + 0.66, 0]}
        center
        distanceFactor={7.0}
        className="pointer-events-none"
      >
        <StudentAvatarHtml student={student} rankNumber={2} />
      </Html>
    </group>
  );
}

// 3rd Rank Bronze / Copper Prestige Pillar Component
function BronzePrestigePillar({
  position,
  student,
}: {
  position: [number, number, number];
  student?: RankerDisplayItem;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 0.58;
  const height = 1.1;
  const topY = height / 2; // 0.55

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime() + 1.2;
    groupRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.02;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Main Bronze-Coral Cylinder */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 48]} />
        <meshStandardMaterial
          color="#F2B8A8"
          roughness={0.25}
          metalness={0.16}
          emissive="#FB7185"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* 2. Top Rim Cap */}
      <mesh position={[0, topY, 0]}>
        <cylinderGeometry args={[radius * 0.99, radius * 0.99, 0.028, 48]} />
        <meshStandardMaterial
          color="#FFE2D9"
          roughness={0.2}
          metalness={0.22}
        />
      </mesh>

      {/* 3. Upper Bronze Torus Ring */}
      <mesh position={[0, topY - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.012, 0.022, 16, 48]} />
        <meshStandardMaterial
          color="#F43F5E"
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>

      {/* 4. Lower Tiered Bronze Plinth */}
      <mesh position={[0, -topY + 0.05, 0]}>
        <cylinderGeometry args={[radius * 1.04, radius * 1.08, 0.1, 48]} />
        <meshStandardMaterial
          color="#F43F5E"
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* 5. Center Rank 3 Number (Centered Billboard) */}
      <Html
        position={[0, -0.05, radius + 0.02]}
        center
        distanceFactor={7.5}
        className="pointer-events-none"
      >
        <div className="select-none font-black text-4xl sm:text-5xl font-sans text-white/95 drop-shadow-[0_3px_10px_rgba(159,18,57,0.25)] flex items-center justify-center">
          3
        </div>
      </Html>

      {/* 6. Floating Avatar on top (Floats cleanly right above rim) */}
      <Html
        position={[0, topY + 0.66, 0]}
        center
        distanceFactor={7.0}
        className="pointer-events-none"
      >
        <StudentAvatarHtml student={student} rankNumber={3} />
      </Html>
    </group>
  );
}

// 3D Scene Root
function PodiumScene({
  topRankers,
  popperTrigger,
}: {
  topRankers: RankerDisplayItem[];
  popperTrigger: string | number;
}) {
  const rank1 = topRankers.find((r) => r.position === 1);
  const rank2 = topRankers.find((r) => r.position === 2);
  const rank3 = topRankers.find((r) => r.position === 3);

  return (
    <group position={[0, -0.68, 0]}>
      {/* Three.js Popper Celebration Particles */}
      <RankingPopperParticles triggerKey={popperTrigger} />

      {/* Rank 2 (Left, Silver-Sky Elite Tier) */}
      <SilverElitePillar
        position={[-1.52, -0.32, 0]}
        student={rank2}
      />

      {/* Rank 1 (Center, Royal Gold Champion Tier) */}
      <RoyalChampionPillar
        position={[0, 0, 0]}
        student={rank1}
      />

      {/* Rank 3 (Right, Bronze-Coral Prestige Tier) */}
      <BronzePrestigePillar
        position={[1.52, -0.52, 0]}
        student={rank3}
      />
    </group>
  );
}

export function Ranking3DPodium({
  topRankers,
  triggerPopperKey = 'initial',
}: Ranking3DPodiumProps) {
  const [manualBursts, setManualBursts] = useState(0);
  const activePopperKey = `${triggerPopperKey}-${manualBursts}`;

  const handleManualBurst = () => {
    setManualBursts((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[350px] md:h-[370px] lg:h-[390px] flex items-center justify-center select-none overflow-visible">
      {/* Interactive Replay Poppers Button */}
      <button
        type="button"
        onClick={handleManualBurst}
        title="Celebrate Top Rankers"
        className="absolute bottom-2 right-2 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 border border-slate-200/90 shadow-md backdrop-blur-md text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
        <span>Celebrate</span>
      </button>

      {/* Three.js Canvas */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.42, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full overflow-visible"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 8, 5]} intensity={1.9} />
        <directionalLight position={[-4, 3, -2]} intensity={0.7} color="#E0F2FE" />
        <pointLight position={[0, 4, 3]} intensity={0.9} />

        <PodiumScene
          topRankers={topRankers}
          popperTrigger={activePopperKey}
        />
      </Canvas>
    </div>
  );
}
