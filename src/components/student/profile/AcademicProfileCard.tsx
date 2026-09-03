'use client';

import React from 'react';
import { Student } from '@/types/student.types';
import {
  GraduationCap,
  Target,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  Hash,
  BookOpen,
} from 'lucide-react';

interface AcademicProfileCardProps {
  student: Student | null;
}

export function AcademicProfileCard({ student }: AcademicProfileCardProps) {
  const rollDisplay = student?.rollNumber ? String(student.rollNumber).padStart(7, '0') : '---';
  const regDisplay = student?.registrationNumber ? String(student.registrationNumber) : '---';
  const collegeName = student?.collegeName || 'National Medical Aspirant Track';
  const isVerified = student?.registrationStatus === 'COMPLETED';

  return (
    <div className="w-full space-y-5">
      
      {/* Target Medical College Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#00594D] to-[#00796B] text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-teal-200 flex items-center gap-1.5">
            <Target className="size-4 text-amber-300" />
            Target Medical Institution
          </span>
          <span className="text-[11px] font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded-full text-amber-300">
            1st Choice
          </span>
        </div>

        <div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
            Dhaka Medical College (DMC)
          </h2>
          <p className="text-xs text-teal-100 mt-1 font-medium">
            National Medical College Admission Test (MBBS 2025/2026)
          </p>
        </div>
      </div>

      {/* Academic Credentials Grid */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <GraduationCap className="size-4 text-[#00796B]" />
          <span>Official Board Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Candidate Roll */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Candidate Roll
            </span>
            <p className="font-mono font-bold text-base text-slate-900">
              {rollDisplay}
            </p>
            <p className="text-[11px] text-slate-500">
              Printed on all verified model test Admit Passes
            </p>
          </div>

          {/* Registration Number */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Central Registration ID
            </span>
            <p className="font-mono font-bold text-base text-slate-900">
              {regDisplay}
            </p>
            <p className="text-[11px] text-slate-500">
              Permanent central evaluation board registration
            </p>
          </div>

          {/* College Name */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              HSC Institution / College
            </span>
            <p className="font-bold text-sm text-slate-900">
              {collegeName}
            </p>
            <p className="text-[11px] text-slate-500">
              Verified Higher Secondary Education Board
            </p>
          </div>

          {/* Academic Track & Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Aspirant Track &amp; Status
            </span>
            <p className="font-bold text-sm text-[#00796B] flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600" />
              1st Timer Medical Aspirant • Verified
            </p>
            <p className="text-[11px] text-slate-500">
              Session 2025/2026 Academic Batch
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default AcademicProfileCard;
