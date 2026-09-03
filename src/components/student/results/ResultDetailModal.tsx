'use client';

import React from 'react';
import { Result } from '@/types/result.types';
import {
  X,
  Trophy,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  PieChart,
  Award,
  Layers,
} from 'lucide-react';

interface ResultDetailModalProps {
  result: Result | null;
  onClose: () => void;
}

export function ResultDetailModal({ result, onClose }: ResultDetailModalProps) {
  if (!result) return null;

  const exam = result.exam;
  const examTitle = exam?.title || 'National Medical Mock Test';
  const examCode = exam?.code || 'NMT';
  const totalMarks = exam?.totalMarks || 100;
  const isPassed = result.resultStatus === 'PASSED';

  // Standard Subject-wise distribution
  const subjectList = [
    { subject: 'Biology (Botany & Zoology)', total: 30, weight: '30%' },
    { subject: 'Chemistry (Organic & Inorganic)', total: 25, weight: '25%' },
    { subject: 'Physics (Paper 1 & Paper 2)', total: 20, weight: '20%' },
    { subject: 'English (Grammar & Vocabulary)', total: 15, weight: '15%' },
    { subject: 'General Knowledge & BD Affairs', total: 10, weight: '10%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#00695C] border border-teal-200">
                {examCode}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Detailed Mark Sheet &amp; OMR Audit
              </span>
            </div>
            <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
              {examTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Score Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00594D] to-[#00796B] text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-teal-200">
              Score Summary &amp; Rank Standing
            </span>
            {result.position ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-amber-300 font-mono font-bold flex items-center gap-1">
                <Trophy className="size-3" />
                Rank #{result.position}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-teal-200 uppercase font-semibold">Net Obtained Marks</p>
              <p className="font-heading font-black text-xl text-white mt-0.5">
                {Number(result.obtainedMarks).toFixed(1)}
                <span className="text-xs text-teal-200 font-medium"> / {totalMarks}</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-teal-200 uppercase font-semibold">Accuracy Percentage</p>
              <p className="font-heading font-black text-xl text-emerald-300 font-mono mt-0.5">
                {Number(result.percentage).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* OMR Question Count Grid */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            OMR Answer Calibration
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-800 font-bold block text-[11px]">Correct (+1.00)</span>
              <span className="font-mono font-black text-lg text-emerald-700 mt-0.5 block">
                +{result.correctAnswered}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-rose-800 font-bold block text-[11px]">Wrong (-0.25)</span>
              <span className="font-mono font-black text-lg text-rose-600 mt-0.5 block">
                {result.wrongAnswered} (-{Number(result.deductMark).toFixed(2)})
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-bold block text-[11px]">Skipped (0.00)</span>
              <span className="font-mono font-black text-lg text-slate-700 mt-0.5 block">
                {result.skipped}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Core Subject Blueprint */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Medical Syllabus Weightage
          </p>

          <div className="space-y-1.5">
            {subjectList.map((sub, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#00796B]" />
                  <span className="font-semibold text-slate-800">{sub.subject}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-900 font-bold">{sub.total} Marks</span>
                  <span className="text-[10px] text-slate-400">({sub.weight})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Close Mark Sheet
          </button>
        </div>

      </div>

    </div>
  );
}

export default ResultDetailModal;
