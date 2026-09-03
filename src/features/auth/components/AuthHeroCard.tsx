'use client';

import React from 'react';
import Image from 'next/image';
import {
  FileQuestion,
  BarChart3,
  Activity,
  Award,
  Sparkles,
  ShieldCheck,
  Quote,
} from 'lucide-react';

interface AuthHeroCardProps {
  variant?: 'login' | 'register';
}

export function AuthHeroCard({ variant = 'login' }: AuthHeroCardProps) {
  const isLogin = variant === 'login';

  return (
    <div className="relative w-full rounded-[28px] sm:rounded-[32px] bg-white/95 border border-slate-200/80 p-6 sm:p-7 lg:p-8 shadow-[0_20px_50px_rgba(15,118,110,0.06)] backdrop-blur-xl flex flex-col justify-between overflow-hidden h-full">
      
      {/* Decorative subtle ambient gradient accent */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-400/5 blur-2xl pointer-events-none" />

      {/* Top Section: Squircle Icon & Board Details */}
      <div className="relative z-10">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-100 border border-teal-200/70 p-2 flex items-center justify-center shrink-0 shadow-sm shadow-teal-950/5">
            <Image
              src="/shopnercoat-icon.png"
              alt="Shopner Coat"
              width={52}
              height={52}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="space-y-0.5 pt-0.5">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#00594D] text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
              Central Medical Admission
            </span>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
              Shopner Coat Exam Board
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              National Merit Calibration System
            </p>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-5 sm:mt-6 space-y-2">
          <h1 className="font-heading font-black text-2xl sm:text-[28px] lg:text-[30px] leading-[1.18] text-slate-900 tracking-tight">
            {isLogin ? (
              <>
                Your gateway to the{' '}
                <span className="text-[#00796B] font-black block sm:inline">white coat.</span>
              </>
            ) : (
              <>
                Begin your journey to the{' '}
                <span className="text-[#00796B] font-black block sm:inline">white coat.</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-md">
            {isLogin
              ? 'Centralized medical admission portal for national live model tests, predictive AI rank engines, and instant OMR performance breakdown.'
              : 'Centralized candidate registration for nationwide medical admission model tests, automated SMS roll allocation, and AI percentile profiling.'}
          </p>
        </div>

        {/* 3 Metric / Feature Badges */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-2.5">
          {isLogin ? (
            <>
              {/* Badge 1 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <FileQuestion className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  National Mocks
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  Real OMR Style
                </p>
              </div>

              {/* Badge 2 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <BarChart3 className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  AI Rank Engine
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  Percentile Calib
                </p>
              </div>

              {/* Badge 3 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <Activity className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  OMR Analytics
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  Negative Marking
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Register Badge 1 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <Sparkles className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  Instant Roll
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  7-Digit Crypto ID
                </p>
              </div>

              {/* Register Badge 2 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <ShieldCheck className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  SMS OTP
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  Secure Validation
                </p>
              </div>

              {/* Register Badge 3 */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="text-[#00796B] mb-1 flex items-center justify-center">
                  <Award className="size-4 sm:size-4.5" />
                </div>
                <p className="font-bold text-[11px] text-slate-900 leading-tight">
                  DGHS Aligned
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                  Exam Standards
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quote Card with Watermark */}
        <div className="relative mt-5 p-3.5 sm:p-4 rounded-2xl bg-teal-50/50 border border-teal-100/80 shadow-2xs overflow-hidden">
          {/* Watermark 99 glyph */}
          <span className="absolute -right-1 -bottom-3 text-5xl sm:text-6xl font-serif font-black text-teal-900/5 select-none pointer-events-none">
            ”
          </span>

          <div className="flex items-start gap-2.5 relative z-10">
            <div className="w-5 h-5 rounded-md bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0 mt-0.5">
              <Quote className="size-3 fill-[#00796B]" />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] sm:text-xs italic text-slate-800 font-medium leading-relaxed">
                {isLogin
                  ? '"Every stethoscope starts with a dream and rigorous, honest practice."'
                  : '"Precision, discipline, and dedication define tomorrow\'s medical leaders."'}
              </p>
              <p className="text-[10px] font-bold text-[#00796B] tracking-wider uppercase">
                {isLogin ? '— Central Faculty Board' : '— Admission Scrutiny Committee'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Cluster status & version */}
      <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-600">
            Server Cluster: <span className="text-emerald-700">Active &amp; Low Latency</span>
          </span>
        </div>

        <span className="font-mono text-[10px] text-slate-400 tracking-tight">
          v4.2-clinical
        </span>
      </div>

    </div>
  );
}

export default AuthHeroCard;
