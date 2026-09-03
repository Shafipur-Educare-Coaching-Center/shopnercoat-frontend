'use client';

import React from 'react';
import { Result } from '@/types/result.types';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Award,
  Layers,
  Clock,
} from 'lucide-react';

interface ResultCardProps {
  result: Result;
  onOpenDetail: (res: Result) => void;
}

export function ResultCard({ result, onOpenDetail }: ResultCardProps) {
  const exam = result.exam;
  const examTitle = exam?.title || 'National Medical Mock Test';
  const examCode = exam?.code || 'NMT';

  const formattedDate = exam?.examDate || result.createdAt
    ? new Date(exam?.examDate || result.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Session 2026';

  const isPassed = result.resultStatus === 'PASSED';
  const totalMarks = exam?.totalMarks || 100;
  const percentage = Number(result.percentage) || Math.round((result.obtainedMarks / totalMarks) * 100);

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)] hover:shadow-[0_15px_35px_rgba(15,118,110,0.08)] hover:border-teal-300 transition-all flex flex-col justify-between space-y-4 group">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-teal-50 text-[#00695C] border border-teal-200/80 shadow-2xs">
              {examCode}
            </span>

            {result.position ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold font-mono">
                <Trophy className="size-3 text-amber-500" />
                Rank #{result.position}
              </span>
            ) : null}
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              isPassed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                : 'bg-rose-50 text-rose-800 border border-rose-200/80'
            }`}
          >
            {isPassed ? (
              <>
                <CheckCircle2 className="size-3 text-emerald-600" />
                <span>PASSED</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-3 text-rose-600" />
                <span>FAILED</span>
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 group-hover:text-[#00796B] transition-colors leading-snug">
          {examTitle}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="size-3.5" />
          <span>Evaluated on {formattedDate}</span>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        {/* Net Score */}
        <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100/80">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Net Score</p>
          <p className="font-heading font-black text-lg sm:text-xl text-[#00796B] mt-0.5">
            {Number(result.obtainedMarks).toFixed(1)}
            <span className="text-xs text-slate-400 font-medium"> / {totalMarks}</span>
          </p>
        </div>

        {/* Correct Answers */}
        <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Correct</p>
          <p className="font-mono font-black text-lg sm:text-xl text-emerald-700 mt-0.5">
            +{result.correctAnswered}
          </p>
        </div>

        {/* Wrong Answers */}
        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Wrong (Penalty)</p>
          <p className="font-mono font-black text-lg sm:text-xl text-rose-600 mt-0.5">
            -{Number(result.deductMark).toFixed(2)}
          </p>
        </div>

        {/* Skipped */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skipped</p>
          <p className="font-mono font-black text-lg sm:text-xl text-slate-700 mt-0.5">
            {result.skipped}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-600">Performance Accuracy Dial</span>
          <span className="font-mono font-bold text-slate-900">{percentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPassed ? 'bg-[#00796B]' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(result)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="size-3.5 text-teal-300" />
          <span>View Subject Marks &amp; OMR Audit</span>
        </button>
      </div>

    </div>
  );
}

export default ResultCard;
