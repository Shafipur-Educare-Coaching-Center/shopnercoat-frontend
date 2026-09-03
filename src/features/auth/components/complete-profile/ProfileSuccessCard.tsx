'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import {
  Trophy,
  Sparkles,
  Copy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSuccessCardProps {
  completedStudent: {
    id: string;
    fullName: string;
    rollNumber: number;
    registrationNumber: number;
    registrationStatus: string;
  };
}

export function ProfileSuccessCard({ completedStudent }: ProfileSuccessCardProps) {
  const router = useRouter();

  const rollFormatted = String(completedStudent.rollNumber).padStart(7, '0');

  return (
    <div className="max-w-xl mx-auto bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/80 p-6 sm:p-10 shadow-[0_20px_50px_rgba(15,118,110,0.06)] text-center space-y-6 animate-in zoom-in-95 duration-300">
      
      {/* Top Trophy Emblem */}
      <div className="size-20 rounded-3xl bg-gradient-to-tr from-[#00594D] to-[#0D9488] text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-950/15">
        <Trophy className="size-10 text-amber-300" />
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-2xs">
          <Sparkles className="size-3.5 text-emerald-600" />
          <span>Candidate Profile Finalized</span>
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Welcome, {completedStudent.fullName}!
        </h1>

        <p className="text-xs sm:text-[13px] text-slate-500 max-w-md mx-auto leading-relaxed">
          Your admission profile is officially registered. You have been assigned your unique cryptographic 7-digit roll and registration number.
        </p>
      </div>

      {/* Credentials Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00594D] via-[#00695C] to-[#0D9488] text-white shadow-xl text-left space-y-4 relative overflow-hidden">
        
        {/* Subtle glow orb */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-teal-300/15 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/15 relative z-10">
          <span className="text-[11px] text-teal-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-teal-300" />
            Official Candidate Identification
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-bold">
            ACTIVE &amp; VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* Roll Number */}
          <div>
            <p className="text-[10px] text-teal-200 uppercase font-semibold">
              Admission Roll Number
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono font-black text-2xl text-amber-300 tracking-wider">
                {rollFormatted}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(rollFormatted);
                  toast.success('Roll Number copied!');
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white cursor-pointer transition-colors"
                title="Copy Roll Number"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Registration Number */}
          <div>
            <p className="text-[10px] text-teal-200 uppercase font-semibold">
              Registration No.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono font-black text-2xl text-white tracking-wider">
                {completedStudent.registrationNumber}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(String(completedStudent.registrationNumber));
                  toast.success('Registration Number copied!');
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white cursor-pointer transition-colors"
                title="Copy Registration Number"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-teal-100/80 pt-2 border-t border-white/15 relative z-10 leading-relaxed">
          💡 You can now log into your student portal using your mobile number or this 7-digit Roll Number.
        </p>
      </div>

      {/* Proceed CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => router.push(ROUTES.STUDENT_DASHBOARD)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Proceed to Student Dashboard</span>
          <ArrowRight className="size-4" />
        </button>
      </div>

    </div>
  );
}

export default ProfileSuccessCard;
