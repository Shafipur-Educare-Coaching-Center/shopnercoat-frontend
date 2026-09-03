'use client';

import React from 'react';
import {
  FileCheck,
  Calendar,
  MapPin,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface EnrollmentMetricCardsProps {
  totalEnrolled: number;
  upcomingCount: number;
  assignedSeat: string;
  bestRank?: number | null;
}

export function EnrollmentMetricCards({
  totalEnrolled,
  upcomingCount,
  assignedSeat,
  bestRank,
}: EnrollmentMetricCardsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* Metric 1: Confirmed Passes */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Confirmed Passes
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {totalEnrolled}
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                100% Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Active Candidate Passes
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> Ready for Entry
          </span>
          <span className="text-slate-400 font-medium">Auto QR Active</span>
        </div>
      </div>

      {/* Metric 2: Next Live Session */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Next Live Test
            </span>
            <div className="size-8 rounded-xl bg-cyan-50 text-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {upcomingCount > 0 ? `${upcomingCount} Active` : 'None'}
              </span>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200/60">
                Live Series
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Central Examination Hall
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-cyan-700 font-bold flex items-center gap-1">
            <Sparkles className="size-3.5" /> Full Syllabus Final
          </span>
          <span className="text-slate-400 font-medium">100 MCQs</span>
        </div>
      </div>

      {/* Metric 3: Assigned Seat & Room */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assigned Seat &amp; Room
            </span>
            <div className="size-8 rounded-xl bg-indigo-50 text-[#00594D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight font-mono">
                {assignedSeat}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Shafipur Central Examination Hall
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-teal-700 font-bold">West Wing</span>
          <span className="text-slate-400 font-medium">Seat Plan Locked</span>
        </div>
      </div>

      {/* Metric 4: National Merit Rank */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Current Merit Rank
            </span>
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {bestRank ? `Rank #${bestRank}` : 'Unranked'}
              </span>
              {bestRank ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  Top Tier
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Nationwide Medical Percentile
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            {bestRank ? (
              <>
                <ArrowUpRight className="size-3.5" /> Top Medical Tier
              </>
            ) : (
              <span>Evaluation Pending</span>
            )}
          </span>
          <span className="text-slate-400 font-medium">{bestRank ? 'DMC Eligible' : 'Rank Benchmark'}</span>
        </div>
      </div>

    </div>
  );
}

export default EnrollmentMetricCards;
