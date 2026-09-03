'use client';

import React from 'react';
import { TopRanker } from '@/types/ranking.types';
import {
  Trophy,
  Medal,
  Award,
  CheckCircle2,
  Inbox,
  User,
} from 'lucide-react';

interface LeaderboardTableProps {
  rankers: TopRanker[];
  currentStudentRoll?: number | string;
}

export function LeaderboardTable({
  rankers,
  currentStudentRoll,
}: LeaderboardTableProps) {
  if (!rankers || rankers.length === 0) {
    return (
      <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
        <div className="size-16 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
          <Inbox className="size-8" />
        </div>
        <h3 className="font-heading font-black text-lg text-slate-900">
          No Leaderboard Standings Published
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Rankings for this model test have not been published by the examination board yet. Check back once OMR grading is finalized.
        </p>
      </div>
    );
  }

  const rollStr = currentStudentRoll ? String(currentStudentRoll) : '';

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(15,118,110,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6 w-20">Rank</th>
              <th className="py-3.5 px-4">Candidate Information</th>
              <th className="py-3.5 px-4 text-center">Net Score</th>
              <th className="py-3.5 px-4 text-center">Accuracy</th>
              <th className="py-3.5 px-4 text-right pr-6">Merit Tier</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {rankers.map((ranker, index) => {
              const isCurrentStudent =
                rollStr && ranker.rollNumber && String(ranker.rollNumber) === rollStr;

              // Rank Badge Styling
              let rankBadge = (
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  #{ranker.position}
                </span>
              );

              if (ranker.position === 1) {
                rankBadge = (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg shadow-2xs">
                    <Trophy className="size-3 text-amber-600" />
                    #1
                  </span>
                );
              } else if (ranker.position === 2) {
                rankBadge = (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-lg shadow-2xs">
                    <Medal className="size-3 text-slate-500" />
                    #2
                  </span>
                );
              } else if (ranker.position === 3) {
                rankBadge = (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-lg shadow-2xs">
                    <Award className="size-3 text-amber-700" />
                    #3
                  </span>
                );
              }

              return (
                <tr
                  key={ranker.studentId || index}
                  className={`transition-colors ${
                    isCurrentStudent
                      ? 'bg-teal-50/70 border-y-2 border-teal-500/50'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-3.5 px-4 sm:px-6">{rankBadge}</td>

                  {/* Candidate Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        <User className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-black text-slate-900 text-xs sm:text-sm">
                            {ranker.fullName}
                          </span>
                          {isCurrentStudent ? (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#00796B] text-white text-[9px] font-bold uppercase tracking-wider">
                              You
                            </span>
                          ) : null}
                        </div>
                        <p className="font-mono text-[11px] text-slate-400">
                          Roll #{ranker.rollNumber ? String(ranker.rollNumber).padStart(7, '0') : '---'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Net Score Column */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-heading font-black text-xs sm:text-sm text-slate-900">
                      {Number(ranker.obtainedMarks).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400"> / 100</span>
                  </td>

                  {/* Accuracy Column */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                      {Number(ranker.percentage).toFixed(1)}%
                    </span>
                  </td>

                  {/* Merit Tier Column */}
                  <td className="py-3.5 px-4 text-right pr-6">
                    <span className="text-[11px] font-bold text-slate-600">
                      {ranker.position <= 10
                        ? 'Top 10 Laureate'
                        : ranker.position <= 50
                        ? 'Medical Tier 1'
                        : 'National Candidate'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardTable;
