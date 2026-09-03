'use client';

import React from 'react';
import {
  Trophy,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowUpRight,
  Award,
} from 'lucide-react';

interface ResultMetricCardsProps {
  bestRank: number | null;
  averageMarks: number;
  accuracyPercentage: number;
  totalPassed: number;
  totalEvaluated: number;
}

export function ResultMetricCards({
  bestRank,
  averageMarks,
  accuracyPercentage,
  totalPassed,
  totalEvaluated,
}: ResultMetricCardsProps) {
  const passRate = totalEvaluated > 0 ? Math.round((totalPassed / totalEvaluated) * 100) : 100;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* Metric 1: Best National Rank */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Highest Standing
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
              ) : null}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              National Merit Percentile
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="size-3.5" /> DMC Eligible Range
          </span>
          <span className="text-slate-400 font-medium">Rank Benchmark</span>
        </div>
      </div>

      {/* Metric 2: Mean Score */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Mean Marks
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {averageMarks.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                / 100 Marks
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Average Across Tests
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-teal-700 font-bold">Pass Cutoff: 40.0</span>
          <span className="text-slate-400 font-medium">Mean Calibration</span>
        </div>
      </div>

      {/* Metric 3: OMR Precision */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OMR Precision
            </span>
            <div className="size-8 rounded-xl bg-cyan-50 text-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {accuracyPercentage}%
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                High Accuracy
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Correct vs Attempted Ratio
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-cyan-700 font-bold">-0.25 Penalty Aware</span>
          <span className="text-slate-400 font-medium">Precision Lock</span>
        </div>
      </div>

      {/* Metric 4: Pass Rate */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pass Rate
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {passRate}%
              </span>
              <span className="text-xs font-bold text-slate-400">
                ({totalPassed}/{totalEvaluated})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Evaluated Tests Passed
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> 100% Cleared
          </span>
          <span className="text-slate-400 font-medium">All Passed</span>
        </div>
      </div>

    </div>
  );
}

export default ResultMetricCards;
