'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export function AdminLoginVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6 select-none">
      
      {/* Background Ambient Cyber Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Admin Dashboard Window Preview Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-lg rounded-2xl bg-[#090E17]/95 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden group"
      >
        {/* Window Chrome Bar */}
        <div className="h-9 bg-[#0D1524] border-b border-slate-800/80 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-[11px] font-mono text-slate-400 tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>MedExam Portal | Admin Dashboard</span>
          </div>
          <div className="w-12 flex justify-end">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          </div>
        </div>

        {/* Dashboard Content Mockup */}
        <div className="p-5 flex flex-col gap-4">
          
          {/* Mini Top Stat Metrics */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Total Students</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 block">1,482</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Avg. Performance</span>
              <span className="text-xs sm:text-sm font-bold text-teal-400 mt-0.5 block">87.2%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Admissions</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 block">9</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Mock Tests</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 block">4</span>
            </div>
          </div>

          {/* Interactive Dynamic Line Trend Chart Mockup */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-semibold text-slate-200">Student Performance Trends</span>
              </div>
              <span className="text-[10px] font-mono text-teal-400/90 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                Live Sync
              </span>
            </div>

            {/* Glowing SVG Curve */}
            <div className="h-28 w-full relative mt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M0,80 Q50,20 100,60 T200,30 T300,10 L300,100 L0,100 Z"
                  fill="url(#chartGradient)"
                />
                {/* Glowing Stroke */}
                <path
                  d="M0,80 Q50,20 100,60 T200,30 T300,10"
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="100" cy="60" r="3.5" fill="#2DD4BF" className="animate-ping" />
                <circle cx="100" cy="60" r="3.5" fill="#FFFFFF" />
                <circle cx="200" cy="30" r="3.5" fill="#2DD4BF" />
                <circle cx="200" cy="30" r="3.5" fill="#FFFFFF" />
                <circle cx="300" cy="10" r="4" fill="#2DD4BF" />
              </svg>
            </div>
          </div>

          {/* Mini Table Rows Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1 rounded bg-slate-900/40">
              <span>Clinical Exam Stage 1</span>
              <span className="text-emerald-400 font-mono font-medium">● Complete</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1 rounded bg-slate-900/40">
              <span>MBBS Anatomy Evaluation</span>
              <span className="text-teal-400 font-mono font-medium">● Active</span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Floating Stat Card 1: Active Students (Top Right) */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.2 },
          x: { duration: 0.5, delay: 0.2 },
          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-2 right-2 sm:-top-3 sm:-right-4 z-20 rounded-2xl bg-[#0F172A]/95 border border-slate-700/80 p-4 sm:p-5 shadow-[0_16px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl min-w-[150px] sm:min-w-[170px]"
      >
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <Users className="w-4 h-4" />
          <span className="text-xs font-semibold text-slate-300">Active Students</span>
        </div>
        <div className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          1,248
        </div>
      </motion.div>

      {/* Floating Stat Card 2: Exam Pass Rate (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 8, 0],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.35 },
          x: { duration: 0.5, delay: 0.35 },
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        }}
        className="absolute -bottom-4 right-4 sm:-bottom-5 sm:right-6 z-20 rounded-2xl bg-[#0F172A]/95 border border-slate-700/80 p-4 sm:p-5 shadow-[0_16px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl min-w-[150px] sm:min-w-[170px]"
      >
        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-semibold text-slate-300">Exam Pass Rate</span>
        </div>
        <div className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          92.4%
        </div>
      </motion.div>

    </div>
  );
}
