'use client';
import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";

const HelixScene = lazy(() => import("./HelixScene"));

/**
 * Decorative 3D helix with increased vertical height and floating codon base pair tags.
 */
export function HeroVisual() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = window.matchMedia("(min-width: 768px)").matches;
    if (!reduced && wideEnough) setEnabled(true);
  }, []);

  return (
    <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[660px] max-w-xl flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
      {/* Background glow effects */}
      <div className="absolute inset-x-8 inset-y-16 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute inset-x-16 inset-y-24 rounded-full bg-primary/10 blur-2xl" />
      
      {/* 3D Helix Canvas */}
      {enabled && (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <HelixScene />
          </div>
        </Suspense>
      )}

      {/* Reduced-motion / Mobile Fallback */}
      {!enabled && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-48 rounded-full border-4 border-primary/30 border-t-primary/80 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      )}

      {/* Floating Codon Base Pair Bonds */}
      {/* 1. Top-Left: A ══ T */}
      <motion.div 
        animate={{ y: [-6, 6, -6], rotate: [-1, 1, -1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-2 sm:left-6 z-20 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-teal-200 shadow-sm flex items-center gap-2"
      >
        <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        <span className="font-mono text-xs font-bold text-teal-800 tracking-wider">A ══ T</span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">Adenine • Thymine</span>
      </motion.div>

      {/* 2. Mid-Right: G ═══ C */}
      <motion.div 
        animate={{ y: [6, -6, 6], rotate: [1, -1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-1/3 -right-2 sm:right-2 z-20 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-teal-200 shadow-sm flex items-center gap-2"
      >
        <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="font-mono text-xs font-bold text-teal-800 tracking-wider">G ═══ C</span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">Guanine • Cytosine</span>
      </motion.div>

      {/* 3. Lower-Left: T ══ A */}
      <motion.div 
        animate={{ y: [-5, 7, -5], rotate: [-1, 1, -1] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-28 left-0 sm:left-4 z-20 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-teal-200 shadow-sm flex items-center gap-2"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs font-bold text-teal-800 tracking-wider">T ══ A</span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">2 H-Bonds</span>
      </motion.div>

      {/* 4. Bottom-Right: C ═══ G */}
      <motion.div 
        animate={{ y: [7, -5, 7], rotate: [1, -1, 1] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-10 right-4 sm:right-8 z-20 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-teal-200 shadow-sm flex items-center gap-2"
      >
        <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
        <span className="font-mono text-xs font-bold text-teal-800 tracking-wider">C ═══ G</span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">3 H-Bonds</span>
      </motion.div>
    </div>
  );
}
