'use client';

import React from 'react';
import Image from 'next/image';
import { Student } from '@/types/student.types';
import { Profile3DAvatarVisualizer } from './Profile3DAvatarVisualizer';
import {
  UserCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  User,
  Hash,
  Award,
} from 'lucide-react';

interface ProfileHeaderProps {
  student: Student | null;
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  const fullName = student?.fullName || 'Candidate Aspirant';
  const rollDisplay = student?.rollNumber ? String(student.rollNumber).padStart(7, '0') : '---';
  const regDisplay = student?.registrationNumber ? String(student.registrationNumber) : '---';
  const collegeName = student?.collegeName || 'National Medical Aspirant Track';
  const isCompleted = student?.registrationStatus === 'COMPLETED';

  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Avatar & Candidate Badges */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 max-w-2xl">
        
        {/* Avatar Image / Fallback */}
        <div className="size-20 sm:size-24 rounded-3xl bg-teal-50 border-2 border-[#00796B]/20 p-1 flex items-center justify-center shrink-0 shadow-md relative overflow-hidden group">
          {student?.photoUrl ? (
            <Image
              src={student.photoUrl}
              alt={fullName}
              width={96}
              height={96}
              className="size-full object-cover rounded-2xl"
            />
          ) : (
            <div className="size-full rounded-2xl bg-gradient-to-br from-[#00594D] to-[#00796B] flex items-center justify-center text-white font-black text-2xl">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="absolute bottom-1 right-1 size-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
            <CheckCircle2 className="size-3" />
          </div>
        </div>

        {/* Candidate Information Details */}
        <div className="space-y-2 text-center sm:text-left">
          
          {/* Top Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00594D] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
              <UserCheck className="size-3 text-teal-300" />
              Medical Aspirant
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              {isCompleted ? 'Profile Verified' : 'Registration Active'}
            </span>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Session 2025/2026
            </span>
          </div>

          {/* Full Name */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
            {fullName}
          </h1>

          {/* College */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium">
            <Building2 className="size-3.5 text-[#00796B] shrink-0" />
            <span className="truncate">{collegeName}</span>
          </div>

          {/* Candidate IDs Strip */}
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-teal-200/80 shadow-2xs text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Roll:</span>
              <span className="font-mono font-bold text-slate-900">{rollDisplay}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reg #:</span>
              <span className="font-mono font-bold text-slate-900">{regDisplay}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Right Column: 3D Holographic Aspirant Visualizer */}
      <div className="relative z-10 w-full lg:w-[240px] h-[180px] sm:h-[200px] flex items-center justify-center shrink-0">
        <Profile3DAvatarVisualizer />
        
        {/* Floating Identity Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200 text-[10px] font-bold text-[#00796B] shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-teal-500" />
          <span>Biometric Candidate</span>
        </div>
      </div>

    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';
export default ProfileHeader;
