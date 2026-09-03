'use client';

import React from 'react';
import Link from 'next/link';
import { Result } from '@/types/result.types';
import { ROUTES } from '@/constants/routes';
import {
  Trophy,
  Award,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface CandidateRankHighlightCardProps {
  candidateResult: Result | null;
  studentName: string;
  rollNumber: number | string;
}

export function CandidateRankHighlightCard({
  candidateResult,
  studentName,
  rollNumber,
}: CandidateRankHighlightCardProps) {
  const rollDisplay = rollNumber ? String(rollNumber).padStart(7, '0') : '---';

  if (!candidateResult) {
    return (
      <div className="w-full rounded-[24px] bg-gradient-to-r from-teal-900 via-[#00594D] to-[#00695C] text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-white/10 text-teal-200 flex items-center justify-center shrink-0 border border-white/15">
            <Target className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded">
                Candidate Status
              </span>
              <span className="text-xs font-mono text-white/80">Roll #{rollDisplay}</span>
            </div>
            <h4 className="font-heading font-black text-sm sm:text-base text-white mt-0.5">
              You Have Not Taken This Model Test Yet
            </h4>
            <p className="text-xs text-teal-100/90 font-medium">
              Enroll in available mock tests to appear on the official national leaderboard and earn your merit rank.
            </p>
          </div>
        </div>

        <Link
          href={ROUTES.STUDENT_EXAMS}
          className="px-4 py-2 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Browse Open Exams</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  const isPassed = candidateResult.resultStatus === 'PASSED';
  const obtainedMarks = Number(candidateResult.obtainedMarks).toFixed(1);
  const position = candidateResult.position;

  return (
    <div className="w-full rounded-[24px] bg-gradient-to-r from-[#004D40] via-[#00594D] to-[#00796B] text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      
      {/* Left Info */}
      <div className="flex items-center gap-4">
        <div className="size-13 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-xs shrink-0">
          {position ? `#${position}` : '---'}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" />
              Your Verified Standing
            </span>
            <span className="text-xs font-mono text-teal-200">Roll #{rollDisplay}</span>
          </div>

          <h4 className="font-heading font-black text-base sm:text-lg text-white mt-1">
            {studentName} — {position ? `National Rank #${position}` : 'Evaluation Scorecard'}
          </h4>

          <div className="mt-1 flex items-center gap-3 text-xs text-teal-100 flex-wrap">
            <span className="font-bold text-white">Score: {obtainedMarks} / 100 Marks</span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">Accuracy: {Number(candidateResult.percentage).toFixed(1)}%</span>
            <span>•</span>
            <span className="text-amber-300 font-bold">Status: {candidateResult.resultStatus}</span>
          </div>
        </div>
      </div>

      {/* Right Link */}
      <Link
        href={ROUTES.STUDENT_RESULTS}
        className="px-4 py-2.5 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0 self-end md:self-center"
      >
        <span>Inspect My Score Sheet</span>
        <ArrowRight className="size-3.5" />
      </Link>

    </div>
  );
}

export default CandidateRankHighlightCard;
