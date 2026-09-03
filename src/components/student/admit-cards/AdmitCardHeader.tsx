'use client';

import React from 'react';
import { AdmitCard3DVisualizer } from './AdmitCard3DVisualizer';
import {
  FileCheck2,
  ShieldCheck,
  QrCode,
  MapPin,
  Sparkles,
  Printer,
} from 'lucide-react';

interface AdmitCardHeaderProps {
  studentName: string;
  rollNumber: number | string;
  totalPasses: number;
}

export function AdmitCardHeader({
  studentName,
  rollNumber,
  totalPasses,
}: AdmitCardHeaderProps) {
  const rollDisplay = rollNumber ? String(rollNumber).padStart(7, '0') : '---';

  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Background ambient lighting glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Heading & Candidate Badges */}
      <div className="relative z-10 max-w-2xl space-y-4">
        
        {/* Top Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00594D] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <FileCheck2 className="size-3.5 text-teal-300" />
            Official Digital Admit Passes
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            QR Stamp Verified
          </span>

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Session 2025/2026
          </span>
        </div>

        {/* Welcome Heading */}
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-tight leading-tight">
            My <span className="text-[#00796B]">Admit Cards</span> &amp; Hall Passes 🎫
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Download and print official digital Admit Cards for your upcoming medical mock tests. Present these passes with your QR code at the examination hall entrance.
          </p>
        </div>

        {/* Candidate Info Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Roll Number */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-teal-200/80 shadow-2xs">
            <div className="size-7 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center font-black text-xs">
              #
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Candidate Roll
              </p>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-900 tracking-wide">
                {rollDisplay}
              </p>
            </div>
          </div>

          {/* Active Passes Count */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="size-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
              <QrCode className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Issued Passes
              </p>
              <p className="font-bold text-xs text-slate-800">
                {totalPasses} Admit Cards Ready
              </p>
            </div>
          </div>

          {/* Central Hall Venue */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#00594D] text-white shadow-xs">
            <MapPin className="size-4 text-teal-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Test Venue
              </p>
              <p className="font-bold text-xs text-white">
                Shafipur Central Examination Hall
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: 3D Holographic Pass Visualizer */}
      <div className="relative z-10 w-full lg:w-[260px] h-[190px] sm:h-[210px] flex items-center justify-center shrink-0">
        <AdmitCard3DVisualizer />
        
        {/* Floating Verification Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200 text-[10px] font-bold text-[#00796B] shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-teal-500" />
          <span>Biometric QR Pass</span>
        </div>
      </div>

    </div>
  );
}

export default AdmitCardHeader;
