'use client';

import React from 'react';
import { Exam } from '@/types/exam.types';
import { Leaderboard3DPodiumVisualizer } from './Leaderboard3DPodiumVisualizer';
import {
  Trophy,
  Award,
  Sparkles,
  Users,
  Target,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface LeaderboardHeaderProps {
  exams: Exam[];
  selectedExamId: string;
  onSelectExam: (examId: string) => void;
  totalExaminees: number;
  topScore: number;
}

export function LeaderboardHeader({
  exams,
  selectedExamId,
  onSelectExam,
  totalExaminees,
  topScore,
}: LeaderboardHeaderProps) {
  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#F7FCFB] to-[#EEF9F6] border border-teal-100/90 p-6 sm:p-7 lg:p-8 shadow-[0_15px_40px_rgba(15,118,110,0.05)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* Ambient background glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Left Column: Heading & Exam Selector */}
      <div className="relative z-10 max-w-2xl space-y-4">
        
        {/* Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00594D] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <Trophy className="size-3.5 text-amber-300" />
            National Merit Leaderboard
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold">
            <Award className="size-3.5 text-amber-600" />
            Central Board Dense Rankings
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-tight leading-tight">
            Leaderboard &amp; <span className="text-[#00796B]">National Standings</span> 🏅
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Compare your model test performance against medical aspirants nationwide. Track gold laureates, cutoff thresholds, and merit tiers.
          </p>
        </div>

        {/* Exam Selector Dropdown & Stats Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Exam Selector */}
          {exams.length > 0 ? (
            <div className="relative min-w-[240px]">
              <select
                value={selectedExamId}
                onChange={(e) => onSelectExam(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-teal-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] shadow-2xs cursor-pointer"
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.code} — {exam.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : null}

          {/* Total Examinees */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <Users className="size-4 text-[#00796B]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Aspirants Scored
              </p>
              <p className="font-bold text-xs text-slate-800">
                {totalExaminees > 0 ? `${totalExaminees} Examinees` : 'National Pool'}
              </p>
            </div>
          </div>

          {/* Highest Score */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#00594D] text-white shadow-xs">
            <Target className="size-4 text-amber-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Top Score
              </p>
              <p className="font-bold text-xs text-white">
                {topScore > 0 ? `${topScore.toFixed(1)} / 100` : '96.5 / 100'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: 3D Golden Podium Visualizer */}
      <div className="relative z-10 w-full lg:w-[270px] h-[190px] sm:h-[210px] flex items-center justify-center shrink-0">
        <Leaderboard3DPodiumVisualizer />
        
        {/* Floating Merit Tag */}
        <div className="absolute bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 text-[10px] font-bold text-amber-800 shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="size-3 text-amber-600" />
          <span>Top 3 Laureates</span>
        </div>
      </div>

    </div>
  );
}

export default LeaderboardHeader;
