'use client';

import React from 'react';
import { KpiSummary } from '@/types/student-analytics.types';
import {
  Trophy,
  TrendingUp,
  Target,
  FileCheck,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface StudentMetricCardsProps {
  kpiSummary: KpiSummary;
}

export function StudentMetricCards({ kpiSummary }: StudentMetricCardsProps) {
  const { nationalMeritStanding, meanScore, omrPrecisionRate, testSeriesProgress } = kpiSummary;
  const isRanked = nationalMeritStanding.currentRank > 0;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* Metric 1: National Merit Standing */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              National Merit Standing
            </span>
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {isRanked ? `Rank #${nationalMeritStanding.currentRank}` : 'Unranked'}
              </span>
              {isRanked ? (
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                  Top {nationalMeritStanding.percentile > 0 ? (100 - nationalMeritStanding.percentile).toFixed(1) : '1.8'}%
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
            {isRanked ? (
              <>
                <ArrowUpRight className="size-3.5" /> +{nationalMeritStanding.rankChange || 0} Ranks Higher
              </>
            ) : (
              <span>Evaluation Pending</span>
            )}
          </span>
          <span className="text-slate-400 font-medium">{isRanked ? 'vs Last Mock' : 'Rank Benchmark'}</span>
        </div>
      </div>

      {/* Metric 2: Mean Score & Accuracy */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Mean Score &amp; Grade
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {meanScore.averageMarks.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                / {meanScore.totalPossible} Marks
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Average Across Model Tests
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-teal-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="size-3.5" /> +{meanScore.growthPercentage || 0}% Growth
          </span>
          <span className="text-slate-400 font-medium">Pass Cutoff: {meanScore.passCutoff}</span>
        </div>
      </div>

      {/* Metric 3: OMR Precision Rate */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OMR Precision Rate
            </span>
            <div className="size-8 rounded-xl bg-cyan-50 text-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {omrPrecisionRate.accuracyPercentage}%
              </span>
              {omrPrecisionRate.accuracyPercentage > 0 ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  High Precision
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Correct vs Attempted Ratio
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-rose-600 font-bold">
            -{omrPrecisionRate.totalDeductions.toFixed(2)} Negative Marks
          </span>
          <span className="text-slate-400 font-medium">Penalty Log</span>
        </div>
      </div>

      {/* Metric 4: Active Test Series & Enrollments */}
      <div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Live Mock Series
            </span>
            <div className="size-8 rounded-xl bg-indigo-50 text-[#00796B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="size-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {testSeriesProgress.completedTests}
              </span>
              <span className="text-xs font-bold text-slate-400">
                / {testSeriesProgress.totalEnrolledTests} Tests Evaluated
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Central Board Schedule
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> Next: {testSeriesProgress.nextExamLabel || 'Mock Test Series'}
          </span>
          <span className="text-slate-400 font-medium">Active</span>
        </div>
      </div>

    </div>
  );
}

export default StudentMetricCards;
