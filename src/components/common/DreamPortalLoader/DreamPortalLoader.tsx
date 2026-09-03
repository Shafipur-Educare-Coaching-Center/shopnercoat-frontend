'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DreamPortal3DScene } from './DreamPortal3DScene';
import { DreamPortalTypography } from './DreamPortalTypography';

const STORAGE_KEY = 'shopnercoat_dream_intro_seen';

interface DreamPortalLoaderProps {
  children: React.ReactNode;
}

export function DreamPortalLoader({ children }: DreamPortalLoaderProps) {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(true); // default true for SSR safety
  const [mounted, setMounted] = useState<boolean>(false);
  const [phase, setPhase] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Mark session as seen
  const markSessionSeen = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage exceptions
    }
  }, []);

  // Complete and exit
  const handleComplete = useCallback(() => {
    setIsExiting(true);
    markSessionSeen();
    setTimeout(() => {
      setHasSeenIntro(true);
    }, 600); // match exit animation duration
  }, [markSessionSeen]);

  // Skip Intro directly
  const handleSkip = useCallback(() => {
    setPhase(4);
    setProgressPercent(100);
    setTimeout(() => {
      handleComplete();
    }, 450);
  }, [handleComplete]);

  // Initial check on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (seen === 'true') {
        setHasSeenIntro(true);
      } else {
        setHasSeenIntro(false);
      }
    } catch {
      setHasSeenIntro(true);
    }
  }, []);

  // Keyboard shortcut listener for Esc / Space
  useEffect(() => {
    if (hasSeenIntro) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSeenIntro, handleSkip]);

  // Sequence timer state machine
  useEffect(() => {
    if (!mounted || hasSeenIntro) return;

    const totalDuration = 7600; // 7.6s total for generous reading time
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgressPercent(pct);

      if (elapsed < 800) {
        setPhase(0); // Illuminating from void
      } else if (elapsed < 2400) {
        setPhase(1); // "Welcome" (1.6s)
      } else if (elapsed < 4400) {
        setPhase(2); // "Welcome to" (2.0s - ample reading time!)
      } else if (elapsed < 6300) {
        setPhase(3); // "Welcome to Shopner Coat" (1.9s)
      } else if (elapsed < 7600) {
        setPhase(4); // Doors parting open (1.3s)
      } else {
        clearInterval(progressInterval);
        handleComplete();
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [mounted, hasSeenIntro, handleComplete]);

  return (
    <>
      {/* 1. Underlying Page Children */}
      {children}

      {/* 2. Fullscreen Dream Portal Cinematic Intro Overlay */}
      <AnimatePresence>
        {!hasSeenIntro && mounted && (
          <motion.div
            key="dream-portal-loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: 'blur(16px)',
              transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center select-none"
          >
            {/* Ambient Background Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/20 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[160px] pointer-events-none" />

            {/* 3D Three.js Dream Portal Stage */}
            <DreamPortal3DScene
              isDoorsOpen={phase >= 4 || isExiting}
              progress={progressPercent}
            />

            {/* Typography Overlay Layer */}
            <DreamPortalTypography
              phase={phase}
              onSkip={handleSkip}
              progressPercent={progressPercent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DreamPortalLoader;
