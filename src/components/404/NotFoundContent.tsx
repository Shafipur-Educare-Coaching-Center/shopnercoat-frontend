'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import {
  Home,
  UserPlus,
  BarChart3,
  LogIn,
  ArrowLeft,
  Activity,
  Zap,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface NotFoundContentProps {
  onTriggerShock: () => void;
  shockCount: number;
}

export function NotFoundContent({ onTriggerShock, shockCount }: NotFoundContentProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [latency, setLatency] = useState<number>(14);
  const [shockToast, setShockToast] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuate latency slightly for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleShockClick = () => {
    onTriggerShock();
    setShockToast(true);
    setTimeout(() => setShockToast(false), 2000);
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 sm:px-6">
      
      {/* 1. Emergency Diagnostic Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-teal-200/90 shadow-clinical backdrop-blur-md"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
        <span className="font-mono text-xs font-bold text-slate-800 tracking-tight">
          Clinical Error 404
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] font-semibold text-[#00796B] flex items-center gap-1">
          <Activity className="size-3 text-teal-600 animate-pulse" />
          ECG Flatline Detected
        </span>
      </motion.div>

      {/* 2. Main Medical Diagnostic Headline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 sm:mt-5 space-y-2"
      >
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-[1.15]">
          Diagnosis:{' '}
          <span className="bg-gradient-to-r from-[#00695C] via-[#00897B] to-teal-500 bg-clip-text text-transparent">
            Page Flatlined
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed font-medium">
          The examination ward, admit slip, or candidate registry you requested cannot be located. It may have been discharged, relocated, or expired from our medical servers.
        </p>
      </motion.div>

      {/* 3. Interactive Defibrillator CPR Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-5 relative"
      >
        <button
          type="button"
          onClick={handleShockClick}
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/15 to-emerald-500/10 hover:from-teal-500/20 hover:via-cyan-500/25 hover:to-emerald-500/20 border border-teal-300/60 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer text-xs font-bold text-teal-900"
          title="Send a 200J Defibrillator Shock to revive 3D items!"
        >
          <Zap className="size-4 text-amber-500 group-hover:rotate-12 transition-transform duration-300 fill-amber-400" />
          <span>Apply 200J Defibrillator Pulse</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-teal-100/80 text-teal-800 border border-teal-200">
            x{shockCount} Shocks
          </span>
        </button>

        {/* Shock Feedback Toast */}
        <AnimatePresence>
          {shockToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -30, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Sparkles className="size-3 text-cyan-400" />
              <span>⚡ Cardiac Pulse Dispatched!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Glassmorphism Quick Navigation Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 sm:mt-8 w-full max-w-xl bg-white/90 border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(15,118,110,0.06)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Stethoscope className="size-3.5 text-[#00796B]" />
            Recommended Clinical Routes
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            System Ward 01
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Action 1: Home (Primary) */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white transition-all shadow-sm hover:shadow-md active:scale-[0.98] group"
          >
            <div className="size-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Home className="size-4 text-white" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bold text-xs leading-tight truncate">Central Portal Home</p>
              <p className="text-[10px] text-teal-100 truncate mt-0.5">Return to admissions desk</p>
            </div>
          </Link>

          {/* Action 2: Register */}
          <Link
            href={ROUTES.REGISTER}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-200 text-slate-800 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] group"
          >
            <div className="size-8 rounded-xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserPlus className="size-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">Candidate Registration</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Enroll for model tests</p>
            </div>
          </Link>

          {/* Action 3: Rankings */}
          <Link
            href={ROUTES.RANKING}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-200 text-slate-800 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] group"
          >
            <div className="size-8 rounded-xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BarChart3 className="size-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">National Merit Ranks</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Live percentile calibrate</p>
            </div>
          </Link>

          {/* Action 4: Login */}
          <Link
            href={ROUTES.LOGIN}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-200 text-slate-800 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] group"
          >
            <div className="size-8 rounded-xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LogIn className="size-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">Aspirant Sign In</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Access your roll slips</p>
            </div>
          </Link>
        </div>

        {/* Go Back History Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100/80"
          >
            <ArrowLeft className="size-3.5" />
            <span>Go Back to Previous Ward</span>
          </button>

          <Link
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00796B] hover:text-[#00594D] transition-colors"
          >
            <HelpCircle className="size-3" />
            <span>Helpdesk Support</span>
          </Link>
        </div>
      </motion.div>

      {/* 5. Bottom System Vitals Telemetry Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-500 font-medium flex-wrap"
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Cluster Status: <strong className="text-emerald-700">Operational</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <Activity className="size-3.5 text-teal-600" />
          <span>Telemetry Latency: <strong className="font-mono text-slate-700">{latency}ms</strong></span>
        </div>

        {currentTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-slate-400" />
            <span className="font-mono text-slate-500">{currentTime} UTC</span>
          </div>
        )}
      </motion.div>

    </div>
  );
}

export default NotFoundContent;
