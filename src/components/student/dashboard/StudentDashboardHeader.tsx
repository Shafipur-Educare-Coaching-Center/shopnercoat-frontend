'use client';

import React from 'react';
import { StudentProfileAnalytics } from '@/types/student-analytics.types';
import { Student3DHeroVisualizer } from './Student3DHeroVisualizer';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Calendar,
  Target,
} from 'lucide-react';

interface StudentDashboardHeaderProps {
  studentProfile: StudentProfileAnalytics;
}

export function StudentDashboardHeader({ studentProfile }: StudentDashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const rollDisplay = studentProfile.rollNumber
    ? String(studentProfile.rollNumber).padStart(7, '0')
    : '2025-88412';

  const collegeName = studentProfile.collegeName || 'National Medical & Dental Track';
  const targetCollege = studentProfile.targetCollege || 'Dhaka Medical College (DMC)';

  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Background ambient lighting glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Greeting, Roll Profile & Goals */}
      <div className="relative z-10 max-w-2xl space-y-4">
        
        {/* Top Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00594D] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <ShieldCheck className="size-3.5 text-teal-300" />
            Verified Medical Aspirant
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-[#00695C] border border-teal-200/70 text-xs font-semibold">
            <Calendar className="size-3.5 text-teal-600" />
            {currentDate}
          </span>

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {studentProfile.session || 'Session 2025/2026'}
          </span>
        </div>

        {/* Welcome Heading */}
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-tight leading-tight">
            Welcome back,{' '}
            <span className="text-[#00796B]">{studentProfile.fullName || 'Candidate Aspirant'}</span> 🩺
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Central admission merit standings, model test performance analytics, and instant OMR breakdown.
          </p>
        </div>

        {/* Profile Details & Target Goal Pill */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Roll Number Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-teal-200/80 shadow-2xs">
            <div className="size-6 rounded-lg bg-teal-50 text-[#00796B] flex items-center justify-center font-black text-xs">
              #
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Admission Roll
              </p>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-900 tracking-wide">
                {rollDisplay}
              </p>
            </div>
          </div>

          {/* Academic College */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <GraduationCap className="size-4.5 text-[#00796B]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Academic Track
              </p>
              <p className="font-bold text-xs text-slate-800 truncate max-w-[180px] sm:max-w-none">
                {collegeName}
              </p>
            </div>
          </div>

          {/* Target Goal Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#00594D] text-white shadow-xs">
            <Target className="size-4.5 text-teal-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Target College
              </p>
              <p className="font-bold text-xs text-white">
                {targetCollege}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: 3D Interactive Calibration Hero Visualizer */}
      <div className="relative z-10 w-full lg:w-[260px] h-[190px] sm:h-[210px] flex items-center justify-center shrink-0">
        <Student3DHeroVisualizer />
        
        {/* Floating Calibration Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200 text-[10px] font-bold text-[#00796B] shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-teal-500" />
          <span>AI Merit Calibration</span>
        </div>
      </div>

    </div>
  );
}

export default StudentDashboardHeader;
