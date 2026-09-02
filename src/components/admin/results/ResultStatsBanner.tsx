'use client';

import React from 'react';
import { Users, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';
import { Result } from '@/types/result.types';

interface ResultStatsBannerProps {
  results: Result[];
}

export function ResultStatsBanner({ results }: ResultStatsBannerProps) {
  const total = results.length;
  const passedCount = results.filter((r) => r.resultStatus === 'PASSED').length;
  const passRate = total > 0 ? ((passedCount / total) * 100).toFixed(1) : '0';
  
  const scores = results.map((r) => Number(r.obtainedMarks) || 0);
  const topScore = scores.length > 0 ? Math.max(...scores).toFixed(1) : '0';
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 select-none">
      
      {/* 1. Total Evaluated */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
          <Users className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Evaluated</p>
          <p className="font-heading font-black text-xl text-slate-900 mt-0.5">{total}</p>
        </div>
      </div>

      {/* 2. Passed & Pass Rate */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Passed Candidates</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-heading font-black text-xl text-teal-700">{passedCount}</span>
            <span className="text-[11px] font-bold text-teal-600">({passRate}%)</span>
          </div>
        </div>
      </div>

      {/* 3. Highest Score */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
          <Trophy className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Highest Marks</p>
          <p className="font-heading font-black text-xl text-amber-700 mt-0.5">{topScore}</p>
        </div>
      </div>

      {/* 4. Average Score */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shrink-0">
          <TrendingUp className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
          <p className="font-heading font-black text-xl text-sky-700 mt-0.5">{averageScore}</p>
        </div>
      </div>

    </div>
  );
}
