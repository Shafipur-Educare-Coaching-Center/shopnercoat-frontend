'use client';

import React from 'react';
import { Notice3DBroadcastVisualizer } from './Notice3DBroadcastVisualizer';
import {
  Megaphone,
  BellRing,
  Sparkles,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';

interface NoticeHeaderProps {
  totalNotices: number;
  urgentCount: number;
}

export function NoticeHeader({
  totalNotices,
  urgentCount,
}: NoticeHeaderProps) {
  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Heading & Broadcast Badges */}
      <div className="relative z-10 max-w-2xl space-y-4">
        
        {/* Top Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00594D] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <Megaphone className="size-3.5 text-teal-300" />
            Central Board Official Circulars
          </span>

          {urgentCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-bold animate-pulse">
              <AlertTriangle className="size-3.5 text-rose-600" />
              {urgentCount} Urgent Notices
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold">
              <BellRing className="size-3.5 text-emerald-600" />
              All Systems Operational
            </span>
          )}

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Session 2025/2026
          </span>
        </div>

        {/* Welcome Heading */}
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-tight leading-tight">
            Official <span className="text-[#00796B]">Notices</span> &amp; Circulars 📢
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Stay up to date with examination hall circulars, syllabus updates, OMR evaluation notices, and medical college admission advisories.
          </p>
        </div>

        {/* Info Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Active Notices */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-teal-200/80 shadow-2xs">
            <div className="size-7 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center font-black text-xs">
              <BellRing className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Published Bulletins
              </p>
              <p className="font-bold text-xs text-slate-800">
                {totalNotices} Circulars Active
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#00594D] text-white shadow-xs">
            <FileCheck2 className="size-4 text-teal-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Authority
              </p>
              <p className="font-bold text-xs text-white">
                Shafipur Educare Central Board
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: 3D Holographic Radio Beacon */}
      <div className="relative z-10 w-full lg:w-[260px] h-[190px] sm:h-[210px] flex items-center justify-center shrink-0">
        <Notice3DBroadcastVisualizer />
        
        {/* Floating Broadcast Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200 text-[10px] font-bold text-[#00796B] shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-teal-500" />
          <span>Live Board Feed</span>
        </div>
      </div>

    </div>
  );
}

export default NoticeHeader;
