'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmrAccuracyBreakdown } from '@/types/student-analytics.types';
import { PieChart, Info, Inbox } from 'lucide-react';

interface OmrAccuracyPieChartProps {
  breakdown: OmrAccuracyBreakdown;
}

interface SegmentItem {
  id: string;
  label: string;
  count: number;
  percentage: number;
  markImpact: string;
  color: string;
}

export function OmrAccuracyPieChart({ breakdown }: OmrAccuracyPieChartProps) {
  const { totalQuestions, correct, wrong, skipped, netAccuracyPercentage } = breakdown;

  const segments: SegmentItem[] = [
    {
      id: 'correct',
      label: 'Correct Answers',
      count: correct.count,
      percentage: correct.percentage,
      markImpact: correct.markImpact,
      color: '#0D9488',
    },
    {
      id: 'wrong',
      label: 'Wrong (Penalized)',
      count: wrong.count,
      percentage: wrong.percentage,
      markImpact: wrong.markImpact,
      color: '#F43F5E',
    },
    {
      id: 'skipped',
      label: 'Skipped Questions',
      count: skipped.count,
      percentage: skipped.percentage,
      markImpact: skipped.markImpact,
      color: '#94A3B8',
    },
  ];

  const [activeSegment, setActiveSegment] = useState<SegmentItem | null>(null);

  // SVG Donut calculations
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)] flex flex-col justify-between select-none">
      
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-cyan-50 text-[#06B6D4] flex items-center justify-center">
              <PieChart className="size-4.5" />
            </div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight">
              OMR Accuracy Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Answer calibration, penalty deductions (-0.25), and skip ratio.
          </p>
        </div>

        {/* Hover detail pill */}
        {totalQuestions > 0 && (
          <div className="h-8 flex items-center">
            <AnimatePresence mode="wait">
              {activeSegment && (
                <motion.div
                  key={activeSegment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-[11px] font-bold shadow-xs"
                >
                  <span>{activeSegment.label}: </span>
                  <span className="text-teal-300">{activeSegment.markImpact}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Donut & Legend Container */}
      {totalQuestions > 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
          {/* Donut SVG */}
          <div className="relative size-44 sm:size-48 flex items-center justify-center shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="18"
              />

              {/* Segments */}
              {segments.map((seg) => {
                const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += (seg.percentage / 100) * circumference;
                const isHovered = activeSegment?.id === seg.id;

                return (
                  <circle
                    key={seg.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 22 : 18}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveSegment(seg)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                );
              })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {netAccuracyPercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Net Accuracy
              </span>
            </div>
          </div>

          {/* Legend & Breakdown List */}
          <div className="w-full sm:w-auto space-y-2.5 flex-1 max-w-[210px]">
            {segments.map((seg) => {
              const isHovered = activeSegment?.id === seg.id;
              return (
                <div
                  key={seg.id}
                  onMouseEnter={() => setActiveSegment(seg)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isHovered
                      ? 'bg-slate-50 border-slate-300 shadow-xs scale-102'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 leading-tight truncate">
                        {seg.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {seg.markImpact}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs text-slate-900 shrink-0">
                    {seg.count} ({seg.percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-44 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4">
          <Inbox className="size-6 text-slate-400 mb-1" />
          <p className="text-xs font-bold text-slate-700">No OMR Questions Evaluated</p>
          <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
            Accuracy precision, correct counts, and penalty deductions will calibrate after your first model test.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="size-3.5 text-slate-400" />
          <span>
            {totalQuestions > 0
              ? activeSegment
                ? `${activeSegment.label}: ${activeSegment.count} questions evaluated`
                : `Overall: ${totalQuestions} Total Questions • Net Penalty: ${wrong.markImpact}`
              : 'Negative Marking Rule: -0.25 per wrong answer'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          -0.25 OMR Rule
        </span>
      </div>

    </div>
  );
}

export default OmrAccuracyPieChart;
