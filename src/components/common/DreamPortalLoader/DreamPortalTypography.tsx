'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface DreamPortalTypographyProps {
  phase: number;
  onSkip: () => void;
  progressPercent: number;
}

export function DreamPortalTypography({
  phase,
  onSkip,
  progressPercent,
}: DreamPortalTypographyProps) {
  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between items-center p-6 sm:p-10 pointer-events-none select-none">
      
      {/* Top Bar: Brand Pill & Skip Button */}
      <header className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        {/* Medical Accreditation Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/70 border border-teal-500/30 backdrop-blur-md text-[11px] text-teal-300 shadow-[0_4px_20px_rgba(13,148,136,0.15)]"
        >
          <ShieldCheck className="size-3.5 text-teal-400" />
          <span className="font-semibold tracking-wide uppercase">Central Medical Admission Board</span>
        </motion.div>

        {/* Skip Intro Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeInOut' }}
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-bold tracking-wide backdrop-blur-md transition-all cursor-pointer shadow-lg hover:border-teal-400/60 group"
        >
          <span>Skip Intro</span>
          <ArrowRight className="size-3 text-teal-300 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </header>

      {/* Center Cinematic Typography Stage */}
      <div className="relative flex flex-col items-center justify-center my-auto min-h-[260px]">
        <AnimatePresence mode="wait">
          
          {/* Phase 1: "Welcome" (1.6s) */}
          {phase === 1 && (
            <motion.div
              key="phase-welcome"
              initial={{ opacity: 0, y: 22, scale: 0.94, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, scale: 1.06, filter: 'blur(10px)' }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
              className="text-center space-y-3 flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeInOut' }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-widest uppercase shadow-inner"
              >
                <Sparkles className="size-3 text-teal-300 animate-pulse" />
                <span>Admission Portal</span>
              </motion.div>

              <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl text-white tracking-tight drop-shadow-[0_0_40px_rgba(45,212,191,0.55)]">
                Welcome
              </h1>
            </motion.div>
          )}

          {/* Phase 2: "to" (2.0s) */}
          {phase === 2 && (
            <motion.div
              key="phase-to"
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
              className="text-center space-y-2 flex flex-col items-center"
            >
              <span className="font-serif italic font-light text-5xl sm:text-6xl md:text-7xl text-teal-200 tracking-widest drop-shadow-[0_0_35px_rgba(45,212,191,0.7)]">
                to
              </span>
            </motion.div>
          )}

          {/* Phase 3: "Shopner Coat" (1.9s) */}
          {phase === 3 && (
            <motion.div
              key="phase-shopnercoat"
              initial={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
              className="text-center space-y-3 flex flex-col items-center"
            >
              {/* Brand Squircle Icon Emblem */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="size-16 sm:size-18 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 p-2.5 shadow-[0_0_50px_rgba(45,212,191,0.65)] border border-teal-200/60 mb-0.5"
              >
                <Image
                  src="/shopnercoat-icon.png"
                  alt="Shopner Coat"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </motion.div>

              {/* Main "Shopner Coat" Heading */}
              <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight drop-shadow-[0_0_45px_rgba(45,212,191,0.8)]">
                Shopner <span className="text-teal-300">Coat</span>
              </h1>

              <p className="text-xs sm:text-sm text-teal-100/90 font-medium tracking-wide max-w-md">
                Where Aspirations Wear the White Coat.
              </p>
            </motion.div>
          )}

          {/* Phase 4: "Doors of Dream Opening..." (6.3s - 7.6s) */}
          {phase === 4 && (
            <motion.div
              key="phase-door-open"
              initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.35, filter: 'blur(20px)' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="text-center space-y-2 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-400/20 border border-teal-300/50 text-teal-200 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_35px_rgba(45,212,191,0.5)] backdrop-blur-md animate-pulse">
                <Unlock className="size-4 text-teal-300" />
                <span>Doors of Dream Opening...</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar & Vitals */}
      <footer className="w-full max-w-md flex flex-col items-center gap-2.5">
        {/* Glowing Progress Track */}
        <div className="w-full h-1.5 bg-teal-950/90 rounded-full overflow-hidden border border-teal-500/25 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-300 shadow-[0_0_15px_rgba(45,212,191,0.9)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[10px] text-teal-400/80 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3 text-teal-500" />
            {phase < 4 ? 'Securing Dream Ward...' : 'Threshold Unlocked'}
          </span>
          <span className="font-bold">{Math.round(progressPercent)}%</span>
        </div>
      </footer>

    </div>
  );
}

export default DreamPortalTypography;
