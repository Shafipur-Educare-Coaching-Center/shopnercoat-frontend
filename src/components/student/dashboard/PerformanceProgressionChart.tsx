'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressionTrendPoint } from '@/types/student-analytics.types';
import { TrendingUp, Sparkles, Inbox } from 'lucide-react';

interface PerformanceProgressionChartProps {
  progressionTrend: ProgressionTrendPoint[];
}

export function PerformanceProgressionChart({ progressionTrend }: PerformanceProgressionChartProps) {
  const [activePoint, setActivePoint] = useState<ProgressionTrendPoint | null>(null);

  const points = progressionTrend;
  const maxScore = 100;
  const chartHeight = 200;
  const chartWidth = 540;
  const paddingX = 40;
  const usableWidth = chartWidth - paddingX * 2;
  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth;

  // Build SVG path coordinates
  const studentCoords = points.map((p, i) => {
    const x = points.length === 1 ? chartWidth / 2 : paddingX + i * stepX;
    const y = chartHeight - (p.studentScore / maxScore) * (chartHeight - 30) - 15;
    return { x, y, point: p };
  });

  const top10Coords = points.map((p, i) => {
    const x = points.length === 1 ? chartWidth / 2 : paddingX + i * stepX;
    const y = chartHeight - (p.nationalTop10Avg / maxScore) * (chartHeight - 30) - 15;
    return { x, y };
  });

  // Construct SVG paths
  const studentPathD = studentCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const studentAreaD = studentCoords.length > 0
    ? `${studentPathD} L ${studentCoords[studentCoords.length - 1].x} ${chartHeight} L ${studentCoords[0].x} ${chartHeight} Z`
    : '';

  const top10PathD = top10Coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const passMarkY = chartHeight - (40 / maxScore) * (chartHeight - 30) - 15;

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)] flex flex-col justify-between select-none">
      
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-teal-50 text-[#00796B] flex items-center justify-center">
              <TrendingUp className="size-4.5" />
            </div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight">
              Performance Progression Curve
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model test score trajectory vs National Top 10 benchmark and pass threshold.
          </p>
        </div>

        {/* Dynamic Tooltip / Legend */}
        {points.length > 0 && (
          <div className="h-9 flex items-center">
            <AnimatePresence mode="wait">
              {activePoint ? (
                <motion.div
                  key={activePoint.examCode}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="px-3 py-1 rounded-xl bg-[#00594D] text-white text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <span>{activePoint.examCode}:</span>
                  <span className="text-teal-200">{activePoint.studentScore} Marks (Rank #{activePoint.nationalRank})</span>
                </motion.div>
              ) : (
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#00796B]" /> Your Score
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-cyan-400" /> Top-10 Avg
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-amber-400" /> Pass (40.0)
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      {points.length > 0 ? (
        <div className="relative w-full h-[210px] sm:h-[220px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={paddingX} y1={passMarkY} x2={chartWidth - paddingX} y2={passMarkY} stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <line x1={paddingX} y1={40} x2={chartWidth - paddingX} y2={40} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingX} y1={100} x2={chartWidth - paddingX} y2={100} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

            {/* Shaded Area below student line */}
            {points.length > 1 && <path d={studentAreaD} fill="url(#scoreAreaGradient)" />}

            {/* National Top-10 Line (Cyan Dotted) */}
            {points.length > 1 && <path d={top10PathD} fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" opacity="0.75" />}

            {/* Student Score Line (Emerald Solid) */}
            {points.length > 1 && <path d={studentPathD} fill="none" stroke="#00796B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Interactive Data Points */}
            {studentCoords.map((pt, idx) => {
              const isHovered = activePoint?.examCode === pt.point.examCode;
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePoint(pt.point)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  {/* Invisible hit area */}
                  <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                  {/* Outer Ring on Hover */}
                  {isHovered && (
                    <circle cx={pt.x} cy={pt.y} r="9" fill="#00796B" opacity="0.2" className="animate-pulse" />
                  )}

                  {/* Core Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : 4}
                    fill={isHovered ? '#00594D' : '#00796B'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* X-axis Label below */}
                  <text
                    x={pt.x}
                    y={chartHeight + 16}
                    textAnchor="middle"
                    className={`text-[10px] font-semibold transition-colors ${
                      isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                    }`}
                  >
                    {pt.point.examCode}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="w-full h-[210px] sm:h-[220px] rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4">
          <Inbox className="size-6 text-slate-400 mb-1" />
          <p className="text-xs font-bold text-slate-700">No Progression Records Yet</p>
          <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
            Your score trajectory against the national Top 10 average and pass threshold will plot here automatically.
          </p>
        </div>
      )}

      {/* Bottom Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-teal-600" />
          <span>
            {activePoint
              ? `${activePoint.examTitle}: ${activePoint.studentScore}/100 • National Rank #${activePoint.nationalRank}`
              : 'Live performance curve synchronized with national dense rankings'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          Dense Merit Calibration
        </span>
      </div>

    </div>
  );
}

export default PerformanceProgressionChart;
