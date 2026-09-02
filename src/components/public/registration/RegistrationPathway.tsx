'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Flag,
  Lock,
  Unlock,
  ScanLine,
  Award,
  Sparkles,
  PartyPopper,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { REGISTRATION_STEPS, JOURNEY_OBSTACLES } from '@/data/registrationStepsData';
import { StepCard } from './StepCard';
import { ThreeCharacterCanvas } from './ThreeCharacterCanvas';
import { cn } from '@/lib/utils';

export function RegistrationPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // Track vertical scroll through pathway container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 75%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Initial candidate position is cleanly 0 (at the Start Gateway)
  const [currentProgress, setCurrentProgress] = useState(0);

  // Sync scroll progress and detect movement
  useEffect(() => {
    let lastProgress = 0;
    let moveTimeout: NodeJS.Timeout;

    const unsubscribe = smoothProgress.on('change', (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      setCurrentProgress(clamped);

      if (Math.abs(clamped - lastProgress) > 0.003) {
        setIsMoving(true);
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => setIsMoving(false), 200);
      }
      lastProgress = clamped;
    });

    return () => {
      unsubscribe();
      clearTimeout(moveTimeout);
    };
  }, [smoothProgress]);

  // Determine active and passed steps based on progress
  const getStepStatus = (checkpointProgress: number) => {
    const isActive =
      currentProgress >= checkpointProgress - 0.10 &&
      currentProgress <= checkpointProgress + 0.12;
    const isPassed = currentProgress > checkpointProgress + 0.12;

    return { isActive, isPassed };
  };

  const isAtFinish = currentProgress >= 0.92;

  const handleManualBurst = () => {
    setBurstCount((prev) => prev + 1);
  };

  return (
    <div ref={containerRef} className="relative w-full py-8 lg:py-12">
      
      {/* Top Starting Gateway Marker */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-600 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-md shadow-teal-600/20 ring-4 ring-teal-100"
        >
          <Flag className="w-3.5 h-3.5" />
          START REGISTRATION
        </motion.div>
        <span className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-teal-600" />
          Scroll down to guide candidate through admission steps
        </span>
      </div>

      {/* Main Relative Road Track Area */}
      <div className="relative w-full">
        
        {/* Central Timeline Road (Desktop center, Mobile left side) */}
        <div className="absolute top-0 bottom-0 left-6 sm:left-8 lg:left-1/2 -translate-x-1/2 w-4 flex justify-center z-10 pointer-events-none">
          {/* Background Dashed Medical Road */}
          <div className="w-1 h-full border-l-2 border-dashed border-teal-300/70" />

          {/* Dynamic Solid Progress Fill Line */}
          <motion.div
            style={{ height: `${Math.min(currentProgress * 100, 100)}%` }}
            className="absolute top-0 w-1.5 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-full shadow-sm shadow-teal-500/50"
          />

          {/* 3D Three.js Character directly pinned to the active progress coordinate on desktop */}
          <div
            style={{ top: `${currentProgress * 100}%` }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-36 z-30 pointer-events-none hidden lg:block"
          >
            <ThreeCharacterCanvas
              isMoving={isMoving}
              isAtFinish={isAtFinish}
              burstCount={burstCount}
            />
          </div>

          {/* Central Junction Nodes matching step positions */}
          {REGISTRATION_STEPS.map((step) => {
            const { isActive, isPassed } = getStepStatus(step.checkpointProgress);
            return (
              <div
                key={step.stepNumber}
                style={{ top: `${step.checkpointProgress * 100}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 flex items-center justify-center pointer-events-none"
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                    isActive
                      ? 'bg-teal-500 border-white ring-4 ring-teal-200 scale-125 shadow-md shadow-teal-500/50'
                      : isPassed
                      ? 'bg-teal-600 border-white'
                      : 'bg-white border-teal-300'
                  )}
                >
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Pathway Flow: Alternating Steps + Medical Journey Obstacles */}
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-14 sm:gap-18 lg:gap-24">
          
          {/* STEP 1 */}
          {(() => {
            const step = REGISTRATION_STEPS[0];
            const { isActive, isPassed } = getStepStatus(step.checkpointProgress);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-10 sm:pl-14 lg:pl-0">
                <div className="lg:col-span-5 flex justify-end">
                  <StepCard step={step} isActive={isActive} isPassed={isPassed} />
                </div>
                <div className="lg:col-span-2 hidden lg:block" />
                <div className="lg:col-span-5 hidden lg:block" />
              </div>
            );
          })()}

          {/* OBSTACLE 1: Security OTP Firewall */}
          {(() => {
            const obs = JOURNEY_OBSTACLES[0];
            const isCleared = currentProgress >= obs.progress;
            return (
              <div className="flex justify-center pl-10 sm:pl-14 lg:pl-0 my-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md shadow-xs transition-all duration-300',
                    isCleared
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800 ring-2 ring-emerald-100'
                      : 'bg-white/90 border-slate-200 text-slate-600'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                      isCleared ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {isCleared ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold font-heading">
                      {isCleared ? obs.unlockedTitle : obs.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {obs.subtitle}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* STEP 2 */}
          {(() => {
            const step = REGISTRATION_STEPS[1];
            const { isActive, isPassed } = getStepStatus(step.checkpointProgress);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-10 sm:pl-14 lg:pl-0">
                <div className="lg:col-span-5 hidden lg:block" />
                <div className="lg:col-span-2 hidden lg:block" />
                <div className="lg:col-span-5 flex justify-start">
                  <StepCard step={step} isActive={isActive} isPassed={isPassed} />
                </div>
              </div>
            );
          })()}

          {/* OBSTACLE 2: Document Bio-Scanner */}
          {(() => {
            const obs = JOURNEY_OBSTACLES[1];
            const isCleared = currentProgress >= obs.progress;
            return (
              <div className="flex justify-center pl-10 sm:pl-14 lg:pl-0 my-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md shadow-xs transition-all duration-300',
                    isCleared
                      ? 'bg-teal-50/90 border-teal-300 text-teal-800 ring-2 ring-teal-100'
                      : 'bg-white/90 border-slate-200 text-slate-600'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                      isCleared ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold font-heading">
                      {isCleared ? obs.unlockedTitle : obs.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {obs.subtitle}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* STEP 3 */}
          {(() => {
            const step = REGISTRATION_STEPS[2];
            const { isActive, isPassed } = getStepStatus(step.checkpointProgress);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-10 sm:pl-14 lg:pl-0">
                <div className="lg:col-span-5 flex justify-end">
                  <StepCard step={step} isActive={isActive} isPassed={isPassed} />
                </div>
                <div className="lg:col-span-2 hidden lg:block" />
                <div className="lg:col-span-5 hidden lg:block" />
              </div>
            );
          })()}

          {/* OBSTACLE 3: Board Merit Clearance */}
          {(() => {
            const obs = JOURNEY_OBSTACLES[2];
            const isCleared = currentProgress >= obs.progress;
            return (
              <div className="flex justify-center pl-10 sm:pl-14 lg:pl-0 my-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md shadow-xs transition-all duration-300',
                    isCleared
                      ? 'bg-amber-50/90 border-amber-300 text-amber-900 ring-2 ring-amber-100'
                      : 'bg-white/90 border-slate-200 text-slate-600'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                      isCleared ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold font-heading">
                      {isCleared ? obs.unlockedTitle : obs.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {obs.subtitle}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* STEP 4 & FINISH ARCH */}
          {(() => {
            const step = REGISTRATION_STEPS[3];
            const { isActive, isPassed } = getStepStatus(step.checkpointProgress);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-10 sm:pl-14 lg:pl-0">
                <div className="lg:col-span-5 hidden lg:block" />
                <div className="lg:col-span-2 hidden lg:block" />
                <div className="lg:col-span-5 flex justify-start">
                  <StepCard step={step} isActive={isActive} isPassed={isPassed} />
                </div>
              </div>
            );
          })()}

        </div>
      </div>

      {/* Finish Line & 3D Celebration Poppers Area */}
      <div className="mt-14 sm:mt-20 flex flex-col items-center justify-center text-center relative z-20">
        
        {/* Interactive Confetti Poppers Button / Trigger */}
        <motion.button
          type="button"
          onClick={handleManualBurst}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-bold text-sm shadow-md transition-all select-none cursor-pointer',
            isAtFinish
              ? 'bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500 text-white shadow-teal-500/25 ring-4 ring-amber-100 animate-pulse'
              : 'bg-white border border-teal-200 text-teal-800 hover:bg-teal-50'
          )}
        >
          <PartyPopper className="w-4 h-4 text-amber-300 fill-amber-300" />
          {isAtFinish ? '🎉 Click for Celebration Poppers!' : '🎯 Finish Line (Click to Pop Confetti)'}
        </motion.button>

        {/* Congratulations Banner on reaching finish */}
        <AnimatePresence>
          {isAtFinish && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 rounded-2xl bg-white/95 border-2 border-teal-400 shadow-xl max-w-md mx-auto"
            >
              <div className="flex items-center justify-center gap-2 text-teal-800 font-heading font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Congratulations! Enrolment Pathway Complete!</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-normal">
                Your medical candidate profile is now fully cleared for admit card generation and board exams.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
