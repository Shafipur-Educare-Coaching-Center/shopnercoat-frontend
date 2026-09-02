'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Info, BarChart3 } from 'lucide-react';
import { CandidateAgeDistributionItem } from '@/types/admin-overview.types';

interface AgeDistributionBarChartProps {
  data: CandidateAgeDistributionItem[];
  totalCandidates?: number;
}

export function AgeDistributionBarChart({
  data,
  totalCandidates = 1482,
}: AgeDistributionBarChartProps) {
  const [activeItem, setActiveItem] = useState<CandidateAgeDistributionItem | null>(null);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-[#37447E]">
              <BarChart3 className="size-4" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              Candidate Age Distribution
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Breakdown of HSC examinees and 1st vs 2nd timer medical admission seekers.
          </p>
        </div>

        {/* Dynamic Hover / Active Stat Badge */}
        <div className="h-10 flex items-center">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key={activeItem.ageGroup}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <span>{activeItem.ageGroup}:</span>
                <span className="text-teal-400 font-bold">{activeItem.count.toLocaleString()} students ({activeItem.percentage}%)</span>
              </motion.div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600">
                <Users className="size-3.5 text-teal-600" />
                <span>{totalCandidates.toLocaleString()} Total Candidates</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="relative w-full h-56 sm:h-64 flex flex-col justify-end pt-6 pb-2">
        
        {/* Background Horizontal Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-slate-200" />
        </div>

        {/* Bars Container */}
        <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-6">
          {data.map((item, index) => {
            const heightPercentage = Math.round((item.count / maxCount) * 100);
            const isSelected = activeItem?.ageGroup === item.ageGroup;

            return (
              <div
                key={item.ageGroup}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
              >
                {/* Floating Top Number on Hover */}
                <div className="h-5 flex items-center justify-center mb-1">
                  <span
                    className={`text-[11px] font-bold font-mono transition-opacity ${
                      isSelected ? 'opacity-100 text-teal-600' : 'opacity-0 group-hover:opacity-100 text-slate-500'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Animated Vertical Bar */}
                <div className="relative w-full max-w-[48px] h-full flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                    className={`w-full rounded-t-2xl transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-t from-teal-600 to-[#37447E] shadow-[0_8px_20px_rgba(13,148,136,0.35)] scale-105'
                        : 'bg-gradient-to-t from-slate-200 via-teal-100 to-indigo-200 group-hover:from-teal-500 group-hover:to-[#37447E]'
                    }`}
                  >
                    {/* Top Highlight Rim */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-white/60" />
                  </motion.div>
                </div>

                {/* X-Axis Label */}
                <span
                  className={`text-xs font-semibold mt-3 text-center transition-colors ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.ageGroup}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Detail Pill */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="size-3.5 text-slate-400" />
          <span>
            {activeItem
              ? `${activeItem.categoryLabel} (${activeItem.count} applicants)`
              : 'Dominant segment: 18 yrs (40% HSC batch graduates)'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Source: Verified Profiles
        </span>
      </div>

    </div>
  );
}
