'use client';

import React from 'react';
import { Exam3DDiscoveryVisualizer } from './Exam3DDiscoveryVisualizer';
import {
  BookOpen,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

interface ExamDiscoveryHeaderProps {
  totalAvailable: number;
  enrolledCount: number;
}

export function ExamDiscoveryHeader({ totalAvailable, enrolledCount }: ExamDiscoveryHeaderProps) {
  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Background ambient lighting glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Heading, Schedule Info & Badges */}
      <div className="relative z-10 max-w-2xl space-y-4">
        
        {/* Top Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00594D] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <BookOpen className="size-3.5 text-teal-300" />
            Central Medical Examination Board
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-bold">
            <ShieldAlert className="size-3.5 text-rose-600" />
            -0.25 Negative Marking Rule
          </span>

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Session 2025/2026
          </span>
        </div>

        {/* Welcome Heading */}
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-tight leading-tight">
            Available Medical <span className="text-[#00796B]">Model Tests</span> 🩺
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Register for verified centralized offline mock tests, subject-wise finals, and national rank benchmarks.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Active Series */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-teal-200/80 shadow-2xs">
            <div className="size-7 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center font-black text-xs">
              <Layers className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Available Tests
              </p>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                {totalAvailable} Series Active
              </p>
            </div>
          </div>

          {/* Enrolled Status */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="size-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
              <Award className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Enrolled Passes
              </p>
              <p className="font-bold text-xs text-slate-800">
                {enrolledCount} Registered
              </p>
            </div>
          </div>

          {/* Venue Notice */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#00594D] text-white shadow-xs">
            <Calendar className="size-4 text-teal-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Test Venue
              </p>
              <p className="font-bold text-xs text-white">
                Shafipur Central Hall
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: 3D Interactive Discovery Visualizer */}
      <div className="relative z-10 w-full lg:w-[260px] h-[190px] sm:h-[210px] flex items-center justify-center shrink-0">
        <Exam3DDiscoveryVisualizer />
        
        {/* Floating Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200 text-[10px] font-bold text-[#00796B] shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-teal-500" />
          <span>5 Core Subjects</span>
        </div>
      </div>

    </div>
  );
}

export default ExamDiscoveryHeader;
