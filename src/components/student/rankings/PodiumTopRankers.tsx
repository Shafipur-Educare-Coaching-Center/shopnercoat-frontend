'use client';

import React from 'react';
import { TopRanker } from '@/types/ranking.types';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
} from 'lucide-react';

interface PodiumTopRankersProps {
  topRankers: TopRanker[];
}

export function PodiumTopRankers({ topRankers }: PodiumTopRankersProps) {
  if (!topRankers || topRankers.length === 0) return null;

  const rank1 = topRankers.find((r) => r.position === 1) || topRankers[0];
  const rank2 = topRankers.find((r) => r.position === 2) || (topRankers.length > 1 ? topRankers[1] : null);
  const rank3 = topRankers.find((r) => r.position === 3) || (topRankers.length > 2 ? topRankers[2] : null);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <Trophy className="size-5 text-amber-500" />
          <span>National Top 3 Laureates Podium</span>
        </h3>
        <span className="text-xs font-bold text-slate-400">Merit Excellence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        
        {/* 2nd Place (Silver) */}
        {rank2 ? (
          <div className="rounded-[24px] bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 order-2 md:order-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-800 text-[11px] font-bold">
                <Medal className="size-3.5 text-slate-500" />
                Rank #2 • Silver
              </span>
              <span className="font-mono text-xs font-bold text-slate-400">
                Roll #{rank2.rollNumber || '---'}
              </span>
            </div>

            <div>
              <h4 className="font-heading font-black text-base text-slate-900 truncate">
                {rank2.fullName}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Medical Aspirant Track
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <p className="font-heading font-black text-base text-slate-900">
                  {Number(rank2.obtainedMarks).toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                {Number(rank2.percentage).toFixed(1)}%
              </span>
            </div>
          </div>
        ) : null}

        {/* 1st Place (Gold) - Elevated Card */}
        {rank1 ? (
          <div className="rounded-[28px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-300 p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4 order-1 md:order-2 md:-mt-2 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Crown className="size-3" />
              National Champion
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                <Trophy className="size-4 text-amber-600" />
                Rank #1 • Gold
              </span>
              <span className="font-mono text-xs font-bold text-amber-900/70">
                Roll #{rank1.rollNumber || '---'}
              </span>
            </div>

            <div>
              <h4 className="font-heading font-black text-lg text-slate-900 truncate">
                {rank1.fullName}
              </h4>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                {rank1.remarks || 'National Merit Gold Laureate'}
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800">Top Score</span>
                <p className="font-heading font-black text-xl text-slate-900">
                  {Number(rank1.obtainedMarks).toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
                </p>
              </div>
              <span className="font-mono text-sm font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl">
                {Number(rank1.percentage).toFixed(1)}%
              </span>
            </div>
          </div>
        ) : null}

        {/* 3rd Place (Bronze) */}
        {rank3 ? (
          <div className="rounded-[24px] bg-gradient-to-b from-amber-50/60 to-white border border-amber-200/70 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 order-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-900 text-[11px] font-bold">
                <Award className="size-3.5 text-amber-700" />
                Rank #3 • Bronze
              </span>
              <span className="font-mono text-xs font-bold text-slate-400">
                Roll #{rank3.rollNumber || '---'}
              </span>
            </div>

            <div>
              <h4 className="font-heading font-black text-base text-slate-900 truncate">
                {rank3.fullName}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Medical Aspirant Track
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <p className="font-heading font-black text-base text-slate-900">
                  {Number(rank3.obtainedMarks).toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                {Number(rank3.percentage).toFixed(1)}%
              </span>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default PodiumTopRankers;
