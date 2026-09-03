'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NegativeMarkingAuditItem } from '@/types/student-analytics.types';
import { AlertOctagon, Lightbulb, Inbox } from 'lucide-react';

interface NegativeMarkingAuditChartProps {
  auditData: NegativeMarkingAuditItem[];
}

export function NegativeMarkingAuditChart({ auditData }: NegativeMarkingAuditChartProps) {
  const [activeItem, setActiveItem] = useState<NegativeMarkingAuditItem | null>(null);

  const displayData = auditData;
  const maxDeduct = displayData.length > 0
    ? Math.max(...displayData.map((d) => d.deductMarks), 4)
    : 4;

  // Dynamic calculations for penalty reduction & strategy insight
  const firstPenalty = displayData[0]?.deductMarks || 0;
  const latestPenalty = displayData[displayData.length - 1]?.deductMarks || 0;
  const latestWrong = displayData[displayData.length - 1]?.wrongCount || 0;

  const reductionPct = firstPenalty > 0
    ? Math.round(((latestPenalty - firstPenalty) / firstPenalty) * 100)
    : 0;

  const penaltyBadgeText = reductionPct !== 0
    ? `${reductionPct > 0 ? '+' : ''}${reductionPct}% Penalty Reduction`
    : '0% Penalty Variance';

  const marksSaved = (latestWrong * 1.25).toFixed(2);
  const strategyInsightText = latestWrong > 0
    ? `Skipping ${latestWrong} uncertain guesses saves +${marksSaved} net marks on your merit standing.`
    : 'Keep answering accurately to preserve your national rank.';

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)] flex flex-col justify-between select-none">
      
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="size-4.5" />
            </div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight">
              Negative Marking Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Penalty reduction trend across live mock test sessions.
          </p>
        </div>

        {/* Hover summary pill */}
        {displayData.length > 0 && (
          <div className="h-8 flex items-center">
            <AnimatePresence mode="wait">
              {activeItem ? (
                <motion.div
                  key={activeItem.examLabel}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-3 py-1 rounded-xl bg-rose-950 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>{activeItem.examLabel}: </span>
                  <span className="text-rose-400">-{activeItem.deductMarks.toFixed(2)} Marks ({activeItem.wrongCount} Wrong)</span>
                </motion.div>
              ) : (
                <span className="hidden sm:inline-block text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                  {penaltyBadgeText}
                </span>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bar Chart Container */}
      {displayData.length > 0 ? (
        <div className="relative w-full h-[180px] flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4 pt-4 pb-2">
          {/* Background Guide Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 py-4">
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-dashed border-slate-200" />
          </div>

          {/* Vertical Bars */}
          {displayData.map((item, idx) => {
            const heightPercent = Math.max((item.deductMarks / maxDeduct) * 100, 15);
            const isHovered = activeItem?.examLabel === item.examLabel;

            return (
              <div
                key={item.examLabel}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer relative z-10"
              >
                {/* Floating Top Value */}
                <span
                  className={`text-[10px] font-mono font-bold transition-opacity mb-1 ${
                    isHovered ? 'opacity-100 text-rose-600' : 'opacity-0 group-hover:opacity-100 text-slate-400'
                  }`}
                >
                  -{item.deductMarks.toFixed(2)}
                </span>

                {/* Animated Bar */}
                <div className="w-full max-w-[36px] h-full flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.06 }}
                    className={`w-full rounded-t-xl transition-all duration-200 relative overflow-hidden ${
                      isHovered
                        ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-md shadow-rose-900/20 scale-105'
                        : 'bg-gradient-to-t from-rose-200 via-rose-100 to-slate-100 group-hover:from-rose-500 group-hover:to-rose-400'
                    }`}
                  >
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-white/70" />
                  </motion.div>
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-semibold mt-2 transition-colors ${
                    isHovered ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.examLabel}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-[180px] rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4">
          <Inbox className="size-6 text-slate-400 mb-1" />
          <p className="text-xs font-bold text-slate-700">No Penalty Deductions Recorded</p>
          <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
            Negative marking penalty metrics and reduction trends will calibrate after your first model tests are evaluated.
          </p>
        </div>
      )}

      {/* Strategic Insight Pill */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Lightbulb className="size-3" />
          </div>
          <p className="text-[11px] leading-tight">
            <span className="font-bold text-slate-800">Strategy Insight:</span>{' '}
            {strategyInsightText}
          </p>
        </div>
      </div>

    </div>
  );
}

export default NegativeMarkingAuditChart;
