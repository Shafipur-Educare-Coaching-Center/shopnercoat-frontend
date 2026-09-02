'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass } from 'lucide-react';
import { LocationDistributionItem } from '@/types/admin-overview.types';

interface LocationDistributionPieChartProps {
  data: LocationDistributionItem[];
  totalCandidates?: number;
}

// Pure helper function outside component scope
function computeLocationSegments(
  items: LocationDistributionItem[],
  circumference: number
) {
  const result = [];
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((sum / 100) * circumference);
    sum += item.percentage;
    result.push({
      ...item,
      strokeDasharray,
      strokeDashoffset,
    });
  }
  return result;
}

export function LocationDistributionPieChart({
  data,
  totalCandidates = 1482,
}: LocationDistributionPieChartProps) {
  const [activeItem, setActiveItem] = useState<LocationDistributionItem | null>(null);

  // SVG Donut metrics
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const chartSegments = useMemo(
    () => computeLocationSegments(data, circumference),
    [data, circumference]
  );

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600">
              <Compass className="size-4" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              Location Distribution
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Geographic candidate density across Bangladesh divisions.
          </p>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
          6 Divisions
        </span>
      </div>

      {/* Donut Chart + Legends Split Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
        
        {/* Donut Chart with Center Total */}
        <div className="relative size-44 shrink-0 flex items-center justify-center">
          <svg className="size-full -rotate-90 overflow-visible" viewBox={`0 0 ${size} ${size}`}>
            {chartSegments.map((item, index) => {
              const isSelected = activeItem?.id === item.id;

              return (
                <motion.circle
                  key={item.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: item.strokeDashoffset }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                />
              );
            })}
          </svg>

          {/* Center Dynamic Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <AnimatePresence mode="wait">
              {activeItem ? (
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-lg font-black font-heading text-slate-900 leading-none">
                    {activeItem.percentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 max-w-[80px] truncate">
                    {activeItem.division.split(' ')[0]}
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-base font-black font-heading text-slate-900 leading-none">
                    {totalCandidates.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-medium">
                    Candidates
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Division Legend Chips */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-50 border-slate-300 shadow-2xs scale-[1.02]'
                    : 'bg-white/60 border-slate-100 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {item.division.replace(' Division', '')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-slate-400" />
          <span>
            {activeItem
              ? `${activeItem.division}: ${activeItem.count} verified examinees`
              : 'Highest concentration: Dhaka Division (44.0%)'}
          </span>
        </div>
      </div>

    </div>
  );
}
